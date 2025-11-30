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
      <DialogContent 
        className="max-w-3xl max-h-[85vh] sm:max-h-[90vh] p-3 sm:p-6 [&>button]:hidden" 
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-center mb-1 sm:mb-3">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg gradient-primary flex items-center justify-center shadow-primary">
              <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-base sm:text-2xl font-black text-center leading-tight">
            Terms Updated
          </DialogTitle>
          <DialogDescription className="text-center text-[11px] sm:text-sm leading-tight">
            Please review and accept the changes to continue using SquadUp.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[32vh] sm:max-h-[50vh] py-1 sm:py-3">
          <div className="space-y-2 sm:space-y-5 px-0.5 sm:px-2">
            <Alert className="border-primary bg-primary/10 p-1.5 sm:p-4">
              <AlertTriangle className="h-3 w-3 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
              <AlertDescription className="text-[10px] sm:text-sm font-semibold text-foreground ml-1.5 sm:ml-2 leading-tight">
                Updated from v{previousVersion} to v{currentVersion}. Review and accept to continue.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 sm:space-y-4">
              <div>
                <h3 className="text-xs sm:text-lg font-semibold mb-0.5 sm:mb-2 leading-tight">What's Changed?</h3>
                <p className="text-[10px] sm:text-sm text-muted-foreground mb-1 sm:mb-2 leading-tight">
                  Key updates include:
                </p>
                <ul className="list-disc pl-3 sm:pl-5 text-[10px] sm:text-sm text-muted-foreground space-y-0 sm:space-y-1 leading-snug">
                  <li>Updates to liability provisions and risk assumptions</li>
                  <li>Clarifications on platform responsibilities</li>
                  <li>Changes to dispute resolution procedures</li>
                  <li>Updates to user obligations and conduct</li>
                  <li>Modifications to service availability</li>
                </ul>
              </div>

              <div className="border-2 border-primary/20 rounded-md sm:rounded-lg p-1.5 sm:p-4 bg-primary/5">
                <p className="text-[10px] sm:text-sm font-semibold text-foreground mb-0.5 sm:mb-2 leading-tight">
                  Action Required
                </p>
                <p className="text-[9px] sm:text-xs text-muted-foreground leading-snug">
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
                <ul className="list-disc pl-3 sm:pl-5 mt-0.5 sm:mt-2 space-y-0 sm:space-y-1 text-[9px] sm:text-xs text-muted-foreground leading-snug">
                  <li><strong className="text-foreground font-semibold">Assumption of all risks</strong> from sports activities</li>
                  <li><strong className="text-foreground font-semibold">Release of all claims</strong> and waiver of right to sue</li>
                  <li><strong className="text-foreground font-semibold">All liability limitations</strong> in the Terms</li>
                </ul>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <div className="space-y-1 sm:space-y-2 border-2 border-destructive/20 rounded-md sm:rounded-lg p-1.5 sm:p-4 bg-destructive/5">
              <div className="flex items-start space-x-1.5 sm:space-x-3">
                <Checkbox
                  id="accept-updated-terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  className="mt-0 sm:mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="accept-updated-terms"
                    className="text-[9px] sm:text-xs leading-snug sm:leading-relaxed cursor-pointer font-normal block"
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

        <div className="flex gap-2 sm:gap-4 pt-1.5 sm:pt-3 mt-1 sm:mt-2">
          <Button 
            onClick={handleAccept}
            className="flex-1 gradient-primary text-white shadow-primary hover:opacity-90 text-xs sm:text-sm h-10 sm:h-11 min-h-[40px]"
            disabled={!agreeToTerms || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Accept & Continue"}
          </Button>
        </div>
        
        <p className="text-[9px] sm:text-xs text-center text-muted-foreground mt-0.5 sm:mt-1 leading-tight">
          Must accept to continue using SquadUp.
        </p>
      </DialogContent>
    </Dialog>
  );
};
