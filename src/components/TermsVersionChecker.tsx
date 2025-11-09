import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TermsUpdateDialog } from "./TermsUpdateDialog";
import { CURRENT_TERMS_VERSION } from "@/constants/termsVersion";
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
      const { error } = await supabase
        .from("profiles")
        .update({
          accepted_terms_version: CURRENT_TERMS_VERSION,
          terms_last_accepted_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

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
