import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FriendProfile {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  profile_photo: string | null;
  overall_rating: number;
  games_hosted: number;
  games_attended: number;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  created_at: string;
  requester?: FriendProfile;
  addressee?: FriendProfile;
}

export const useFriends = () => {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFriends = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: friendshipsData, error: friendshipsError } = await supabase
        .from("friendships")
        .select("*")
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq("status", "ACCEPTED");

      if (friendshipsError) throw friendshipsError;

      // Get profile data for all friends
      const userIds = friendshipsData?.flatMap((f) => [f.requester_id, f.addressee_id]) || [];
      const uniqueUserIds = [...new Set(userIds)];

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, first_name, last_name, profile_photo, overall_rating, games_hosted, games_attended")
        .in("id", uniqueUserIds);

      if (profilesError) throw profilesError;

      // Map profiles to friendships
      const friendsWithProfiles = friendshipsData?.map((friendship) => ({
        ...friendship,
        requester: profilesData?.find((p) => p.id === friendship.requester_id),
        addressee: profilesData?.find((p) => p.id === friendship.addressee_id),
      })) || [];

      setFriends(friendsWithProfiles as Friendship[]);
    } catch (error: any) {
      toast({
        title: "Error fetching friends",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: requestsData, error: requestsError } = await supabase
        .from("friendships")
        .select("*")
        .eq("addressee_id", user.id)
        .eq("status", "PENDING");

      if (requestsError) throw requestsError;

      // Get requester profiles
      const requesterIds = requestsData?.map((r) => r.requester_id) || [];

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, first_name, last_name, profile_photo, overall_rating, games_hosted, games_attended")
        .in("id", requesterIds);

      if (profilesError) throw profilesError;

      const requestsWithProfiles = requestsData?.map((request) => ({
        ...request,
        requester: profilesData?.find((p) => p.id === request.requester_id),
      })) || [];

      setPendingRequests(requestsWithProfiles as Friendship[]);
    } catch (error: any) {
      toast({
        title: "Error fetching pending requests",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchSentRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: requestsData, error: requestsError } = await supabase
        .from("friendships")
        .select("*")
        .eq("requester_id", user.id)
        .eq("status", "PENDING");

      if (requestsError) throw requestsError;

      // Get addressee profiles
      const addresseeIds = requestsData?.map((r) => r.addressee_id) || [];

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, first_name, last_name, profile_photo, overall_rating, games_hosted, games_attended")
        .in("id", addresseeIds);

      if (profilesError) throw profilesError;

      const requestsWithProfiles = requestsData?.map((request) => ({
        ...request,
        addressee: profilesData?.find((p) => p.id === request.addressee_id),
      })) || [];

      setSentRequests(requestsWithProfiles as Friendship[]);
    } catch (error: any) {
      toast({
        title: "Error fetching sent requests",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sendFriendRequest = async (addresseeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("friendships")
        .insert({
          requester_id: user.id,
          addressee_id: addresseeId,
          status: "PENDING",
        });

      if (error) {
        // Check if it's a duplicate key error
        if (error.code === '23505' || error.message.includes('unique_friendship')) {
          // Silent fail for duplicate - request already exists
          console.log("Friend request already exists");
          return;
        }
        throw error;
      }

      toast({
        title: "Friend request sent",
        description: "Your friend request has been sent successfully.",
      });

      fetchSentRequests();
    } catch (error: any) {
      toast({
        title: "Error sending friend request",
        description: error.message,
        variant: "destructive",
      });
      throw error; // Re-throw to allow caller to handle
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from("friendships")
        .update({ status: "ACCEPTED" })
        .eq("id", friendshipId);

      if (error) throw error;

      toast({
        title: "Friend request accepted",
        description: "You are now friends!",
      });

      fetchFriends();
      fetchPendingRequests();
    } catch (error: any) {
      toast({
        title: "Error accepting friend request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const declineFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", friendshipId);

      if (error) throw error;

      toast({
        title: "Friend request declined",
      });

      fetchPendingRequests();
    } catch (error: any) {
      toast({
        title: "Error declining friend request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", friendshipId);

      if (error) throw error;

      toast({
        title: "Friend removed",
      });

      fetchFriends();
    } catch (error: any) {
      toast({
        title: "Error removing friend",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cancelRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", friendshipId);

      if (error) throw error;

      toast({
        title: "Friend request cancelled",
      });

      fetchSentRequests();
    } catch (error: any) {
      toast({
        title: "Error cancelling request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const checkFriendshipStatus = async (userId: string): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("friendships")
        .select("status, requester_id, addressee_id")
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${user.id})`)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;
      
      if (data.status === "ACCEPTED") return "FRIENDS";
      if (data.requester_id === user.id) return "SENT";
      return "RECEIVED";
    } catch (error: any) {
      console.error("Error checking friendship status:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchFriends(),
        fetchPendingRequests(),
        fetchSentRequests(),
      ]);
      setLoading(false);
    };

    loadData();

    // Set up realtime subscription
    const channel = supabase
      .channel("friendships-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friendships",
        },
        () => {
          fetchFriends();
          fetchPendingRequests();
          fetchSentRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    friends,
    pendingRequests,
    sentRequests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    cancelRequest,
    checkFriendshipStatus,
    refreshFriends: fetchFriends,
  };
};
