import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calculator, Zap, Fuel, TreePine, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";

// Indian emission factors
const EMISSION_FACTORS = {
  electricity: 0.82, // kg CO₂e per kWh (Indian grid average)
  diesel: 2.68, // kg CO₂e per liter
};

const TREE_ABSORPTION = 21; // kg CO₂ per tree per year

interface CarbonCalculatorProps {
  trigger?: React.ReactNode;
}

export function CarbonCalculator({ trigger }: CarbonCalculatorProps) {
  const [open, setOpen] = useState(false);
  const [electricity, setElectricity] = useState("");
  const [diesel, setDiesel] = useState("");

  const electricityEmissions = parseFloat(electricity || "0") * EMISSION_FACTORS.electricity;
  const dieselEmissions = parseFloat(diesel || "0") * EMISSION_FACTORS.diesel;
  const totalKg = electricityEmissions + dieselEmissions;
  const totalTonnes = totalKg / 1000;
  const treesNeeded = Math.ceil(totalKg / TREE_ABSORPTION);

  const hasInput = electricity || diesel;

  const handleReset = () => {
    setElectricity("");
    setDiesel("");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Calculator className="h-4 w-4" />
            Calculator
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-2xl">Carbon Calculator</SheetTitle>
              <SheetDescription>
                Calculate emissions using Indian emission factors
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* Electricity Input */}
            <div className="space-y-2">
              <Label htmlFor="electricity" className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Electricity Consumed
              </Label>
              <div className="flex gap-2">
                <Input
                  id="electricity"
                  type="number"
                  placeholder="0"
                  value={electricity}
                  onChange={(e) => setElectricity(e.target.value)}
                  min="0"
                  step="0.01"
                  className="flex-1"
                />
                <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                  kWh
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Indian grid factor: {EMISSION_FACTORS.electricity} kg CO₂e/kWh
              </p>
            </div>

            {/* Diesel Input */}
            <div className="space-y-2">
              <Label htmlFor="diesel" className="flex items-center gap-2">
                <Fuel className="h-4 w-4 text-orange-500" />
                Diesel Consumed
              </Label>
              <div className="flex gap-2">
                <Input
                  id="diesel"
                  type="number"
                  placeholder="0"
                  value={diesel}
                  onChange={(e) => setDiesel(e.target.value)}
                  min="0"
                  step="0.01"
                  className="flex-1"
                />
                <div className="flex items-center px-3 bg-muted rounded-md text-sm text-muted-foreground">
                  Liters
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Diesel factor: {EMISSION_FACTORS.diesel} kg CO₂e/L
              </p>
            </div>
          </div>

          {/* Results Section */}
          {hasInput && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-lg">Emission Results</h3>

              {/* Breakdown */}
              <div className="space-y-2">
                {electricity && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Zap className="h-3 w-3" /> Electricity
                    </span>
                    <span className="font-medium">{electricityEmissions.toFixed(2)} kg CO₂e</span>
                  </div>
                )}
                {diesel && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Fuel className="h-3 w-3" /> Diesel
                    </span>
                    <span className="font-medium">{dieselEmissions.toFixed(2)} kg CO₂e</span>
                  </div>
                )}
              </div>

              {/* Total Emissions Card */}
              <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Emissions</p>
                  <p className="text-3xl font-bold text-primary">
                    {totalKg.toFixed(2)} <span className="text-lg">kg CO₂e</span>
                  </p>
                  <p className="text-lg text-muted-foreground mt-1">
                    = {totalTonnes.toFixed(4)} tonnes CO₂e
                  </p>
                </div>
              </Card>

              {/* Trees Equivalent */}
              <Card className="p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-500/20 p-3">
                    <TreePine className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trees needed to offset</p>
                    <p className="text-2xl font-bold text-green-600">
                      {treesNeeded.toLocaleString("en-IN")} trees
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Based on {TREE_ABSORPTION} kg CO₂ absorption per tree/year
                    </p>
                  </div>
                </div>
              </Card>

              {/* Carbon Credit Cost Estimate */}
              <Card className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated offset cost</p>
                    <p className="text-xl font-bold text-secondary">
                      ₹{(totalTonnes * 800).toFixed(0)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    @ ₹800 per<br />tonne CO₂e
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
            <Button type="button" className="flex-1" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>

          {/* Emission Factors Reference */}
          <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
            <p className="font-medium">🇮🇳 Indian Emission Factors (CEA 2023)</p>
            <p>• Grid Electricity: 0.82 kg CO₂e/kWh</p>
            <p>• Diesel: 2.68 kg CO₂e/L</p>
            <p>• Tree absorption: ~21 kg CO₂/year (avg tropical tree)</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
