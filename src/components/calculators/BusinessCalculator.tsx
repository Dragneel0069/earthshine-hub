import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Briefcase, 
  Zap, 
  Fuel, 
  Car, 
  Plane, 
  TreePine,
  Leaf,
  Building,
  Truck,
  Package
} from "lucide-react";

// Indian emission factors for business
const EMISSION_FACTORS = {
  // Scope 1 - Direct emissions
  diesel: 2.68, // kg CO₂e per liter
  petrol: 2.31, // kg CO₂e per liter
  lpg: 2.98, // kg CO₂e per kg
  cng: 2.75, // kg CO₂e per kg
  coalKg: 2.42, // kg CO₂e per kg
  
  // Scope 2 - Electricity
  electricity: 0.82, // kg CO₂e per kWh (Indian grid)
  
  // Scope 3 - Indirect
  employeeCommute: 0.15, // kg CO₂e per km (average)
  businessTravel: 0.255, // kg CO₂e per km (flight)
  shipping: 0.1, // kg CO₂e per tonne-km
  wasteToLandfill: 0.58, // kg CO₂e per kg
  waterUsage: 0.149, // kg CO₂e per m³
};

const TREE_ABSORPTION = 21;

interface BusinessCalculatorProps {
  trigger?: React.ReactNode;
}

