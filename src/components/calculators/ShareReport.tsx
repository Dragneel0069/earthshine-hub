import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share2, MessageCircle, Mail, Twitter, Linkedin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareReportProps {
  totalTonnes: number;
  treesNeeded: number;
  calculatorType: "individual" | "business" | "corporate";
}

export function ShareReport({ totalTonnes, treesNeeded, calculatorType }: ShareReportProps) {
  const [copied, setCopied] = useState(false);

  const getShareText = () => {
    const typeLabel = calculatorType === "individual" 
      ? "personal" 
      : calculatorType === "business" 
        ? "business" 
        : "corporate";
    
    return `🌱 I calculated my ${typeLabel} carbon footprint with Bharat Carbon!\n\n📊 Annual Emissions: ${totalTonnes.toFixed(2)} tonnes CO₂e\n🌳 Trees needed to offset: ${treesNeeded.toLocaleString("en-IN")}\n\nCalculate yours at: ${window.location.origin}/calculators\n\n#NetZero #CarbonFootprint #Sustainability #ClimateAction`;
  };

  const shareUrl = `${window.location.origin}/calculators`;
  const shareText = getShareText();

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`My Carbon Footprint Report - ${totalTonnes.toFixed(2)} tonnes CO₂e`);
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleTwitterShare = () => {
    const tweetText = `🌱 My carbon footprint: ${totalTonnes.toFixed(2)} tonnes CO₂e/year. Calculate yours at Bharat Carbon! #NetZero #ClimateAction`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success("Report copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share Report
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="grid gap-1">
          <Button
            variant="ghost"
            className="justify-start gap-3 h-10"
            onClick={handleWhatsAppShare}
          >
            <MessageCircle className="h-4 w-4 text-green-500" />
            WhatsApp
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 h-10"
            onClick={handleEmailShare}
          >
            <Mail className="h-4 w-4 text-blue-500" />
            Email
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 h-10"
            onClick={handleTwitterShare}
          >
            <Twitter className="h-4 w-4 text-sky-500" />
            Twitter / X
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 h-10"
            onClick={handleLinkedInShare}
          >
            <Linkedin className="h-4 w-4 text-blue-600" />
            LinkedIn
          </Button>
          <div className="border-t my-1" />
          <Button
            variant="ghost"
            className="justify-start gap-3 h-10"
            onClick={handleCopyLink}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy Report"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}