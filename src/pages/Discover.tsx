import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import GameMap from "@/components/GameMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Filter, Users, Calendar, Clock, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [joiningGameId, setJoiningGameId] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoinGame = async (gameId: number, currentPlayers: number, maxPlayers: number) => {
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
          game_id: gameId.toString(),
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

  // Mock data - will be replaced with real data later
  const games = [
    {
      id: 1,
      sport: "Basketball",
      emoji: "🏀",
      location: "Central Park Courts",
      address: "New York, NY",
      date: "Today",
      time: "6:00 PM",
      distance: "0.8 mi",
      players: { current: 8, max: 10 },
      skillLevel: "Intermediate",
      hostName: "Mike Jordan",
      hostRating: 4.8,
      price: "Free",
      lat: 40.7829,
      lng: -73.9654,
    },
    {
      id: 2,
      sport: "Soccer",
      emoji: "⚽",
      location: "Lincoln Field",
      address: "Brooklyn, NY",
      date: "Tomorrow",
      time: "10:00 AM",
      distance: "1.2 mi",
      players: { current: 12, max: 16 },
      skillLevel: "All Levels",
      hostName: "Sarah Lee",
      hostRating: 4.9,
      price: "Free",
      lat: 40.6782,
      lng: -73.9442,
    },
    {
      id: 3,
      sport: "Volleyball",
      emoji: "🏐",
      location: "Beach Courts",
      address: "Queens, NY",
      date: "Saturday",
      time: "2:00 PM",
      distance: "2.5 mi",
      players: { current: 6, max: 8 },
      skillLevel: "Advanced",
      hostName: "Alex Kim",
      hostRating: 4.7,
      price: "Free",
      lat: 40.7282,
      lng: -73.7949,
    },
  ];

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
              games={games} 
              center={[40.7128, -74.0060]} 
              zoom={11} 
            />
          </div>

          {/* Games List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Nearby Games ({games.length})</h2>
              <Badge variant="secondary" className="text-sm">
                Within 5 miles
              </Badge>
            </div>

            {games.map((game) => (
              <Card key={game.id} className="hover:shadow-elevated transition-smooth cursor-pointer border-2 hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Sport Icon */}
                      <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-3xl shadow-primary flex-shrink-0">
                        {game.emoji}
                      </div>
                      
                      {/* Game Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{game.sport}</h3>
                            <div className="flex items-center text-muted-foreground text-sm">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="truncate">{game.location} • {game.address}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="flex-shrink-0">
                            {game.distance}
                          </Badge>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{game.date}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{game.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {game.players.current}/{game.players.max} players
                            </span>
                          </div>
                          <Badge variant="outline" className="w-fit">
                            {game.skillLevel}
                          </Badge>
                        </div>

                        {/* Host Info */}
                        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
                          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                            {game.hostName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{game.hostName}</div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 fill-primary text-primary" />
                              <span>{game.hostRating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - CTA */}
                    <div className="flex flex-col items-stretch md:items-end space-y-2 md:min-w-[140px]">
                      <div className="text-2xl font-black text-primary text-right">
                        {game.price}
                      </div>
                      <Button 
                        className="gradient-primary text-white shadow-primary hover:opacity-90 w-full"
                        onClick={() => handleJoinGame(game.id, game.players.current, game.players.max)}
                        disabled={joiningGameId === game.id || game.players.current >= game.players.max}
                      >
                        {joiningGameId === game.id ? "Joining..." : game.players.current >= game.players.max ? "Game Full" : "Join Game"}
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
