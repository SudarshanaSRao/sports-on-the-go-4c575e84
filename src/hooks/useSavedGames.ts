import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSavedGames = (userId: string | undefined) => {
  const [savedGameIds, setSavedGameIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchSavedGames();
    } else {
      setSavedGameIds(new Set());
    }
  }, [userId]);

  const fetchSavedGames = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('saved_games')
        .select('game_id')
        .eq('user_id', userId);

      if (error) throw error;

      setSavedGameIds(new Set(data?.map(sg => sg.game_id) || []));
    } catch (error) {
      console.error('Error fetching saved games:', error);
    }
  };

  const saveGame = async (gameId: string) => {
    if (!userId) {
      toast.error('Please log in to save games');
      return false;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('saved_games')
        .insert({ user_id: userId, game_id: gameId });

      if (error) {
        if (error.code === '23505') {
          toast.error('Game already saved');
        } else {
          throw error;
        }
        return false;
      }

      setSavedGameIds(prev => new Set([...prev, gameId]));
      toast.success('Game saved!');
      return true;
    } catch (error) {
      console.error('Error saving game:', error);
      toast.error('Failed to save game');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsaveGame = async (gameId: string) => {
    if (!userId) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('saved_games')
        .delete()
        .eq('user_id', userId)
        .eq('game_id', gameId);

      if (error) throw error;

      setSavedGameIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(gameId);
        return newSet;
      });
      toast.success('Game removed from saved');
      return true;
    } catch (error) {
      console.error('Error unsaving game:', error);
      toast.error('Failed to remove game');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveGame = async (gameId: string) => {
    if (savedGameIds.has(gameId)) {
      return await unsaveGame(gameId);
    } else {
      return await saveGame(gameId);
    }
  };

  return {
    savedGameIds,
    loading,
    saveGame,
    unsaveGame,
    toggleSaveGame,
    isSaved: (gameId: string) => savedGameIds.has(gameId),
  };
};
