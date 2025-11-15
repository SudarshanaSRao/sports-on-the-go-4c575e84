import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pickuppal_recent_sport_emojis';
const MAX_RECENT = 10;

export function useRecentEmojis() {
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  // Load recent emojis from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentEmojis(parsed.slice(0, MAX_RECENT));
        }
      }
    } catch (error) {
      console.error('Failed to load recent emojis:', error);
    }
  }, []);

  // Add a new emoji to recent list
  const addRecentEmoji = useCallback((emoji: string) => {
    setRecentEmojis((prev) => {
      // Remove duplicate if it exists
      const filtered = prev.filter((e) => e !== emoji);
      // Add to front
      const updated = [emoji, ...filtered].slice(0, MAX_RECENT);
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save recent emoji:', error);
      }
      
      return updated;
    });
  }, []);

  return { recentEmojis, addRecentEmoji };
}
