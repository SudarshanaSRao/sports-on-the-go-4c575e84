import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Plus, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MyGames = () => {
  const navigate = useNavigate();

  const handleViewDetails = (gameId: number) => {
    toast.info("Game details coming soon!");
    // TODO: Navigate to game details page or show modal
    // navigate(`/game/${gameId}`);
  };

  const handleManageGame = (gameId: number) => {
    toast.info("Game management coming soon!");
    // TODO: Navigate to game management page
  };

  const handleCancelGame = (gameId: number, gameName: string) => {
    if (confirm(`Are you sure you want to cancel the ${gameName} game?`)) {
      toast.success("Game cancelled successfully");
      // TODO: Call Supabase to cancel the game
    }
  };

  const handleMessageHost = (gameId: number, hostName: string) => {
    toast.info(`Messaging ${hostName} coming soon!`);
    // TODO: Open messaging interface
  };

  const handleLeaveGame = (gameId: number, gameName: string) => {
    if (confirm(`Are you sure you want to leave the ${gameName} game?`)) {
      toast.success("You've left the game");
      // TODO: Call Supabase to remove RSVP
    }
  };

  // Mock data - will be replaced with real data later
  const upcomingGames = [
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
              <Link to="/discover">
                <Plus className="w-4 h-4 mr-2" />
                Create Game
              </Link>
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingGames.length})
              </TabsTrigger>
              <TabsTrigger value="hosting">
                Hosting (1)
              </TabsTrigger>
              <TabsTrigger value="past">
                Past (0)
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Games */}
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingGames.map((game) => (
                <Card key={game.id} className="border-2 hover:shadow-elevated transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Left Section */}
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Sport Icon */}
                        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-2xl shadow-primary flex-shrink-0">
                          {game.emoji}
                        </div>
                        
                        {/* Game Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <h3 className="text-xl font-bold mb-1">{game.sport}</h3>
                              <div className="flex items-center text-muted-foreground text-sm">
                                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{game.location}</span>
                              </div>
                            </div>
                            {game.role === "hosting" && (
                              <Badge className="gradient-secondary text-white">Host</Badge>
                            )}
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
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
                          </div>

                          {/* Countdown */}
                          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            <span>Starts in 2 hours 30 min</span>
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
                        {game.role === "hosting" ? (
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
                              onClick={() => handleMessageHost(game.id, game.hostName)}
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
              ))}
            </TabsContent>

            {/* Hosting Tab */}
            <TabsContent value="hosting">
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-xl gradient-primary mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Your Hosted Games</h3>
                <p className="text-muted-foreground mb-6">Games you're organizing will appear here</p>
                <Button className="gradient-primary text-white shadow-primary hover:opacity-90" asChild>
                  <Link to="/discover">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Game
                  </Link>
                </Button>
              </div>
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
