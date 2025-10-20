import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThumbsUp, ThumbsDown, MessageSquare, Send, Users, Plus, ArrowLeft, Filter, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

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
  const { user } = useAuth();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchCommunities();
  }, [user]);

  useEffect(() => {
    if (selectedCommunity) {
      fetchPosts(selectedCommunity.id);
      checkMembership(selectedCommunity.id);
      fetchUserVotes();
      fetchCommunityMembers(selectedCommunity.id);
    }
  }, [selectedCommunity]);

  const fetchCommunities = async () => {
    const { data, error } = await supabase
      .from("communities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching communities:", error);
    } else {
      setCommunities(data || []);
      setFilteredCommunities(data || []);
    }
  };

  useEffect(() => {
    if (sportFilter === "ALL") {
      setFilteredCommunities(communities);
    } else {
      setFilteredCommunities(communities.filter(c => c.sport === sportFilter));
    }
  }, [sportFilter, communities]);

  const fetchPosts = async (communityId: string) => {
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
      
      const postsWithProfiles = postsData.map(post => ({
        ...post,
        profiles: profilesMap.get(post.user_id) || { username: null, first_name: "Unknown", last_name: "User" }
      }));

      setPosts(postsWithProfiles as Post[]);
    } else {
      setPosts([]);
    }
  };

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

  const fetchComments = async (postId: string) => {
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

    fetchUserVotes();
    if (selectedCommunity) {
      fetchPosts(selectedCommunity.id);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !newComment.trim()) return;

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      content: newComment
    });

    if (error) {
      toast({ title: "Error", description: "Failed to add comment.", variant: "destructive" });
    } else {
      setNewComment("");
      fetchComments(postId);
    }
  };

  const toggleComments = (postId: string) => {
    if (selectedPost === postId) {
      setSelectedPost(null);
    } else {
      setSelectedPost(postId);
      if (!comments[postId]) {
        fetchComments(postId);
      }
    }
  };

  const handleViewCommunity = (community: Community) => {
    setSelectedCommunity(community);
    setViewMode("posts");
  };

  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
    setViewMode("list");
    setShowNewPost(false);
    setShowMembersPanel(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      <div className="pt-20 px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          {viewMode === "list" ? (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Communities</h1>
                <p className="text-gray-600">Join communities and connect with players</p>
              </div>
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <Select value={sportFilter} onValueChange={setSportFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Sports</SelectItem>
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
                </div>
                <Button onClick={() => setShowNewCommunity(!showNewCommunity)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {showNewCommunity ? "Cancel" : "Create Community"}
                </Button>
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
                          <CardTitle className="text-lg">{community.name}</CardTitle>
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
                        <div className="flex items-center text-sm text-gray-600">
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

              <Card className="bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{selectedCommunity?.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {selectedCommunity?.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {selectedCommunity?.member_count} members
                        </div>
                        {selectedCommunity?.sport && (
                          <Badge variant="default">
                            {selectedCommunity.sport.replace(/_/g, ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Sheet open={showMembersPanel} onOpenChange={setShowMembersPanel}>
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
                              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div>
                                  <p className="font-medium">
                                    {getDisplayName(member.profiles, member.user_id)}
                                  </p>
                                  <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
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
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-700">
                      Join this community to view and create posts
                    </p>
                  </CardContent>
                </Card>
              )}

              {isMember && posts.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-600">
                      No posts yet. Be the first to post!
                    </p>
                  </CardContent>
                </Card>
              )}

              {isMember && posts.map(post => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      by {getDisplayName(post.profiles, post.user_id)} • {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{post.content}</p>

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
                      <Button variant="ghost" size="sm" onClick={() => toggleComments(post.id)}>
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Comments
                      </Button>
                    </div>

                    {selectedPost === post.id && (
                      <div className="mt-4 space-y-3">
                        {comments[post.id]?.map(comment => (
                          <div key={comment.id} className="bg-gray-50 p-3 rounded relative group">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-semibold">
                                  {getDisplayName(comment.profiles, comment.user_id)}
                                </p>
                                <p className="text-sm text-gray-700">{comment.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
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
    </div>
  );
}