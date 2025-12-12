import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Flag } from "lucide-react";

interface TotalEmissionsCounterProps {
  totalEmissions: number;
  previousEmissions: number;
  currency?: string;
  costSavings?: number;
}

export function TotalEmissionsCounter({
  totalEmissions = 1284.5,
  previousEmissions = 1852.3,
  currency = "₹",
  costSavings = 1250000,
}: TotalEmissionsCounterProps) {
  const reduction = ((previousEmissions - totalEmissions) / previousEmissions) * 100;
  
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
              {totalEmissions.toLocaleString('en-IN')}
            </span>
            <span className="text-xl text-primary-foreground/80">tCO₂e</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-3 py-2">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm font-medium">
              {reduction.toFixed(1)}% vs last year
            </span>
          </div>
          <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-3 py-2">
            <span className="text-sm font-medium">
              Cost Savings: {currency}{(costSavings / 100000).toFixed(1)}L
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
