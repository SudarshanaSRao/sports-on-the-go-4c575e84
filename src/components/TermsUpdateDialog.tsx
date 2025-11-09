import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsUpdateDialogProps {
  open: boolean;
  currentVersion: string;
  previousVersion: string;
  onAccept: () => void;
  isSubmitting: boolean;
}

export const TermsUpdateDialog = ({
  open,
  currentVersion,
  previousVersion,
  onAccept,
  isSubmitting,
}: TermsUpdateDialogProps) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleAccept = () => {
    if (!agreeToTerms) return;
    onAccept();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl max-h-[90vh]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
              <FileText className="w-7 h-7 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-black text-center">
            Terms and Conditions Updated
          </DialogTitle>
          <DialogDescription className="text-center">
            We've updated our Terms and Conditions. Please review and accept the changes to continue using SquadUp.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] py-4">
          <div className="space-y-6 px-2">
            <Alert className="border-primary bg-primary/10">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <AlertDescription className="text-sm font-semibold text-foreground ml-2">
                Our Terms and Conditions have been updated from version {previousVersion} to {currentVersion}. You must review and accept the updated terms to continue using SquadUp.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">What's Changed?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We've made important updates to our Terms and Conditions. Key changes may include:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                  <li>Updates to liability provisions and risk assumptions</li>
                  <li>Clarifications on platform responsibilities and limitations</li>
                  <li>Changes to dispute resolution procedures</li>
                  <li>Updates to user obligations and prohibited conduct</li>
                  <li>Modifications to service availability and features</li>
                </ul>
              </div>

              <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Action Required
                </p>
                <p className="text-xs text-muted-foreground">
                  Please read the full updated{" "}
                  <Link to="/terms" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">
                    Terms and Conditions
                  </Link>
                  {" "}and{" "}
                  <Link to="/privacy" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">
                    Privacy Policy
                  </Link>
                  {" "}before accepting. By accepting, you agree to be bound by all terms, including:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-muted-foreground">
                  <li><strong className="text-foreground">Assumption of all risks</strong> of injury, disability, or death from sports activities</li>
                  <li><strong className="text-foreground">Release of all claims</strong> against the operator and waiver of right to sue</li>
                  <li><strong className="text-foreground">All liability limitations and legal provisions</strong> as detailed in the Terms</li>
                </ul>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <div className="space-y-3 border-2 border-destructive/20 rounded-lg p-4 bg-destructive/5">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="accept-updated-terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="accept-updated-terms"
                    className="text-xs leading-relaxed cursor-pointer font-normal"
                  >
                    I have read, understand, and agree to the updated{" "}
                    <Link to="/terms" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">
                      Terms and Conditions (v{currentVersion})
                    </Link>
                    {" "}and{" "}
                    <Link to="/privacy" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">
                      Privacy Policy
                    </Link>
                    . I acknowledge that my continued use of SquadUp constitutes acceptance of these updated terms.
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={handleAccept}
            className="flex-1 gradient-primary text-white shadow-primary hover:opacity-90"
            disabled={!agreeToTerms || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "I Accept - Continue to SquadUp"}
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground">
          You must accept the updated terms to continue using SquadUp. If you do not accept, you will be signed out.
        </p>
      </DialogContent>
    </Dialog>
  );
};
