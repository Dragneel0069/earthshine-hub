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
  User, 
  Zap, 
  Flame, 
  Car, 
  Bike, 
  Train, 
  Plane, 
  Utensils, 
  ShoppingBag,
  TreePine,
  Leaf,
  Home,
  Droplets,
  Cylinder
} from "lucide-react";
import { ShareReport } from "./ShareReport";

// Indian emission factors
const EMISSION_FACTORS = {
  // Home Energy
  electricity: 0.82, // kg CO₂e per kWh
  lpg: 2.98, // kg CO₂e per kg
  png: 2.0, // kg CO₂e per cubic meter
  coal: 2.42, // kg CO₂e per kg
  
  // Transport (per km)
  petrolCar: 0.192,
  dieselCar: 0.171,
  cngCar: 0.129,
  evCar: 0.05,
  motorcycle: 0.072,
  autoRickshaw: 0.09,
  bus: 0.089,
  metro: 0.035,
  train: 0.041,
  
  // Air Travel (per km)
  domesticFlight: 0.255,
  internationalFlightShort: 0.195,
  internationalFlightLong: 0.147,
  
  // Diet (annual kg CO₂e)
  vegan: 1500,
  vegetarian: 1700,
  pescatarian: 2100,
  lowMeat: 2500,
  mediumMeat: 3200,
  highMeat: 3800,
  
  // Lifestyle
  clothing: 0.025, // per ₹ spent
  electronics: 0.035, // per ₹ spent
  other: 0.02, // per ₹ spent
};

const TREE_ABSORPTION = 21; // kg CO₂ per tree per year

interface IndividualCalculatorProps {
  trigger?: React.ReactNode;
}

