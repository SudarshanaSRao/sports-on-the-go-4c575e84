import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Clock, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { getSportEmoji, toDisplaySportName } from "@/utils/sportsUtils";

interface UpcomingGame {
  id: string;
  sport: string;
  location_name: string;
  game_date: string;
  start_time: string;
  host_id: string;
  hoursUntilGame: number;
}

export const GameReminderBanner = () => {
  const { user } = useAuth();
  const [upcomingGames, setUpcomingGames] = useState<UpcomingGame[]>([]);
  const [dismissedGames, setDismissedGames] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    // Load dismissed games from localStorage
    const stored = localStorage.getItem("dismissed_game_reminders");
    if (stored) {
      try {
        const dismissed = JSON.parse(stored);
        setDismissedGames(new Set(dismissed));
      } catch (e) {
        console.error("Error parsing dismissed games:", e);
      }
    }

    fetchUpcomingGames();

    // Refresh every 5 minutes to catch new games entering the 24-hour window
    const interval = setInterval(fetchUpcomingGames, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchUpcomingGames = async () => {
    if (!user) return;

    try {
      const now = new Date();
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      // Format dates for comparison using local timezone
      const nowDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const next24Date = `${next24Hours.getFullYear()}-${String(next24Hours.getMonth() + 1).padStart(2, '0')}-${String(next24Hours.getDate()).padStart(2, '0')}`;

      // Fetch games user is attending
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvps')
        .select(`
          game_id,
          games (
            id,
            sport,
            location_name,
            game_date,
            start_time,
            host_id,
            status
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'CONFIRMED');

      if (rsvpError) throw rsvpError;

      // Fetch games user is hosting
      const { data: hostData, error: hostError } = await supabase
        .from('games')
        .select('id, sport, location_name, game_date, start_time, host_id, status')
        .eq('host_id', user.id)
        .eq('status', 'UPCOMING');

      if (hostError) throw hostError;

      // Combine all games
      const attendingGames = rsvpData?.map(r => r.games).filter(Boolean) || [];
      const hostingGames = hostData || [];
      const allGames = [...attendingGames, ...hostingGames];

      // Filter games happening in the next 24 hours
      const gamesIn24Hours = allGames
        .filter((game: any) => {
          // Parse game date and time in local timezone
          const gameDateTime = new Date(`${game.game_date}T${game.start_time}`);
          
          // Calculate hours until game
          const hoursUntil = (gameDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
          
          // Include games happening between now and next 24 hours
          return hoursUntil > 0 && hoursUntil <= 24;
        })
        .map((game: any) => {
          const gameDateTime = new Date(`${game.game_date}T${game.start_time}`);
          const hoursUntil = (gameDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
          
          return {
            id: game.id,
            sport: game.sport,
            location_name: game.location_name,
            game_date: game.game_date,
            start_time: game.start_time,
            host_id: game.host_id,
            hoursUntilGame: hoursUntil
          };
        })
        .filter((game: UpcomingGame) => !dismissedGames.has(game.id))
        .sort((a: UpcomingGame, b: UpcomingGame) => a.hoursUntilGame - b.hoursUntilGame);

      setUpcomingGames(gamesIn24Hours);
    } catch (error) {
      console.error("Error fetching upcoming games:", error);
    }
  };

  const handleDismiss = (gameId: string) => {
    const newDismissed = new Set([...dismissedGames, gameId]);
    setDismissedGames(newDismissed);
    
    // Save to localStorage
    localStorage.setItem("dismissed_game_reminders", JSON.stringify([...newDismissed]));
    
    // Remove from display
    setUpcomingGames(prev => prev.filter(game => game.id !== gameId));
  };

  const formatTimeUntilGame = (hours: number) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const roundedHours = Math.round(hours * 10) / 10;
    return `${roundedHours} hour${roundedHours !== 1 ? 's' : ''}`;
  };

  if (!user || upcomingGames.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-2">
      {upcomingGames.map((game) => {
        const isHosting = game.host_id === user.id;
        const gameDateTime = new Date(`${game.game_date}T${game.start_time}`);

        return (
          <Alert 
            key={game.id} 
            className="border-2 border-primary/50 bg-primary/5 shadow-lg relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => handleDismiss(game.id)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-start gap-3 pr-8">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-2xl shadow-primary flex-shrink-0">
                {getSportEmoji(game.sport)}
              </div>

              <div className="flex-1 min-w-0">
                <AlertTitle className="text-lg font-bold mb-2 flex items-center gap-2 text-green-800">
                  <Clock className="w-5 h-5 text-primary animate-pulse" />
                  {isHosting ? "Your Game Starts Soon!" : "Game Starting Soon!"}
                </AlertTitle>
                
                <AlertDescription className="space-y-2">
                  <div className="font-semibold text-green-800">
                    {toDisplaySportName(game.sport)} • {formatTimeUntilGame(game.hoursUntilGame)} away
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-green-700">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(gameDateTime, 'MMM dd, yyyy • h:mm a')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{game.location_name}</span>
                    </div>
                  </div>

                  <Link to={`/game/${game.id}`}>
                    <Button size="sm" className="mt-2">
                      View Details
                    </Button>
                  </Link>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        );
      })}
    </div>
  );
};
