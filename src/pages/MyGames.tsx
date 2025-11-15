import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ShareGameButton } from "@/components/ShareGameButton";
import { GameReminderBanner } from "@/components/GameReminderBanner";
import { Calendar, Clock, MapPin, Users, Plus, Star, X, Pencil, MessageSquare, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getSportEmoji, toDisplaySportName, formatSportDisplay, getAllSportsDisplayNames, toDbSportValue } from "@/utils/sportsUtils";
import { ReviewPlayerDialog } from "@/components/ReviewPlayerDialog";
import { useSavedGames } from "@/hooks/useSavedGames";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Game {
  id: string;
  sport: string;
  skill_level: string;
  location_name: string;
  address: string;
  city: string;
  state?: string;
  zip_code?: string;
  game_date: string;
  start_time: string;
  duration_minutes: number;
  current_players: number;
  max_players: number;
  visibility: string;
  host_id: string;
  latitude: number;
  longitude: number;
  description?: string;
  equipment_requirements?: string;
  game_rules?: string;
  custom_sport_name?: string;
  profiles?: {
    id?: string;
    first_name: string;
    last_name: string;
    username?: string;
    overall_rating: number;
  };
}

// Past Game Card Component
const PastGameCard = ({ game, userId, onReviewSubmitted }: { game: Game; userId: string; onReviewSubmitted: () => void }) => {
  const [attendees, setAttendees] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<Set<string>>(new Set());
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReviewee, setSelectedReviewee] = useState<{ id: string; name: string } | null>(null);

  const fetchAttendees = async () => {
    if (loadingAttendees || attendees.length > 0) return;
    
    setLoadingAttendees(true);
    try {
      // Fetch all RSVPs for this game
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvps')
        .select(`
          user_id,
          attended,
          profiles:user_id (
            id,
            first_name,
            last_name,
            username,
            overall_rating
          )
        `)
        .eq('game_id', game.id)
        .eq('status', 'CONFIRMED');

      if (rsvpError) throw rsvpError;

      // Fetch my reviews for this game
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('reviewee_id')
        .eq('game_id', game.id)
        .eq('reviewer_id', userId);

      const reviewedIds = new Set(reviewData?.map(r => r.reviewee_id) || []);
      setMyReviews(reviewedIds);

      // Filter out current user and add host if they're not already in list
      const filteredAttendees = rsvpData?.filter(r => r.user_id !== userId) || [];
      
      // Add host if not already in attendees
      if (game.host_id !== userId) {
        const isHostInList = filteredAttendees.some(a => a.user_id === game.host_id);
        if (!isHostInList && game.profiles) {
          filteredAttendees.push({
            user_id: game.host_id,
            attended: true,
            profiles: {
              id: game.host_id,
              first_name: game.profiles.first_name || '',
              last_name: game.profiles.last_name || '',
              username: game.profiles.username || '',
              overall_rating: game.profiles.overall_rating || 0
            }
          });
        }
      }

      setAttendees(filteredAttendees);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const handleReviewClick = (attendeeId: string, attendeeName: string) => {
    setSelectedReviewee({ id: attendeeId, name: attendeeName });
    setReviewDialogOpen(true);
  };

  const handleShowAttendees = () => {
    if (!showAttendees) {
      fetchAttendees();
    }
    setShowAttendees(!showAttendees);
  };

  return (
    <>
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-2xl shadow-primary flex-shrink-0">
                {getSportEmoji(game.sport)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold mb-1">{formatSportDisplay(game.sport, game.custom_sport_name)}</h3>
                <div className="flex items-center text-muted-foreground text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="truncate">{game.location_name}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">
                      {format(new Date(game.game_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{game.start_time}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 md:min-w-[160px]">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleShowAttendees}
              >
                <Users className="w-4 h-4 mr-2" />
                {showAttendees ? 'Hide' : 'Review'} Players
              </Button>
            </div>
          </div>

          {/* Attendees List */}
          {showAttendees && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Players ({attendees.length})
              </h4>
              
              {loadingAttendees ? (
                <p className="text-sm text-muted-foreground">Loading players...</p>
              ) : attendees.length === 0 ? (
                <p className="text-sm text-muted-foreground">No other players attended this game.</p>
              ) : (
                <div className="space-y-2">
                  {attendees.map((attendee) => {
                    const profile = attendee.profiles;
                    if (!profile) return null;

                    const name = profile.username || `${profile.first_name} ${profile.last_name}`;
                    const hasReviewed = myReviews.has(attendee.user_id);

                    return (
                      <div key={attendee.user_id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                            {name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{name}</p>
                            {profile.overall_rating > 0 && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{profile.overall_rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {hasReviewed ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Reviewed
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleReviewClick(attendee.user_id, name)}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedReviewee && (
        <ReviewPlayerDialog
          isOpen={reviewDialogOpen}
          onClose={() => {
            setReviewDialogOpen(false);
            setSelectedReviewee(null);
          }}
          gameId={game.id}
          revieweeId={selectedReviewee.id}
          revieweeName={selectedReviewee.name}
          reviewerId={userId}
          onReviewSubmitted={() => {
            fetchAttendees();
            onReviewSubmitted();
          }}
        />
      )}
    </>
  );
};

const MyGames = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [hostedGames, setHostedGames] = useState<Game[]>([]);
  const [pastGames, setPastGames] = useState<Game[]>([]);
  const [savedGames, setSavedGames] = useState<Game[]>([]);
  const [joiningGameId, setJoiningGameId] = useState<string | null>(null);
  const [userRSVPs, setUserRSVPs] = useState<Set<string>>(new Set());
  const { unsaveGame } = useSavedGames(user?.id);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReviewee, setSelectedReviewee] = useState<{ id: string; name: string } | null>(null);
  const [editForm, setEditForm] = useState({
    sport: '',
    skill_level: '',
    location_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    game_date: '',
    start_time: '',
    duration_minutes: 0,
    max_players: 0,
    visibility: '',
    description: '',
    equipment_requirements: '',
    game_rules: '',
  });

  useEffect(() => {
    if (user) {
      fetchGames();
      fetchUserRSVPs();
    }
  }, [user]);

  const fetchUserRSVPs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('game_id')
        .eq('user_id', user.id)
        .eq('status', 'CONFIRMED');

      if (error) throw error;

      setUserRSVPs(new Set(data?.map(r => r.game_id) || []));
    } catch (error) {
      console.error('Error fetching user RSVPs:', error);
    }
  };

  // Auto-refresh games at midnight to move them from upcoming to past
  useEffect(() => {
    if (!user) return;

    let lastCheckDate = new Date().toDateString();

    // Check every minute if the date has changed
    const interval = setInterval(() => {
      const currentDate = new Date().toDateString();
      
      if (currentDate !== lastCheckDate) {
        // Date has changed (midnight passed), refetch games
        console.log('Date changed, refreshing games categorization...');
        fetchGames();
        lastCheckDate = currentDate;
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user]);

  const fetchGames = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Use local timezone for date comparison
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      // Fetch upcoming games user has RSVP'd to
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvps')
        .select(`
          game_id,
          games (
            *,
            profiles:host_id (
              username,
              first_name,
              last_name,
              overall_rating
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'CONFIRMED');

      if (rsvpError) throw rsvpError;

      // Fetch past games user attended
      const { data: pastRsvpData, error: pastRsvpError } = await supabase
        .from('rsvps')
        .select(`
          game_id,
          games (
            *,
            profiles:host_id (
              username,
              first_name,
              last_name,
              overall_rating
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'CONFIRMED');

      if (pastRsvpError) throw pastRsvpError;

      // Fetch games user is hosting
      const { data: hostData, error: hostError } = await supabase
        .from('games')
        .select(`
          *,
          profiles:host_id (
            username,
            first_name,
            last_name,
            overall_rating
          )
        `)
        .eq('host_id', user.id);

      if (hostError) throw hostError;

      const allAttendedGames = rsvpData?.map(r => r.games).filter(Boolean) as Game[] || [];
      const allHostedGames = hostData || [];
      
      // Split into upcoming and past
      const upcoming = allAttendedGames.filter(g => g.game_date >= today);
      const past = [...allAttendedGames, ...allHostedGames].filter(g => g.game_date < today);
      const hosted = allHostedGames.filter(g => g.game_date >= today);

      // Fetch saved games
      const { data: savedGameIds, error: savedError } = await supabase
        .from('saved_games')
        .select('game_id')
        .eq('user_id', user.id);

      if (savedError) throw savedError;

      // Fetch game details for saved games
      const savedGameIdsList = savedGameIds?.map(s => s.game_id) || [];
      let allSavedGames: Game[] = [];
      
      if (savedGameIdsList.length > 0) {
        const { data: savedGamesData, error: savedGamesError } = await supabase
          .from('games')
          .select(`
            *,
            profiles:host_id (
              username,
              first_name,
              last_name,
              overall_rating
            )
          `)
          .in('id', savedGameIdsList);

        if (savedGamesError) throw savedGamesError;
        allSavedGames = savedGamesData || [];
      }

      const upcomingSaved = allSavedGames.filter(g => g.game_date >= today);

      setUpcomingGames(upcoming);
      setPastGames(past);
      setHostedGames(hosted);
      setSavedGames(upcomingSaved);
    } catch (error: any) {
      console.error('Error fetching games:', error);
      toast.error('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (gameId: string) => {
    const game = [...upcomingGames, ...hostedGames].find(g => g.id === gameId);
    if (game) {
      setSelectedGame(game);
      setIsDetailsOpen(true);
    }
  };

  const handleManageGame = async (gameId: string) => {
    const game = hostedGames.find(g => g.id === gameId);
    if (game) {
      setSelectedGame(game);
      setEditForm({
        sport: formatSportDisplay(game.sport, game.custom_sport_name),
        skill_level: game.skill_level,
        location_name: game.location_name,
        address: game.address,
        city: game.city,
        state: game.state || '',
        zip_code: game.zip_code || '',
        game_date: game.game_date,
        start_time: game.start_time,
        duration_minutes: game.duration_minutes,
        max_players: game.max_players,
        visibility: game.visibility,
        description: game.description || '',
        equipment_requirements: game.equipment_requirements || '',
        game_rules: game.game_rules || '',
      });
      setIsEditMode(false);
      // Fetch participants
      try {
        const { data, error } = await supabase
          .from('rsvps')
          .select(`
            *,
            profiles:user_id (
              first_name,
              last_name,
              username,
              overall_rating
            )
          `)
          .eq('game_id', gameId)
          .eq('status', 'CONFIRMED');
        
        if (error) throw error;
        setParticipants(data || []);
        setIsManageOpen(true);
      } catch (error) {
        console.error('Error fetching participants:', error);
        toast.error('Failed to load participants');
      }
    }
  };

  const handleSaveGameDetails = async () => {
    if (!selectedGame) return;

    // Validate max_players is not less than current_players
    if (editForm.max_players < selectedGame.current_players) {
      toast.error(`Max players cannot be less than current players (${selectedGame.current_players})`);
      return;
    }

    try {
      // Detect what changed
      const changes: string[] = [];
      if (toDbSportValue(editForm.sport) !== selectedGame.sport) {
        changes.push(`Sport changed to ${editForm.sport}`);
      }
      if (editForm.skill_level !== selectedGame.skill_level) {
        changes.push(`Skill level changed to ${editForm.skill_level.replace('_', ' ')}`);
      }
      if (editForm.location_name !== selectedGame.location_name) {
        changes.push(`Location changed to ${editForm.location_name}`);
      }
      if (editForm.address !== selectedGame.address) {
        changes.push(`Address changed to ${editForm.address}`);
      }
      if (editForm.city !== selectedGame.city) {
        changes.push(`City changed to ${editForm.city}`);
      }
      if (editForm.game_date !== selectedGame.game_date) {
        changes.push(`Date changed to ${format(new Date(editForm.game_date), 'EEEE, MMM dd, yyyy')}`);
      }
      if (editForm.start_time !== selectedGame.start_time) {
        changes.push(`Time changed to ${editForm.start_time}`);
      }
      if (editForm.duration_minutes !== selectedGame.duration_minutes) {
        changes.push(`Duration changed to ${editForm.duration_minutes} minutes`);
      }
      if (editForm.max_players !== selectedGame.max_players) {
        changes.push(`Max players changed to ${editForm.max_players}`);
      }

      const { error } = await supabase
        .from('games')
        .update({
          sport: toDbSportValue(editForm.sport) as any,
          skill_level: editForm.skill_level as any,
          location_name: editForm.location_name,
          address: editForm.address,
          city: editForm.city,
          state: editForm.state,
          zip_code: editForm.zip_code,
          game_date: editForm.game_date,
          start_time: editForm.start_time,
          duration_minutes: editForm.duration_minutes,
          max_players: editForm.max_players,
          visibility: editForm.visibility as any,
          description: editForm.description,
          equipment_requirements: editForm.equipment_requirements,
          game_rules: editForm.game_rules,
        })
        .eq('id', selectedGame.id)
        .eq('host_id', user?.id);

      if (error) throw error;

      // Post announcement to community if there were changes
      if (changes.length > 0) {
        try {
          // Find the community associated with this game
          const { data: communityData } = await supabase
            .from('communities')
            .select('id')
            .eq('game_id', selectedGame.id)
            .eq('type', 'game')
            .single();

          if (communityData) {
            // Create announcement post
            const announcementContent = `🔔 **Game Update Alert**\n\nThe host has updated the game details:\n\n${changes.map(change => `• ${change}`).join('\n')}\n\nPlease review the updated information!`;
            
            await supabase
              .from('posts')
              .insert({
                title: 'Game Details Updated',
                content: announcementContent,
                community_id: communityData.id,
                user_id: user?.id,
                sport: toDbSportValue(editForm.sport),
              });

            console.log('Community announcement posted');
          }
        } catch (announcementError) {
          console.error('Error posting community announcement:', announcementError);
          // Don't fail the whole update if announcement fails
        }
      }

      // Update the selected game with new data
      const updatedGame = {
        ...selectedGame,
        ...editForm,
      };
      setSelectedGame(updatedGame);

      toast.success('Game details updated successfully');
      setIsEditMode(false);
      fetchGames();
    } catch (error: any) {
      console.error('Error updating game:', error);
      toast.error('Failed to update game details');
    }
  };

  const handleCancelGame = async (gameId: string, gameName: string) => {
    if (!confirm(`Are you sure you want to cancel the ${gameName} game? This will notify all participants and delete the game community.`)) {
      return;
    }

    try {
      // 1. Delete associated community if exists
      const { error: communityError } = await supabase
        .from('communities')
        .delete()
        .eq('game_id', gameId);

      if (communityError) {
        console.error('Error deleting community:', communityError);
      }

      // 2. Delete all RSVPs for this game
      const { error: rsvpError } = await supabase
        .from('rsvps')
        .delete()
        .eq('game_id', gameId);

      if (rsvpError) {
        console.error('Error deleting RSVPs:', rsvpError);
      }

      // 3. Delete the game itself
      const { error: gameError } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId)
        .eq('host_id', user?.id);

      if (gameError) throw gameError;

      toast.success("Game cancelled successfully");
      fetchGames(); // Refresh the list
    } catch (error: any) {
      console.error('Error cancelling game:', error);
      toast.error('Failed to cancel game');
    }
  };

  const handleMessageHost = async (gameId: string, hostName: string) => {
    if (!user) return;
    
    try {
      // Get the host's user ID from the game
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('host_id, profiles:host_id(username, first_name, last_name)')
        .eq('id', gameId)
        .single();

      if (gameError) throw gameError;

      const hostId = gameData.host_id;
      
      // Get or create a friendship/conversation
      const { data: friendshipData } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${hostId}),and(requester_id.eq.${hostId},addressee_id.eq.${user.id})`)
        .maybeSingle();

      // For now, show WhatsApp contact option since messaging isn't built yet
      const message = encodeURIComponent(`Hi ${hostName}! I'm interested in your game (ID: ${gameId.substring(0, 8)}). Can we discuss the details?`);
      
      // Create a dialog with options
      const shouldOpenWhatsApp = confirm(
        `Messaging feature is coming soon!\n\nWould you like to contact ${hostName} via WhatsApp for now?\n\nClick OK to open WhatsApp, or Cancel to go back.`
      );
      
      if (shouldOpenWhatsApp) {
        // Open WhatsApp
        window.open(`https://wa.me/?text=${message}`, '_blank');
      }
    } catch (error) {
      console.error('Error initiating message:', error);
      toast.error('Failed to start conversation');
    }
  };

  const handleLeaveGame = async (gameId: string, gameName: string) => {
    if (!confirm(`Are you sure you want to leave the ${gameName} game?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('game_id', gameId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success("You've left the game");
      fetchGames(); // Refresh the list
    } catch (error: any) {
      console.error('Error leaving game:', error);
      toast.error('Failed to leave game');
    }
  };

  const handleJoinSavedGame = async (game: Game) => {
    if (!user) {
      toast.error("Please log in to join a game.");
      navigate("/auth");
      return;
    }

    // Check if user is the host of this game
    if (game.host_id === user.id) {
      toast.error("You cannot join a game you are hosting.");
      return;
    }

    // Check if user has already joined this game
    if (userRSVPs.has(game.id)) {
      toast.error("You've already joined this game.");
      return;
    }

    // Check if game has already passed
    const gameDateTime = new Date(`${game.game_date}T${game.start_time}`);
    const now = new Date();
    
    if (gameDateTime < now) {
      toast.error("You cannot join a game that has already started or ended.");
      return;
    }

    // Check if game is full
    if (game.current_players >= game.max_players) {
      toast.error("This game is already full.");
      return;
    }

    setJoiningGameId(game.id);

    try {
      const { error } = await supabase.from("rsvps").insert({
        game_id: game.id,
        user_id: user.id,
        status: "CONFIRMED",
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("You've already joined this game.");
          setUserRSVPs(prev => new Set([...prev, game.id]));
          return;
        }
        if (error.message?.includes("policy")) {
          toast.error("You cannot join a game you are hosting.");
          return;
        }
        throw error;
      }

      // Auto-join the game's community
      const { data: communityData } = await supabase
        .from("communities")
        .select("id")
        .eq("game_id", game.id)
        .eq("type", "game")
        .single();

      if (communityData) {
        await supabase
          .from("community_members")
          .insert({
            community_id: communityData.id,
            user_id: user.id,
            role: 'member'
          })
          .select();
      }

      toast.success("Successfully joined! You're confirmed for this game.");
      
      // Update local state
      setUserRSVPs(prev => new Set([...prev, game.id]));
      
      // Remove from saved games and refresh
      setSavedGames(prev => prev.filter(g => g.id !== game.id));
      fetchGames();
      fetchUserRSVPs();
    } catch (error) {
      console.error("Error joining game:", error);
      toast.error("Failed to join game. Please try again.");
    } finally {
      setJoiningGameId(null);
    }
  };

  const allUpcomingGames = [...upcomingGames, ...hostedGames];

  const renderDetailsDialog = () => (
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <span className="text-3xl">{selectedGame && getSportEmoji(selectedGame.sport)}</span>
            {selectedGame && formatSportDisplay(selectedGame.sport, selectedGame.custom_sport_name)}
          </DialogTitle>
        </DialogHeader>
        {selectedGame && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">{selectedGame.location_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedGame.address}</p>
                  <p className="text-sm text-muted-foreground">{selectedGame.city}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{format(new Date(selectedGame.game_date), 'EEEE, MMM dd, yyyy')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-semibold">{selectedGame.start_time}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Players</p>
                  <p className="font-semibold">{selectedGame.current_players}/{selectedGame.max_players}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedGame.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedGame.description}</p>
              </div>
            )}

            {/* Host Info */}
            {selectedGame.profiles && (
              <div>
                <h3 className="font-semibold mb-2">Host</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {(selectedGame.profiles.username || selectedGame.profiles.first_name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">
                      {selectedGame.profiles.username || 
                        `${selectedGame.profiles.first_name || ''} ${selectedGame.profiles.last_name || ''}`.trim() || 
                        'Anonymous Host'}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-muted-foreground">
                        {selectedGame.profiles.overall_rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              {selectedGame.host_id === user?.id ? (
                <>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleManageGame(selectedGame.id);
                    }}
                  >
                    Manage Game
                  </Button>
                  <ShareGameButton 
                    gameId={selectedGame.id}
                    gameName={`${formatSportDisplay(selectedGame.sport, selectedGame.custom_sport_name)} Game`}
                  />
                </>
              ) : (
                <>
                  <Button 
                    className="flex-1"
                    onClick={() => handleMessageHost(selectedGame.id, 
                      selectedGame.profiles ? `${selectedGame.profiles.first_name} ${selectedGame.profiles.last_name}` : 'Host'
                    )}
                  >
                    Message Host
                  </Button>
                  <ShareGameButton 
                    gameId={selectedGame.id}
                    gameName={`${formatSportDisplay(selectedGame.sport, selectedGame.custom_sport_name)} Game`}
                  />
                </>
              )}
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const renderManageDialog = () => (
    <Dialog open={isManageOpen} onOpenChange={(open) => {
      setIsManageOpen(open);
      if (!open) setIsEditMode(false);
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span>Manage Game</span>
            {!isEditMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditMode(true)}
                className="gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit Details
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            {selectedGame && formatSportDisplay(selectedGame.sport, selectedGame.custom_sport_name)} at {isEditMode ? editForm.location_name : selectedGame?.location_name}
          </DialogDescription>
        </DialogHeader>
        {selectedGame && (
          <div className="space-y-6">
            {isEditMode ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sport">Sport</Label>
                    <Select value={editForm.sport} onValueChange={(value) => setEditForm({ ...editForm, sport: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAllSportsDisplayNames().map((sport) => (
                          <SelectItem key={sport} value={sport}>
                            {getSportEmoji(sport)} {sport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skill_level">Skill Level</Label>
                    <Select value={editForm.skill_level} onValueChange={(value) => setEditForm({ ...editForm, skill_level: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                        <SelectItem value="EXPERT">Expert</SelectItem>
                        <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_name">Location Name</Label>
                  <Input
                    id="location_name"
                    value={editForm.location_name}
                    onChange={(e) => setEditForm({ ...editForm, location_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={editForm.state}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      placeholder="e.g., CA"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip_code">Zip Code</Label>
                  <Input
                    id="zip_code"
                    value={editForm.zip_code}
                    onChange={(e) => setEditForm({ ...editForm, zip_code: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="game_date">Date</Label>
                    <Input
                      id="game_date"
                      type="date"
                      value={editForm.game_date}
                      onChange={(e) => setEditForm({ ...editForm, game_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start_time">Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={editForm.start_time}
                      onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                    <Input
                      id="duration_minutes"
                      type="number"
                      min={15}
                      step={15}
                      value={editForm.duration_minutes}
                      onChange={(e) => setEditForm({ ...editForm, duration_minutes: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_players">Max Players</Label>
                    <Input
                      id="max_players"
                      type="number"
                      min={selectedGame.current_players}
                      value={editForm.max_players}
                      onChange={(e) => setEditForm({ ...editForm, max_players: parseInt(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Min: {selectedGame.current_players} (current)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select value={editForm.visibility} onValueChange={(value) => setEditForm({ ...editForm, visibility: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Public</SelectItem>
                        <SelectItem value="FRIENDS_ONLY">Friends Only</SelectItem>
                        <SelectItem value="INVITE_ONLY">Invite Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipment_requirements">Equipment Requirements</Label>
                  <Textarea
                    id="equipment_requirements"
                    value={editForm.equipment_requirements}
                    onChange={(e) => setEditForm({ ...editForm, equipment_requirements: e.target.value })}
                    rows={2}
                    placeholder="What equipment should players bring?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="game_rules">Game Rules</Label>
                  <Textarea
                    id="game_rules"
                    value={editForm.game_rules}
                    onChange={(e) => setEditForm({ ...editForm, game_rules: e.target.value })}
                    rows={3}
                    placeholder="Special rules or instructions for this game"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsEditMode(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleSaveGameDetails}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <>
                {/* Game Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold">{selectedGame.current_players}</p>
                    <p className="text-sm text-muted-foreground">Players</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold">{selectedGame.max_players}</p>
                    <p className="text-sm text-muted-foreground">Max</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold">{selectedGame.max_players - selectedGame.current_players}</p>
                    <p className="text-sm text-muted-foreground">Spots Left</p>
                  </Card>
                </div>

                {/* Participants List */}
                <div>
                  <h3 className="font-semibold mb-3">Participants ({participants.length})</h3>
                  <div className="space-y-2">
                    {participants.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">No participants yet</p>
                    ) : (
                      participants.map((participant) => (
                        <Card key={participant.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                                {participant.profiles?.first_name?.[0]}{participant.profiles?.last_name?.[0]}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {participant.profiles?.first_name} {participant.profiles?.last_name}
                                </p>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  <span className="text-sm text-muted-foreground">
                                    {participant.profiles?.overall_rating?.toFixed(1) || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline">{participant.status}</Badge>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsManageOpen(false)}>
                    Close
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setIsManageOpen(false);
                      handleCancelGame(selectedGame.id, formatSportDisplay(selectedGame.sport, selectedGame.custom_sport_name));
                    }}
                  >
                    Cancel Game
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center py-12">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const upcomingGamesOld = [
    {
      id: 1,
      sport: "Basketball",
      emoji: "🏀",
      location: "Central Park Courts",
      address: "New York, NY",
      date: "Today",
      time: "6:00 PM",
      players: { current: 8, max: 10 },
      role: "attending",
      hostName: "Mike Jordan",
      hostRating: 4.8,
    },
    {
      id: 2,
      sport: "Soccer",
      emoji: "⚽",
      location: "Lincoln Field",
      address: "Brooklyn, NY",
      date: "Saturday",
      time: "2:00 PM",
      players: { current: 14, max: 16 },
      role: "hosting",
      hostName: "You",
      hostRating: 4.9,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {renderDetailsDialog()}
      {renderManageDialog()}
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          {/* Game Reminder Banner */}
          <div className="mb-6">
            <GameReminderBanner />
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-black mb-2">My Games</h1>
              <p className="text-lg text-muted-foreground">Manage your upcoming and past games</p>
            </div>
            <Button className="gradient-primary text-white shadow-primary hover:opacity-90" asChild>
              <Link to="/host-game">
                <Plus className="w-4 h-4 mr-2" />
                Create Game
              </Link>
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="upcoming">
                Upcoming ({allUpcomingGames.length})
              </TabsTrigger>
              <TabsTrigger value="hosting">
                Hosting ({hostedGames.length})
              </TabsTrigger>
              <TabsTrigger value="saved">
                Saved ({savedGames.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastGames.length})
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Games */}
            <TabsContent value="upcoming" className="space-y-4">
              {allUpcomingGames.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-xl bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Upcoming Games</h3>
                  <p className="text-muted-foreground mb-6">Join games to see them here</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link to="/discover">Browse Games</Link>
                  </Button>
                </div>
              ) : (
                allUpcomingGames.map((game) => {
                  const isHost = game.host_id === user?.id;
                  const hostName = game.profiles 
                    ? (game.profiles.username || 
                       `${game.profiles.first_name || ''} ${game.profiles.last_name || ''}`.trim() || 
                       'Anonymous Host')
                    : 'Unknown';
                  
                  return (
                  <Card key={game.id} className="border-2 hover:shadow-elevated transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Left Section */}
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Sport Icon */}
                          <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-2xl shadow-primary flex-shrink-0">
                            {getSportEmoji(game.sport)}
                          </div>
                          
                          {/* Game Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div>
                                <h3 className="text-xl font-bold mb-1">{formatSportDisplay(game.sport, game.custom_sport_name)}</h3>
                                <div className="flex items-center text-muted-foreground text-sm">
                                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{game.location_name}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {isHost && (
                                  <Badge className="gradient-secondary text-white">Host</Badge>
                                )}
                                {game.visibility === 'PUBLIC' && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Public</Badge>
                                )}
                                {game.visibility === 'FRIENDS_ONLY' && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Friends Only</Badge>
                                )}
                                {game.visibility === 'INVITE_ONLY' && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Invite Only</Badge>
                                )}
                              </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center space-x-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {format(new Date(game.game_date), 'MMM dd')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{game.start_time}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {game.current_players}/{game.max_players} players
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex flex-col space-y-2 md:min-w-[140px]">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleViewDetails(game.id)}
                          >
                            View Details
                          </Button>
                          {isHost ? (
                            <>
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => handleManageGame(game.id)}
                              >
                                Manage
                              </Button>
                              <Button 
                                variant="ghost" 
                                className="w-full text-destructive hover:text-destructive"
                                onClick={() => handleCancelGame(game.id, game.sport)}
                              >
                                Cancel Game
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => handleMessageHost(game.id, hostName)}
                              >
                                Message Host
                              </Button>
                              <Button 
                                variant="ghost" 
                                className="w-full text-muted-foreground"
                                onClick={() => handleLeaveGame(game.id, game.sport)}
                              >
                                Leave Game
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
              )}
            </TabsContent>

            {/* Hosting Tab */}
            <TabsContent value="hosting" className="space-y-4">
              {hostedGames.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-xl gradient-primary mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your Hosted Games</h3>
                  <p className="text-muted-foreground mb-6">Games you're organizing will appear here</p>
                  <Button className="gradient-primary text-white shadow-primary hover:opacity-90" asChild>
                    <Link to="/host-game">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Game
                    </Link>
                  </Button>
                </div>
              ) : (
                hostedGames.map((game) => (
                  <Card key={game.id} className="border-2 hover:shadow-elevated transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-2xl shadow-primary flex-shrink-0">
                            {getSportEmoji(game.sport)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div>
                                <h3 className="text-xl font-bold mb-1">{formatSportDisplay(game.sport, game.custom_sport_name)}</h3>
                                <div className="flex items-center text-muted-foreground text-sm">
                                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{game.location_name}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Badge className="gradient-secondary text-white">Host</Badge>
                                {game.visibility === 'PUBLIC' && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Public</Badge>
                                )}
                                {game.visibility === 'FRIENDS_ONLY' && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Friends Only</Badge>
                                )}
                                {game.visibility === 'INVITE_ONLY' && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Invite Only</Badge>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center space-x-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {format(new Date(game.game_date), 'MMM dd')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{game.start_time}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {game.current_players}/{game.max_players} players
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 md:min-w-[140px]">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleViewDetails(game.id)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleManageGame(game.id)}
                          >
                            Manage
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="w-full text-destructive hover:text-destructive"
                            onClick={() => handleCancelGame(game.id, game.sport)}
                          >
                            Cancel Game
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Saved Games Tab */}
            <TabsContent value="saved" className="space-y-4">
              {savedGames.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-2">No saved games yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bookmark games you're interested in to easily find and join them later
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/discover">Browse Games</Link>
                  </Button>
                </div>
              ) : (
                savedGames.map((game) => (
                  <Card key={game.id} className="border-2">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-2xl shadow-primary flex-shrink-0">
                            {getSportEmoji(game.sport)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold mb-1">{formatSportDisplay(game.sport, game.custom_sport_name)}</h3>
                            <div className="flex items-center text-muted-foreground text-sm mb-3">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="truncate">{game.location_name}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center space-x-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {format(new Date(game.game_date), 'MMM dd, yyyy')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{game.start_time}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {game.current_players}/{game.max_players} players
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Badge variant="secondary">{game.skill_level.replace('_', ' ')}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 md:min-w-[160px]">
                          {/* Show different buttons based on game state */}
                          {game.host_id === user?.id ? (
                            <Badge variant="secondary" className="w-full justify-center py-2">
                              You're hosting
                            </Badge>
                          ) : userRSVPs.has(game.id) ? (
                            <Badge variant="secondary" className="w-full justify-center py-2">
                              ✓ Already joined
                            </Badge>
                          ) : (() => {
                            const gameDateTime = new Date(`${game.game_date}T${game.start_time}`);
                            const now = new Date();
                            const isPastGame = gameDateTime < now;
                            const isFull = game.current_players >= game.max_players;
                            
                            return isPastGame ? (
                              <Badge variant="outline" className="w-full justify-center py-2">
                                Game ended
                              </Badge>
                            ) : isFull ? (
                              <Badge variant="outline" className="w-full justify-center py-2">
                                Game full
                              </Badge>
                            ) : (
                              <Button 
                                variant="default" 
                                className="w-full"
                                onClick={() => handleJoinSavedGame(game)}
                                disabled={joiningGameId === game.id}
                              >
                                {joiningGameId === game.id ? "Joining..." : "Join Game"}
                              </Button>
                            );
                          })()}
                          
                          <Button 
                            variant="outline" 
                            className="w-full"
                            asChild
                          >
                            <Link to={`/game/${game.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              unsaveGame(game.id);
                              setSavedGames(prev => prev.filter(g => g.id !== game.id));
                            }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Past Games Tab */}
            <TabsContent value="past" className="space-y-4">
              {pastGames.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-xl bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Star className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Past Games Yet</h3>
                  <p className="text-muted-foreground mb-6">Join or host games to build your history and reputation</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link to="/discover">
                      Browse Games
                    </Link>
                  </Button>
                </div>
              ) : (
                pastGames.map((game) => (
                  <PastGameCard 
                    key={game.id} 
                    game={game} 
                    userId={user?.id!}
                    onReviewSubmitted={fetchGames}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyGames;
