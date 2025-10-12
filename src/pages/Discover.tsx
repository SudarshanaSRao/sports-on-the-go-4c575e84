import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, MapPin, Navigation } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Game {
  id: number;
  sport: string;
  emoji: string;
  location: string;
  address: string;
  date: string;
  time: string;
  distance: string;
  players: { current: number; max: number };
  skillLevel: string;
  hostName: string;
  hostRating: number;
  price: string;
  lat: number;
  lng: number;
}

interface GameMapProps {
  games?: Game[];
  center?: [number, number];
  zoom?: number;
}

// Sample games data for demo
const sampleGames: Game[] = [
  {
    id: 1,
    sport: "Basketball",
    emoji: "🏀",
    location: "Mission Playground",
    address: "19th & Valencia",
    date: "Oct 15",
    time: "6:00 PM",
    distance: "2.3 mi",
    players: { current: 8, max: 10 },
    skillLevel: "Intermediate",
    hostName: "John D.",
    hostRating: 4.8,
    price: "Free",
    lat: 37.7599,
    lng: -122.4219,
  },
  {
    id: 2,
    sport: "Soccer",
    emoji: "⚽",
    location: "Golden Gate Park",
    address: "Polo Fields",
    date: "Oct 16",
    time: "5:00 PM",
    distance: "3.1 mi",
    players: { current: 14, max: 20 },
    skillLevel: "All Levels",
    hostName: "Maria S.",
    hostRating: 4.9,
    price: "$5",
    lat: 37.7694,
    lng: -122.4862,
  },
  {
    id: 3,
    sport: "Tennis",
    emoji: "🎾",
    location: "Dolores Park",
    address: "Tennis Courts",
    date: "Oct 17",
    time: "7:00 AM",
    distance: "1.8 mi",
    players: { current: 3, max: 4 },
    skillLevel: "Advanced",
    hostName: "Alex K.",
    hostRating: 4.7,
    price: "Free",
    lat: 37.7596,
    lng: -122.4269,
  },
];

export default function GameMap({ games = sampleGames, center = [37.7749, -122.4194], zoom = 12 }: GameMapProps) {
  const [map, setMap] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [joiningGameId, setJoiningGameId] = useState<number | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        // Fix default marker icon
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // Initialize map
        const mapInstance = L.map("map").setView(center, zoom);

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstance);

        // Add markers for each game
        games.forEach((game) => {
          const icon = L.divIcon({
            className: "custom-marker",
            html: `
              <div style="
                width: 40px;
                height: 40px;
                background: #3b82f6;
                border: 3px solid #1e40af;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                cursor: pointer;
              ">
                ${game.emoji}
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });

          const marker = L.marker([game.lat, game.lng], { icon }).addTo(mapInstance);

          marker.on("click", () => {
            setSelectedGame(game);
            mapInstance.setView([game.lat, game.lng], 14);
          });
        });

        setMap(mapInstance);

        // Cleanup
        return () => {
          mapInstance.remove();
        };
      });
    }
  }, [games]);

  const handleJoinGame = async (gameId: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join a game.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setJoiningGameId(gameId);

    try {
      const { error } = await supabase.from("rsvps").insert({
        game_id: gameId.toString(),
        user_id: user.id,
        status: "CONFIRMED",
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already joined",
            description: "You've already joined this game.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully joined!",
          description: "You're confirmed for this game.",
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

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);

          if (map) {
            map.setView([latitude, longitude], 14);

            // Add user location marker
            import("leaflet").then((L) => {
              L.marker([latitude, longitude], {
                icon: L.divIcon({
                  className: "user-marker",
                  html: `
                    <div style="
                      width: 20px;
                      height: 20px;
                      background: #ef4444;
                      border: 3px solid white;
                      border-radius: 50%;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    "></div>
                  `,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10],
                }),
              }).addTo(map);
            });
          }
        },
        (error) => {
          alert("Unable to get your location. Please enable location services.");
        },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Game</h1>
          <p className="text-gray-600">Discover pickup games near you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-140px)]">
          {/* Map Section */}
          <div className="lg:col-span-2 relative">
            <div id="map" className="w-full h-full rounded-xl shadow-lg border-2 border-gray-200"></div>

            {/* Locate Me Button */}
            <button
              onClick={handleLocateMe}
              className="absolute bottom-4 right-4 z-[1000] w-12 h-12 rounded-full bg-white shadow-lg border-2 border-blue-500 flex items-center justify-center hover:bg-blue-50 transition-all hover:scale-110"
              title="Locate Me"
            >
              <Navigation className="w-5 h-5 text-blue-600" />
            </button>

            {/* Map Legend */}
            <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 border border-gray-200">
              <div className="text-xs font-semibold text-gray-700 mb-2">Games Nearby</div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">🏀</span>
                <span>Basketball</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">⚽</span>
                <span>Soccer</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">🎾</span>
                <span>Tennis</span>
              </div>
            </div>
          </div>

          {/* Game Details Panel */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 overflow-y-auto">
            {selectedGame ? (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-4xl mb-2">{selectedGame.emoji}</div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedGame.sport}</h2>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedGame.location}
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">{selectedGame.distance}</Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-xs text-gray-500">Date</div>
                      <div className="font-semibold text-gray-900">{selectedGame.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-xs text-gray-500">Time</div>
                      <div className="font-semibold text-gray-900">{selectedGame.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-xs text-gray-500">Players</div>
                      <div className="font-semibold text-gray-900">
                        {selectedGame.players.current}/{selectedGame.players.max}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Skill Level</div>
                    <Badge className="bg-green-100 text-green-700 border-green-300">{selectedGame.skillLevel}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Cost</div>
                    <div className="text-xl font-bold text-blue-600">{selectedGame.price}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Host:</span> {selectedGame.hostName}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold text-gray-900">{selectedGame.hostRating}</span>
                    <span className="text-sm text-gray-500">/5.0</span>
                  </div>
                </div>

                <Button 
                  onClick={() => selectedGame && handleJoinGame(selectedGame.id)}
                  disabled={joiningGameId === selectedGame?.id}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  {joiningGameId === selectedGame?.id ? "Joining..." : "Join Game"}
                </Button>

                <button
                  onClick={() => setSelectedGame(null)}
                  className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Back to all games
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nearby Games</h3>
                <div className="space-y-3">
                  {games.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{game.emoji}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{game.sport}</div>
                            <div className="text-xs text-gray-600">{game.location}</div>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">{game.distance}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                          {game.date} • {game.time}
                        </span>
                        <span>
                          {game.players.current}/{game.players.max} players
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Required Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
    </div>
  );
}
