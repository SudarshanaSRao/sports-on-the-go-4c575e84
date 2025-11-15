import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, X } from 'lucide-react';
import { sportEmojis, emojiCategories, type SportEmojisData } from '@/data/sportEmojis';
import { useRecentEmojis } from '@/hooks/useRecentEmojis';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  value: string;
  onEmojiSelect: (emoji: string) => void;
  onClear: () => void;
}

export function EmojiPicker({ value, onEmojiSelect, onClear }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { recentEmojis, addRecentEmoji } = useRecentEmojis();

  // Filter emojis based on search query
  const filteredEmojis = useMemo(() => {
    if (!searchQuery.trim()) return sportEmojis;

    const query = searchQuery.toLowerCase();
    const filtered: SportEmojisData = {
      popular: [],
      ballSports: [],
      activities: [],
      winter: [],
      water: [],
      combat: [],
      target: [],
      other: [],
    };

    Object.entries(sportEmojis).forEach(([category, emojis]) => {
      filtered[category as keyof SportEmojisData] = emojis.filter((item) =>
        item.keywords.some((keyword) => keyword.toLowerCase().includes(query))
      );
    });

    return filtered;
  }, [searchQuery]);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    addRecentEmoji(emoji);
    setOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between h-10 font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <span>{value || "Choose an emoji 🎯"}</span>
          {value && (
            <X
              className="h-4 w-4 opacity-50 hover:opacity-100"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <div className="flex flex-col gap-2 p-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emojis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>

          {/* Recently Used Section */}
          {!searchQuery && recentEmojis.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground px-1">Recently Used</p>
              <div className="grid grid-cols-8 gap-1">
                {recentEmojis.map((emoji, index) => (
                  <button
                    key={`recent-${index}`}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="flex items-center justify-center w-10 h-10 text-2xl hover:bg-accent rounded transition-colors"
                    aria-label={`Select ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Emoji Categories */}
          <Tabs defaultValue="popular" className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-auto">
              {emojiCategories.slice(0, 4).map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs px-2 py-1"
                >
                  {category.icon}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="w-full grid grid-cols-4 h-auto mt-1">
              {emojiCategories.slice(4).map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs px-2 py-1"
                >
                  {category.icon}
                </TabsTrigger>
              ))}
            </TabsList>

            {emojiCategories.map((category) => {
              const emojis = filteredEmojis[category.id as keyof SportEmojisData];
              return (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="mt-2 max-h-[240px] overflow-y-auto"
                >
                  {emojis.length > 0 ? (
                    <div className="grid grid-cols-8 gap-1">
                      {emojis.map((item, index) => (
                        <button
                          key={`${category.id}-${index}`}
                          type="button"
                          onClick={() => handleEmojiClick(item.emoji)}
                          className="flex items-center justify-center w-10 h-10 text-2xl hover:bg-accent rounded transition-colors hover:scale-110"
                          aria-label={`Select ${item.emoji} - ${item.keywords.join(', ')}`}
                        >
                          {item.emoji}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No emojis found
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
}
