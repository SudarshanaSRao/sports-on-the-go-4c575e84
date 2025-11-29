import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

const QUICK_ACTIONS = [
  { label: "🔍 Discover Games", prompt: "How do I find games near me?" },
  { label: "⚽ Host a Game", prompt: "How do I host a game?" },
  { label: "👥 Find Friends", prompt: "How do I connect with other players?" },
  { label: "📍 How it works", prompt: "How does SquadUp work?" },
];

export default function SportyChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hey there! I'm Sporty, your SquadUp assistant! I'm here to help you discover games, connect with players, and get the most out of the platform. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";
    const assistantId = (Date.now() + 1).toString();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-sporty`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.role === "assistant" && lastMsg.id === assistantId) {
                  return prev.map((m) =>
                    m.id === assistantId ? { ...m, content: assistantContent } : m
                  );
                }
                return [
                  ...prev,
                  { id: assistantId, role: "assistant", content: assistantContent },
                ];
              });
            }
          } catch {
            continue;
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput("");
    streamChat(message);
  };

  const handleQuickAction = (prompt: string) => {
    streamChat(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9998] bg-primary text-primary-foreground rounded-full shadow-elegant hover:scale-110 transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open Sporty chat"
      >
        <div className="p-3 md:p-4">
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9998] bg-background border border-border rounded-lg shadow-2xl transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          width: "calc(100vw - 2rem)",
          maxWidth: "380px",
          height: "min(600px, calc(100vh - 8rem))",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="text-lg md:text-xl">⚽</div>
            <div>
              <div className="font-bold text-sm md:text-base">Sporty</div>
              <div className="text-[10px] md:text-xs opacity-90">SquadUp Assistant</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-7 w-7 md:h-8 md:w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-3 md:p-4" style={{ height: "calc(100% - 140px)" }} ref={scrollRef}>
          <div className="space-y-3 md:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs md:text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Quick action buttons - show only after welcome message */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 md:gap-2 pt-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.prompt)}
                    disabled={isLoading}
                    className="px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors disabled:opacity-50"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="p-2 md:p-3 border-t border-border">
          <div className="flex gap-1.5 md:gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type here..."
              disabled={isLoading}
              className="flex-1 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-8 w-8 md:h-10 md:w-10 shrink-0"
            >
              <Send className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
          <p className="text-[9px] md:text-[10px] text-muted-foreground text-center mt-1.5 md:mt-2">
            AI can make mistakes. Please verify responses.
          </p>
        </div>
      </div>
    </>
  );
}