export function BusinessCalculator({ trigger }: BusinessCalculatorProps) {
  const [open, setOpen] = useState(false);
  
  // Scope 1 - Direct
  const [dieselLiters, setDieselLiters] = useState("");
  const [petrolLiters, setPetrolLiters] = useState("");
  const [lpgKg, setLpgKg] = useState("");
  const [cngKg, setCngKg] = useState("");
  
  // Scope 2 - Electricity
  const [electricityKwh, setElectricityKwh] = useState("");
  const [dgDieselLiters, setDgDieselLiters] = useState("");
  
  // Scope 3 - Indirect
  const [employeeCount, setEmployeeCount] = useState("");
  const [avgCommuteKm, setAvgCommuteKm] = useState("");
  const [businessTravelKm, setBusinessTravelKm] = useState("");
  const [shippingTonneKm, setShippingTonneKm] = useState("");
  const [wasteKg, setWasteKg] = useState("");

  // Scope 1 Calculations
  const scope1Emissions = 
    (parseFloat(dieselLiters || "0") * EMISSION_FACTORS.diesel * 12) +
    (parseFloat(petrolLiters || "0") * EMISSION_FACTORS.petrol * 12) +
    (parseFloat(lpgKg || "0") * EMISSION_FACTORS.lpg * 12) +
    (parseFloat(cngKg || "0") * EMISSION_FACTORS.cng * 12);

  // Scope 2 Calculations
  const scope2Emissions = 
    (parseFloat(electricityKwh || "0") * EMISSION_FACTORS.electricity * 12) +
    (parseFloat(dgDieselLiters || "0") * EMISSION_FACTORS.diesel * 12);

  // Scope 3 Calculations
  const commuteEmissions = 
    parseFloat(employeeCount || "0") * 
    parseFloat(avgCommuteKm || "0") * 2 * 
    EMISSION_FACTORS.employeeCommute * 250; // 250 working days

  const travelEmissions = parseFloat(businessTravelKm || "0") * EMISSION_FACTORS.businessTravel;
  const shippingEmissions = parseFloat(shippingTonneKm || "0") * EMISSION_FACTORS.shipping;
  const wasteEmissions = parseFloat(wasteKg || "0") * EMISSION_FACTORS.wasteToLandfill * 12;

  const scope3Emissions = commuteEmissions + travelEmissions + shippingEmissions + wasteEmissions;

  const totalKg = scope1Emissions + scope2Emissions + scope3Emissions;
  const totalTonnes = totalKg / 1000;
  const treesNeeded = Math.ceil(totalKg / TREE_ABSORPTION);

  const handleReset = () => {
    setDieselLiters("");
    setPetrolLiters("");
    setLpgKg("");
    setCngKg("");
    setElectricityKwh("");
    setDgDieselLiters("");
    setEmployeeCount("");
    setAvgCommuteKm("");
    setBusinessTravelKm("");
    setShippingTonneKm("");
    setWasteKg("");
  };

  const hasInput = dieselLiters || petrolLiters || lpgKg || cngKg || 
    electricityKwh || dgDieselLiters || employeeCount || businessTravelKm ||
    shippingTonneKm || wasteKg;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Business Calculator
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-secondary/20 p-2">
              <Briefcase className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <SheetTitle className="text-2xl">Bharat Carbon Lite</SheetTitle>
              <SheetDescription>
                SME Carbon Footprint Calculator (Annual)
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="scope1" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="scope1" className="text-xs sm:text-sm">
              <Fuel className="h-4 w-4 mr-1" />
              Scope 1
            </TabsTrigger>
            <TabsTrigger value="scope2" className="text-xs sm:text-sm">
              <Zap className="h-4 w-4 mr-1" />
              Scope 2
            </TabsTrigger>
            <TabsTrigger value="scope3" className="text-xs sm:text-sm">
              <Truck className="h-4 w-4 mr-1" />
              Scope 3
            </TabsTrigger>
          </TabsList>

          {/* Scope 1 - Direct Emissions */}
          <TabsContent value="scope1" className="space-y-4">
            <div className="p-3 bg-muted rounded-lg mb-4">
              <p className="text-sm font-medium">Scope 1: Direct Emissions</p>
              <p className="text-xs text-muted-foreground">
                Emissions from sources owned or controlled by your company
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-orange-500" />
                  Diesel (L/month)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={dieselLiters}
                  onChange={(e) => setDieselLiters(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Vehicles, generators
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-green-500" />
                  Petrol (L/month)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={petrolLiters}
                  onChange={(e) => setPetrolLiters(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-red-500" />
                  LPG (kg/month)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={lpgKg}
                  onChange={(e) => setLpgKg(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Cooking, heating
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-blue-500" />
                  CNG (kg/month)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={cngKg}
                  onChange={(e) => setCngKg(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <Card className="p-4 bg-orange-500/10 border-orange-500/20">
              <p className="text-sm text-muted-foreground">Scope 1 Emissions (Annual)</p>
              <p className="text-2xl font-bold text-orange-600">{(scope1Emissions / 1000).toFixed(2)} tonnes CO₂e</p>
            </Card>
          </TabsContent>

          {/* Scope 2 - Electricity */}
          <TabsContent value="scope2" className="space-y-4">
            <div className="p-3 bg-muted rounded-lg mb-4">
              <p className="text-sm font-medium">Scope 2: Indirect Emissions</p>
              <p className="text-xs text-muted-foreground">
                Emissions from purchased electricity and energy
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Grid Electricity (kWh/month)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 5000"
                  value={electricityKwh}
                  onChange={(e) => setElectricityKwh(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Indian grid factor: 0.82 kg CO₂e/kWh (CEA 2023)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-gray-500" />
                  DG Set Diesel (L/month)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={dgDieselLiters}
                  onChange={(e) => setDgDieselLiters(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Backup power generation
                </p>
              </div>
            </div>

            <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
              <p className="text-sm text-muted-foreground">Scope 2 Emissions (Annual)</p>
              <p className="text-2xl font-bold text-yellow-600">{(scope2Emissions / 1000).toFixed(2)} tonnes CO₂e</p>
            </Card>
          </TabsContent>

          {/* Scope 3 - Indirect */}
          <TabsContent value="scope3" className="space-y-4">
            <div className="p-3 bg-muted rounded-lg mb-4">
              <p className="text-sm font-medium">Scope 3: Other Indirect Emissions</p>
              <p className="text-xs text-muted-foreground">
                Emissions from your value chain activities
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Employee Commute
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Number of Employees</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 25"
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Avg. Commute (km one-way)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 15"
                      value={avgCommuteKm}
                      onChange={(e) => setAvgCommuteKm(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Business Air Travel (km/year)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 10000"
                  value={businessTravelKm}
                  onChange={(e) => setBusinessTravelKm(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Freight Shipping (tonne-km/year)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 50000"
                  value={shippingTonneKm}
                  onChange={(e) => setShippingTonneKm(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Weight × Distance transported
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Waste to Landfill (kg/month)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 200"
                  value={wasteKg}
                  onChange={(e) => setWasteKg(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <Card className="p-4 bg-blue-500/10 border-blue-500/20">
              <p className="text-sm text-muted-foreground">Scope 3 Emissions (Annual)</p>
              <p className="text-2xl font-bold text-blue-600">{(scope3Emissions / 1000).toFixed(2)} tonnes CO₂e</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Total Results */}
        {hasInput && (
          <div className="space-y-4 pt-6 border-t mt-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Your Business Carbon Footprint
            </h3>

            {/* Scope Breakdown */}
            <div className="grid grid-cols-3 gap-2">
              <Card className="p-3 bg-orange-500/10 border-orange-500/20">
                <p className="text-xs text-muted-foreground">Scope 1</p>
                <p className="text-lg font-bold text-orange-600">
                  {(scope1Emissions / 1000).toFixed(1)}t
                </p>
              </Card>
              <Card className="p-3 bg-yellow-500/10 border-yellow-500/20">
                <p className="text-xs text-muted-foreground">Scope 2</p>
                <p className="text-lg font-bold text-yellow-600">
                  {(scope2Emissions / 1000).toFixed(1)}t
                </p>
              </Card>
              <Card className="p-3 bg-blue-500/10 border-blue-500/20">
                <p className="text-xs text-muted-foreground">Scope 3</p>
                <p className="text-lg font-bold text-blue-600">
                  {(scope3Emissions / 1000).toFixed(1)}t
                </p>
              </Card>
            </div>

            <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Annual Emissions</p>
                <p className="text-4xl font-bold text-primary">
                  {totalTonnes.toFixed(2)} <span className="text-lg">tCO₂e</span>
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                <div className="flex items-center gap-3">
                  <TreePine className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Trees to offset</p>
                    <p className="text-xl font-bold text-green-600">
                      {treesNeeded.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <div>
                  <p className="text-sm text-muted-foreground">Offset cost</p>
                  <p className="text-xl font-bold text-secondary">
                    ₹{(totalTonnes * 800).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-muted-foreground">@ ₹800/tCO₂e</p>
                </div>
              </Card>
            </div>

            {/* Offset CTA */}
            <Card className="p-4 bg-gradient-to-r from-primary to-emerald-600 border-0">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="font-semibold">Offset your business emissions</p>
                  <p className="text-sm text-white/80">Explore verified carbon credits & RECs</p>
                </div>
                <Link to="/marketplace" onClick={() => setOpen(false)}>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Leaf className="h-4 w-4" />
                    Offset Now
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button type="button" variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button type="button" className="flex-1" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
