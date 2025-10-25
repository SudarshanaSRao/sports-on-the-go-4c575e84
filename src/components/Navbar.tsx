import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, User, Calendar, LogOut, Menu, X, MessageSquare, Trophy, Grid3x3, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FriendRequestNotification } from "@/components/FriendRequestNotification";
import { useFriends } from "@/hooks/useFriends";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { pendingRequests } = useFriends();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-primary transition-smooth group-hover:scale-105 text-2xl">
              🤾🏼
            </div>
            <span className="text-xl font-bold text-foreground">SquadUp</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/discover" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth font-medium"
            >
              <MapPin className="w-4 h-4" />
              Discover Games
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

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <>
                <Button 
                  size="sm"
                  className="gradient-primary text-white shadow-primary hover:opacity-90 transition-smooth"
                  asChild
                >
                  <Link to="/host-game">
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
                    <DropdownMenuItem asChild>
                      <Link to="/friends" className="cursor-pointer flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Friends
                        <FriendRequestNotification count={pendingRequests.length} />
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xl">
                      🤾🏼
                    </div>
                    <span>SquadUp</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Navigation Links */}
                  <Link 
                    to="/discover" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Discover Games</span>
                  </Link>
                  
                  {user ? (
                    <>
                      <Link 
                        to="/host-game" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Host Game</span>
                      </Link>
                      <Link 
                        to="/community" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">Community</span>
                      </Link>
                      <Link 
                        to="/leaderboard" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Trophy className="w-5 h-5" />
                        <span className="font-medium">Leaderboard</span>
                      </Link>
                      <Link 
                        to="/my-games" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Grid3x3 className="w-5 h-5" />
                        <span className="font-medium">My Games</span>
                      </Link>
                      <Link 
                        to="/friends" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Users className="w-5 h-5" />
                        <span className="font-medium">Friends</span>
                        <FriendRequestNotification count={pendingRequests.length} />
                      </Link>
                      
                      <div className="border-t pt-4 mt-4">
                        <div className="text-sm text-muted-foreground mb-3 px-3">
                          {user.email}
                        </div>
                        <Button 
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                          variant="destructive"
                          className="w-full"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3 pt-4">
                      <Button 
                        asChild
                        variant="outline"
                        className="w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link to="/auth">
                          <User className="w-4 h-4 mr-2" />
                          Sign In
                        </Link>
                      </Button>
                      <Button 
                        asChild
                        className="w-full gradient-primary text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link to="/auth">
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
