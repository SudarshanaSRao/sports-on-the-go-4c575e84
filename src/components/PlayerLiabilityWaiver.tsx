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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-xl bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-black text-center">
            Player Liability Waiver
          </DialogTitle>
          <DialogDescription className="text-center">
            Before joining games, you must acknowledge the risks and responsibilities
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Alert className="border-destructive bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDescription className="text-sm font-semibold text-destructive ml-2">
              IMPORTANT LEGAL NOTICE: By joining games on SquadUp, you assume all risks of injury from sports activities and release the platform from all liability. This waiver is legally binding.
            </AlertDescription>
          </Alert>

          {/* Player Liability Acknowledgment - MANDATORY */}
          <div className="space-y-3 border-2 border-destructive/20 rounded-lg p-4 bg-destructive/5">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-2">
                  PLAYER LIABILITY ACKNOWLEDGMENT
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  By joining games on SquadUp, you are accepting significant risks. Please read carefully before proceeding:
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="player-waiver"
                checked={agreeToWaiver}
                onCheckedChange={(checked) => setAgreeToWaiver(checked === true)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor="player-waiver"
                  className="text-xs leading-relaxed cursor-pointer font-normal"
                >
                  I have read, understand, and agree to the following:
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-muted-foreground">
                    <li>
                      <strong className="text-foreground">I ASSUME ALL RISKS</strong> of participating in sports activities, including but not limited to serious injury, permanent disability, paralysis, or death
                    </li>
                    <li>
                      <strong className="text-foreground">I participate entirely at my own risk</strong> and acknowledge that the platform provides no supervision, insurance, or liability coverage
                    </li>
                    <li>
                      <strong className="text-foreground">The platform has NO LIABILITY</strong> for any injuries, damages, disputes, or incidents that occur during games
                    </li>
                    <li>
                      <strong className="text-foreground">Users are NOT verified</strong> - The platform does not verify identities, backgrounds, qualifications, or criminal records of participants
                    </li>
                    <li>
                      <strong className="text-foreground">Venues are NOT inspected</strong> - The platform does not verify, inspect, or guarantee the safety of any game locations
                    </li>
                    <li>
                      <strong className="text-foreground">No supervision is provided</strong> - Games have no referees, safety personnel, or medical assistance from the platform
                    </li>
                    <li>
                      <strong className="text-foreground">I am responsible for my own safety</strong> including proper equipment, physical fitness, and medical clearance
                    </li>
                    <li>
                      <strong className="text-foreground">I RELEASE ALL CLAIMS</strong> against the platform and waive my right to sue for any reason related to games or activities
                    </li>
                    <li>
                      <strong className="text-foreground">I agree to the{" "}
                        <Link to="/terms" target="_blank" className="text-primary underline hover:text-primary/80">
                          Terms and Conditions
                        </Link>
                      </strong>, including all liability limitations and legal provisions
                    </li>
                  </ul>
                  <p className="mt-3 font-semibold text-foreground">
                    I understand that SquadUp is only a coordination platform and I am meeting strangers at my own risk with no platform involvement or protection.
                  </p>
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              onClick={handleAccept}
              className="flex-1 gradient-primary text-white shadow-primary hover:opacity-90"
              disabled={!agreeToWaiver || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "I Acknowledge & Accept"}
            </Button>
            <Button 
              onClick={onDecline}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Decline
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            By clicking "I Acknowledge & Accept", you confirm that you have read and agreed to all provisions above. This waiver only needs to be accepted once.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
