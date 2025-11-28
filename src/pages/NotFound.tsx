import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-12 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      <div className="text-center space-y-8 relative z-10 max-w-2xl animate-fade-in">
        {/* 404 Number with sports theme */}
        <div className="relative">
          <div className="text-[12rem] sm:text-[16rem] font-black leading-none bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent animate-scale-in select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl sm:text-8xl animate-bounce" style={{ animationDuration: '2s' }}>
              ⚽🏀🎾
            </div>
          </div>
        </div>

        {/* Playful message */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground">
            Game Not Found!
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto">
            Looks like this page decided to sit out this match. Don't worry, there are plenty of other games to join!
          </p>
          <p className="text-sm text-muted-foreground/60 font-mono">
            Lost route: <span className="text-destructive">{location.pathname}</span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="gap-2 hover-scale">
            <Link to="/">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 hover-scale">
            <Link to="/discover">
              <Search className="w-5 h-5" />
              Discover Games
            </Link>
          </Button>
        </div>

        {/* Helpful links */}
        <div className="pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-4">Popular destinations:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/my-games" className="text-sm text-primary hover:text-primary/80 story-link transition-colors">
              My Games
            </Link>
            <span className="text-muted-foreground/30">•</span>
            <Link to="/community" className="text-sm text-primary hover:text-primary/80 story-link transition-colors">
              Community
            </Link>
            <span className="text-muted-foreground/30">•</span>
            <Link to="/leaderboard" className="text-sm text-primary hover:text-primary/80 story-link transition-colors">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Leaderboard
            </Link>
            <span className="text-muted-foreground/30">•</span>
            <Link to="/friends" className="text-sm text-primary hover:text-primary/80 story-link transition-colors">
              Friends
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
