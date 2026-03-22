import { useState, useEffect } from "react";
import {
  Shield,
  Check,
  ExternalLink,
  Copy,
  Lock,
  Fingerprint,
  Clock,
  FileCheck,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BlockchainVerificationProps {
  certificateNumber: string;
  creditsRetired: number;
  retirementDate: string;
  projectName: string;
  registry: string;
  beneficiaryName: string;
  onVerificationComplete?: (verificationData: VerificationData) => void;
}

interface VerificationData {
  blockchainTxHash: string;
  ipfsCid: string;
  timestamp: string;
  blockNumber: number;
  networkName: string;
  verificationStatus: "verified" | "pending" | "failed";
}

// Simulated blockchain verification
async function simulateBlockchainVerification(
  certificateData: Omit<BlockchainVerificationProps, "onVerificationComplete">
): Promise<VerificationData> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate deterministic-looking hashes based on certificate data
  const dataString = JSON.stringify(certificateData);
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(dataString)
  );
  const hashArray = Array.from(new Uint8Array(hash));
  const txHash = "0x" + hashArray.slice(0, 32).map((b) => b.toString(16).padStart(2, "0")).join("");
  const ipfsCid = "Qm" + hashArray.slice(0, 23).map((b) => b.toString(36)).join("").slice(0, 44);

  return {
    blockchainTxHash: txHash,
    ipfsCid,
    timestamp: new Date().toISOString(),
    blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
    networkName: "Polygon (Simulated)",
    verificationStatus: "verified",
  };
}

export function BlockchainVerification({
  certificateNumber,
  creditsRetired,
  retirementDate,
  projectName,
  registry,
  beneficiaryName,
  onVerificationComplete,
}: BlockchainVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [verificationSteps, setVerificationSteps] = useState<
    { step: string; status: "pending" | "in_progress" | "completed" }[]
  >([
    { step: "Computing certificate hash", status: "pending" },
    { step: "Submitting to blockchain", status: "pending" },
    { step: "Storing on IPFS", status: "pending" },
    { step: "Generating proof", status: "pending" },
  ]);

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationSteps((steps) =>
      steps.map((s) => ({ ...s, status: "pending" }))
    );

    // Simulate step-by-step verification
    for (let i = 0; i < verificationSteps.length; i++) {
      setVerificationSteps((steps) =>
        steps.map((s, idx) => ({
          ...s,
          status: idx === i ? "in_progress" : idx < i ? "completed" : "pending",
        }))
      );
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    // Complete final step
    setVerificationSteps((steps) =>
      steps.map((s) => ({ ...s, status: "completed" }))
    );

    try {
      const result = await simulateBlockchainVerification({
        certificateNumber,
        creditsRetired,
        retirementDate,
        projectName,
        registry,
        beneficiaryName,
      });
      setVerificationData(result);
      onVerificationComplete?.(result);
      toast.success("Certificate verified on blockchain", {
        description: "Immutable proof has been created and stored",
      });
    } catch (error) {
      toast.error("Verification failed", {
        description: "Please try again later",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Blockchain Verification</CardTitle>
              <CardDescription>Immutable proof of retirement</CardDescription>
            </div>
          </div>
          {verificationData && (
            <Badge className="bg-green-500 text-white">
              <Check className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Certificate Summary */}
        <div className="p-3 bg-muted/30 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Certificate</span>
            <span className="font-mono">{certificateNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Credits Retired</span>
            <span className="font-medium">{creditsRetired} tCO₂e</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Beneficiary</span>
            <span>{beneficiaryName}</span>
          </div>
        </div>

        {/* Verification Status */}
        {!verificationData && !isVerifying && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <Fingerprint className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Create an immutable record of this retirement on the blockchain
            </p>
            <Button onClick={handleVerify} className="gap-2">
              <Lock className="w-4 h-4" />
              Verify on Blockchain
            </Button>
          </div>
        )}

        {/* Verification Progress */}
        {isVerifying && (
          <div className="space-y-3 py-4">
            {verificationSteps.map((step, index) => (
              <div
                key={step.step}
                className="flex items-center gap-3"
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                    step.status === "completed" && "bg-green-500 text-white",
                    step.status === "in_progress" && "bg-primary/20",
                    step.status === "pending" && "bg-muted"
                  )}
                >
                  {step.status === "completed" && <Check className="w-4 h-4" />}
                  {step.status === "in_progress" && (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  )}
                  {step.status === "pending" && (
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    step.status === "completed" && "text-foreground",
                    step.status === "in_progress" && "text-primary font-medium",
                    step.status === "pending" && "text-muted-foreground"
                  )}
                >
                  {step.step}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Verification Complete */}
        {verificationData && (
          <div
            className="space-y-4"
          >
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <FileCheck className="w-5 h-5" />
                <span className="font-medium">Verification Successful</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This retirement certificate has been permanently recorded on the blockchain.
                The record is immutable and can be independently verified.
              </p>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span>Technical Details</span>
              {showDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

              {showDetails && (
                <div
                  className="space-y-3 overflow-hidden"
                >
                  <div className="p-3 bg-muted/30 rounded-lg space-y-3">
                    <div>
                      <Label>Transaction Hash</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 text-xs font-mono bg-background p-2 rounded truncate">
                          {verificationData.blockchainTxHash}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            copyToClipboard(verificationData.blockchainTxHash, "Transaction hash")
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>IPFS CID</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 text-xs font-mono bg-background p-2 rounded truncate">
                          {verificationData.ipfsCid}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(verificationData.ipfsCid, "IPFS CID")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Network</span>
                        <p className="font-medium">{verificationData.networkName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Block Number</span>
                        <p className="font-medium">{verificationData.blockNumber.toLocaleString()}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Timestamp</span>
                        <p className="font-medium">
                          {new Date(verificationData.timestamp).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View on Explorer
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View on IPFS
                    </Button>
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            This is a simulated blockchain verification for demonstration purposes.
            Production implementation would use actual blockchain networks like Polygon or Ethereum.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-muted-foreground">{children}</span>;
}
