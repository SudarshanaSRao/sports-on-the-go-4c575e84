import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

interface Game {
  id: string;
  sport: string;
  location_name: string;
  address: string;
  game_date: string;
  start_time: string;
  current_players: number | null;
  max_players: number;
  skill_level: string;
  host_id: string;
  cost_per_person: number | null;
  latitude: number;
  longitude: number;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

export default function Discover() {
  const center: [number, number] = [37.7749, -122.4194];
  const zoom = 12;
  const [map, setMap] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningGameId, setJoiningGameId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("games")
        .select(`
          *,
          profiles:host_id (
            first_name,
            last_name
          )
        `)
        .order("game_date", { ascending: true });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast({
        title: "Error",
        description: "Failed to load games",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => setLeafletLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !window.L || map || games.length === 0) return;

    const L = window.L;

    // Fix default marker icon
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    // Initialize map
    const mapInstance = L.map("map", {
      center: center,
      zoom: zoom,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    // Add markers for each game
    games.forEach((game) => {
      const emoji = getSportEmoji(game.sport);
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${emoji}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });

      const marker = L.marker([game.latitude, game.longitude], { icon }).addTo(mapInstance);

      // Create popup content
      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <div>
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700;">${game.sport.replace(/_/g, ' ')}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${game.location_name}</p>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0; font-size: 12px;">
            <div>📅 ${format(new Date(game.game_date), 'MMM d')}</div>
            <div>🕒 ${game.start_time}</div>
            <div>👥 ${game.current_players || 0}/${game.max_players}</div>
            <div style="padding: 2px 6px; background: #f3f4f6; border-radius: 8px; text-align: center;">${formatSkillLevel(game.skill_level)}</div>
          </div>
          <div style="padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 18px; font-weight: 700; color: #667eea;">$${game.cost_per_person || 0}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300 });

      marker.on("click", () => {
        setSelectedGame(game);
      });
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [leafletLoaded, games]);

  const handleJoinGame = async (gameId: string, currentPlayers: number, maxPlayers: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join games",
      });
      navigate("/auth");
      return;
    }

    if (currentPlayers >= maxPlayers) {
      toast({
        title: "Game is full",
        description: "This game has reached maximum capacity",
        variant: "destructive",
      });
      return;
    }

    try {
      setJoiningGameId(gameId);
      const { error } = await supabase.from("rsvps").insert({
        game_id: gameId,
        user_id: user.id,
        status: "CONFIRMED",
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already joined",
            description: "You've already joined this game",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You've joined the game",
        });
        // Refresh games to update player count
        fetchGames();
      }
    } catch (error) {
      console.error("Error joining game:", error);
      toast({
        title: "Error",
        description: "Failed to join game",
        variant: "destructive",
      });
    } finally {
      setJoiningGameId(null);
    }
  };

  const handleViewDetails = () => {
    toast({
      title: "Coming Soon",
      description: "Game details page is under development",
    });
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          if (map && window.L) {
            map.setView([latitude, longitude], 14);

            // Add user location marker
            const L = window.L;
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
            })
              .addTo(map)
              .bindPopup("You are here");
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

  const getSportEmoji = (sport: string): string => {
    const sportEmojis: Record<string, string> = {
      BASKETBALL: "🏀",
      SOCCER: "⚽",
      TENNIS: "🎾",
      VOLLEYBALL: "🏐",
      FOOTBALL: "🏈",
      BASEBALL: "⚾",
    };
    return sportEmojis[sport] || "⚽";
  };

  const formatSkillLevel = (level: string): string => {
    return level.charAt(0) + level.slice(1).toLowerCase();
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return `${distance.toFixed(1)} mi`;
  };

  if (!leafletLoaded || loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Discover Games</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <div className="relative w-full h-[600px] rounded-lg overflow-hidden border-2 border-border shadow-lg">
            <div id="map" className="w-full h-full"></div>
            <button
              onClick={handleLocateMe}
              className="absolute bottom-4 right-4 z-[1000] w-12 h-12 rounded-full bg-background shadow-lg border-2 border-primary flex items-center justify-center hover:bg-accent transition-all hover:scale-110"
              title="Locate Me"
            >
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Games List Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Nearby Games</h2>
            {games.length === 0 ? (
              <p className="text-muted-foreground">No games available</p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <span>{getSportEmoji(game.sport)}</span>
                          {game.sport.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-sm text-muted-foreground">{game.location_name}</p>
                        <p className="text-xs text-muted-foreground">{game.address}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div className="flex items-center gap-1">
                        <span>📅</span>
                        <span>{format(new Date(game.game_date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>{game.start_time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👥</span>
                        <span>{game.current_players || 0}/{game.max_players} players</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{formatSkillLevel(game.skill_level)}</span>
                      </div>
                    </div>

                    {game.profiles && (
                      <p className="text-sm text-muted-foreground mb-3">
                        Host: {game.profiles.first_name} {game.profiles.last_name}
                      </p>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <span className="text-xl font-bold text-primary">${game.cost_per_person || 0}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={handleViewDetails}
                          className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Details
                        </button>
                        <button
                          onClick={() => handleJoinGame(game.id, game.current_players || 0, game.max_players)}
                          disabled={joiningGameId === game.id || (game.current_players || 0) >= game.max_players}
                          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {joiningGameId === game.id ? "Joining..." : (game.current_players || 0) >= game.max_players ? "Full" : "Join Game"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
