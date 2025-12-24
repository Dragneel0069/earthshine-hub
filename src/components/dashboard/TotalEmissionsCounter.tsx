import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Flag } from "lucide-react";

interface TotalEmissionsCounterProps {
  totalEmissions: number;
  previousEmissions: number;
  currency?: string;
  costSavings?: number;
  isLoading?: boolean;
}

export function TotalEmissionsCounter({
  totalEmissions = 0,
  previousEmissions = 0,
  currency = "₹",
  costSavings = 0,
  isLoading = false,
}: TotalEmissionsCounterProps) {
  const reduction = previousEmissions > 0 
    ? ((previousEmissions - totalEmissions) / previousEmissions) * 100 
    : 0;

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-primary-foreground/20 rounded w-1/3"></div>
            <div className="h-12 bg-primary-foreground/20 rounded w-2/3"></div>
            <div className="h-8 bg-primary-foreground/20 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
      <div className="absolute top-4 right-4 opacity-20">
        <Flag className="h-24 w-24" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-medium text-primary-foreground/80">🇮🇳 India</span>
          <span className="text-sm text-primary-foreground/60">• FY 2024-25</span>
        </div>
        <div className="mb-4">
          <p className="text-sm text-primary-foreground/70 mb-1">Total Carbon Emissions (YTD)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold font-display tracking-tight">
              {totalEmissions.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
            </span>
            <span className="text-xl text-primary-foreground/80">tCO₂e</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-6">
          {reduction > 0 && (
            <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-3 py-2">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">
                {reduction.toFixed(1)}% vs last year
              </span>
            </div>
          )}
          {costSavings > 0 && (
            <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-3 py-2">
              <span className="text-sm font-medium">
                Cost Savings: {currency}{(costSavings / 100000).toFixed(1)}L
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
