import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { MapPin, Users, Star, Calendar, Trophy, Shield, Zap, MessageSquare, Medal, CalendarCheck } from "lucide-react";
import heroImage from "@/assets/hero-sports.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const Index = () => {
  const features = [
    {
      icon: MapPin,
      title: "Find Games Nearby",
      description: "Interactive map shows pickup games in your area instantly. Never miss a game again.",
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Connect with athletes of all skill levels. Find your crew and play consistently.",
    },
    {
      icon: Star,
      title: "Trust & Reputation",
      description: "Verified profiles and peer reviews ensure you're playing with reliable people.",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Multi-tier verification system and user ratings create a trusted environment.",
    },
    {
      icon: Calendar,
      title: "Easy Coordination",
      description: "RSVP, manage waitlists, and get real-time notifications. No more group chat chaos.",
    },
    {
      icon: Trophy,
      title: "Skill Matching",
      description: "Filter games by skill level to find the right competition for you.",
    },
  ];

  const sports = [
    { 
      name: "Basketball", 
      emoji: "🏀",
      description: "Fast-paced team sport played on a court. Perfect for cardio and teamwork.",
      rules: [
        "Two teams of 5 players each",
        "Score by shooting ball through opponent's hoop (2 or 3 points)",
        "Game typically played in 4 quarters (12 minutes each in NBA)",
        "Players cannot run with the ball without dribbling",
        "Physical contact is limited - fouls result in free throws"
      ],
      skillLevels: "Beginner to Advanced",
      equipment: "Ball, court, hoops"
    },
    { 
      name: "Soccer", 
      emoji: "⚽",
      description: "World's most popular sport. Great for endurance and coordination.",
      rules: [
        "Two teams of 11 players each",
        "Score by kicking ball into opponent's goal",
        "Game typically played in 2 halves (45 minutes each)",
        "Only goalkeepers can use hands within penalty area",
        "Offsides rule prevents players from goal-hanging"
      ],
      skillLevels: "All levels welcome",
      equipment: "Ball, goals, field"
    },
    { 
      name: "Volleyball", 
      emoji: "🏐",
      description: "Dynamic team sport played over a net. Excellent for agility and reflexes.",
      rules: [
        "Two teams of 6 players each",
        "Score by grounding ball on opponent's court",
        "Teams have 3 hits to return ball over net",
        "Games played to 25 points (must win by 2)",
        "Players rotate positions after winning serve"
      ],
      skillLevels: "Beginner to Intermediate",
      equipment: "Ball, net, court"
    },
    { 
      name: "Tennis", 
      emoji: "🎾",
      description: "Racket sport for singles or doubles. Great workout for the whole body.",
      rules: [
        "Singles (1v1) or Doubles (2v2)",
        "Score by hitting ball over net into opponent's court",
        "Points: 15, 30, 40, Game (must win by 2)",
        "Ball can bounce once before being returned",
        "Serve must land in diagonal service box"
      ],
      skillLevels: "All levels",
      equipment: "Racket, balls, court"
    },
    { 
      name: "Baseball", 
      emoji: "⚾",
      description: "Classic American sport combining strategy and athleticism.",
      rules: [
        "Two teams of 9 players each",
        "Batting team scores by running bases and reaching home plate",
        "Game played in 9 innings (each team bats and fields)",
        "3 outs end the team's turn at bat",
        "Pitcher tries to throw strikes past the batter"
      ],
      skillLevels: "Intermediate to Advanced",
      equipment: "Bat, ball, gloves, bases"
    },
    { 
      name: "Football", 
      emoji: "🏈",
      description: "Strategic team sport with high intensity. Build strength and teamwork.",
      rules: [
        "Two teams of 11 players each",
        "Score by carrying/passing ball into end zone (6 points)",
        "Teams have 4 downs to advance 10 yards",
        "Game played in 4 quarters (15 minutes each in NFL)",
        "Field goals (3 points) and safeties (2 points) also score"
      ],
      skillLevels: "Intermediate to Advanced",
      equipment: "Ball, protective gear, field"
    },
  ];

  const [selectedSport, setSelectedSport] = useState<typeof sports[0] | null>(null);
  const navigate = useNavigate();

  const handleFindGames = (sportName: string) => {
    navigate(`/discover?sport=${encodeURIComponent(sportName)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
          <img 
            src={heroImage} 
            alt="People playing sports" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="container mx-auto relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Join thousands of active players</span>
            </div>
            
            {/* Catchphrase */}
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-4 tracking-wide">
              Seek. Squad. Score.
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              Find Pickup Games
              <br />
              <span className="text-gradient">Near You</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with athletes, discover local games, and never play alone. 
              Build trust through our reputation system.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="w-full sm:w-auto gradient-primary text-white shadow-primary hover:scale-105 transition-smooth text-lg px-8 py-6"
                asChild
              >
                <Link to="/discover">
                  <MapPin className="w-5 h-5 mr-2" />
                  Discover Games
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-accent hover:text-accent-foreground transition-smooth"
                asChild
              >
                <Link to="/auth">
                  Get Started Free
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8 border-t border-border">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-primary mb-1">2.5k+</div>
                <div className="text-sm text-muted-foreground">Active Players</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-primary mb-1">150+</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-primary mb-1">4.8★</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Everything You Need</h2>
            <p className="text-lg text-muted-foreground">Discover games, connect with players, and track your stats</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-elevated transition-smooth border-2 hover:border-primary/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mb-4 mx-auto shadow-primary">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with players, share tips, and discuss upcoming games in our vibrant community
                </p>
                <Button asChild className="w-full">
                  <Link to="/community">
                    Visit Community
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elevated transition-smooth border-2 hover:border-primary/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mb-4 mx-auto shadow-primary">
                  <Medal className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Leaderboard</h3>
                <p className="text-muted-foreground mb-6">
                  Track top players, see ratings, and compete to climb the rankings in your area
                </p>
                <Button asChild className="w-full">
                  <Link to="/leaderboard">
                    View Rankings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elevated transition-smooth border-2 hover:border-primary/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mb-4 mx-auto shadow-primary">
                  <CalendarCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">My Games</h3>
                <p className="text-muted-foreground mb-6">
                  Manage your hosted games and track games you've joined all in one place
                </p>
                <Button asChild className="w-full">
                  <Link to="/my-games">
                    My Games
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-black mb-4">Play Your Favorite Sports</h3>
            <p className="text-muted-foreground">From basketball to volleyball, find games for every sport</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sports.map((sport) => (
              <Dialog key={sport.name}>
                <DialogTrigger asChild>
                  <Card className="hover:shadow-elevated transition-smooth cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="text-5xl mb-3 group-hover:scale-110 transition-bounce">{sport.emoji}</div>
                      <div className="font-semibold">{sport.name}</div>
                      <p className="text-xs text-muted-foreground mt-2">{sport.description}</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-3xl">
                      <span className="text-4xl">{sport.emoji}</span>
                      {sport.name}
                    </DialogTitle>
                    <DialogDescription className="text-base pt-2">
                      {sport.description}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 mt-4">
                    <div>
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        Basic Rules
                      </h3>
                      <ul className="space-y-2">
                        {sport.rules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <h4 className="font-semibold mb-1 flex items-center gap-2">
                          <Star className="w-4 h-4 text-primary" />
                          Skill Levels
                        </h4>
                        <p className="text-sm text-muted-foreground">{sport.skillLevels}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          Equipment Needed
                        </h4>
                        <p className="text-sm text-muted-foreground">{sport.equipment}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        className="w-full gradient-primary text-white" 
                        onClick={() => handleFindGames(sport.name)}
                      >
                        Find {sport.name} Games Near You
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Why SquadUp?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The most trusted platform for organizing and joining pickup games
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="border-2 hover:border-primary/50 hover:shadow-elevated transition-smooth group"
                >
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-primary group-hover:scale-110 transition-bounce">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Ready to Play?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Join thousands of athletes finding games every day. It's free to get started.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-elevated text-lg px-10 py-6 hover:scale-105 transition-smooth"
              asChild
            >
              <Link to="/auth">
                Create Free Account
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Personal Project Disclaimer:</span> SquadUp is a non-commercial hobby project created for educational and recreational purposes. Not affiliated with any sports organization or athletic association. No payments, ads, or monetization. User data (name, photo, location, preferences) is collected solely for in-app matching and securely stored. You may request data deletion anytime by contacting us.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">SquadUp</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                Privacy Policy
              </Link>
            </div>
            
            <div className="text-sm text-muted-foreground text-center md:text-right">
              © 2025 SquadUp. Open-source & free to use.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
