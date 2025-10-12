import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Plus, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Game {
  id: string;
  sport: string;
  location_name: string;
  address: string;
  city: string;
  game_date: string;
  start_time: string;
  current_players: number;
  max_players: number;
  host_id: string;
  latitude: number;
  longitude: number;
  description?: string;
  profiles?: {
    first_name: string;
    last_name: string;
    overall_rating: number;
  };
}

const MyGames = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [hostedGames, setHostedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGames();
    }
  }, [user]);

  const fetchGames = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch games user has RSVP'd to
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvps')
        .select(`
          game_id,
          games (
            *,
            profiles:host_id (
              first_name,
              last_name,
              overall_rating
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'CONFIRMED');

      if (rsvpError) throw rsvpError;

      // Fetch games user is hosting
      const { data: hostData, error: hostError } = await supabase
        .from('games')
        .select(`
          *,
          profiles:host_id (
            first_name,
            last_name,
            overall_rating
          )
        `)
        .eq('host_id', user.id)
        .gte('game_date', new Date().toISOString().split('T')[0]);

      if (hostError) throw hostError;

      const attendingGames = rsvpData?.map(r => r.games).filter(Boolean) as Game[] || [];
      setUpcomingGames(attendingGames);
      setHostedGames(hostData || []);
    } catch (error: any) {
      console.error('Error fetching games:', error);
      toast.error('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (gameId: string) => {
    // For now, show game details in toast - can be expanded to modal or page
    toast.info("Viewing game details");
    // TODO: Navigate to game details page
    // navigate(`/game/${gameId}`);
  };

  const handleManageGame = (gameId: string) => {
    toast.info("Game management coming soon!");
    // TODO: Navigate to game management page with participant list
    // navigate(`/manage-game/${gameId}`);
  };

  const handleCancelGame = async (gameId: string, gameName: string) => {
    if (!confirm(`Are you sure you want to cancel the ${gameName} game?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('games')
        .update({ status: 'CANCELLED' })
        .eq('id', gameId)
        .eq('host_id', user?.id);

      if (error) throw error;

      toast.success("Game cancelled successfully");
      fetchGames(); // Refresh the list
    } catch (error: any) {
      console.error('Error cancelling game:', error);
      toast.error('Failed to cancel game');
    }
  };

  const handleMessageHost = (gameId: string, hostName: string) => {
    toast.info(`Messaging feature coming soon!`);
    // TODO: Open messaging interface or navigate to chat
    // navigate(`/messages/${gameId}`);
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

  const getSportEmoji = (sport: string) => {
    const emojiMap: { [key: string]: string } = {
      'BASKETBALL': '🏀',
      'SOCCER': '⚽',
      'VOLLEYBALL': '🏐',
      'TENNIS': '🎾',
      'BASEBALL': '⚾',
      'FOOTBALL': '🏈',
      'default': '🏃'
    };
    return emojiMap[sport] || emojiMap.default;
  };

  const allUpcomingGames = [...upcomingGames, ...hostedGames];

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
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upcoming">
                Upcoming ({allUpcomingGames.length})
              </TabsTrigger>
              <TabsTrigger value="hosting">
                Hosting ({hostedGames.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past (0)
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
                    ? `${game.profiles.first_name} ${game.profiles.last_name}`
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
                                <h3 className="text-xl font-bold mb-1">{game.sport}</h3>
                                <div className="flex items-center text-muted-foreground text-sm">
                                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{game.location_name}</span>
                                </div>
                              </div>
                              {isHost && (
                                <Badge className="gradient-secondary text-white">Host</Badge>
                              )}
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
                                <h3 className="text-xl font-bold mb-1">{game.sport}</h3>
                                <div className="flex items-center text-muted-foreground text-sm">
                                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{game.location_name}</span>
                                </div>
                              </div>
                              <Badge className="gradient-secondary text-white">Host</Badge>
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

            {/* Past Games Tab */}
            <TabsContent value="past">
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-xl bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No Past Games Yet</h3>
                <p className="text-muted-foreground mb-6">Join or host games to build your history and reputation</p>
                <Button variant="outline" asChild>
                  <Link to="/discover">
                    Browse Games
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyGames;
