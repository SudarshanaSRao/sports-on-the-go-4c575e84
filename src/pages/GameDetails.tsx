import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShareGameButton } from "@/components/ShareGameButton";
import { PlayerLiabilityWaiver } from "@/components/PlayerLiabilityWaiver";
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
import { formatSportDisplay, getSportEmoji } from "@/utils/sportsUtils";

interface GameDetails {
  id: string;
  sport: string;
  custom_sport_name?: string | null;
  custom_emoji?: string | null;
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
  const [showWaiver, setShowWaiver] = useState(false);
  const [isSubmittingWaiver, setIsSubmittingWaiver] = useState(false);
  const [hasAcceptedWaiver, setHasAcceptedWaiver] = useState(false);

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

      // Check if user has RSVP'd and waiver acceptance
      if (user) {
        const { data: rsvpData } = await supabase
          .from("rsvps")
          .select("id")
          .eq("game_id", id!)
          .eq("user_id", user.id)
          .maybeSingle();

        setHasRSVP(!!rsvpData);

        // Check if user has accepted the player waiver
        const { data: profileData } = await supabase
          .from("profiles")
          .select("player_waiver_accepted")
          .eq("id", user.id)
          .single();

        setHasAcceptedWaiver(profileData?.player_waiver_accepted || false);
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
      // Store current game URL before redirecting to auth
      sessionStorage.setItem('authReturnUrl', window.location.pathname);
      navigate("/auth");
      return;
    }

    // Check if user has accepted the player waiver
    if (!hasAcceptedWaiver) {
      setShowWaiver(true);
      return;
    }

    // Check if game has already passed
    if (game) {
      const gameDateTime = new Date(`${game.game_date}T${game.start_time}`);
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

    // Defensive check: Prevent hosts from joining their own games
    if (game && user.id === game.host_id) {
      toast({
        title: "Cannot join",
        description: "You cannot join a game you are hosting.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has already joined
    if (hasRSVP) {
      toast({
        title: "Already joined",
        description: "You've already joined this game.",
        variant: "destructive",
      });
      return;
    }

    // Check if game is full
    if (game && game.current_players >= game.max_players) {
      toast({
        title: "Game is full",
        description: "This game has reached maximum capacity.",
        variant: "destructive",
      });
      return;
    }

    await joinGameAfterWaiver();
  };

  const joinGameAfterWaiver = async () => {
    try {
      const { error } = await supabase.from("rsvps").insert({
        game_id: game!.id,
        user_id: user!.id,
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
          setHasRSVP(true);
          return;
        }
        // Handle specific error for host trying to join own game
        if (error.message.includes("policy")) {
          toast({
            title: "Cannot join",
            description: "You cannot join a game you are hosting.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Success!",
        description: "You've joined the game!",
      });

      setHasRSVP(true);
      fetchGameDetails();
    } catch (error: any) {
      console.error("Error joining game:", error);
      toast({
        title: "Error joining game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleWaiverAccept = async () => {
    if (!user) return;

    setIsSubmittingWaiver(true);
    try {
      // Update user's profile to mark waiver as accepted
      const { error } = await supabase
        .from("profiles")
        .update({
          player_waiver_accepted: true,
          player_waiver_accepted_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setHasAcceptedWaiver(true);
      setShowWaiver(false);
      
      toast({
        title: "Waiver accepted",
        description: "You can now join games. Proceeding to join this game...",
      });

      // Automatically join the game after accepting waiver
      await joinGameAfterWaiver();
    } catch (error: any) {
      console.error("Error accepting waiver:", error);
      toast({
        title: "Error",
        description: "Failed to save waiver acceptance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingWaiver(false);
    }
  };

  const handleWaiverDecline = () => {
    setShowWaiver(false);
    toast({
      title: "Waiver declined",
      description: "You must accept the waiver to join games on SquadUp.",
      variant: "destructive",
    });
  };

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // No history, go to discover page
      navigate('/discover');
    }
  };

  const openInMaps = () => {
    if (!game) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${game.latitude},${game.longitude}`;
    window.open(mapsUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen min-h-screen-mobile bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12 safe-bottom">
          <p className="text-center text-muted-foreground">Loading game details...</p>
        </main>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen min-h-screen-mobile bg-gradient-to-b from-background to-muted/20">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12 safe-bottom">
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
  
  // Check if game has already passed
  const gameDateTime = new Date(`${game.game_date}T${game.start_time}`);
  const now = new Date();
  const isPastGame = gameDateTime < now;
  
  // Strict check to ensure host cannot join their own game
  const isHost = Boolean(user && game && user.id === game.host_id);
  // Additional safety: Check if user already has RSVP or is the host or game has passed
  const canJoin = Boolean(user && !isHost && !hasRSVP && !isFull && !isPastGame);

  return (
    <div className="min-h-screen min-h-screen-mobile bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 safe-bottom">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold truncate">{formatSportDisplay(game.sport, game.custom_sport_name)}</h1>
                  <Badge variant="secondary" className="text-xs sm:text-sm whitespace-nowrap">{game.skill_level}</Badge>
                  {game.visibility !== "PUBLIC" && (
                    <Badge variant="outline" className="text-xs sm:text-sm whitespace-nowrap">{game.visibility}</Badge>
                  )}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">Hosted by {hostName}</p>
              </div>
              <ShareGameButton gameId={game.id} gameName={`${formatSportDisplay(game.sport, game.custom_sport_name)} Game`} />
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
                  onClick={() => {
                    sessionStorage.setItem('authReturnUrl', window.location.pathname);
                    navigate("/auth");
                  }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign In to Join
                </Button>
              )}

              {canJoin && (
                <Button
                  className="gradient-primary text-white flex-1"
                  onClick={handleJoinGame}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Game
                </Button>
              )}

              {hasRSVP && !isHost && (
                <div className="flex-1">
                  <Badge variant="secondary" className="w-full justify-center py-3 mb-2">
                    ✓ You're in!
                  </Badge>
                  <p className="text-sm text-center text-muted-foreground">
                    You've already joined this game
                  </p>
                </div>
              )}

              {isHost && (
                <div className="flex-1">
                  <Badge variant="secondary" className="w-full justify-center py-3 mb-2">
                    You're hosting this game
                  </Badge>
                  <p className="text-sm text-center text-muted-foreground">
                    Hosts cannot join their own games
                  </p>
                </div>
              )}

              {isFull && !hasRSVP && !isHost && !isPastGame && (
                <Badge variant="outline" className="flex-1 justify-center py-3">
                  Game is full
                </Badge>
              )}

              {isPastGame && !isHost && (
                <div className="flex-1">
                  <Badge variant="outline" className="w-full justify-center py-3 mb-2">
                    Game has ended
                  </Badge>
                  <p className="text-sm text-center text-muted-foreground">
                    This game has already started or ended
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      {/* Player Liability Waiver Dialog */}
      <PlayerLiabilityWaiver
        open={showWaiver}
        onAccept={handleWaiverAccept}
        onDecline={handleWaiverDecline}
        isSubmitting={isSubmittingWaiver}
      />
    </div>
  );
};

export default GameDetails;
