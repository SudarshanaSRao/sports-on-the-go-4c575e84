import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const SetupUsername = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUsername = async () => {
      if (loading) return; // Wait until auth state is resolved

      if (!user) {
        // If not authenticated after loading, send to auth
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      // If username already exists, redirect to discover
      if (profile?.username) {
        navigate('/discover');
      }
    };

    checkUsername();
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate username
    if (username.length < 3 || username.length > 20) {
      setError("Username must be 3-20 characters");
      setIsLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores");
      setIsLoading(false);
      return;
    }

    try {
      // Check if username is already taken
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (existing) {
        setError("Username is already taken");
        setIsLoading(false);
        return;
      }

      // Update profile with username
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      toast.success("Username set successfully!");
      navigate('/discover');
    } catch (err: any) {
      console.error("Error setting username:", err);
      toast.error("Failed to set username. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-elevated border-2">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
              <MapPin className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black text-center">Choose Your Username</CardTitle>
          <CardDescription className="text-center">
            Please choose a unique username to complete your profile setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe123"
                  className="pl-10 h-11"
                  pattern="[a-zA-Z0-9_]+"
                  minLength={3}
                  maxLength={20}
                  required
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
              <p className="text-xs text-muted-foreground">
                3-20 characters, letters, numbers, and underscores only
              </p>
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 gradient-primary text-white shadow-primary hover:opacity-90 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Setting username..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupUsername;
