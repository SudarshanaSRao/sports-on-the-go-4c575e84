import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Filter, Users, Calendar, Clock, Star } from "lucide-react";
import GameMap from "@/components/GameMap";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.006 });
  const { toast } = useToast();

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Use default location (New York)
        },
      );
    }
  }, []);

  // Fetch games from database
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("games")
        .select(
          `
          *,
          profiles:host_id (
            first_name,
            last_name,
            profile_photo
          )
        `,
        )
        .eq("status", "UPCOMING")
        .gte("game_date", new Date().toISOString().split("T")[0])
        .order("game_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching games:", error);
        toast({
          title: "Error loading games",
          description: "Could not load games. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      // Transform data for map component
      const transformedGames = (data || []).map((game) => {
        const hostName = game.profiles
          ? `${game.profiles.first_name || ""} ${game.profiles.last_name || ""}`.trim() || "Anonymous"
          : "Anonymous";

        // Calculate distance from user location
        const distance = calculateDistance(userLocation.lat, userLocation.lng, game.latitude, game.longitude);

        // Format date
        const gameDate = new Date(game.game_date);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let dateStr = gameDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (gameDate.toDateString() === today.toDateString()) {
          dateStr = "Today";
        } else if (gameDate.toDateString() === tomorrow.toDateString()) {
          dateStr = "Tomorrow";
        }

        // Format time (convert 24h to 12h)
        const [hours, minutes] = game.start_time.split(":");
        const hour = parseInt(hours);
        const period = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        const timeStr = `${hour12}:${minutes} ${period}`;

        // Get emoji for sport
        const sportEmojis = {
          Basketball: "🏀",
          Soccer: "⚽",
          Tennis: "🎾",
          Volleyball: "🏐",
          Football: "🏈",
          Baseball: "⚾",
          Pickleball: "🏓",
          "Ultimate Frisbee": "🥏",
          Running: "🏃",
          Cycling: "🚴",
          Badminton: "🏸",
          Golf: "⛳",
        };

        return {
          id: game.id,
          sport: game.sport,
          emoji: sportEmojis[game.sport] || "⚽",
          location: game.location_name,
          address: `${game.city}, ${game.state}`,
          date: dateStr,
          time: timeStr,
          distance: `${distance.toFixed(1)} mi`,
          players: {
            current: game.current_players || 1,
            max: game.max_players,
          },
          skillLevel: game.skill_level,
          hostName: hostName,
          hostRating: 4.5, // TODO: Get from reviews
          price: game.cost_per_person > 0 ? `$${game.cost_per_person}` : "Free",
          lat: game.latitude,
          lng: game.longitude,
          description: game.description,
          equipmentRequirements: game.equipment_requirements,
          gameRules: game.game_rules,
        };
      });

      setGames(transformedGames);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value) => {
    return (value * Math.PI) / 180;
  };

  // Filter games based on search
  const filteredGames = games.filter((game) => {
    const query = searchQuery.toLowerCase();
    return (
      game.sport.toLowerCase().includes(query) ||
      game.location.toLowerCase().includes(query) ||
      game.hostName.toLowerCase().includes(query) ||
      game.address.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2 text-gray-900">Discover Games</h1>
            <p className="text-lg text-gray-600">Seek. Squad. Score. 🎯</p>
          </div>

          {/* Search and Filters */}
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by sport, location, or host..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base bg-white border-2 border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>

            <Button variant="outline" className="h-12 border-2 border-gray-200 hover:border-blue-500 bg-white">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Interactive Map */}
          <div className="mb-8">
            {games.length > 0 ? (
              <GameMap games={filteredGames} center={[userLocation.lat, userLocation.lng]} zoom={12} />
            ) : (
              <div className="w-full h-96 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 text-lg mb-4">No games found nearby</p>
                  <Button onClick={() => (window.location.href = "/host")}>Host Your First Game</Button>
                </div>
              </div>
            )}
          </div>

          {/* Games List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Nearby Games ({filteredGames.length})</h2>
              <Badge variant="secondary" className="text-sm">
                Within 25 miles
              </Badge>
            </div>

            {filteredGames.length === 0 ? (
              <Card className="border-2 border-gray-200">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-600 text-lg mb-4">
                    {searchQuery ? "No games match your search" : "No games available yet"}
                  </p>
                  <Button onClick={() => (window.location.href = "/host")}>Host a Game</Button>
                </CardContent>
              </Card>
            ) : (
              filteredGames.map((game) => (
                <Card
                  key={game.id}
                  className="hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-400 bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Sport Icon */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                          {game.emoji}
                        </div>

                        {/* Game Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{game.sport}</h3>
                              <div className="flex items-center text-gray-600 text-sm">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="truncate">
                                  {game.location} • {game.address}
                                </span>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className="flex-shrink-0 bg-blue-100 text-blue-700 border-blue-300"
                            >
                              {game.distance}
                            </Badge>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-700">{game.date}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-700">{game.time}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-700">
                                {game.players.current}/{game.players.max}
                              </span>
                            </div>
                            <Badge variant="outline" className="w-fit border-green-300 bg-green-50 text-green-700">
                              {game.skillLevel}
                            </Badge>
                          </div>

                          {/* Host Info */}
                          <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                              {game.hostName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-700 truncate">{game.hostName}</div>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{game.hostRating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - CTA */}
                      <div className="flex flex-col items-stretch md:items-end space-y-2 md:min-w-[140px]">
                        <div className="text-2xl font-black text-blue-600 text-right">{game.price}</div>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all w-full">
                          Join Game
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-900">
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
}
