import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { TermsVersionChecker } from "./components/TermsVersionChecker";
import { useMobileViewport } from "./hooks/useMobileViewport";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import GoogleConsent from "./pages/GoogleConsent";
import SetupUsername from "./pages/SetupUsername";
import Discover from "./pages/Discover";
import GameDetails from "./pages/GameDetails";
import MyGames from "./pages/MyGames";
import HostGame from "./pages/HostGame";
import Community from "./pages/Community";
import Leaderboard from "./pages/Leaderboard";
import Friends from "./pages/Friends";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Enable mobile viewport optimization
  useMobileViewport();
  
  return (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <TermsVersionChecker>
                <div className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/auth-callback" element={<AuthCallback />} />
                    <Route path="/google-consent" element={<GoogleConsent />} />
                    <Route path="/setup-username" element={<SetupUsername />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/game/:id" element={<GameDetails />} />
                    <Route path="/host-game" element={<HostGame />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/my-games" element={<MyGames />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </TermsVersionChecker>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
  );
};

export default App;
