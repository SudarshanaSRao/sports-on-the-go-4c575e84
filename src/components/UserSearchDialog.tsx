import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FriendProfile, useFriends } from "@/hooks/useFriends";
import { useToast } from "@/hooks/use-toast";

interface UserSearchDialogProps {
  trigger?: React.ReactNode;
}

export const UserSearchDialog = ({ trigger }: UserSearchDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FriendProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [friendStatuses, setFriendStatuses] = useState<Record<string, string | null>>({});
  const { sendFriendRequest, checkFriendshipStatus } = useFriends();
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, first_name, last_name, profile_photo, overall_rating, games_hosted, games_attended")
          .or(`username.ilike.%${searchQuery}%,first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`)
          .neq("id", user.id)
          .limit(10);

        if (error) throw error;

        setSearchResults(data || []);

        // Check friendship status for each result
        const statuses: Record<string, string | null> = {};
        for (const profile of data || []) {
          statuses[profile.id] = await checkFriendshipStatus(profile.id);
        }
        setFriendStatuses(statuses);
      } catch (error: any) {
        toast({
          title: "Error searching users",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSendRequest = async (userId: string) => {
    await sendFriendRequest(userId);
    const newStatus = await checkFriendshipStatus(userId);
    setFriendStatuses((prev) => ({ ...prev, [userId]: newStatus }));
  };

  const getActionButton = (profile: FriendProfile) => {
    if (profile.id === currentUserId) return null;

    const status = friendStatuses[profile.id];

    if (status === "FRIENDS") {
      return (
        <Badge variant="secondary">
          <Users className="w-3 h-3 mr-1" />
          Friends
        </Badge>
      );
    }

    if (status === "SENT") {
      return <Badge variant="outline">Request Sent</Badge>;
    }

    if (status === "RECEIVED") {
      return <Badge variant="outline">Request Received</Badge>;
    }

    return (
      <Button
        size="sm"
        onClick={() => handleSendRequest(profile.id)}
        className="gradient-primary text-white"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Add Friend
      </Button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gradient-primary text-white">
            <Search className="w-4 h-4 mr-2" />
            Find Friends
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Find Friends</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by username or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading && (
            <p className="text-center text-muted-foreground py-4">Searching...</p>
          )}

          {!loading && searchQuery && searchResults.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No users found</p>
          )}

          <div className="space-y-3">
            {searchResults.map((profile) => {
              const displayName =
                profile.username ||
                `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
                "Anonymous User";

              return (
                <div
                  key={profile.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-smooth"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={profile.profile_photo || undefined} />
                    <AvatarFallback className="gradient-primary text-white">
                      {displayName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{displayName}</p>
                    {profile.username && (
                      <p className="text-sm text-muted-foreground">@{profile.username}</p>
                    )}
                  </div>

                  {getActionButton(profile)}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
