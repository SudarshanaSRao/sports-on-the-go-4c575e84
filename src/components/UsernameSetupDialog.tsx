import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const UsernameSetupDialog = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const checkUsername = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profile && !profile.username) {
        setOpen(true);
      }
    };

    checkUsername();
  }, [user]);

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
      setOpen(false);
    } catch (err: any) {
      console.error("Error setting username:", err);
      toast.error("Failed to set username. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Choose Your Username</DialogTitle>
          <DialogDescription>
            Please choose a unique username to complete your profile setup.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe123"
                className="pl-10"
                pattern="[a-zA-Z0-9_]+"
                minLength={3}
                maxLength={20}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-muted-foreground">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>
          <Button 
            type="submit" 
            className="w-full gradient-primary text-white shadow-primary hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? "Setting username..." : "Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
