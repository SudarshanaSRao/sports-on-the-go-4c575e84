import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          // Check if this is a first-time Google user who hasn't accepted terms
          const termsAccepted = session.user.user_metadata?.terms_accepted;
          
          // If terms not accepted, redirect to Google consent page
          if (!termsAccepted) {
            navigate('/google-consent');
            return;
          }

          // Check if user has a username
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .single();

          // Get the return URL if it exists
          const returnUrl = sessionStorage.getItem('authReturnUrl');

          if (!profile?.username) {
            // Need to set username first
            navigate('/setup-username');
          } else if (returnUrl) {
            // Has username and return URL, go back to original page
            sessionStorage.removeItem('authReturnUrl');
            navigate(returnUrl);
          } else {
            // Has username but no return URL, go to discover
            navigate('/discover');
          }
        } else {
          // No session, redirect to auth
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
