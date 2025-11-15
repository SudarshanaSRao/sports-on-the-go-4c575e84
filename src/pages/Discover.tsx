import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareGameButton } from "@/components/ShareGameButton";
import { SEO } from "@/components/SEO";
import { GameReminderBanner } from "@/components/GameReminderBanner";
import { Calendar, Clock, Users, MapPin, Navigation, Share2, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { toDisplaySportName, getSportEmoji, formatSportDisplay } from "@/utils/sportsUtils";
import { useSavedGames } from "@/hooks/useSavedGames";

interface Game {
  id: string;
  sport: string;
  rawSport: string; // Raw sport type from DB (e.g., "OTHER")
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
  visibility: string;
  hostId: string;
  rawGameDate?: string; // Store raw date for comparison (optional for sample games)
  rawStartTime?: string; // Store raw time for comparison (optional for sample games)
  customSportName?: string | null;
}

interface GameMapProps {
  games?: Game[];
  center?: [number, number];
  zoom?: number;
}

// Sample games data for demo - across America
const sampleGames: Game[] = [
  {
    id: "1",
    sport: "Basketball",
    rawSport: "BASKETBALL",
    emoji: "🏀",
    location: "Mission Playground",
    address: "19th & Valencia, San Francisco, CA",
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
    visibility: "PUBLIC",
    hostId: "sample-host-1",
  },
  {
    id: "2",
    sport: "Soccer",
    rawSport: "SOCCER",
    emoji: "⚽",
    location: "Central Park",
    address: "Great Lawn, New York, NY",
    date: "Oct 16",
    time: "5:00 PM",
    distance: "3.1 mi",
    players: { current: 14, max: 20 },
    skillLevel: "All Levels",
    hostName: "Maria S.",
    hostRating: 4.9,
    price: "$5",
    lat: 40.7829,
    lng: -73.9654,
    visibility: "PUBLIC",
    hostId: "sample-host-2",
  },
  {
    id: "3",
    sport: "Tennis",
    rawSport: "TENNIS",
    emoji: "🎾",
    location: "Griffith Park",
    address: "Los Angeles, CA",
    date: "Oct 17",
    time: "7:00 AM",
    distance: "1.8 mi",
    players: { current: 3, max: 4 },
    skillLevel: "Advanced",
    hostName: "Alex K.",
    hostRating: 4.7,
    price: "Free",
    lat: 34.1365,
    lng: -118.2942,
    visibility: "PUBLIC",
    hostId: "sample-host-3",
  },
  {
    id: "4",
    sport: "Volleyball",
    rawSport: "VOLLEYBALL",
    emoji: "🏐",
    location: "South Beach",
    address: "Miami Beach, FL",
    date: "Oct 18",
    time: "4:00 PM",
    distance: "4.2 mi",
    players: { current: 6, max: 8 },
    skillLevel: "Beginner",
    hostName: "Sarah L.",
    hostRating: 4.6,
    price: "Free",
    lat: 25.7617,
    lng: -80.1918,
    visibility: "PUBLIC",
    hostId: "sample-host-4",
  },
  {
    id: "5",
    sport: "Football",
    rawSport: "FOOTBALL",
    emoji: "🏈",
    location: "Grant Park",
    address: "Chicago, IL",
    date: "Oct 19",
    time: "2:00 PM",
    distance: "2.8 mi",
    players: { current: 18, max: 22 },
    skillLevel: "Intermediate",
    hostName: "Mike T.",
    hostRating: 4.9,
    price: "$10",
    lat: 41.8756,
    lng: -87.6244,
    visibility: "PUBLIC",
    hostId: "sample-host-5",
  },
  {
    id: "6",
    sport: "Baseball",
    rawSport: "BASEBALL",
    emoji: "⚾",
    location: "Gas Works Park",
    address: "Seattle, WA",
    date: "Oct 20",
    time: "11:00 AM",
    distance: "3.5 mi",
    players: { current: 12, max: 18 },
    skillLevel: "All Levels",
    hostName: "Chris P.",
    hostRating: 4.5,
    price: "Free",
    lat: 47.6456,
    lng: -122.3344,
    visibility: "PUBLIC",
    hostId: "sample-host-6",
  },
  {
    id: "16",
    sport: "Cricket",
    rawSport: "CRICKET",
    emoji: "🏏",
    location: "Golden Gate Park",
    address: "San Francisco, CA",
    date: "Oct 20",
    time: "2:00 PM",
    distance: "2.9 mi",
    players: { current: 15, max: 22 },
    skillLevel: "Intermediate",
    hostName: "Raj K.",
    hostRating: 4.8,
    price: "Free",
    lat: 37.7694,
    lng: -122.4862,
    visibility: "PUBLIC",
    hostId: "sample-host-16",
  },
  {
    id: "17",
    sport: "Cricket",
    rawSport: "CRICKET",
    emoji: "🏏",
    location: "Flushing Meadows Park",
    address: "Queens, NY",
    date: "Oct 21",
    time: "10:00 AM",
    distance: "4.1 mi",
    players: { current: 18, max: 22 },
    skillLevel: "All Levels",
    hostName: "Priya S.",
    hostRating: 4.9,
    price: "$5",
    lat: 40.7498,
    lng: -73.8447,
    visibility: "PUBLIC",
    hostId: "sample-host-17",
  },
  {
    id: "7",
    sport: "Pickleball",
    rawSport: "PICKLEBALL",
    emoji: "🎾",
    location: "Zilker Park",
    address: "Austin, TX",
    date: "Oct 21",
    time: "9:00 AM",
    distance: "1.5 mi",
    players: { current: 3, max: 4 },
    skillLevel: "Intermediate",
    hostName: "Linda W.",
    hostRating: 4.8,
    price: "$5",
    lat: 30.2672,
    lng: -97.7431,
    visibility: "PUBLIC",
    hostId: "sample-host-7",
  },
  {
    id: "8",
    sport: "Ultimate Frisbee",
    rawSport: "ULTIMATE_FRISBEE",
    emoji: "🥏",
    location: "Boston Common",
    address: "Boston, MA",
    date: "Oct 22",
    time: "3:00 PM",
    distance: "5.1 mi",
    players: { current: 10, max: 14 },
    skillLevel: "All Levels",
    hostName: "Tom H.",
    hostRating: 4.7,
    price: "Free",
    lat: 42.3551,
    lng: -71.0656,
    visibility: "PUBLIC",
    hostId: "sample-host-8",
  },
  {
    id: "9",
    sport: "Running",
    rawSport: "RUNNING",
    emoji: "🏃",
    location: "City Park",
    address: "Denver, CO",
    date: "Oct 23",
    time: "6:30 AM",
    distance: "3.7 mi",
    players: { current: 8, max: 15 },
    skillLevel: "Intermediate",
    hostName: "Emma R.",
    hostRating: 4.9,
    price: "Free",
    lat: 39.7476,
    lng: -104.9528,
    visibility: "PUBLIC",
    hostId: "sample-host-9",
  },
  {
    id: "10",
    sport: "Cycling",
    rawSport: "CYCLING",
    emoji: "🚴",
    location: "Schuylkill River Trail",
    address: "Philadelphia, PA",
    date: "Oct 24",
    time: "8:00 AM",
    distance: "2.1 mi",
    players: { current: 5, max: 12 },
    skillLevel: "All Levels",
    hostName: "Jake M.",
    hostRating: 4.6,
    price: "Free",
    lat: 39.9526,
    lng: -75.1652,
    visibility: "PUBLIC",
    hostId: "sample-host-10",
  },
  {
    id: "11",
    sport: "Badminton",
    rawSport: "BADMINTON",
    emoji: "🏸",
    location: "Piedmont Park",
    address: "Atlanta, GA",
    date: "Oct 25",
    time: "7:00 PM",
    distance: "4.8 mi",
    players: { current: 4, max: 8 },
    skillLevel: "Beginner",
    hostName: "Amy C.",
    hostRating: 4.5,
    price: "$3",
    lat: 33.7869,
    lng: -84.3722,
    visibility: "PUBLIC",
    hostId: "sample-host-11",
  },
  {
    id: "12",
    sport: "Golf",
    rawSport: "GOLF",
    emoji: "⛳",
    location: "Discovery Park",
    address: "Seattle, WA",
    date: "Oct 26",
    time: "10:00 AM",
    distance: "4.3 mi",
    players: { current: 3, max: 4 },
    skillLevel: "Intermediate",
    hostName: "Robert K.",
    hostRating: 4.8,
    price: "$25",
    lat: 47.6597,
    lng: -122.4043,
    visibility: "PUBLIC",
    hostId: "sample-host-12",
  },
  {
    id: "13",
    sport: "Basketball",
    rawSport: "BASKETBALL",
    emoji: "🏀",
    location: "Waterfront Park",
    address: "Portland, OR",
    date: "Oct 27",
    time: "5:00 PM",
    distance: "2.5 mi",
    players: { current: 7, max: 10 },
    skillLevel: "All Levels",
    hostName: "Kevin L.",
    hostRating: 4.7,
    price: "Free",
    lat: 45.5234,
    lng: -122.6762,
    visibility: "PUBLIC",
    hostId: "sample-host-13",
  },
  {
    id: "14",
    sport: "Soccer",
    rawSport: "SOCCER",
    emoji: "⚽",
    location: "Discovery Green",
    address: "Houston, TX",
    date: "Oct 28",
    time: "6:00 PM",
    distance: "3.2 mi",
    players: { current: 16, max: 22 },
    skillLevel: "Intermediate",
    hostName: "Carlos M.",
    hostRating: 4.8,
    price: "$7",
    lat: 29.7520,
    lng: -95.3585,
    visibility: "PUBLIC",
    hostId: "sample-host-14",
  },
  {
    id: "15",
    sport: "Volleyball",
    rawSport: "VOLLEYBALL",
    emoji: "🏐",
    location: "Mission Bay Park",
    address: "San Diego, CA",
    date: "Oct 29",
    time: "3:00 PM",
    distance: "1.9 mi",
    players: { current: 8, max: 12 },
    skillLevel: "All Levels",
    hostName: "Jessica T.",
    hostRating: 4.9,
    price: "Free",
    lat: 32.7661,
    lng: -117.2269,
    visibility: "PUBLIC",
    hostId: "sample-host-15",
  },
];

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return `${distance.toFixed(1)} mi`;
};

