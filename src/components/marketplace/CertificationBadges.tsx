import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Award,
  Leaf,
  Shield,
  Globe,
  CheckCircle2,
  Star,
} from "lucide-react";

interface CertificationBadgeProps {
  level: "bronze" | "silver" | "gold" | "platinum";
  totalOffset: number;
  verified: boolean;
}

const CERTIFICATION_LEVELS = {
  bronze: {
    label: "Bronze",
    description: "Offset 10-49 tonnes CO₂e",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
    threshold: 10,
  },
  silver: {
    label: "Silver",
    description: "Offset 50-199 tonnes CO₂e",
    color: "text-slate-500",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300",
    threshold: 50,
  },
  gold: {
    label: "Gold",
    description: "Offset 200-999 tonnes CO₂e",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-400",
    threshold: 200,
  },
  platinum: {
    label: "Platinum",
    description: "Offset 1000+ tonnes CO₂e",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-400",
    threshold: 1000,
  },
};

export function CertificationBadge({ level, totalOffset, verified }: CertificationBadgeProps) {
  const cert = CERTIFICATION_LEVELS[level];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${cert.bgColor} ${cert.borderColor}`}
        >
          <Award className={`h-4 w-4 ${cert.color}`} />
          <span className={`text-sm font-medium ${cert.color}`}>{cert.label}</span>
          {verified && <CheckCircle2 className="h-3 w-3 text-green-600" />}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{cert.label} Certification</p>
        <p className="text-xs text-muted-foreground">{cert.description}</p>
        <p className="text-xs mt-1">Total offset: {totalOffset} tCO₂e</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function CertificationTiers() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Climate Certification Tiers</h3>
        <p className="text-sm text-muted-foreground">
          Earn badges as you increase your carbon offset purchases
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(CERTIFICATION_LEVELS).map(([key, level]) => (
          <Card
            key={key}
            className={`relative overflow-hidden border-2 ${level.borderColor}`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${level.bgColor} rounded-bl-full opacity-50`} />
            <CardContent className="p-4 relative">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg ${level.bgColor}`}>
                  <Award className={`h-6 w-6 ${level.color}`} />
                </div>
                <div>
                  <h4 className={`font-bold ${level.color}`}>{level.label}</h4>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{level.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3" />
                {level.threshold}+ tCO₂e
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Certification Benefits
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Verified Status</p>
                <p className="text-xs text-muted-foreground">
                  Third-party verified offset purchases
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <Globe className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Public Recognition</p>
                <p className="text-xs text-muted-foreground">
                  Display badges on your website and materials
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <Award className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Annual Certificate</p>
                <p className="text-xs text-muted-foreground">
                  Official certificate for compliance reporting
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
