import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Trophy, UserMinus, UserCheck, UserX } from "lucide-react";
import { FriendProfile, Friendship } from "@/hooks/useFriends";

interface FriendCardProps {
  friendship: Friendship;
  currentUserId: string;
  onRemove?: (friendshipId: string) => void;
  onAccept?: (friendshipId: string) => void;
  onDecline?: (friendshipId: string) => void;
  onCancel?: (friendshipId: string) => void;
  type: "friend" | "pending" | "sent";
}

export const FriendCard = ({
  friendship,
  currentUserId,
  onRemove,
  onAccept,
  onDecline,
  onCancel,
  type,
}: FriendCardProps) => {
  const profile: FriendProfile | undefined =
    friendship.requester_id === currentUserId
      ? friendship.addressee
      : friendship.requester;

  if (!profile) return null;

  const displayName =
    profile.username ||
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
    "Anonymous User";

  return (
    <Card className="p-4 hover:shadow-md transition-smooth">
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={profile.profile_photo || undefined} />
          <AvatarFallback className="gradient-primary text-white text-lg">
            {displayName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg truncate">{displayName}</h3>
              {profile.username && (
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              )}
            </div>
            {type === "friend" && profile.overall_rating > 0 && (
              <Badge variant="secondary" className="shrink-0">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {profile.overall_rating.toFixed(1)}
              </Badge>
            )}
          </div>

          {type === "friend" && (
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{profile.games_attended} played</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>{profile.games_hosted} hosted</span>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            {type === "friend" && onRemove && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(friendship.id)}
              >
                <UserMinus className="w-4 h-4 mr-2" />
                Remove Friend
              </Button>
            )}

            {type === "pending" && onAccept && onDecline && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onAccept(friendship.id)}
                  className="gradient-primary text-white"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDecline(friendship.id)}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Decline
                </Button>
              </>
            )}

            {type === "sent" && onCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(friendship.id)}
              >
                <UserX className="w-4 h-4 mr-2" />
                Cancel Request
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
