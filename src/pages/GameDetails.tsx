import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShareGameButton } from "@/components/ShareGameButton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  ExternalLink,
  ArrowLeft,
  UserPlus,
} from "lucide-react";
import { format } from "date-fns";

interface GameDetails {
  id: string;
  sport: string;
  skill_level: string;
  location_name: string;
  address: string;
  city: string;
  state: string | null;
  zip_code: string | null;
  latitude: number;
  longitude: number;
  game_date: string;
  start_time: string;
  duration_minutes: number;
  max_players: number;
  current_players: number;
  cost_per_person: number;
  description: string | null;
  equipment_requirements: string | null;
  game_rules: string | null;
  visibility: string;
  host_id: string;
  host?: {
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    profile_photo: string | null;
    overall_rating: number;
  };
}

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasRSVP, setHasRSVP] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchGameDetails();
  }, [id, user]);

  const fetchGameDetails = async () => {
    try {
      setLoading(true);

      // Fetch game details
      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select(`
          *,
          host:profiles!games_host_id_fkey(username, first_name, last_name, profile_photo, overall_rating)
        `)
        .eq("id", id!)
        .single();

      if (gameError) throw gameError;

      setGame(gameData);

      // Check if user has RSVP'd
      if (user) {
        const { data: rsvpData } = await supabase
          .from("rsvps")
          .select("id")
          .eq("game_id", id!)
          .eq("user_id", user.id)
          .maybeSingle();

        setHasRSVP(!!rsvpData);
      }
    } catch (error: any) {
      console.error("Error fetching game:", error);
      toast({
        title: "Error loading game",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase.from("rsvps").insert({
        game_id: game!.id,
        user_id: user.id,
        status: "CONFIRMED",
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've joined the game!",
      });

      setHasRSVP(true);
      fetchGameDetails();
    } catch (error: any) {
      toast({
        title: "Error joining game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openInMaps = () => {
    if (!game) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${game.latitude},${game.longitude}`;
    window.open(mapsUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <p className="text-center text-muted-foreground">Loading game details...</p>
        </main>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This game doesn't exist or is not available.
            </p>
            <Button asChild>
              <Link to="/discover">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Discover
              </Link>
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const hostName = game.host?.username || 
    `${game.host?.first_name || ""} ${game.host?.last_name || ""}`.trim() || 
    "Anonymous Host";

  const spotsLeft = game.max_players - game.current_players;
  const isFull = spotsLeft <= 0;
  const isHost = user?.id === game.host_id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{game.sport}</h1>
                  <Badge variant="secondary">{game.skill_level}</Badge>
                  {game.visibility !== "PUBLIC" && (
                    <Badge variant="outline">{game.visibility}</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">Hosted by {hostName}</p>
              </div>
              <ShareGameButton gameId={game.id} gameName={`${game.sport} Game`} />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold">{game.location_name}</p>
                    <p className="text-sm text-muted-foreground">{game.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {game.city}, {game.state} {game.zip_code}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={openInMaps}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open in Maps
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
                  <p>{format(new Date(game.game_date), "EEEE, MMMM d, yyyy")}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                  <p>
                    {game.start_time} ({game.duration_minutes} minutes)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-semibold">
                      {game.current_players} / {game.max_players} players
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isFull ? "Game is full" : `${spotsLeft} spots available`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground shrink-0" />
                  <p>
                    {game.cost_per_person === 0
                      ? "Free"
                      : `$${game.cost_per_person} per person`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-muted-foreground shrink-0" />
                  <p>Skill Level: {game.skill_level}</p>
                </div>
              </div>
            </div>

            {game.description && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{game.description}</p>
                </div>
              </>
            )}

            {game.equipment_requirements && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="font-semibold mb-2">Equipment Requirements</h3>
                  <p className="text-muted-foreground">{game.equipment_requirements}</p>
                </div>
              </>
            )}

            {game.game_rules && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="font-semibold mb-2">Game Rules</h3>
                  <p className="text-muted-foreground">{game.game_rules}</p>
                </div>
              </>
            )}

            <Separator className="my-6" />

            <div className="flex gap-3">
              {!user && (
                <Button
                  className="gradient-primary text-white flex-1"
                  onClick={() => navigate("/auth")}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign In to Join
                </Button>
              )}

              {user && !isHost && !hasRSVP && !isFull && (
                <Button
                  className="gradient-primary text-white flex-1"
                  onClick={handleJoinGame}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Game
                </Button>
              )}

              {hasRSVP && !isHost && (
                <Badge variant="secondary" className="flex-1 justify-center py-3">
                  You're in!
                </Badge>
              )}

              {isHost && (
                <Badge variant="secondary" className="flex-1 justify-center py-3">
                  You're hosting this game
                </Badge>
              )}

              {isFull && !hasRSVP && !isHost && (
                <Badge variant="outline" className="flex-1 justify-center py-3">
                  Game is full
                </Badge>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GameDetails;
