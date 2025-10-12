import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  content: string;
  sport: string | null;
  game_id: string | null;
  upvotes: number;
  downvotes: number;
  created_at: string;
  user_id: string;
  profiles: {
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
    first_name: string;
    last_name: string;
  };
}

const sports = [
  "All Sports", "Basketball", "Soccer", "Tennis", "Volleyball", "Football", 
  "Baseball", "Pickleball", "Ultimate Frisbee", "Running", 
  "Cycling", "Badminton", "Golf"
];

export default function Community() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [newPost, setNewPost] = useState({ title: "", content: "", sport: "" });
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchPosts();
    fetchUserVotes();
  }, [user]);

  useEffect(() => {
    if (selectedSport === "All Sports") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.sport === selectedSport));
    }
  }, [selectedSport, posts]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles (first_name, last_name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }
  };

  const fetchUserVotes = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("post_votes")
      .select("post_id, vote_type")
      .eq("user_id", user.id);

    if (data) {
      const votesMap: Record<string, string> = {};
      data.forEach(vote => {
        votesMap[vote.post_id] = vote.vote_type;
      });
      setUserVotes(votesMap);
    }
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        profiles (first_name, last_name)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(prev => ({ ...prev, [postId]: data || [] }));
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.title || !newPost.content) {
      toast({
        title: "Missing fields",
        description: "Please fill in title and content.",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      title: newPost.title,
      content: newPost.content,
      sport: newPost.sport || null
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive"
      });
    } else {
      toast({ title: "Post created!" });
      setNewPost({ title: "", content: "", sport: "" });
      setShowNewPost(false);
      fetchPosts();
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
    fetchPosts();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
          <p className="text-gray-600">Connect with players and discuss games</p>
        </div>

        {/* Filter and Create Post */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex gap-4 items-center flex-wrap">
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sports.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setShowNewPost(!showNewPost)}>
              {showNewPost ? "Cancel" : "New Post"}
            </Button>
          </div>

          {showNewPost && (
            <div className="mt-4 space-y-3">
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
              <Select value={newPost.sport} onValueChange={(val) => setNewPost(prev => ({ ...prev, sport: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sport (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {sports.filter(s => s !== "All Sports").map(sport => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreatePost}>Post</Button>
            </div>
          )}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      by {post.profiles.first_name} {post.profiles.last_name} • {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {post.sport && <Badge>{post.sport}</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{post.content}</p>

                {/* Vote buttons */}
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

                {/* Comments section */}
                {selectedPost === post.id && (
                  <div className="mt-4 space-y-3">
                    {comments[post.id]?.map(comment => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded">
                        <p className="text-sm font-semibold">
                          {comment.profiles.first_name} {comment.profiles.last_name}
                        </p>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
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
      </div>
    </div>
  );
}
