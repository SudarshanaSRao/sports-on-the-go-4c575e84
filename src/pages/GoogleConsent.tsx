import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GoogleConsent = () => {
  const navigate = useNavigate();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!agreeToTerms) {
      toast.error("You must agree to the Terms and Privacy Policy to continue");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("No authenticated user found");
        navigate('/auth');
        return;
      }

      // Store consent timestamp in user metadata or a separate table
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString()
        }
      });

      if (updateError) throw updateError;

      // Check if user has a username (profile exists)
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
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
    } catch (error: any) {
      console.error("Error accepting terms:", error);
      toast.error("Failed to save your consent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    // Sign the user out if they decline
    await supabase.auth.signOut();
    toast.info("You must agree to the terms to use SquadUp");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl shadow-elevated border-2">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
              <MapPin className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black text-center">Welcome to SquadUp</CardTitle>
          <CardDescription className="text-center">
            Before you continue, please review and accept our legal terms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-destructive bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDescription className="text-sm font-semibold text-destructive ml-2">
              IMPORTANT LEGAL NOTICE: By continuing with Google sign-in, you agree to binding arbitration, waive your right to sue in court, waive your right to a jury trial, and acknowledge significant liability limitations ($100 maximum). Please read carefully before proceeding.
            </AlertDescription>
          </Alert>

          {/* Legal Consent Checkbox - MANDATORY */}
          <div className="space-y-3 border-2 border-destructive/20 rounded-lg p-4 bg-destructive/5">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-2">
                  IMPORTANT LEGAL AGREEMENT
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  By continuing, you are entering into a legally binding agreement. Please read carefully:
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="agree-terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor="agree-terms"
                  className="text-xs leading-relaxed cursor-pointer font-normal"
                >
                  I have read, understand, and agree to be legally bound by the{" "}
                  <Link to="/terms" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">
                    Terms and Conditions
                  </Link>
                  {" "}and{" "}
                  <Link to="/privacy" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">
                    Privacy Policy
                  </Link>
                  , including but not limited to:
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                    <li><strong className="text-foreground">Assumption of all risks</strong> of injury, disability, or death from sports activities</li>
                    <li><strong className="text-foreground">Release of all claims</strong> against the operator and waiver of right to sue</li>
                    <li><strong className="text-foreground">Binding arbitration</strong> in Santa Clara County, California for all disputes</li>
                    <li><strong className="text-foreground">Waiver of jury trial</strong> and class action rights</li>
                    <li><strong className="text-foreground">$100 maximum liability cap</strong> for all claims and damages</li>
                    <li><strong className="text-foreground">California law</strong> governs all aspects of this agreement</li>
                  </ul>
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              onClick={handleContinue}
              className="flex-1 gradient-primary text-white shadow-primary hover:opacity-90"
              disabled={!agreeToTerms || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "I Agree - Continue"}
            </Button>
            <Button 
              onClick={handleDecline}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Decline
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            By clicking "Continue", you confirm that you have read and agreed to all legal provisions above. Clicking "Decline" will sign you out.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleConsent;