export default function GameMap({ games: propGames, center: propCenter, zoom = 4 }: GameMapProps) {
  const [map, setMap] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [joiningGameId, setJoiningGameId] = useState<string | null>(null);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [markerMap, setMarkerMap] = useState<Map<string, any>>(new Map());
  const [dbGames, setDbGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideMyGames, setHideMyGames] = useState(false);
  const [userRSVPs, setUserRSVPs] = useState<Set<string>>(new Set());
  const [userHostedGames, setUserHostedGames] = useState<Set<string>>(new Set());
  const [savedGamesFilter, setSavedGamesFilter] = useState<'all' | 'only-saved' | 'hide-saved'>('all');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { savedGameIds, toggleSaveGame, isSaved } = useSavedGames(user?.id);
  const [searchParams, setSearchParams] = useSearchParams();

  // Transform a single game from database format to UI format
  const transformGame = (game: any): Game => ({
    id: game.id,
    sport: formatSportDisplay(game.sport, game.custom_sport_name),
    rawSport: game.sport, // Store raw DB value for filtering
    emoji: getSportEmoji(game.sport),
    location: game.location_name,
    address: `${game.address}, ${game.city}`,
    date: new Date(game.game_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: new Date(`2000-01-01T${game.start_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    distance: '0 mi',
    players: { current: game.current_players, max: game.max_players },
    skillLevel: game.skill_level.replace('_', ' '),
    hostName: game.profiles?.username || 'Unknown',
    hostRating: 4.5,
    price: 'Free',
    lat: parseFloat(game.latitude),
    lng: parseFloat(game.longitude),
    visibility: game.visibility,
    hostId: game.host_id,
    rawGameDate: game.game_date,
    rawStartTime: game.start_time,
    customSportName: game.custom_sport_name,
  });

  // Fetch user's games (RSVPs and hosted games)
  useEffect(() => {
    const fetchUserGames = async () => {
      if (!user) return;
      
      // Fetch RSVPs
      const { data: rsvpData } = await supabase
        .from('rsvps')
        .select('game_id')
        .eq('user_id', user.id)
        .eq('status', 'CONFIRMED');
      
      if (rsvpData) {
        const gameIds = new Set(rsvpData.map(rsvp => rsvp.game_id));
        setUserRSVPs(gameIds);
      }

      // Fetch hosted games
      const { data: hostedData } = await supabase
        .from('games')
        .select('id')
        .eq('host_id', user.id);
      
      if (hostedData) {
        const gameIds = new Set(hostedData.map(game => game.id));
        setUserHostedGames(gameIds);
      }
    };

    fetchUserGames();
  }, [user]);

  // Fetch games from database and set up realtime subscription
  useEffect(() => {
    const fetchGames = async () => {
      console.log('🎮 [Discover] Fetching games from database...');
      setLoading(true);
      
      try {
        const { data: gamesData, error } = await supabase
          .from('games')
          .select(`
            id,
            sport,
            custom_sport_name,
            location_name,
            address,
            city,
            game_date,
            start_time,
            max_players,
            current_players,
            skill_level,
            latitude,
            longitude,
            host_id,
            visibility,
            profiles!games_host_id_fkey(username)
          `)
          .eq('status', 'UPCOMING')
          .order('game_date', { ascending: true });

        if (error) {
          console.error('❌ [Discover] Error fetching games:', error);
          throw error;
        }

        console.log('✅ [Discover] Games fetched:', gamesData?.length || 0);

        const transformedGames: Game[] = (gamesData || []).map(transformGame);
        setDbGames(transformedGames);
      } catch (error) {
        console.error('❌ [Discover] Error:', error);
        toast({
          title: 'Error loading games',
          description: 'Could not load games from database',
          variant: 'destructive',
        });
        setDbGames(sampleGames);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();

    // Set up realtime subscription for game changes
    console.log('🔴 [Discover] Setting up realtime subscription...');
    const channel = supabase
      .channel('games-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'games'
        },
        async (payload) => {
          console.log('🆕 [Discover] New game detected:', payload);
          
          // Fetch the complete game data including profile
          const { data: newGameData, error } = await supabase
            .from('games')
            .select(`
              id,
              sport,
              custom_sport_name,
              location_name,
              address,
              city,
              game_date,
              start_time,
              max_players,
              current_players,
              skill_level,
              latitude,
              longitude,
              host_id,
              visibility,
              profiles!games_host_id_fkey(username)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && newGameData) {
            const transformedGame = transformGame(newGameData);
            console.log('✅ [Discover] Adding new game to map:', transformedGame);
            setDbGames(prev => [...prev, transformedGame]);
            
            toast({
              title: '🎮 New game available!',
              description: `${transformedGame.sport} at ${transformedGame.location}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games'
        },
        async (payload) => {
          console.log('📝 [Discover] Game updated:', payload);
          
          // Fetch the updated game data
          const { data: updatedGameData, error } = await supabase
            .from('games')
            .select(`
              id,
              sport,
              custom_sport_name,
              location_name,
              address,
              city,
              game_date,
              start_time,
              max_players,
              current_players,
              skill_level,
              latitude,
              longitude,
              host_id,
              visibility,
              profiles!games_host_id_fkey(username)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && updatedGameData) {
            const transformedGame = transformGame(updatedGameData);
            console.log('✅ [Discover] Updating game on map:', transformedGame);
            setDbGames(prev => prev.map(game => 
              game.id === transformedGame.id ? transformedGame : game
            ));
            
            toast({
              title: '📝 Game updated',
              description: `${transformedGame.sport} at ${transformedGame.location}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'games'
        },
        (payload) => {
          console.log('🗑️ [Discover] Game deleted:', payload);
          const gameId = payload.old.id;
          
          setDbGames(prev => {
            const deletedGame = prev.find(g => g.id === gameId);
            if (deletedGame) {
              toast({
                title: '🗑️ Game cancelled',
                description: `${deletedGame.sport} at ${deletedGame.location} has been cancelled`,
              });
            }
            return prev.filter(game => game.id !== gameId);
          });
        }
      )
      .subscribe();

    return () => {
      console.log('🔴 [Discover] Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Use propGames if provided, otherwise use fetched DB games
  const games = propGames || dbGames;
  
  // Restore game selection from URL on page load
  useEffect(() => {
    const gameId = searchParams.get('gameId');
    
    // Only restore if we have URL param and no game is already selected
    if (gameId && games.length > 0 && !selectedGame) {
      const game = games.find(g => g.id === gameId);
      
      if (game) {
        setSelectedGame(game);
        if (map) {
          map.setView([game.lat, game.lng], 14);
        }
      }
    }
  }, [searchParams, games, map, selectedGame]);
  
  // Auto-center map on first real game with coordinates
  const center = propCenter || (games.length > 0 && games[0].lat && games[0].lng 
    ? [games[0].lat, games[0].lng] as [number, number]
    : [39.8283, -98.5795] as [number, number]);

  // Get unique sports from games (using DB enum values)
  const availableSports = useMemo(() => {
    return Array.from(new Set(games.map(g => g.rawSport))).sort();
  }, [games]);

  // Filter games based on selected sports and visibility
  const filteredGames = useMemo(() => {
    let filtered = games;
    
    // Filter out past games based on user's local timezone
    const now = new Date();
    filtered = filtered.filter(game => {
      // Skip filtering for sample games without rawGameDate
      if (!game.rawGameDate || !game.rawStartTime) {
        return true;
      }
      
      // Combine date and time into a single Date object in user's local timezone
      const gameDateTime = new Date(`${game.rawGameDate}T${game.rawStartTime}`);
      
      // Only show games that haven't passed yet
      return gameDateTime > now;
    });
    
    // Filter by selected sports
    if (selectedSports.length > 0) {
      filtered = filtered.filter(game => selectedSports.includes(game.rawSport));
    }
    
    // Filter by visibility rules
    filtered = filtered.filter(game => {
      // Public games are visible to everyone
      if (game.visibility === 'PUBLIC') {
        return true;
      }
      
      // For FRIENDS_ONLY and INVITE_ONLY games, only show to users in RSVP list or host
      if (game.visibility === 'FRIENDS_ONLY' || game.visibility === 'INVITE_ONLY') {
        if (!user) return false; // Not visible if user is not logged in
        
        const isHost = game.hostId === user.id;
        const hasRSVP = userRSVPs.has(game.id);
        
        return isHost || hasRSVP;
      }
      
      return true;
    });
    
    // Filter out user's games if hideMyGames is true
    if (hideMyGames && user) {
      filtered = filtered.filter(game => {
        const isHost = userHostedGames.has(game.id);
        const hasRSVP = userRSVPs.has(game.id);
        return !isHost && !hasRSVP;
      });
    }
    
    // Filter by saved games preference
    if (savedGamesFilter === 'only-saved' && user) {
      filtered = filtered.filter(game => savedGameIds.has(game.id));
    } else if (savedGamesFilter === 'hide-saved' && user) {
      filtered = filtered.filter(game => !savedGameIds.has(game.id));
    }
    
    return filtered;
  }, [games, selectedSports, hideMyGames, user, userRSVPs, userHostedGames, savedGamesFilter, savedGameIds]);

  // Apply sport filter from URL on mount
  useEffect(() => {
    const sportParam = searchParams.get('sport');
    if (sportParam && availableSports.length > 0 && availableSports.includes(sportParam) && selectedSports.length === 0) {
      setSelectedSports([sportParam]);
      // Clear the URL parameter after applying
      setSearchParams({});
    }
  }, [searchParams, availableSports, selectedSports.length, setSearchParams]);

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.log("Location access denied or unavailable");
        }
      );
    }
  }, []);

  // Initialize map once when component mounts
  useEffect(() => {
    // Don't initialize map until games are loaded
    if (loading) return;
    
    if (typeof window !== "undefined" && !map) {
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

        console.log('🗺️ [Discover] Map initialized');
        setMap(mapInstance);

        // Cleanup
        return () => {
          mapInstance.remove();
        };
      });
    }
  }, [loading]);

  // Update markers when games change
  useEffect(() => {
    if (!map || loading) return;

    console.log(`🔄 [Discover] Updating markers for ${games.length} games`);

    // Remove all existing markers
    markerMap.forEach((marker) => marker.remove());

    // Create new markers
    import("leaflet").then((L) => {
      const newMarkerMap = new Map();
      
      games.forEach((game) => {
        console.log(`📍 [Discover] Adding marker for ${game.sport} at ${game.location} (${game.lat}, ${game.lng})`);
        
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

        const marker = L.marker([game.lat, game.lng], { icon }).addTo(map);

        marker.on("click", () => {
          setSelectedGame(game);
          const params = new URLSearchParams(searchParams);
          params.set('gameId', game.id);
          setSearchParams(params);
          map.setView([game.lat, game.lng], 14);
        });

        newMarkerMap.set(game.id, marker);
      });

      console.log(`✅ [Discover] Updated ${newMarkerMap.size} markers`);
      setMarkerMap(newMarkerMap);
    });
  }, [map, games, loading]);

  // Show/hide markers based on filter
  useEffect(() => {
    if (markerMap.size === 0) return;

    const filteredIds = new Set(filteredGames.map(g => g.id));
    
    games.forEach((game) => {
      const marker = markerMap.get(game.id);
      if (marker) {
        if (filteredIds.has(game.id)) {
          marker.setOpacity(1);
        } else {
          marker.setOpacity(0);
        }
      }
    });
  }, [filteredGames, markerMap, games]);

  const toggleSportFilter = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const openInAppleMaps = (game: Game) => {
    const url = `https://maps.apple.com/?q=${encodeURIComponent(game.location)}&ll=${game.lat},${game.lng}`;
    window.open(url, '_blank');
  };

  const openInGoogleMaps = (game: Game) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${game.lat},${game.lng}`;
    window.open(url, '_blank');
  };

  const handleJoinGame = async (gameId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join a game.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Check if user is the host of this game
    const game = games.find(g => g.id === gameId);
    if (game && game.hostId === user.id) {
      toast({
        title: "Cannot join",
        description: "You cannot join a game you are hosting.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has already joined this game
    if (userRSVPs.has(gameId)) {
      toast({
        title: "Already joined",
        description: "You've already joined this game.",
        variant: "destructive",
      });
      return;
    }

    // Check if game has already passed
    if (game) {
      const gameDateTime = new Date(`${game.rawGameDate}T${game.rawStartTime}`);
      const now = new Date();
      
      if (gameDateTime < now) {
        toast({
          title: "Game has passed",
          description: "You cannot join a game that has already started or ended.",
          variant: "destructive",
        });
        return;
      }
    }

    setJoiningGameId(gameId);

    try {
      const { error } = await supabase.from("rsvps").insert({
        game_id: gameId,
        user_id: user.id,
        status: "CONFIRMED",
      });

      if (error) {
        // Handle duplicate RSVP error
        if (error.code === "23505") {
          toast({
            title: "Already joined",
            description: "You've already joined this game.",
            variant: "destructive",
          });
          // Update local state
          setUserRSVPs(prev => new Set([...prev, gameId]));
          return;
        }
        // Handle specific error for host trying to join own game
        if (error.message?.includes("policy")) {
          toast({
            title: "Cannot join",
            description: "You cannot join a game you are hosting.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      } else {
        // Auto-join the game's community
        const { data: communityData } = await supabase
          .from("communities")
          .select("id")
          .eq("game_id", gameId)
          .eq("type", "game")
          .single();

        if (communityData) {
          // Add user to community as member (ignore if already a member)
          await supabase
            .from("community_members")
            .insert({
              community_id: communityData.id,
              user_id: user.id,
              role: 'member'
            })
            .select();
        }

        toast({
          title: "Successfully joined!",
          description: "You're confirmed for this game and added to its community.",
        });
        
        // Update local state to reflect the join
        setUserRSVPs(prev => new Set([...prev, gameId]));
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <SEO
        title="Discover Pickup Games Near You"
        description="Browse and join pickup games in your area. Find basketball, soccer, volleyball, tennis, cricket and more sports games nearby. Filter by sport, skill level, and location to find the perfect game for you."
        keywords="discover games, find sports near me, local pickup games, basketball near me, soccer games, volleyball games, tennis matches, sports map, game finder, join sports games"
        canonicalUrl="https://squadup.app/discover"
      />
      <Navbar />
      
      {/* Game Reminder Banner */}
      {user && (
        <div className="pt-20 pb-2 px-4">
          <div className="w-full max-w-7xl mx-auto">
            <GameReminderBanner />
          </div>
        </div>
      )}
      
      <div className={`${user ? 'pt-2' : 'pt-20'} px-2 sm:px-4 pb-4 flex justify-center`}>
        <div className="w-full max-w-7xl">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Find Your Game</h1>
            <p className="text-sm sm:text-base text-gray-600">Discover pickup games near you</p>
          
          {/* Sports Filter - Responsive padding */}
          <div className="mt-4 sm:mt-6 bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Filter by Sport:</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {availableSports.map((sport) => {
                  const isSelected = selectedSports.includes(sport);
                  const emoji = getSportEmoji(sport);
                  const displayName = toDisplaySportName(sport);
                  
                  return (
                    <button
                      key={sport}
                      onClick={() => toggleSportFilter(sport)}
                    className={`
                      inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium
                      transition-all duration-200
                      ${isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <span className="text-sm sm:text-base">{emoji}</span>
                    <span>{displayName}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hideMyGames"
                  checked={hideMyGames}
                  onChange={(e) => setHideMyGames(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="hideMyGames" className="text-sm text-gray-600 cursor-pointer">
                  Hide My Games (hosting or RSVPed)
                </label>
              </div>

              {/* Saved Games Filter */}
              {user && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-700">Saved Games:</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSavedGamesFilter('all')}
                      className={`px-3 py-1 text-xs rounded-full transition-all ${
                        savedGamesFilter === 'all'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Show All
                    </button>
                    <button
                      onClick={() => setSavedGamesFilter('only-saved')}
                      className={`px-3 py-1 text-xs rounded-full transition-all flex items-center gap-1 ${
                        savedGamesFilter === 'only-saved'
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Bookmark className="w-3 h-3" />
                      Only Saved
                    </button>
                    <button
                      onClick={() => setSavedGamesFilter('hide-saved')}
                      className={`px-3 py-1 text-xs rounded-full transition-all ${
                        savedGamesFilter === 'hide-saved'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Hide Saved
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Showing {filteredGames.length} of {games.length} games
              {user && savedGamesFilter === 'only-saved' && savedGameIds.size > 0 && (
                <span className="ml-1 text-amber-600">
                  • {savedGameIds.size} saved
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[calc(100vh-200px)]">
          {/* Map Section - Full height on desktop, fixed height on mobile */}
          <div className="lg:col-span-2 relative h-[400px] lg:h-[calc(100vh-200px)]">
            <div id="map" className="w-full h-full rounded-xl shadow-lg border-2 border-gray-200"></div>
            
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-white/90 rounded-xl flex items-center justify-center z-[2000]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading games...</p>
                </div>
              </div>
            )}
            
            {/* No Games Message */}
            {!loading && games.length === 0 && (
              <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center z-[2000]">
                <div className="text-center p-6">
                  <p className="text-xl font-semibold text-gray-900 mb-2">No games found</p>
                  <p className="text-gray-600 mb-4">Be the first to host a game in your area!</p>
                  <Button onClick={() => navigate('/host-game')} className="bg-blue-600 hover:bg-blue-700">
                    Host a Game
                  </Button>
                </div>
              </div>
            )}

            {/* Locate Me Button - Responsive size */}
            <button
              onClick={handleLocateMe}
              className="absolute bottom-4 right-4 z-[1000] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border-2 border-blue-500 flex items-center justify-center hover:bg-blue-50 transition-all hover:scale-110"
              title="Locate Me"
            >
              <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </button>

            {/* Map Legend - Responsive positioning */}
            {!loading && games.length > 0 && (
              <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-2 sm:p-3 border border-gray-200 max-h-[200px] sm:max-h-[300px] overflow-y-auto max-w-[150px] sm:max-w-none">
                <div className="text-xs font-semibold text-gray-700 mb-2">Sports on Map</div>
                {Array.from(new Set(filteredGames.map(g => g.sport)))
                  .map((sport) => {
                    const game = filteredGames.find(g => g.sport === sport);
                    return (
                      <div key={sport} className="flex items-center gap-1 sm:gap-2 text-xs text-gray-600 mt-1">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs sm:text-base">{game?.emoji}</span>
                        <span className="hidden sm:inline">{sport}</span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Game Details Panel - Scrollable on mobile and desktop */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4 sm:p-6 overflow-y-auto max-h-[600px] lg:max-h-[calc(100vh-200px)]">
            {selectedGame ? (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-4xl mb-2">{selectedGame.emoji}</div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedGame.sport}</h2>
                      {isSaved(selectedGame.id) && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-300">
                          <Bookmark className="w-3 h-3 mr-1" />
                          Saved
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedGame.location}
                    </div>
                  </div>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                          {userLocation 
                            ? calculateDistance(userLocation[0], userLocation[1], selectedGame.lat, selectedGame.lng)
                            : selectedGame.distance
                          }
                        </Badge>
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

                {/* Share Location Buttons */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    <span className="font-semibold">Open location in:</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openInAppleMaps(selectedGame)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Apple Maps
                    </Button>
                    <Button
                      onClick={() => openInGoogleMaps(selectedGame)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Google Maps
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {selectedGame && user && selectedGame.hostId === user.id ? (
                    <div className="flex-1">
                      <Badge variant="secondary" className="w-full justify-center py-3 mb-2">
                        You're hosting this game
                      </Badge>
                      <p className="text-sm text-center text-muted-foreground">
                        Hosts cannot join their own games
                      </p>
                    </div>
                  ) : selectedGame && userRSVPs.has(selectedGame.id) ? (
                    <div className="flex-1">
                      <Badge variant="secondary" className="w-full justify-center py-3 mb-2">
                        ✓ You're in!
                      </Badge>
                      <p className="text-sm text-center text-muted-foreground">
                        You've already joined this game
                      </p>
                    </div>
                  ) : selectedGame && selectedGame.rawGameDate && selectedGame.rawStartTime ? (
                    (() => {
                      const gameDateTime = new Date(`${selectedGame.rawGameDate}T${selectedGame.rawStartTime}`);
                      const now = new Date();
                      const isPastGame = gameDateTime < now;
                      
                      return isPastGame ? (
                        <div className="flex-1">
                          <Badge variant="outline" className="w-full justify-center py-3 mb-2">
                            Game has ended
                          </Badge>
                          <p className="text-sm text-center text-muted-foreground">
                            This game has already started or ended
                          </p>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => selectedGame && handleJoinGame(selectedGame.id)}
                          disabled={joiningGameId === selectedGame?.id}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                          {joiningGameId === selectedGame?.id ? "Joining..." : "Join Game"}
                        </Button>
                      );
                    })()
                  ) : (
                    <Button 
                      onClick={() => selectedGame && handleJoinGame(selectedGame.id)}
                      disabled={joiningGameId === selectedGame?.id}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      {joiningGameId === selectedGame?.id ? "Joining..." : "Join Game"}
                    </Button>
                  )}
                  
                  {/* Save/Bookmark Button */}
                  <Button
                    onClick={() => selectedGame && toggleSaveGame(selectedGame.id)}
                    variant="outline"
                    size="lg"
                    className="px-3"
                    title={isSaved(selectedGame?.id || '') ? "Remove from saved" : "Save for later"}
                  >
                    {isSaved(selectedGame?.id || '') ? (
                      <BookmarkCheck className="w-5 h-5 text-primary" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </Button>
                  
                  <ShareGameButton 
                    gameId={selectedGame.id.toString()}
                    gameName={`${selectedGame.sport} Game`}
                    size="lg"
                  />
                </div>

                <button
                  onClick={() => {
                    setSelectedGame(null);
                    const params = new URLSearchParams(searchParams);
                    params.delete('gameId');
                    setSearchParams(params);
                  }}
                  className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Back to all games
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nearby Games</h3>
                <div className="space-y-3">
                  {filteredGames.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => {
                        setSelectedGame(game);
                        const params = new URLSearchParams(searchParams);
                        params.set('gameId', game.id);
                        setSearchParams(params);
                        if (map) {
                          map.setView([game.lat, game.lng], 14);
                        }
                      }}
                      className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{game.emoji}</span>
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              {game.sport}
                              {isSaved(game.id) && (
                                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-300">
                                  <Bookmark className="w-3 h-3 mr-1" />
                                  Saved
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-600">{game.location}</div>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          {userLocation 
                            ? calculateDistance(userLocation[0], userLocation[1], game.lat, game.lng)
                            : game.distance
                          }
                        </Badge>
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
