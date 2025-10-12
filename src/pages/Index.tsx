import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { MapPin, Users, Star, Calendar, Trophy, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-sports.jpg";

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
    { name: "Basketball", emoji: "🏀" },
    { name: "Soccer", emoji: "⚽" },
    { name: "Volleyball", emoji: "🏐" },
    { name: "Tennis", emoji: "🎾" },
    { name: "Baseball", emoji: "⚾" },
    { name: "Football", emoji: "🏈" },
  ];

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

      {/* Sports Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Play Your Favorite Sports</h2>
            <p className="text-lg text-muted-foreground">From basketball to volleyball, find games for every sport</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sports.map((sport) => (
              <Card key={sport.name} className="hover:shadow-elevated transition-smooth cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-bounce">{sport.emoji}</div>
                  <div className="font-semibold">{sport.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Why PickupPro?</h2>
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

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">PickupPro</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 PickupPro. Connecting athletes, one game at a time.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
