import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LeaderboardEntry {
  id: string;
  first_name: string;
  last_name: string;
  overall_rating: number;
  total_reviews: number;
  games_hosted: number;
  games_attended: number;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchLeaderboard();
  }, [user]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, overall_rating, total_reviews, games_hosted, games_attended")
      .gt("total_reviews", 0)
      .order("overall_rating", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching leaderboard:", error);
    } else {
      setLeaders(data || []);
    }
    setLoading(false);
  };

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-amber-600";
    return "text-gray-600";
  };

  const getMedalBg = (rank: number) => {
    if (rank === 1) return "bg-yellow-50 border-yellow-200";
    if (rank === 2) return "bg-gray-50 border-gray-200";
    if (rank === 3) return "bg-amber-50 border-amber-200";
    return "bg-white border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-gray-600">Top rated players in the community</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading leaderboard...</p>
          </div>
        ) : leaders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No rated players yet. Be the first to play and get reviewed!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, index) => {
              const rank = index + 1;
              return (
                <Card key={leader.id} className={`${getMedalBg(rank)} border-2`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className={`text-3xl font-bold ${getMedalColor(rank)} w-12 text-center`}>
                        {rank <= 3 ? (
                          <Trophy className="w-10 h-10 mx-auto" />
                        ) : (
                          rank
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {leader.first_name} {leader.last_name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {leader.overall_rating.toFixed(2)}
                          </span>
                          <span>•</span>
                          <span>{leader.total_reviews} reviews</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">{leader.games_hosted}</div>
                          <div className="text-xs text-gray-600">Hosted</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-600">{leader.games_attended}</div>
                          <div className="text-xs text-gray-600">Attended</div>
                        </div>
                      </div>

                      {/* Badge for current user */}
                      {user && leader.id === user.id && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                          You
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              How Rankings Work
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-2">
            <p>• Players are ranked by their overall rating (out of 5.0)</p>
            <p>• Ratings are based on reviews from other players after games</p>
            <p>• Attend and host more games to improve your ranking</p>
            <p>• Only players with at least one review appear on the leaderboard</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
