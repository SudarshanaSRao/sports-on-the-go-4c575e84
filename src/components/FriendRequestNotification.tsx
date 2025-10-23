import { Badge } from "@/components/ui/badge";

interface FriendRequestNotificationProps {
  count: number;
}

export const FriendRequestNotification = ({ count }: FriendRequestNotificationProps) => {
  if (count === 0) return null;

  return (
    <Badge
      variant="destructive"
      className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
    >
      {count > 9 ? "9+" : count}
    </Badge>
  );
};
