import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import GameMap from "@/components/GameMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Filter, Users, Calendar, Clock, Star, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Game {
  id: string;
  sport: string;
  location_name: string;
  address: string;
  city: string;
  game_date: string;
  start_time: string;
  latitude: number;
  longitude: number;
  current_players: number;
  max_players: number;
  skill_level: string;
  host_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
    overall_rating: number;
  };
}

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [joiningGameId, setJoiningGameId] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from("games")
        .select(`
          *,
          profiles:host_id (
            first_name,
            last_name,
            overall_rating
          )
        `)
        .eq("status", "UPCOMING")
        .eq("visibility", "PUBLIC")
        .order("game_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast({
        title: "Error",
        description: "Failed to load games. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async (gameId: string, currentPlayers: number, maxPlayers: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join a game.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (currentPlayers >= maxPlayers) {
      toast({
        title: "Game Full",
        description: "This game has reached maximum capacity.",
        variant: "destructive",
      });
      return;
    }

    setJoiningGameId(gameId);

    try {
      const { error } = await supabase
        .from("rsvps")
        .insert({
          game_id: gameId,
          user_id: user.id,
          status: "CONFIRMED",
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Joined",
            description: "You've already joined this game.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully Joined!",
          description: "You've been added to the game. Check My Games to see details.",
        });
        // Refresh games list to update player count
        fetchGames();
      }
    } catch (error) {
      console.error("Error joining game:", error);
      toast({
        title: "Error",
        description: "Failed to join game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJoiningGameId(null);
    }
  };

  const handleViewDetails = (gameId: string) => {
    // TODO: Navigate to game details page when implemented
    toast({
      title: "Coming Soon",
      description: "Game details page is under development.",
    });
  };

  const getSportEmoji = (sport: string) => {
    const emojiMap: { [key: string]: string } = {
      BASKETBALL: "🏀",
      SOCCER: "⚽",
      VOLLEYBALL: "🏐",
      TENNIS: "🎾",
      FOOTBALL: "🏈",
      BASEBALL: "⚾",
      PICKLEBALL: "🏓",
      GOLF: "⛳",
    };
    return emojiMap[sport] || "🏃";
  };

  const formatSkillLevel = (level: string) => {
    return level.split("_").map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(" ");
  };

  const calculateDistance = (lat: number, lng: number) => {
    // Mock distance calculation - you can implement actual geolocation later
    return `${(Math.random() * 5).toFixed(1)} mi`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">Discover Games</h1>
            <p className="text-lg text-muted-foreground">Find pickup games happening near you</p>
          </div>

          {/* Search and Filters */}
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {/* Search Bar */}
            <div className="lg:col-span-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by sport, location, or host..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
            </div>
            
            {/* Filter Button */}
            <Button variant="outline" className="h-12 border-2">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Interactive Map */}
          <div className="mb-8">
            <GameMap 
              games={games.map(game => ({
                id: parseInt(game.id.split('-')[0], 16) % 10000,
                sport: game.sport,
                emoji: getSportEmoji(game.sport),
                location: game.location_name,
                address: game.city,
                date: format(new Date(game.game_date), "MMM d"),
                time: game.start_time.slice(0, 5),
                distance: calculateDistance(game.latitude, game.longitude),
                players: { current: game.current_players, max: game.max_players },
                skillLevel: formatSkillLevel(game.skill_level),
                hostName: game.profiles ? `${game.profiles.first_name} ${game.profiles.last_name}` : "Unknown",
                hostRating: game.profiles?.overall_rating || 0,
                price: "Free",
                lat: game.latitude,
                lng: game.longitude,
              }))} 
              center={games.length > 0 ? [games[0].latitude, games[0].longitude] : [40.7128, -74.0060]} 
              zoom={11} 
            />
          </div>

          {/* Games List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Nearby Games ({games.length})</h2>
              <Badge variant="secondary" className="text-sm">
                All Games
              </Badge>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading games...</p>
              </div>
            ) : games.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No games available at the moment.</p>
              </div>
            ) : (
              games.map((game) => (
                <Card key={game.id} className="hover:shadow-elevated transition-smooth cursor-pointer border-2 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Sport Icon */}
                        <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-3xl shadow-primary flex-shrink-0">
                          {getSportEmoji(game.sport)}
                        </div>
                        
                        {/* Game Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="text-xl font-bold mb-1">{game.sport.replace(/_/g, ' ')}</h3>
                              <div className="flex items-center text-muted-foreground text-sm">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="truncate">{game.location_name} • {game.city}</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="flex-shrink-0">
                              {calculateDistance(game.latitude, game.longitude)}
                            </Badge>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{format(new Date(game.game_date), "MMM d")}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{game.start_time.slice(0, 5)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">
                                {game.current_players}/{game.max_players} players
                              </span>
                            </div>
                            <Badge variant="outline" className="w-fit">
                              {formatSkillLevel(game.skill_level)}
                            </Badge>
                          </div>

                          {/* Host Info */}
                          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                              {game.profiles?.first_name?.[0] || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {game.profiles ? `${game.profiles.first_name} ${game.profiles.last_name}` : "Unknown Host"}
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Star className="w-3 h-3 fill-primary text-primary" />
                                <span>{game.profiles?.overall_rating?.toFixed(1) || "N/A"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - CTA */}
                      <div className="flex flex-col items-stretch md:items-end space-y-2 md:min-w-[140px]">
                        <div className="text-2xl font-black text-primary text-right">
                          Free
                        </div>
                        <Button 
                          className="gradient-primary text-white shadow-primary hover:opacity-90 w-full"
                          onClick={() => handleJoinGame(game.id, game.current_players, game.max_players)}
                          disabled={joiningGameId === game.id || game.current_players >= game.max_players}
                        >
                          {joiningGameId === game.id ? "Joining..." : game.current_players >= game.max_players ? "Game Full" : "Join Game"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleViewDetails(game.id)}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
