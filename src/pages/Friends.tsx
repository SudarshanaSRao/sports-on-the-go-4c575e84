import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Send, Search } from "lucide-react";
import { FriendCard } from "@/components/FriendCard";
import { UserSearchDialog } from "@/components/UserSearchDialog";
import { useFriends } from "@/hooks/useFriends";
import { useAuth } from "@/contexts/AuthContext";

const Friends = () => {
  const { user } = useAuth();
  const {
    friends,
    pendingRequests,
    sentRequests,
    loading,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    cancelRequest,
  } = useFriends();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter((friendship) => {
    const profile =
      friendship.requester_id === user?.id
        ? friendship.addressee
        : friendship.requester;
    
    if (!profile) return false;

    const displayName =
      profile.username ||
      `${profile.first_name || ""} ${profile.last_name || ""}`.trim().toLowerCase();
    
    return displayName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Friends</h1>
              <p className="text-muted-foreground">
                Connect with other players and build your squad
              </p>
            </div>
            <UserSearchDialog />
          </div>

          <Tabs defaultValue="friends" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="friends" className="gap-2">
                <Users className="w-4 h-4" />
                Friends ({friends.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Requests ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="sent" className="gap-2">
                <Send className="w-4 h-4" />
                Sent ({sentRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends" className="space-y-4">
              {friends.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}

              {loading ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Loading friends...</p>
                </Card>
              ) : filteredFriends.length === 0 ? (
                <Card className="p-8 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-lg mb-2">
                    {searchQuery ? "No friends found" : "No friends yet"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Try a different search term"
                      : "Start building your squad by adding friends"}
                  </p>
                  {!searchQuery && <UserSearchDialog />}
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredFriends.map((friendship) => (
                    <FriendCard
                      key={friendship.id}
                      friendship={friendship}
                      currentUserId={user?.id || ""}
                      onRemove={removeFriend}
                      type="friend"
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {loading ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Loading requests...</p>
                </Card>
              ) : pendingRequests.length === 0 ? (
                <Card className="p-8 text-center">
                  <UserPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-lg mb-2">No pending requests</h3>
                  <p className="text-muted-foreground">
                    You don't have any friend requests at the moment
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((friendship) => (
                    <FriendCard
                      key={friendship.id}
                      friendship={friendship}
                      currentUserId={user?.id || ""}
                      onAccept={acceptFriendRequest}
                      onDecline={declineFriendRequest}
                      type="pending"
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              {loading ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Loading sent requests...</p>
                </Card>
              ) : sentRequests.length === 0 ? (
                <Card className="p-8 text-center">
                  <Send className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-lg mb-2">No sent requests</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't sent any friend requests yet
                  </p>
                  <UserSearchDialog />
                </Card>
              ) : (
                <div className="space-y-3">
                  {sentRequests.map((friendship) => (
                    <FriendCard
                      key={friendship.id}
                      friendship={friendship}
                      currentUserId={user?.id || ""}
                      onCancel={cancelRequest}
                      type="sent"
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Friends;