export function IndividualCalculator({ trigger }: IndividualCalculatorProps) {
  const [open, setOpen] = useState(false);
  
  // Home Energy
  const [electricity, setElectricity] = useState("");
  const [lpg, setLpg] = useState("");
  const [lpgUnit, setLpgUnit] = useState<"kg" | "cylinder">("kg");
  const [png, setPng] = useState("");
  
  // Transport
  const [petrolKm, setPetrolKm] = useState("");
  const [dieselKm, setDieselKm] = useState("");
  const [motorcycleKm, setMotorcycleKm] = useState("");
  const [busKm, setBusKm] = useState("");
  const [metroKm, setMetroKm] = useState("");
  const [trainKm, setTrainKm] = useState("");
  
  // Air Travel
  const [domesticFlights, setDomesticFlights] = useState("");
  const [shortHaulFlights, setShortHaulFlights] = useState("");
  const [longHaulFlights, setLongHaulFlights] = useState("");
  
  // Diet & Lifestyle
  const [dietType, setDietType] = useState("vegetarian");
  const [clothingSpend, setClothingSpend] = useState("");
  const [electronicsSpend, setElectronicsSpend] = useState("");

  // Calculate LPG in kg (1 cylinder = 14.2 kg)
  const lpgInKg = lpgUnit === "cylinder" ? parseFloat(lpg || "0") * 14.2 : parseFloat(lpg || "0");
  
  // Calculate emissions
  const homeEmissions = 
    (parseFloat(electricity || "0") * EMISSION_FACTORS.electricity * 12) +
    (lpgInKg * EMISSION_FACTORS.lpg * 12) +
    (parseFloat(png || "0") * EMISSION_FACTORS.png * 12);

  const transportEmissions = 
    (parseFloat(petrolKm || "0") * EMISSION_FACTORS.petrolCar * 52) +
    (parseFloat(dieselKm || "0") * EMISSION_FACTORS.dieselCar * 52) +
    (parseFloat(motorcycleKm || "0") * EMISSION_FACTORS.motorcycle * 52) +
    (parseFloat(busKm || "0") * EMISSION_FACTORS.bus * 52) +
    (parseFloat(metroKm || "0") * EMISSION_FACTORS.metro * 52) +
    (parseFloat(trainKm || "0") * EMISSION_FACTORS.train * 52);

  const flightEmissions = 
    (parseFloat(domesticFlights || "0") * 1000 * EMISSION_FACTORS.domesticFlight) +
    (parseFloat(shortHaulFlights || "0") * 3000 * EMISSION_FACTORS.internationalFlightShort) +
    (parseFloat(longHaulFlights || "0") * 8000 * EMISSION_FACTORS.internationalFlightLong);

  const dietEmissions = EMISSION_FACTORS[dietType as keyof typeof EMISSION_FACTORS] as number || 0;

  const lifestyleEmissions = 
    (parseFloat(clothingSpend || "0") * EMISSION_FACTORS.clothing * 12) +
    (parseFloat(electronicsSpend || "0") * EMISSION_FACTORS.electronics);

  const totalKg = homeEmissions + transportEmissions + flightEmissions + dietEmissions + lifestyleEmissions;
  const totalTonnes = totalKg / 1000;
  const treesNeeded = Math.ceil(totalKg / TREE_ABSORPTION);

  const handleReset = () => {
    setElectricity("");
    setLpg("");
    setLpgUnit("kg");
    setPng("");
    setPetrolKm("");
    setDieselKm("");
    setMotorcycleKm("");
    setBusKm("");
    setMetroKm("");
    setTrainKm("");
    setDomesticFlights("");
    setShortHaulFlights("");
    setLongHaulFlights("");
    setDietType("vegetarian");
    setClothingSpend("");
    setElectronicsSpend("");
  };

  const hasInput = electricity || lpg || png || petrolKm || dieselKm || motorcycleKm || 
    busKm || metroKm || trainKm || domesticFlights || shortHaulFlights || longHaulFlights ||
    clothingSpend || electronicsSpend;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            Individual Calculator
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-info/20 p-2">
              <User className="h-5 w-5 text-info" />
            </div>
            <div>
              <SheetTitle className="text-2xl">Bharat Carbon Vita</SheetTitle>
              <SheetDescription>
                Personal Carbon Footprint Calculator (Annual)
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="home" className="text-xs sm:text-sm">
              <Home className="h-4 w-4 mr-1" />
              Home
            </TabsTrigger>
            <TabsTrigger value="transport" className="text-xs sm:text-sm">
              <Car className="h-4 w-4 mr-1" />
              Transport
            </TabsTrigger>
            <TabsTrigger value="travel" className="text-xs sm:text-sm">
              <Plane className="h-4 w-4 mr-1" />
              Travel
            </TabsTrigger>
            <TabsTrigger value="lifestyle" className="text-xs sm:text-sm">
              <ShoppingBag className="h-4 w-4 mr-1" />
              Lifestyle
            </TabsTrigger>
          </TabsList>

          {/* Home Energy Tab */}
          <TabsContent value="home" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Monthly Electricity Bill (kWh)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 150"
                  value={electricity}
                  onChange={(e) => setElectricity(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Average Indian household: 90-150 kWh/month
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Monthly LPG Consumption
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={lpgUnit === "cylinder" ? "e.g., 1" : "e.g., 14.2"}
                    value={lpg}
                    onChange={(e) => setLpg(e.target.value)}
                    min="0"
                    className="flex-1"
                  />
                  <Select value={lpgUnit} onValueChange={(v: "kg" | "cylinder") => setLpgUnit(v)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">
                        <span className="flex items-center gap-2">
                          <Flame className="h-3 w-3" />
                          kg
                        </span>
                      </SelectItem>
                      <SelectItem value="cylinder">
                        <span className="flex items-center gap-2">
                          <Cylinder className="h-3 w-3" />
                          Cylinders
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  {lpgUnit === "cylinder" 
                    ? "1 cylinder = 14.2 kg LPG" 
                    : "Average household: 1-2 cylinders/month"}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  Monthly PNG/Natural Gas (m³)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 10"
                  value={png}
                  onChange={(e) => setPng(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {electricity || lpg || png ? (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <p className="text-sm text-muted-foreground">Home Energy Emissions (Annual)</p>
                <p className="text-2xl font-bold text-primary">{homeEmissions.toFixed(0)} kg CO₂e</p>
              </Card>
            ) : null}
          </TabsContent>

          {/* Transport Tab */}
          <TabsContent value="transport" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Petrol Car (km/week)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={petrolKm}
                  onChange={(e) => setPetrolKm(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Diesel Car (km/week)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={dieselKm}
                  onChange={(e) => setDieselKm(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Bike className="h-4 w-4" />
                  Motorcycle (km/week)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={motorcycleKm}
                  onChange={(e) => setMotorcycleKm(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Bus (km/week)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={busKm}
                  onChange={(e) => setBusKm(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Train className="h-4 w-4" />
                  Metro (km/week)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={metroKm}
                  onChange={(e) => setMetroKm(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Train className="h-4 w-4" />
                  Train (km/week)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={trainKm}
                  onChange={(e) => setTrainKm(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {transportEmissions > 0 && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <p className="text-sm text-muted-foreground">Transport Emissions (Annual)</p>
                <p className="text-2xl font-bold text-primary">{transportEmissions.toFixed(0)} kg CO₂e</p>
              </Card>
            )}
          </TabsContent>

          {/* Air Travel Tab */}
          <TabsContent value="travel" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Domestic Flights (per year)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 4 (round trips)"
                  value={domesticFlights}
                  onChange={(e) => setDomesticFlights(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  ~255 kg CO₂e per 1000 km flight
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Short-haul International (per year)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 2 (Dubai, Singapore, etc.)"
                  value={shortHaulFlights}
                  onChange={(e) => setShortHaulFlights(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Flights under 4 hours
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Long-haul International (per year)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 1 (US, Europe, etc.)"
                  value={longHaulFlights}
                  onChange={(e) => setLongHaulFlights(e.target.value)}
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Flights over 4 hours
                </p>
              </div>
            </div>

            {flightEmissions > 0 && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <p className="text-sm text-muted-foreground">Air Travel Emissions (Annual)</p>
                <p className="text-2xl font-bold text-primary">{flightEmissions.toFixed(0)} kg CO₂e</p>
              </Card>
            )}
          </TabsContent>

          {/* Lifestyle Tab */}
          <TabsContent value="lifestyle" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Diet Type
                </Label>
                <Select value={dietType} onValueChange={setDietType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegan">Vegan (no animal products)</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian (includes dairy)</SelectItem>
                    <SelectItem value="pescatarian">Pescatarian (fish only)</SelectItem>
                    <SelectItem value="lowMeat">Low Meat (1-2 times/week)</SelectItem>
                    <SelectItem value="mediumMeat">Medium Meat (3-5 times/week)</SelectItem>
                    <SelectItem value="highMeat">High Meat (daily)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Diet: ~{dietEmissions.toLocaleString()} kg CO₂e/year
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Monthly Clothing Spend (₹)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 2000"
                  value={clothingSpend}
                  onChange={(e) => setClothingSpend(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Annual Electronics Spend (₹)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 30000"
                  value={electronicsSpend}
                  onChange={(e) => setElectronicsSpend(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <Card className="p-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-muted-foreground">Diet & Lifestyle Emissions (Annual)</p>
              <p className="text-2xl font-bold text-primary">
                {(dietEmissions + lifestyleEmissions).toFixed(0)} kg CO₂e
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Total Results */}
        {hasInput && (
          <div className="space-y-4 pt-6 border-t mt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Your Annual Carbon Footprint
              </h3>
              <ShareReport 
                totalTonnes={totalTonnes} 
                treesNeeded={treesNeeded} 
                calculatorType="individual" 
              />
            </div>
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Annual Emissions</p>
                <p className="text-4xl font-bold text-primary">
                  {totalTonnes.toFixed(2)} <span className="text-lg">tonnes CO₂e</span>
                </p>
                <p className="text-lg text-muted-foreground mt-1">
                  = {totalKg.toFixed(0)} kg CO₂e/year
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                <div className="flex items-center gap-3">
                  <TreePine className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Trees to offset</p>
                    <p className="text-xl font-bold text-green-600">{treesNeeded}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <div>
                  <p className="text-sm text-muted-foreground">Offset cost</p>
                  <p className="text-xl font-bold text-secondary">
                    ₹{(totalTonnes * 800).toFixed(0)}
                  </p>
                </div>
              </Card>
            </div>

            {/* Comparison */}
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-2">How do you compare?</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Your footprint</span>
                  <span className="font-medium">{totalTonnes.toFixed(2)} t</span>
                </div>
                <div className="flex justify-between">
                  <span>India average</span>
                  <span className="font-medium">1.9 t</span>
                </div>
                <div className="flex justify-between">
                  <span>Global average</span>
                  <span className="font-medium">4.7 t</span>
                </div>
                <div className="flex justify-between">
                  <span>Target for 2°C</span>
                  <span className="font-medium text-green-600">2.0 t</span>
                </div>
              </div>
            </Card>

            {/* Offset CTA */}
            <Card className="p-4 bg-gradient-to-r from-primary to-emerald-600 border-0">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="font-semibold">Ready to offset your footprint?</p>
                  <p className="text-sm text-white/80">Browse verified carbon projects in India</p>
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
