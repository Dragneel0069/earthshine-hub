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
  Building2, 
  Zap, 
  Fuel, 
  Car, 
  Plane, 
  TreePine,
  Leaf,
  Truck,
  Package,
  Factory,
  Droplets,
  Recycle,
  Users
} from "lucide-react";

// Comprehensive emission factors for enterprise
const EMISSION_FACTORS = {
  // Scope 1 - Stationary Combustion
  naturalGas: 2.0, // kg CO₂e per m³
  diesel: 2.68, // kg CO₂e per liter
  petrol: 2.31, // kg CO₂e per liter
  lpg: 2.98, // kg CO₂e per kg
  furnaceOil: 3.17, // kg CO₂e per liter
  coal: 2420, // kg CO₂e per tonne
  
  // Scope 1 - Mobile Combustion
  dieselVehicle: 2.68,
  petrolVehicle: 2.31,
  cngVehicle: 2.75,
  
  // Scope 1 - Fugitive
  refrigerantR410a: 2088, // GWP
  refrigerantR22: 1810,
  refrigerantR134a: 1430,
  
  // Scope 2 - Electricity by State (sample)
  electricityGrid: 0.82, // National average
  
  // Scope 3 Categories
  purchasedGoods: 0.5, // per ₹1000 spent (estimate)
  capitalGoods: 0.3, // per ₹1000 spent
  fuelWTT: 0.5, // well-to-tank factor
  upstream: 0.18, // kg per kWh T&D losses
  waste: 0.58, // kg per kg waste
  businessTravel: 0.255, // kg per km flight
  employeeCommute: 0.15, // kg per km
  upstreamLeased: 50, // kg per m² per year
  downstreamTransport: 0.1, // kg per tonne-km
  endOfLife: 0.3, // kg per kg product
  investments: 0.1, // per ₹1000 invested
};

const TREE_ABSORPTION = 21;

interface CorporateCalculatorProps {
  trigger?: React.ReactNode;
}

