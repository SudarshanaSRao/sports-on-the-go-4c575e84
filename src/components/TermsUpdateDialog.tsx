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
      <DialogContent className="max-w-3xl max-h-[95vh] sm:max-h-[90vh] p-4 sm:p-6" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-center mb-2 sm:mb-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
              <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <DialogTitle className="text-lg sm:text-2xl font-black text-center">
            Terms Updated
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm">
            Please review and accept the changes to continue using SquadUp.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[45vh] sm:max-h-[50vh] py-2 sm:py-4">
          <div className="space-y-3 sm:space-y-6 px-1 sm:px-2">
            <Alert className="border-primary bg-primary/10 p-2 sm:p-4">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <AlertDescription className="text-xs sm:text-sm font-semibold text-foreground ml-2">
                Updated from v{previousVersion} to v{currentVersion}. Review and accept to continue.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">What's Changed?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                  Key updates include:
                </p>
                <ul className="list-disc pl-4 sm:pl-6 text-xs sm:text-sm text-muted-foreground space-y-0.5 sm:space-y-1">
                  <li>Updates to liability provisions and risk assumptions</li>
                  <li>Clarifications on platform responsibilities</li>
                  <li>Changes to dispute resolution procedures</li>
                  <li>Updates to user obligations and conduct</li>
                  <li>Modifications to service availability</li>
                </ul>
              </div>

              <div className="border-2 border-primary/20 rounded-lg p-2 sm:p-4 bg-primary/5">
                <p className="text-xs sm:text-sm font-semibold text-foreground mb-1 sm:mb-2">
                  Action Required
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  Read the{" "}
                  <Link to="/terms" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">
                    Terms
                  </Link>
                  {" "}and{" "}
                  <Link to="/privacy" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">
                    Privacy Policy
                  </Link>
                  {" "}before accepting. You agree to:
                </p>
                <ul className="list-disc pl-4 sm:pl-5 mt-1 sm:mt-2 space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs text-muted-foreground">
                  <li><strong className="text-foreground">Assumption of all risks</strong> from sports activities</li>
                  <li><strong className="text-foreground">Release of all claims</strong> and waiver of right to sue</li>
                  <li><strong className="text-foreground">All liability limitations</strong> in the Terms</li>
                </ul>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <div className="space-y-2 sm:space-y-3 border-2 border-destructive/20 rounded-lg p-2 sm:p-4 bg-destructive/5">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Checkbox
                  id="accept-updated-terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  className="mt-0.5 sm:mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="accept-updated-terms"
                    className="text-[11px] sm:text-xs leading-relaxed cursor-pointer font-normal"
                  >
                    I agree to the updated{" "}
                    <Link to="/terms" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">
                      Terms (v{currentVersion})
                    </Link>
                    {" "}and{" "}
                    <Link to="/privacy" target="_blank" className="text-primary font-semibold underline hover:text-primary/80">
                      Privacy Policy
                    </Link>
                    . Continued use constitutes acceptance.
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-2 sm:gap-4 pt-2 sm:pt-4">
          <Button 
            onClick={handleAccept}
            className="flex-1 gradient-primary text-white shadow-primary hover:opacity-90 text-xs sm:text-sm h-9 sm:h-10"
            disabled={!agreeToTerms || isSubmitting}
          >
            {isSubmitting ? "Processing..." : <span className="hidden sm:inline">I Accept - Continue to SquadUp</span>}
            {isSubmitting ? "" : <span className="sm:hidden">Accept & Continue</span>}
          </Button>
        </div>
        
        <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-1 sm:mt-0">
          Must accept to continue using SquadUp.
        </p>
      </DialogContent>
    </Dialog>
  );
};
