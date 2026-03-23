import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [isTeaserDismissed, setIsTeaserDismissed] = useState(false);
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
      {/* Teaser message - appears above the cricket ball */}
      {!isOpen && !isTeaserDismissed && (
        <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-[9998] animate-fade-in">
          {/* Speech bubble */}
          <div className="bg-background border-2 border-primary/20 rounded-2xl shadow-elegant p-3 md:p-4 mb-2 md:mb-3 max-w-[240px] md:max-w-[280px] relative">
            {/* Close button */}
            <button
              onClick={() => setIsTeaserDismissed(true)}
              className="absolute -top-2 -right-2 w-6 h-6 md:w-7 md:h-7 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:scale-110 flex items-center justify-center shadow-lg z-10"
              aria-label="Dismiss teaser"
            >
              <X className="w-3 h-3 md:w-4 md:h-4" />
            </button>

            <div className="flex items-start gap-2">
              <div className="text-2xl md:text-3xl shrink-0">⚽</div>
              <div>
                <p className="text-xs md:text-sm text-foreground leading-relaxed">
                  Hi! I'm here to assist you. Need help?{" "}
                  <button 
                    onClick={() => setIsOpen(true)}
                    className="text-primary font-semibold hover:underline"
                  >
                    Click here
                  </button>{" "}
                  to chat with me anytime.
                </p>
              </div>
            </div>
            {/* Speech bubble pointer */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-background border-r-2 border-b-2 border-primary/20 transform rotate-45" />
          </div>
        </div>
      )}

      {/* Floating trigger button - Cricket Ball Design */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9998] group hover:scale-110 transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open Sporty chat"
      >
        <div className="relative w-14 h-14 md:w-16 md:h-16">
          {/* Cricket ball background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600 via-red-500 to-red-700 shadow-2xl" />
          
          {/* Cricket ball stitching - left curve */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 64 64"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
          >
            {/* Left seam curve */}
            <path
              d="M 20 10 Q 18 32 20 54"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              opacity="0.9"
            />
            {/* Left seam stitches */}
            <path d="M 18 15 L 22 17" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 17 20 L 21 22" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 17 25 L 21 27" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 16.5 32 L 20.5 32" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 17 39 L 21 37" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 17 44 L 21 42" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 18 49 L 22 47" stroke="white" strokeWidth="1" opacity="0.8" />
            
            {/* Right seam curve */}
            <path
              d="M 44 10 Q 46 32 44 54"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              opacity="0.9"
            />
            {/* Right seam stitches */}
            <path d="M 42 17 L 46 15" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 43 22 L 47 20" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 43 27 L 47 25" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 43.5 32 L 47.5 32" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 43 37 L 47 39" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 43 42 L 47 44" stroke="white" strokeWidth="1" opacity="0.8" />
            <path d="M 42 47 L 46 49" stroke="white" strokeWidth="1" opacity="0.8" />
          </svg>
          
          {/* Chat indicator dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          
          {/* Shine effect */}
          <div className="absolute top-2 left-3 w-4 h-4 md:w-5 md:h-5 bg-white/30 rounded-full blur-sm" />
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
        <div className="flex-1 p-3 md:p-4 overflow-y-auto" style={{ height: "calc(100% - 140px)" }} ref={scrollRef}>
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
        </div>

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
