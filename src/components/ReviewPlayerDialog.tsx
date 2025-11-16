import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Star, ThumbsUp, Target, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReviewPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  revieweeId: string;
  revieweeName: string;
  reviewerId: string;
  onReviewSubmitted: () => void;
}

export function ReviewPlayerDialog({
  isOpen,
  onClose,
  gameId,
  revieweeId,
  revieweeName,
  reviewerId,
  onReviewSubmitted,
}: ReviewPlayerDialogProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [ratings, setRatings] = useState({
    showed_up_on_time: 5,
    skill_accurate: 5,
    good_sportsmanship: 5,
    would_play_again: 5,
  });
  const [comment, setComment] = useState("");

  const handleSubmitClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmDialog(false);
    setSubmitting(true);
    try {
      // Ensure reviewer is marked as attended for this game (required by backend policy)
      const { data: rsvp, error: rsvpFetchError } = await supabase
        .from("rsvps")
        .select("id, attended")
        .eq("game_id", gameId)
        .eq("user_id", reviewerId)
        .maybeSingle();

      if (rsvpFetchError) {
        console.error("Error fetching RSVP:", rsvpFetchError);
      }

      if (!rsvp) {
        toast({
          title: "Cannot submit review",
          description:
            "You need to be marked as attended for this game before submitting a review.",
          variant: "destructive",
        });
        return;
      }

      if (rsvp && !rsvp.attended) {
        const { error: rsvpUpdateError } = await supabase
          .from("rsvps")
          .update({ attended: true })
          .eq("id", rsvp.id);
        if (rsvpUpdateError) {
          throw rsvpUpdateError;
        }
      }

      // Insert review (overall_rating may be computed later/elsewhere)
      const { error: reviewError } = await supabase.from("reviews").insert({
        game_id: gameId,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        showed_up_on_time: ratings.showed_up_on_time,
        skill_accurate: ratings.skill_accurate,
        good_sportsmanship: ratings.good_sportsmanship,
        would_play_again: ratings.would_play_again,
        comment: comment.trim() || null,
        is_anonymous: false,
      });

      if (reviewError) throw reviewError;

      // Update reviewee's profile stats
      const { data: allReviews, error: fetchReviewsError } = await supabase
        .from("reviews")
        .select("overall_rating")
        .eq("reviewee_id", revieweeId);

      if (fetchReviewsError) {
        console.error("Error fetching reviews:", fetchReviewsError);
      }

      if (allReviews && allReviews.length > 0) {
        const avgRating =
          allReviews.reduce((sum, r) => sum + Number(r.overall_rating), 0) /
          allReviews.length;

        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({
            overall_rating: avgRating,
            total_reviews: allReviews.length,
          })
          .eq("id", revieweeId);

        if (profileUpdateError) {
          console.error("Error updating profile:", profileUpdateError);
        }
      }

      toast({
        title: "Review submitted!",
        description: `Your review for ${revieweeName} has been submitted.`,
      });

      onReviewSubmitted();
      onClose();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error submitting review",
        description: error.message ?? "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Review {revieweeName}</DialogTitle>
          <DialogDescription>
            Share your experience playing with {revieweeName}. Your feedback helps build
            a better community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Showed Up On Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <Label className="text-base font-semibold">
                Showed Up On Time
              </Label>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[ratings.showed_up_on_time]}
                onValueChange={(value) =>
                  setRatings({ ...ratings, showed_up_on_time: value[0] })
                }
                min={1}
                max={5}
                step={1}
                className="flex-1"
              />
              <div className="flex items-center gap-1 min-w-[80px]">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{ratings.showed_up_on_time}/5</span>
              </div>
            </div>
          </div>

          {/* Skill Accurate */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <Label className="text-base font-semibold">
                Skill Level Accurate
              </Label>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[ratings.skill_accurate]}
                onValueChange={(value) =>
                  setRatings({ ...ratings, skill_accurate: value[0] })
                }
                min={1}
                max={5}
                step={1}
                className="flex-1"
              />
              <div className="flex items-center gap-1 min-w-[80px]">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{ratings.skill_accurate}/5</span>
              </div>
            </div>
          </div>

          {/* Good Sportsmanship */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-primary" />
              <Label className="text-base font-semibold">
                Good Sportsmanship
              </Label>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[ratings.good_sportsmanship]}
                onValueChange={(value) =>
                  setRatings({ ...ratings, good_sportsmanship: value[0] })
                }
                min={1}
                max={5}
                step={1}
                className="flex-1"
              />
              <div className="flex items-center gap-1 min-w-[80px]">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{ratings.good_sportsmanship}/5</span>
              </div>
            </div>
          </div>

          {/* Would Play Again */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <Label className="text-base font-semibold">
                Would Play Again
              </Label>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[ratings.would_play_again]}
                onValueChange={(value) =>
                  setRatings({ ...ratings, would_play_again: value[0] })
                }
                min={1}
                max={5}
                step={1}
                className="flex-1"
              />
              <div className="flex items-center gap-1 min-w-[80px]">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{ratings.would_play_again}/5</span>
              </div>
            </div>
          </div>

          {/* Overall Rating Display */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Overall Rating:</span>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">
                  {(
                    (ratings.showed_up_on_time +
                      ratings.skill_accurate +
                      ratings.good_sportsmanship +
                      ratings.would_play_again) /
                    4
                  ).toFixed(1)}
                  /5
                </span>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Additional Comments (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share any additional thoughts about playing with this person..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/500 characters
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitClick}
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Review Submission</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>You're about to submit a review for <strong>{revieweeName}</strong> with an overall rating of:</p>
              <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">
                  {(
                    (ratings.showed_up_on_time +
                      ratings.skill_accurate +
                      ratings.good_sportsmanship +
                      ratings.would_play_again) /
                    4
                  ).toFixed(1)}
                  /5
                </span>
              </div>
              <p className="text-sm">Reviews cannot be edited after submission. Are you sure you want to continue?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Yes, Submit Review"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
