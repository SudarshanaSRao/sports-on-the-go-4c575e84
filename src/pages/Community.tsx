import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEO } from "@/components/SEO";
import { ThumbsUp, ThumbsDown, MessageSquare, Send, Users, Plus, ArrowLeft, Filter, Trash2, Search, Calendar } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { getAllSportsDbValues, toDisplaySportName } from "@/utils/sportsUtils";
import { format } from "date-fns";

interface Community {
  id: string;
  name: string;
  description: string;
  type: string;
  sport: string | null;
  member_count: number;
  created_at: string;
  game_id: string | null;
  created_by: string;
  visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'INVITE_ONLY';
  archived: boolean;
  archived_at: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  user_id: string;
  community_id: string;
  unreadCount?: number;
  profiles: {
    username: string | null;
    first_name: string;
    last_name: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_flagged?: boolean;
  flag_reason?: string;
  profiles: {
    username: string | null;
    first_name: string;
    last_name: string;
  };
}

interface CommunityMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    username: string | null;
    first_name: string;
    last_name: string;
  };
}

export default function Community() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [showNewCommunity, setShowNewCommunity] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "", sport: "" });
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<"list" | "posts">("list");
  const [sportFilter, setSportFilter] = useState<string>("ALL");
  const [showMembersPanel, setShowMembersPanel] = useState(false);
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [communitySearchQuery, setCommunitySearchQuery] = useState("");
  const [editingVisibility, setEditingVisibility] = useState(false);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);
  const postRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [selectedVisibility, setSelectedVisibility] = useState<'PUBLIC' | 'FRIENDS_ONLY' | 'INVITE_ONLY'>('PUBLIC');
  const [showArchived, setShowArchived] = useState(false);
  const [showReviveDialog, setShowReviveDialog] = useState(false);
  const [gameData, setGameData] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      fetchCommunities();
    }
  }, [user, loading]);

  useEffect(() => {
    if (selectedCommunity) {
      fetchPosts(selectedCommunity.id);
      checkMembership(selectedCommunity.id);
      fetchUserVotes();
      fetchCommunityMembers(selectedCommunity.id);
      setSelectedVisibility(selectedCommunity.visibility);
    }
  }, [selectedCommunity]);

  // Restore community view from URL on page load
  useEffect(() => {
    const communityId = searchParams.get('communityId');
    
    // Only restore if we have URL param and no community is already selected
    if (communityId && communities.length > 0 && !selectedCommunity) {
      const community = communities.find(c => c.id === communityId);
      
      if (community) {
        setSelectedCommunity(community);
        setViewMode("posts");
      }
    }
  }, [searchParams, communities, selectedCommunity]);

  // Auto-scroll and highlight post when postId is in URL
  useEffect(() => {
    const postId = searchParams.get('postId');
    if (postId && posts.length > 0) {
      const postRef = postRefs.current.get(postId);
      if (postRef) {
        // Scroll to the post with smooth behavior
        setTimeout(() => {
          postRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedPostId(postId);
          
          // Open comments for the post
          setSelectedPost(postId);
          
          // Remove highlight after 3 seconds
          setTimeout(() => {
            setHighlightedPostId(null);
          }, 3000);
        }, 300); // Small delay to ensure DOM is ready
      }
    }
  }, [posts, searchParams]);

  const fetchCommunities = useCallback(async () => {
    const { data, error } = await supabase
      .from("communities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching communities:", error);
    } else {
      setCommunities((data || []) as Community[]);
      setFilteredCommunities((data || []) as Community[]);
    }
  }, []);

  const fetchPosts = useCallback(async (communityId: string) => {
    if (!user) return;

    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("community_id", communityId)
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error("Error fetching posts:", postsError);
      return;
    }

    // Fetch profiles separately
    if (postsData && postsData.length > 0) {
      const userIds = [...new Set(postsData.map(p => p.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, first_name, last_name")
        .in("id", userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      // Fetch unread counts for each post
      const postIds = postsData.map(p => p.id);
      
      // Get user's last view times for these posts
      const { data: viewData } = await supabase
        .from("post_views")
        .select("post_id, last_viewed_at")
        .eq("user_id", user.id)
        .in("post_id", postIds);

      const viewMap = new Map(viewData?.map(v => [v.post_id, v.last_viewed_at]) || []);

      // Count unread comments for each post
      const unreadCountsMap = new Map<string, number>();
      
      for (const post of postsData) {
        const lastViewed = viewMap.get(post.id);
        
        if (lastViewed) {
          // Count comments created after last view
          const { count } = await supabase
            .from("comments")
            .select("*", { count: 'exact', head: true })
            .eq("post_id", post.id)
            .gt("created_at", lastViewed);
          
          unreadCountsMap.set(post.id, count || 0);
        } else {
          // Never viewed - count all comments
          const { count } = await supabase
            .from("comments")
            .select("*", { count: 'exact', head: true })
            .eq("post_id", post.id);
          
          unreadCountsMap.set(post.id, count || 0);
        }
      }
      
      const postsWithProfiles = postsData.map(post => ({
        ...post,
        profiles: profilesMap.get(post.user_id) || { username: null, first_name: "Unknown", last_name: "User" },
        unreadCount: unreadCountsMap.get(post.id) || 0
      }));

      setPosts(postsWithProfiles as Post[]);
    } else {
      setPosts([]);
    }
  }, [user]);

  const fetchComments = useCallback(async (postId: string) => {
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      return;
    }

    // Fetch profiles separately
    if (commentsData && commentsData.length > 0) {
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, first_name, last_name")
        .in("id", userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      const commentsWithProfiles = commentsData.map(comment => ({
        ...comment,
        profiles: profilesMap.get(comment.user_id) || { username: null, first_name: "Unknown", last_name: "User" }
      }));

      setComments(prev => ({ ...prev, [postId]: commentsWithProfiles as Comment[] }));
    } else {
      setComments(prev => ({ ...prev, [postId]: [] }));
    }
  }, []);

  // Real-time subscription for new posts in the selected community
  useEffect(() => {
    if (!selectedCommunity || !user) return;

    const channel = supabase
      .channel(`community-posts-${selectedCommunity.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: `community_id=eq.${selectedCommunity.id}`
        },
        async (payload) => {
          // Don't show notification for user's own posts
          if (payload.new.user_id === user.id) return;

          // Fetch the author's profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, first_name, last_name')
            .eq('id', payload.new.user_id)
            .maybeSingle();

          const authorName = profile?.username || 
                            `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() ||
                            'Someone';

          // Create notification for community members
          // Server-side triggers now create notifications for members. Only show local toast.


          toast({
            title: "New post in community",
            description: `${authorName} posted: "${payload.new.title}"`,
          });

          // Refresh posts list to show the new post
          if (selectedCommunity) {
            fetchPosts(selectedCommunity.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCommunity, user, toast, fetchPosts]);

  // Real-time subscription for new comments on the selected post
  useEffect(() => {
    if (!selectedPost || !user) return;

    const channel = supabase
      .channel(`post-comments-${selectedPost}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${selectedPost}`
        },
        async (payload) => {
          // Don't show notification for user's own comments
          if (payload.new.user_id === user.id) return;

          // Fetch the author's profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, first_name, last_name')
            .eq('id', payload.new.user_id)
            .maybeSingle();

          const authorName = profile?.username || 
                            `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() ||
                            'Someone';

          // Find the post title for context
          const post = posts.find(p => p.id === selectedPost);
          const postTitle = post?.title || 'a post';

          // Create notification for post author and other commenters
          const usersToNotify = new Set<string>();
          
          // Add post author
          if (post && post.user_id !== payload.new.user_id) {
            usersToNotify.add(post.user_id);
          }

          // Add other commenters
          const postComments = comments[selectedPost] || [];
          postComments.forEach(comment => {
            if (comment.user_id !== payload.new.user_id && comment.user_id !== user.id) {
              usersToNotify.add(comment.user_id);
            }
          });

          // Server-side triggers now create notifications for post author and commenters.


          toast({
            title: "New comment",
            description: `${authorName} replied to "${postTitle}"`,
          });

          // Refresh comments for this post
          fetchComments(selectedPost);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedPost, user, toast, posts, fetchComments, comments, selectedCommunity]);

  // Real-time subscription for ALL comments in the community to update unread counts
  useEffect(() => {
    if (!selectedCommunity || !user || !posts.length) return;

    const postIds = posts.map(p => p.id);

    const channel = supabase
      .channel(`community-all-comments-${selectedCommunity.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments'
        },
        async (payload) => {
          const commentPostId = payload.new.post_id;
          
          // Only process if it's for a post in this community and not the user's own comment
          if (!postIds.includes(commentPostId) || payload.new.user_id === user.id) return;
          
          // If the post is NOT currently being viewed, increment unread count
          if (selectedPost !== commentPostId) {
            setPosts(prevPosts =>
              prevPosts.map(p =>
                p.id === commentPostId
                  ? { ...p, unreadCount: (p.unreadCount || 0) + 1 }
                  : p
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCommunity, user, posts, selectedPost]);

  useEffect(() => {
    let filtered = communities;
    
    // Filter by archived status
    filtered = filtered.filter(c => c.archived === showArchived);
    
    // Filter by sport
    if (sportFilter !== "ALL") {
      filtered = filtered.filter(c => c.sport === sportFilter);
    }
    
    // Filter by search query
    if (communitySearchQuery.trim()) {
      const query = communitySearchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredCommunities(filtered);
  }, [sportFilter, communitySearchQuery, communities, showArchived]);

  const checkMembership = async (communityId: string) => {
    if (!user) return;
    
    const { data } = await supabase
      .from("community_members")
      .select("id, role")
      .eq("community_id", communityId)
      .eq("user_id", user.id)
      .maybeSingle();

    setIsMember(!!data);
    setIsAdmin(data?.role === 'admin');
  };

  // Helper to display a sensible member name
  const getDisplayName = (
    p: { username?: string | null; first_name?: string; last_name?: string } = {},
    userId?: string
  ) => {
    const uname = (p?.username || "").trim();
    if (uname) return uname;
    const first = (p?.first_name || "").trim();
    const last = (p?.last_name || "").trim();
    const full = [first, last].filter(Boolean).join(" ");
    if (full) return full;
    if (userId) return `User-${userId.slice(0, 6)}`;
    return "Member";
  };

  const fetchUserVotes = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("post_votes")
      .select("post_id, vote_type")
      .eq("user_id", user.id);

    if (data) {
      const votesMap: Record<string, string> = {};
      data.forEach((vote: any) => {
        votesMap[vote.post_id] = vote.vote_type;
      });
      setUserVotes(votesMap);
    }
  };

  const handleCreateCommunity = async () => {
    if (!user || !newCommunity.name || !newCommunity.sport) {
      toast({
        title: "Missing fields",
        description: "Please fill in the community name and sport.",
        variant: "destructive"
      });
      return;
    }

    const { data: communityData, error } = await supabase
      .from("communities")
      .insert({
        name: newCommunity.name,
        description: newCommunity.description,
        created_by: user.id,
        type: 'general',
        sport: newCommunity.sport as any
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create community.",
        variant: "destructive"
      });
    } else {
      // Add creator as admin
      await supabase
        .from("community_members")
        .insert({
          community_id: communityData.id,
          user_id: user.id,
          role: 'admin'
        });

      toast({ title: "Community created!" });
      setNewCommunity({ name: "", description: "", sport: "" });
      setShowNewCommunity(false);
      fetchCommunities();
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("community_members")
      .insert({
        community_id: communityId,
        user_id: user.id,
        role: 'member'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to join community.",
        variant: "destructive"
      });
    } else {
      toast({ title: "Joined community!" });
      checkMembership(communityId);
    }
  };

  const handleLeaveCommunity = async (communityId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("community_id", communityId)
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to leave community.",
        variant: "destructive"
      });
    } else {
      toast({ title: "Left community!" });
      checkMembership(communityId);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.title || !newPost.content || !selectedCommunity) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and content.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      community_id: selectedCommunity.id,
      title: newPost.title,
      content: newPost.content
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive"
      });
    } else {
      toast({ title: "Post created!" });
      setNewPost({ title: "", content: "" });
      setShowNewPost(false);
      fetchPosts(selectedCommunity.id);
    }
  };

  const handleVote = async (postId: string, voteType: "up" | "down") => {
    if (!user) return;

    const currentVote = userVotes[postId];
    
    // Optimistically update the UI immediately
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        
        let newUpvotes = post.upvotes;
        let newDownvotes = post.downvotes;
        
        if (currentVote === voteType) {
          // Removing vote
          if (voteType === "up") {
            newUpvotes = Math.max(0, newUpvotes - 1);
          } else {
            newDownvotes = Math.max(0, newDownvotes - 1);
          }
        } else if (currentVote) {
          // Changing vote
          if (currentVote === "up") {
            newUpvotes = Math.max(0, newUpvotes - 1);
            newDownvotes = newDownvotes + 1;
          } else {
            newDownvotes = Math.max(0, newDownvotes - 1);
            newUpvotes = newUpvotes + 1;
          }
        } else {
          // Adding new vote
          if (voteType === "up") {
            newUpvotes = newUpvotes + 1;
          } else {
            newDownvotes = newDownvotes + 1;
          }
        }
        
        return { ...post, upvotes: newUpvotes, downvotes: newDownvotes };
      })
    );
    
    // Update userVotes state optimistically
    setUserVotes(prev => {
      const newVotes = { ...prev };
      if (currentVote === voteType) {
        delete newVotes[postId];
      } else {
        newVotes[postId] = voteType;
      }
      return newVotes;
    });

    // Perform database operation
    try {
      if (currentVote === voteType) {
        // Remove vote
        await supabase.from("post_votes").delete().match({ post_id: postId, user_id: user.id });
      } else if (currentVote) {
        // Update vote
        await supabase.from("post_votes").update({ vote_type: voteType }).match({ post_id: postId, user_id: user.id });
      } else {
        // Create vote
        await supabase.from("post_votes").insert({ post_id: postId, user_id: user.id, vote_type: voteType });
      }
      
      // Refetch in background to ensure consistency
      setTimeout(() => {
        fetchUserVotes();
        if (selectedCommunity) {
          fetchPosts(selectedCommunity.id);
        }
      }, 500);
    } catch (error) {
      console.error("Error voting:", error);
      // Revert optimistic update on error
      fetchUserVotes();
      if (selectedCommunity) {
        fetchPosts(selectedCommunity.id);
      }
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !newComment.trim()) return;

    // Moderate content first
    try {
      const { data: moderationData, error: moderationError } = await supabase.functions.invoke('moderate-content', {
        body: { content: newComment }
      });

      if (moderationError) {
        console.error("Moderation error:", moderationError);
        // Continue with adding comment if moderation fails
      }

      // Block the comment if flagged
      if (moderationData?.isFlagged) {
        toast({
          title: "⚠️ Comment Blocked",
          description: `Your comment was blocked: ${moderationData.reason}. Please keep the conversation respectful.`,
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user.id,
        content: newComment
      });

      if (error) {
        toast({ title: "Error", description: "Failed to add comment.", variant: "destructive" });
      } else {
        setNewComment("");
        toast({ title: "Comment added successfully!" });
        fetchComments(postId);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({ title: "Error", description: "Failed to add comment.", variant: "destructive" });
    }
  };

  const markPostAsViewed = async (postId: string) => {
    if (!user) return;

    try {
      // Upsert: update if exists, insert if not
      const { error } = await supabase
        .from("post_views")
        .upsert(
          {
            post_id: postId,
            user_id: user.id,
            last_viewed_at: new Date().toISOString()
          },
          {
            onConflict: 'post_id,user_id'
          }
        );

      if (error) {
        console.error("Error marking post as viewed:", error);
      }

      // Update the unread count in the local state
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === postId ? { ...p, unreadCount: 0 } : p
        )
      );
    } catch (error) {
      console.error("Error marking post as viewed:", error);
    }
  };

  const toggleComments = (postId: string) => {
    if (selectedPost === postId) {
      setSelectedPost(null);
    } else {
      setSelectedPost(postId);
      markPostAsViewed(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };

  const handleViewCommunity = async (community: Community) => {
    setSelectedCommunity(community);
    setViewMode("posts");
    const params = new URLSearchParams(searchParams);
    params.set('communityId', community.id);
    setSearchParams(params);
    
    // If community is archived and has a game_id, fetch game data and show revive dialog
    if (community.archived && community.game_id) {
      const { data: game, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", community.game_id)
        .maybeSingle();
      
      if (game && !error) {
        setGameData(game);
        setShowReviveDialog(true);
      }
    }
  };
  
  const handleReviveCommunity = () => {
    if (!selectedCommunity || !gameData) return;
    
    // Navigate to host game page with pre-filled data from the archived game
    const params = new URLSearchParams({
      sport: gameData.sport,
      location: gameData.location_name,
      address: gameData.address,
      city: gameData.city,
      description: gameData.description || '',
      communityId: selectedCommunity.id
    });
    
    navigate(`/host-game?${params.toString()}`);
    setShowReviveDialog(false);
  };

  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
    setViewMode("list");
    setShowNewPost(false);
    setShowMembersPanel(false);
    const params = new URLSearchParams(searchParams);
    params.delete('communityId');
    setSearchParams(params);
  };

  const fetchCommunityMembers = async (communityId: string) => {
    const { data: membersData, error } = await supabase
      .from("community_members")
      .select("*")
      .eq("community_id", communityId)
      .order("joined_at", { ascending: false });

    if (error) {
      console.error("Error fetching members:", error);
      return;
    }

    if (membersData && membersData.length > 0) {
      const userIds = [...new Set(membersData.map(m => m.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, first_name, last_name")
        .in("id", userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      const membersWithProfiles = membersData.map(member => ({
        ...member,
        profiles: profilesMap.get(member.user_id) || { username: null, first_name: "Unknown", last_name: "User" }
      }));

      setCommunityMembers(membersWithProfiles as CommunityMember[]);
    }
  };

  const handleDeleteCommunity = async () => {
    if (!selectedCommunity || !user) return;

    if (selectedCommunity.created_by !== user.id) {
      toast({
        title: "Permission denied",
        description: "Only the community owner can delete the community.",
        variant: "destructive"
      });
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${selectedCommunity.name}"? This action cannot be undone.`);
    
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("communities")
      .delete()
      .eq("id", selectedCommunity.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete community.",
        variant: "destructive"
      });
    } else {
      toast({ title: "Community deleted successfully!" });
      handleBackToCommunities();
      fetchCommunities();
    }
  };

  const handleKickMember = async (memberId: string, memberUserId: string) => {
    if (!user || !isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only admins can kick members.",
        variant: "destructive"
      });
      return;
    }

    // Prevent kicking yourself
    if (memberUserId === user.id) {
      toast({
        title: "Cannot kick yourself",
        description: "You cannot remove yourself as an admin.",
        variant: "destructive"
      });
      return;
    }

    const confirmKick = window.confirm("Are you sure you want to kick this member?");
    if (!confirmKick) return;

    const { error } = await supabase
      .from("community_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to kick member.",
        variant: "destructive"
      });
    } else {
      toast({ title: "Member kicked successfully!" });
      if (selectedCommunity) {
        fetchCommunityMembers(selectedCommunity.id);
      }
    }
  };

  const handleDeleteComment = async (commentId: string, commentUserId: string, postId: string) => {
    if (!user) return;

    // Allow deletion if user is comment owner or community admin
    if (commentUserId !== user.id && !isAdmin) {
      toast({
        title: "Permission denied",
        description: "You can only delete your own comments or be an admin.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive"
      });
    } else {
      toast({ title: "Comment deleted!" });
      fetchComments(postId);
    }
  };

  const handleUpdateVisibility = async () => {
    if (!selectedCommunity || !isAdmin) return;

    const { error } = await supabase
      .from("communities")
      .update({ visibility: selectedVisibility })
      .eq("id", selectedCommunity.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility.",
        variant: "destructive"
      });
    } else {
      toast({ title: "Community visibility updated!" });
      setEditingVisibility(false);
      setSelectedCommunity({ ...selectedCommunity, visibility: selectedVisibility });
      fetchCommunities();
    }
  };

  return (
    <div className="min-h-screen min-h-screen-mobile bg-background">
      <SEO
        title="Sports Communities & Discussion Forums"
        description="Join sport-specific communities, connect with fellow athletes, share tips and strategies. Participate in discussions about games, training, and local sports events."
        keywords="sports community, athletic forums, sports discussion, basketball community, soccer forum, connect with athletes, sports groups, game communities"
        canonicalUrl="https://squadup.app/community"
      />
      <Navbar />
      <div className="pt-20 px-4 pb-4 safe-bottom">
        <div className="max-w-7xl mx-auto">
          {viewMode === "list" ? (
            <>
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Communities</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Join communities and connect with players</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 flex-1 w-full sm:max-w-2xl">
                  <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Select value={sportFilter} onValueChange={setSportFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] text-sm">
                      <SelectValue placeholder="Filter by sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Sports</SelectItem>
                      {getAllSportsDbValues().map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {toDisplaySportName(sport)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search communities..."
                      value={communitySearchQuery}
                      onChange={(e) => setCommunitySearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={showArchived ? "default" : "outline"}
                    onClick={() => setShowArchived(!showArchived)}
                  >
                    {showArchived ? "Show Active" : "Show Archived"}
                  </Button>
                  <Button onClick={() => setShowNewCommunity(!showNewCommunity)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {showNewCommunity ? "Cancel" : "Create Community"}
                  </Button>
                </div>
              </div>

              {showNewCommunity && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Create New Community</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Community name"
                      value={newCommunity.name}
                      onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Description"
                      value={newCommunity.description}
                      onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                    <Select value={newCommunity.sport} onValueChange={(value) => setNewCommunity(prev => ({ ...prev, sport: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BASKETBALL">Basketball</SelectItem>
                        <SelectItem value="SOCCER">Soccer</SelectItem>
                        <SelectItem value="TENNIS">Tennis</SelectItem>
                        <SelectItem value="VOLLEYBALL">Volleyball</SelectItem>
                        <SelectItem value="FOOTBALL">Football</SelectItem>
                        <SelectItem value="BASEBALL">Baseball</SelectItem>
                        <SelectItem value="CRICKET">Cricket</SelectItem>
                        <SelectItem value="RUGBY">Rugby</SelectItem>
                        <SelectItem value="HOCKEY">Hockey</SelectItem>
                        <SelectItem value="BADMINTON">Badminton</SelectItem>
                        <SelectItem value="TABLE_TENNIS">Table Tennis</SelectItem>
                        <SelectItem value="GOLF">Golf</SelectItem>
                        <SelectItem value="SWIMMING">Swimming</SelectItem>
                        <SelectItem value="RUNNING">Running</SelectItem>
                        <SelectItem value="CYCLING">Cycling</SelectItem>
                        <SelectItem value="GYM">Gym</SelectItem>
                        <SelectItem value="YOGA">Yoga</SelectItem>
                        <SelectItem value="MARTIAL_ARTS">Martial Arts</SelectItem>
                        <SelectItem value="BOXING">Boxing</SelectItem>
                        <SelectItem value="CLIMBING">Climbing</SelectItem>
                        <SelectItem value="SKATING">Skating</SelectItem>
                        <SelectItem value="SKIING">Skiing</SelectItem>
                        <SelectItem value="SURFING">Surfing</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleCreateCommunity}>Create Community</Button>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCommunities.map(community => (
                  <Card key={community.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{community.name}</CardTitle>
                            {community.archived && (
                              <Badge variant="secondary">Archived</Badge>
                            )}
                          </div>
                          <CardDescription className="mt-2 line-clamp-2">
                            {community.description}
                          </CardDescription>
                        </div>
                        {community.sport && (
                          <Badge variant="default">
                            {community.sport.replace(/_/g, ' ')}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-1" />
                          {community.member_count} members
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleViewCommunity(community)}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                className="mb-4"
                onClick={handleBackToCommunities}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Communities
              </Button>

              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl">{selectedCommunity?.name}</CardTitle>
                        {selectedCommunity?.archived && (
                          <Badge variant="secondary">Archived</Badge>
                        )}
                      </div>
                      <CardDescription className="mt-2">
                        {selectedCommunity?.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {selectedCommunity?.member_count} members
                        </div>
                        {selectedCommunity?.sport && (
                          <Badge variant="default">
                            {selectedCommunity.sport.replace(/_/g, ' ')}
                          </Badge>
                        )}
                        {selectedCommunity?.visibility && (
                          <Badge variant={selectedCommunity.visibility === 'PUBLIC' ? 'secondary' : 'outline'}>
                            {selectedCommunity.visibility.replace(/_/g, ' ')}
                          </Badge>
                        )}
                        {isAdmin && !editingVisibility && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingVisibility(true)}
                            className="text-xs h-7"
                          >
                            Change Privacy
                          </Button>
                        )}
                      </div>
                      {isAdmin && editingVisibility && (
                        <div className="flex items-center gap-2 mt-3">
                          <Select value={selectedVisibility} onValueChange={(value: any) => setSelectedVisibility(value)}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PUBLIC">Public</SelectItem>
                              <SelectItem value="FRIENDS_ONLY">Friends Only</SelectItem>
                              <SelectItem value="INVITE_ONLY">Invite Only</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" onClick={handleUpdateVisibility}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setEditingVisibility(false);
                            setSelectedVisibility(selectedCommunity?.visibility || 'PUBLIC');
                          }}>Cancel</Button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Sheet open={showMembersPanel} onOpenChange={(open) => {
                        setShowMembersPanel(open);
                        if (open && selectedCommunity) {
                          fetchCommunityMembers(selectedCommunity.id);
                        }
                      }}>
                        <SheetTrigger asChild>
                          <Button variant="outline">
                            <Users className="w-4 h-4 mr-2" />
                            Members
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Community Members</SheetTitle>
                          </SheetHeader>
                          <div className="mt-6 space-y-3">
                            {communityMembers.map(member => (
                              <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded">
                                <div>
                                  <p className="font-medium text-foreground">
                                    {getDisplayName(member.profiles, member.user_id)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{member.role}</p>
                                </div>
                                {isAdmin && member.user_id !== user?.id && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleKickMember(member.id, member.user_id)}
                                  >
                                    Kick
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </SheetContent>
                      </Sheet>
                      {isMember ? (
                        <>
                          <Button onClick={() => setShowNewPost(!showNewPost)}>
                            {showNewPost ? "Cancel" : "New Post"}
                          </Button>
                          {selectedCommunity?.created_by === user?.id && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={handleDeleteCommunity}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            onClick={() => selectedCommunity && handleLeaveCommunity(selectedCommunity.id)}
                          >
                            Leave
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => selectedCommunity && handleJoinCommunity(selectedCommunity.id)}>
                          Join Community
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {showNewPost && isMember && (
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Post</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Post title"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                      placeholder="What's on your mind?"
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                    />
                    <Button onClick={handleCreatePost}>Post</Button>
                  </CardContent>
                </Card>
              )}

              {!isMember && (
                <Card className="bg-muted border-border">
                  <CardContent className="pt-6">
                    <p className="text-center text-foreground">
                      Join this community to view and create posts
                    </p>
                  </CardContent>
                </Card>
              )}

              {isMember && posts.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No posts yet. Be the first to post!
                    </p>
                  </CardContent>
                </Card>
              )}

              {isMember && posts.map(post => (
                <Card 
                  key={post.id}
                  ref={(el) => {
                    if (el) {
                      postRefs.current.set(post.id, el);
                    } else {
                      postRefs.current.delete(post.id);
                    }
                  }}
                  className={`transition-all duration-300 ${
                    highlightedPostId === post.id 
                      ? 'ring-2 ring-primary shadow-lg bg-accent/20' 
                      : ''
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      by {getDisplayName(post.profiles, post.user_id)} • {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-4">{post.content}</p>

                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(post.id, "up")}
                        className={userVotes[post.id] === "up" ? "text-blue-600" : ""}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {post.upvotes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(post.id, "down")}
                        className={userVotes[post.id] === "down" ? "text-red-600" : ""}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        {post.downvotes}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleComments(post.id)} className="relative">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Comments {comments[post.id]?.length || 0}
                        {post.unreadCount && post.unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="ml-2 h-5 min-w-[20px] px-1.5 text-xs"
                          >
                            {post.unreadCount}
                          </Badge>
                        )}
                      </Button>
                    </div>

                    {selectedPost === post.id && (
                      <div className="mt-4 space-y-3">
                        {comments[post.id]?.map(comment => (
                          <div key={comment.id} className="bg-muted p-3 rounded relative group">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                              <p className="text-sm font-semibold">
                                {getDisplayName(comment.profiles, comment.user_id)}
                              </p>
                              <p className="text-sm text-foreground">{comment.content}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </p>
                              </div>
                              {(comment.user_id === user?.id || isAdmin) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteComment(comment.id, comment.user_id, post.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <Button size="sm" onClick={() => handleAddComment(post.id)}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Revive Community Dialog */}
      <AlertDialog open={showReviveDialog} onOpenChange={setShowReviveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archived Community</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This community is archived because the associated game has ended.
              </p>
              {gameData && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Original Game Date:</span>
                    <span>{format(new Date(gameData.game_date), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Time:</span> {gameData.start_time}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Location:</span> {gameData.location_name}
                  </div>
                </div>
              )}
              <p className="text-foreground">
                Would you like to create a new game to revive this community? This will help bring the community back to life with a fresh game session.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Viewing</AlertDialogCancel>
            <AlertDialogAction onClick={handleReviveCommunity}>
              Create New Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}