export function CorporateCalculator({ trigger }: CorporateCalculatorProps) {
  const [open, setOpen] = useState(false);
  
  // Scope 1 - Stationary
  const [naturalGas, setNaturalGas] = useState("");
  const [dieselStationary, setDieselStationary] = useState("");
  const [furnaceOil, setFurnaceOil] = useState("");
  const [coalTonnes, setCoalTonnes] = useState("");
  
  // Scope 1 - Mobile
  const [fleetDiesel, setFleetDiesel] = useState("");
  const [fleetPetrol, setFleetPetrol] = useState("");
  
  // Scope 1 - Fugitive
  const [refrigerantKg, setRefrigerantKg] = useState("");
  const [refrigerantType, setRefrigerantType] = useState("R410a");
  
  // Scope 2
  const [electricityKwh, setElectricityKwh] = useState("");
  const [renewablePercent, setRenewablePercent] = useState("");
  const [dgDiesel, setDgDiesel] = useState("");
  
  // Scope 3
  const [purchasedGoodsLakhs, setPurchasedGoodsLakhs] = useState("");
  const [capitalGoodsLakhs, setCapitalGoodsLakhs] = useState("");
  const [wasteKg, setWasteKg] = useState("");
  const [recycledPercent, setRecycledPercent] = useState("");
  const [businessTravelKm, setBusinessTravelKm] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [avgCommute, setAvgCommute] = useState("");
  const [upstreamTransportTonneKm, setUpstreamTransportTonneKm] = useState("");
  const [downstreamTransportTonneKm, setDownstreamTransportTonneKm] = useState("");

  // Scope 1 Calculations
  const stationaryEmissions = 
    (parseFloat(naturalGas || "0") * EMISSION_FACTORS.naturalGas * 12) +
    (parseFloat(dieselStationary || "0") * EMISSION_FACTORS.diesel * 12) +
    (parseFloat(furnaceOil || "0") * EMISSION_FACTORS.furnaceOil * 12) +
    (parseFloat(coalTonnes || "0") * EMISSION_FACTORS.coal);

  const mobileEmissions = 
    (parseFloat(fleetDiesel || "0") * EMISSION_FACTORS.dieselVehicle * 12) +
    (parseFloat(fleetPetrol || "0") * EMISSION_FACTORS.petrolVehicle * 12);

  const refrigerantGWP = refrigerantType === "R410a" ? EMISSION_FACTORS.refrigerantR410a :
    refrigerantType === "R22" ? EMISSION_FACTORS.refrigerantR22 : EMISSION_FACTORS.refrigerantR134a;
  const fugitiveEmissions = parseFloat(refrigerantKg || "0") * refrigerantGWP;

  const scope1Total = stationaryEmissions + mobileEmissions + fugitiveEmissions;

  // Scope 2 Calculations
  const renewableFactor = 1 - (parseFloat(renewablePercent || "0") / 100);
  const gridEmissions = parseFloat(electricityKwh || "0") * EMISSION_FACTORS.electricityGrid * renewableFactor * 12;
  const dgEmissions = parseFloat(dgDiesel || "0") * EMISSION_FACTORS.diesel * 12;
  const scope2Total = gridEmissions + dgEmissions;

  // Scope 3 Calculations
  const purchasedGoodsEmissions = parseFloat(purchasedGoodsLakhs || "0") * 100000 / 1000 * EMISSION_FACTORS.purchasedGoods;
  const capitalGoodsEmissions = parseFloat(capitalGoodsLakhs || "0") * 100000 / 1000 * EMISSION_FACTORS.capitalGoods;
  
  const recycleRate = parseFloat(recycledPercent || "0") / 100;
  const wasteEmissions = parseFloat(wasteKg || "0") * (1 - recycleRate) * EMISSION_FACTORS.waste * 12;
  
  const businessTravelEmissions = parseFloat(businessTravelKm || "0") * EMISSION_FACTORS.businessTravel;
  const commuteEmissions = parseFloat(employeeCount || "0") * parseFloat(avgCommute || "0") * 2 * 
    EMISSION_FACTORS.employeeCommute * 250;
  
  const upstreamEmissions = parseFloat(upstreamTransportTonneKm || "0") * EMISSION_FACTORS.downstreamTransport;
  const downstreamEmissions = parseFloat(downstreamTransportTonneKm || "0") * EMISSION_FACTORS.downstreamTransport;

  const scope3Total = purchasedGoodsEmissions + capitalGoodsEmissions + wasteEmissions + 
    businessTravelEmissions + commuteEmissions + upstreamEmissions + downstreamEmissions;

  const totalKg = scope1Total + scope2Total + scope3Total;
  const totalTonnes = totalKg / 1000;
  const treesNeeded = Math.ceil(totalKg / TREE_ABSORPTION);

  const handleReset = () => {
    setNaturalGas("");
    setDieselStationary("");
    setFurnaceOil("");
    setCoalTonnes("");
    setFleetDiesel("");
    setFleetPetrol("");
    setRefrigerantKg("");
    setRefrigerantType("R410a");
    setElectricityKwh("");
    setRenewablePercent("");
    setDgDiesel("");
    setPurchasedGoodsLakhs("");
    setCapitalGoodsLakhs("");
    setWasteKg("");
    setRecycledPercent("");
    setBusinessTravelKm("");
    setEmployeeCount("");
    setAvgCommute("");
    setUpstreamTransportTonneKm("");
    setDownstreamTransportTonneKm("");
  };

  const hasInput = naturalGas || dieselStationary || furnaceOil || coalTonnes ||
    fleetDiesel || fleetPetrol || refrigerantKg || electricityKwh || dgDiesel ||
    purchasedGoodsLakhs || capitalGoodsLakhs || wasteKg || businessTravelKm ||
    employeeCount || upstreamTransportTonneKm || downstreamTransportTonneKm;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Building2 className="h-4 w-4" />
            Corporate Calculator
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/20 p-2">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-2xl">Bharat Carbon Pro</SheetTitle>
              <SheetDescription>
                Enterprise GHG Inventory Calculator (GHG Protocol Aligned)
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="scope1" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="scope1" className="text-xs">
              <Factory className="h-3 w-3 mr-1" />
              Scope 1
            </TabsTrigger>
            <TabsTrigger value="scope2" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Scope 2
            </TabsTrigger>
            <TabsTrigger value="scope3a" className="text-xs">
              <Truck className="h-3 w-3 mr-1" />
              Scope 3 (Up)
            </TabsTrigger>
            <TabsTrigger value="scope3b" className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              Scope 3 (Down)
            </TabsTrigger>
          </TabsList>

          {/* Scope 1 */}
          <TabsContent value="scope1" className="space-y-6">
            {/* Stationary Combustion */}
            <div className="space-y-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Factory className="h-4 w-4" />
                  Stationary Combustion
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Natural Gas (m³/month)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={naturalGas}
                    onChange={(e) => setNaturalGas(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Diesel (L/month)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={dieselStationary}
                    onChange={(e) => setDieselStationary(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Furnace Oil (L/month)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={furnaceOil}
                    onChange={(e) => setFurnaceOil(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Coal (tonnes/year)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={coalTonnes}
                    onChange={(e) => setCoalTonnes(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Combustion */}
            <div className="space-y-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Mobile Combustion (Fleet)
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fleet Diesel (L/month)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={fleetDiesel}
                    onChange={(e) => setFleetDiesel(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fleet Petrol (L/month)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={fleetPetrol}
                    onChange={(e) => setFleetPetrol(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Fugitive Emissions */}
            <div className="space-y-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Fugitive Emissions (Refrigerants)
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Refrigerant Leakage (kg/year)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={refrigerantKg}
                    onChange={(e) => setRefrigerantKg(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Refrigerant Type</Label>
                  <Select value={refrigerantType} onValueChange={setRefrigerantType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="R410a">R-410A (GWP: 2088)</SelectItem>
                      <SelectItem value="R22">R-22 (GWP: 1810)</SelectItem>
                      <SelectItem value="R134a">R-134a (GWP: 1430)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Card className="p-4 bg-orange-500/10 border-orange-500/20">
              <p className="text-sm text-muted-foreground">Total Scope 1 Emissions</p>
              <p className="text-2xl font-bold text-orange-600">{(scope1Total / 1000).toFixed(2)} tCO₂e</p>
            </Card>
          </TabsContent>

          {/* Scope 2 */}
          <TabsContent value="scope2" className="space-y-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg mb-4">
              <p className="text-sm font-medium">Scope 2: Purchased Electricity & Energy</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Grid Electricity (kWh/month)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 100000"
                  value={electricityKwh}
                  onChange={(e) => setElectricityKwh(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Renewable Energy Percentage (%)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={renewablePercent}
                  onChange={(e) => setRenewablePercent(e.target.value)}
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground">
                  Solar, wind, or other green energy purchased
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Fuel className="h-4 w-4" />
                  DG Backup Diesel (L/month)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={dgDiesel}
                  onChange={(e) => setDgDiesel(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
              <p className="text-sm text-muted-foreground">Total Scope 2 Emissions</p>
              <p className="text-2xl font-bold text-yellow-600">{(scope2Total / 1000).toFixed(2)} tCO₂e</p>
            </Card>
          </TabsContent>

          {/* Scope 3 Upstream */}
          <TabsContent value="scope3a" className="space-y-4">
            <div className="p-3 bg-blue-500/10 rounded-lg mb-4">
              <p className="text-sm font-medium">Scope 3: Upstream Value Chain</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Purchased Goods & Services (₹ Lakhs/year)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  value={purchasedGoodsLakhs}
                  onChange={(e) => setPurchasedGoodsLakhs(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Capital Goods (₹ Lakhs/year)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 50"
                  value={capitalGoodsLakhs}
                  onChange={(e) => setCapitalGoodsLakhs(e.target.value)}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Upstream Transportation (tonne-km/year)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 500000"
                  value={upstreamTransportTonneKm}
                  onChange={(e) => setUpstreamTransportTonneKm(e.target.value)}
                  min="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Recycle className="h-4 w-4" />
                    Waste Generated (kg/month)
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={wasteKg}
                    onChange={(e) => setWasteKg(e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Recycled (%)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={recycledPercent}
                    onChange={(e) => setRecycledPercent(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Scope 3 Downstream */}
          <TabsContent value="scope3b" className="space-y-4">
            <div className="p-3 bg-blue-500/10 rounded-lg mb-4">
              <p className="text-sm font-medium">Scope 3: Downstream & Other</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Business Travel - Air (km/year)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 100000"
                  value={businessTravelKm}
                  onChange={(e) => setBusinessTravelKm(e.target.value)}
                  min="0"
                />
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Employee Commute
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Total Employees</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 500"
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Avg. One-way Commute (km)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 15"
                      value={avgCommute}
                      onChange={(e) => setAvgCommute(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Downstream Transportation (tonne-km/year)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g., 300000"
                  value={downstreamTransportTonneKm}
                  onChange={(e) => setDownstreamTransportTonneKm(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <Card className="p-4 bg-blue-500/10 border-blue-500/20">
              <p className="text-sm text-muted-foreground">Total Scope 3 Emissions</p>
              <p className="text-2xl font-bold text-blue-600">{(scope3Total / 1000).toFixed(2)} tCO₂e</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Total Results */}
        {hasInput && (
          <div className="space-y-4 pt-6 border-t mt-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Corporate GHG Inventory Summary
            </h3>

            {/* Scope Breakdown */}
            <div className="grid grid-cols-3 gap-2">
              <Card className="p-3 bg-orange-500/10 border-orange-500/20">
                <p className="text-xs text-muted-foreground">Scope 1</p>
                <p className="text-lg font-bold text-orange-600">
                  {(scope1Total / 1000).toFixed(1)} t
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalKg > 0 ? ((scope1Total / totalKg) * 100).toFixed(0) : 0}%
                </p>
              </Card>
              <Card className="p-3 bg-yellow-500/10 border-yellow-500/20">
                <p className="text-xs text-muted-foreground">Scope 2</p>
                <p className="text-lg font-bold text-yellow-600">
                  {(scope2Total / 1000).toFixed(1)} t
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalKg > 0 ? ((scope2Total / totalKg) * 100).toFixed(0) : 0}%
                </p>
              </Card>
              <Card className="p-3 bg-blue-500/10 border-blue-500/20">
                <p className="text-xs text-muted-foreground">Scope 3</p>
                <p className="text-lg font-bold text-blue-600">
                  {(scope3Total / 1000).toFixed(1)} t
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalKg > 0 ? ((scope3Total / totalKg) * 100).toFixed(0) : 0}%
                </p>
              </Card>
            </div>

            <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total GHG Emissions</p>
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white">
                <div>
                  <p className="font-semibold">Start your Net Zero journey</p>
                  <p className="text-sm text-white/80">Browse premium carbon credits & RECs for enterprise</p>
                </div>
                <Link to="/marketplace" onClick={() => setOpen(false)}>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Leaf className="h-4 w-4" />
                    Explore Offsets
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
