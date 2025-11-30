import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlayerLiabilityWaiverProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  isSubmitting: boolean;
}

export const PlayerLiabilityWaiver = ({
  open,
  onAccept,
  onDecline,
  isSubmitting,
}: PlayerLiabilityWaiverProps) => {
  const [agreeToWaiver, setAgreeToWaiver] = useState(false);

  const handleAccept = () => {
    if (!agreeToWaiver) return;
    onAccept();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="max-w-3xl max-h-[85vh] sm:max-h-[90vh] p-3 sm:p-6 [&>button]:hidden">
        <DialogHeader className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-center mb-1 sm:mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-base sm:text-2xl font-black text-center leading-tight">
            Player Liability Waiver
          </DialogTitle>
          <DialogDescription className="text-center text-[11px] sm:text-sm leading-tight">
            Before joining games, you must acknowledge the risks and responsibilities
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[35vh] sm:max-h-[50vh] py-1 sm:py-3">
          <div className="space-y-2 sm:space-y-5 px-0.5 sm:px-2">
            <Alert className="border-destructive bg-destructive/10 p-1.5 sm:p-4">
              <AlertTriangle className="h-3 w-3 sm:h-5 sm:w-5 text-destructive flex-shrink-0" />
              <AlertDescription className="text-[10px] sm:text-sm font-semibold text-destructive ml-1.5 sm:ml-2 leading-tight">
                IMPORTANT LEGAL NOTICE: By joining games on SquadUp, you assume all risks of injury from sports activities and release the platform from all liability. This waiver is legally binding.
              </AlertDescription>
            </Alert>

            {/* Player Liability Acknowledgment - MANDATORY */}
            <div className="space-y-2 sm:space-y-3 border-2 border-destructive/20 rounded-md sm:rounded-lg p-2 sm:p-4 bg-destructive/5">
              <div className="flex items-start space-x-1.5 sm:space-x-3">
                <AlertTriangle className="w-3 h-3 sm:w-5 sm:h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[10px] sm:text-sm font-semibold text-foreground mb-1 sm:mb-2 leading-tight">
                    PLAYER LIABILITY ACKNOWLEDGMENT
                  </p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-3 leading-snug">
                    By joining games on SquadUp, you are accepting significant risks. Please read carefully before proceeding:
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-1.5 sm:space-x-3">
                <Checkbox
                  id="player-waiver"
                  checked={agreeToWaiver}
                  onCheckedChange={(checked) => setAgreeToWaiver(checked === true)}
                  className="mt-0 sm:mt-0.5 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="player-waiver"
                    className="text-[9px] sm:text-xs leading-snug sm:leading-relaxed cursor-pointer font-normal block"
                  >
                    I have read, understand, and agree to the following:
                    <ul className="list-disc pl-3 sm:pl-5 mt-1 sm:mt-2 space-y-0.5 sm:space-y-1.5 text-muted-foreground leading-snug">
                      <li>
                        <strong className="text-foreground font-semibold">I ASSUME ALL RISKS</strong> of participating in sports activities, including but not limited to serious injury, permanent disability, paralysis, or death
                      </li>
                      <li>
                        <strong className="text-foreground font-semibold">I participate entirely at my own risk</strong> and acknowledge that the platform provides no supervision, insurance, or liability coverage
                      </li>
                      <li>
                        <strong className="text-foreground font-semibold">The platform has NO LIABILITY</strong> for any injuries, damages, disputes, or incidents that occur during games
                      </li>
                      <li>
                        <strong className="text-foreground font-semibold">Users are NOT verified</strong> - The platform does not verify identities, backgrounds, qualifications, or criminal records of participants
                      </li>
                      <li>
                        <strong className="text-foreground font-semibold">Venues are NOT inspected</strong> - The platform does not verify, inspect, or guarantee the safety of any game locations
                      </li>
                      <li>
                        <strong className="text-foreground font-semibold">No supervision is provided</strong> - Games have no referees, safety personnel, or medical assistance from the platform
                      </li>
                      <li>
                        <strong className="text-foreground font-semibold">I am responsible for my own safety</strong> including proper equipment, physical fitness, and medical clearance
                      </li>
                      <li>
                        <strong className="text-foreground font-semibold">I RELEASE ALL CLAIMS</strong> against the platform and waive my right to sue for any reason related to games or activities
                      </li>
                      <li>
                        <strong className="text-foreground font-semibold">I agree to the{" "}
                          <Link to="/terms" target="_blank" className="text-primary underline hover:text-primary/80">
                            Terms and Conditions
                          </Link>
                        </strong>, including all liability limitations and legal provisions
                      </li>
                    </ul>
                    <p className="mt-1.5 sm:mt-3 font-semibold text-foreground leading-snug">
                      I understand that SquadUp is only a coordination platform and I am meeting strangers at my own risk with no platform involvement or protection.
                    </p>
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-1.5 sm:pt-3 mt-1 sm:mt-2">
          <Button 
            onClick={handleAccept}
            className="flex-1 gradient-primary text-white shadow-primary hover:opacity-90 text-xs sm:text-sm h-10 sm:h-11 min-h-[40px]"
            disabled={!agreeToWaiver || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "I Acknowledge & Accept"}
          </Button>
          <Button 
            onClick={onDecline}
            variant="outline"
            className="flex-1 text-xs sm:text-sm h-10 sm:h-11 min-h-[40px]"
            disabled={isSubmitting}
          >
            Decline
          </Button>
        </div>
        
        <p className="text-[9px] sm:text-xs text-center text-muted-foreground mt-0.5 sm:mt-1 leading-tight">
          By clicking "I Acknowledge & Accept", you confirm that you have read and agreed to all provisions above. This waiver only needs to be accepted once.
        </p>
      </DialogContent>
    </Dialog>
  );
};
