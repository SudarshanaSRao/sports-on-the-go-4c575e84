import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, User, Calendar, LogOut, Search, MessageSquare, Trophy, Grid3x3 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { user, signOut } = useAuth();

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
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/discover" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth font-medium"
            >
              <MapPin className="w-4 h-4" />
              Find Games
            </Link>
            {user && (
              <>
                <Link 
                  to="/host-game" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  Host Game
                </Link>
                <Link 
                  to="/community" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  Community
                </Link>
                <Link 
                  to="/leaderboard" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth font-medium"
                >
                  <Trophy className="w-4 h-4" />
                  Leaderboard
                </Link>
                <Link 
                  to="/my-games" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth font-medium"
                >
                  <Grid3x3 className="w-4 h-4" />
                  My Games
                </Link>
              </>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Button 
                  size="sm"
                  className="gradient-primary text-white shadow-primary hover:opacity-90 transition-smooth"
                  asChild
                >
                  <Link to="/discover">
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Game
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                        {user.email?.[0].toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">My Account</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/my-games" className="cursor-pointer">
                        <Calendar className="w-4 h-4 mr-2" />
                        My Games
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
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
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
