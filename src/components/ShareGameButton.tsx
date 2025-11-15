import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Link as LinkIcon, MessageCircle, MessageSquare, Facebook, Twitter, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareGameButtonProps {
  gameId: string;
  gameName: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export const ShareGameButton = ({ gameId, gameName, variant = "outline", size = "default" }: ShareGameButtonProps) => {
  const { toast } = useToast();
  const shareUrl = `${window.location.origin}/game/${gameId}`;
  const shareText = `Check out this game: ${gameName}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Game link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(url, "_blank");
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  const shareViaTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(gameName);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaSMS = () => {
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `sms:?body=${body}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: gameName,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.error("Error sharing:", error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Share this game</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={copyToClipboard}>
          <LinkIcon className="w-4 h-4 mr-2" />
          Copy Link
        </DropdownMenuItem>

        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share...
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={shareViaSMS}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Text Message
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareViaWhatsApp}>
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareViaFacebook}>
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareViaTwitter}>
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareViaEmail}>
          <Mail className="w-4 h-4 mr-2" />
          Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
