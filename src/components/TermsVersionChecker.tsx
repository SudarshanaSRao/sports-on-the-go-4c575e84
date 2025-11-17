import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TermsUpdateDialog } from "./TermsUpdateDialog";
import { CURRENT_TERMS_VERSION, getVersionInfo, formatVersionDate } from "@/constants/termsVersion";
import { toast } from "sonner";

interface TermsVersionCheckerProps {
  children: React.ReactNode;
}

export const TermsVersionChecker = ({ children }: TermsVersionCheckerProps) => {
  const { user } = useAuth();
  const [showTermsUpdate, setShowTermsUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousVersion, setPreviousVersion] = useState("1.0");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (user) {
      checkTermsVersion();
    } else {
      setIsChecking(false);
    }
  }, [user]);

  const checkTermsVersion = async () => {
    if (!user) return;

    try {
      setIsChecking(true);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("accepted_terms_version")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error checking terms version:", error);
        setIsChecking(false);
        return;
      }

      const userVersion = profile?.accepted_terms_version || "1.0";
      
      // Compare versions - if user's version is older, show update dialog
      if (userVersion !== CURRENT_TERMS_VERSION) {
        setPreviousVersion(userVersion);
        setShowTermsUpdate(true);
      }
      
      setIsChecking(false);
    } catch (error) {
      console.error("Error in terms version check:", error);
      setIsChecking(false);
    }
  };

  const handleAcceptTerms = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Update user's accepted terms version
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          accepted_terms_version: CURRENT_TERMS_VERSION,
          terms_last_accepted_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Get version info for notification
      const versionInfo = getVersionInfo(CURRENT_TERMS_VERSION);
      const formattedDate = versionInfo ? formatVersionDate(versionInfo.date) : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const description = versionInfo?.description || "Terms and Conditions have been updated";

      // Create notification for the user
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          type: "terms_update",
          title: `Terms Updated to v${CURRENT_TERMS_VERSION}`,
          message: `You accepted the updated Terms and Conditions (v${CURRENT_TERMS_VERSION}) on ${formattedDate}. Changes include: ${description}`,
          action_url: "/terms",
          is_read: false,
        });

      if (notificationError) {
        console.error("Error creating notification:", notificationError);
        // Don't throw here - terms acceptance is more critical than notification
      }

      setShowTermsUpdate(false);
      toast.success("Terms accepted. Thank you for staying up to date!");
    } catch (error: any) {
      console.error("Error accepting terms:", error);
      toast.error("Failed to save acceptance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <TermsUpdateDialog
        open={showTermsUpdate}
        currentVersion={CURRENT_TERMS_VERSION}
        previousVersion={previousVersion}
        onAccept={handleAcceptTerms}
        isSubmitting={isSubmitting}
      />
    </>
  );
};
