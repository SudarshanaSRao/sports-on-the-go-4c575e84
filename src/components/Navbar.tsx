import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, User, Calendar } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary transition-smooth group-hover:scale-105">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">PickupPro</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/discover" 
              className="text-muted-foreground hover:text-foreground transition-smooth font-medium"
            >
              Discover Games
            </Link>
            <Link 
              to="/my-games" 
              className="text-muted-foreground hover:text-foreground transition-smooth font-medium"
            >
              My Games
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden sm:flex"
              asChild
            >
              <Link to="/auth">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button 
              size="sm"
              className="gradient-primary text-white shadow-primary hover:opacity-90 transition-smooth"
              asChild
            >
              <Link to="/auth">
                <Calendar className="w-4 h-4 mr-2" />
                Create Game
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
