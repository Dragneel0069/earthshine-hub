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
  Users,
  Flame,
  Beaker,
  Hammer
} from "lucide-react";
import { ShareReport } from "./ShareReport";

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
  
  // Heavy Industry Process Emissions (kg CO₂e per tonne unless specified)
  // Steel Industry
  steelBOF: 1850, // Basic Oxygen Furnace - kg CO₂e per tonne crude steel
  steelEAF: 580, // Electric Arc Furnace - kg CO₂e per tonne crude steel
  steelDRI: 1200, // Direct Reduced Iron - kg CO₂e per tonne DRI
  cokeProduction: 770, // kg CO₂e per tonne coke
  sinteringProcess: 200, // kg CO₂e per tonne sinter
  ironOreReduction: 1500, // kg CO₂e per tonne pig iron
  
  // Cement Industry
  cementClinker: 850, // kg CO₂e per tonne clinite (process + fuel)
  cementGrinding: 50, // kg CO₂e per tonne cement grinding
  limestoneCalcination: 520, // kg CO₂e per tonne limestone (pure process)
  
  // Aluminum Industry
  aluminumSmelting: 12000, // kg CO₂e per tonne primary aluminum
  aluminaRefining: 1500, // kg CO₂e per tonne alumina
  anodeProduction: 450, // kg CO₂e per tonne anode
  
  // Chemical Industry
  ammoniaProduction: 1800, // kg CO₂e per tonne ammonia
  nitricAcidProduction: 2850, // kg CO₂e per tonne (includes N2O)
  adipicAcidProduction: 10200, // kg CO₂e per tonne (high N2O)
  hydrogenProduction: 9500, // kg CO₂e per tonne H2 (SMR)
  methanolProduction: 670, // kg CO₂e per tonne methanol
  ethyleneProduction: 1000, // kg CO₂e per tonne ethylene
  
  // Refinery & Petrochemicals
  refineryProcessing: 25, // kg CO₂e per barrel processed
  flareEmissions: 2.5, // kg CO₂e per m³ flared
  catalyticCracking: 180, // kg CO₂e per tonne feed
  hydrogenUnit: 9, // kg CO₂e per kg H2 produced
  
  // Glass & Ceramics
  glassProduction: 580, // kg CO₂e per tonne glass
  brickProduction: 200, // kg CO₂e per tonne brick
  
  // Paper & Pulp
  pulpProduction: 450, // kg CO₂e per tonne pulp
  paperProduction: 380, // kg CO₂e per tonne paper
  
  // Mining
  ironOreMining: 15, // kg CO₂e per tonne ore
  coalMining: 25, // kg CO₂e per tonne coal
  limestoneMining: 8, // kg CO₂e per tonne limestone
};

const TREE_ABSORPTION = 21;

interface CorporateCalculatorProps {
  trigger?: React.ReactNode;
}

export function CorporateCalculator({ trigger }: CorporateCalculatorProps) {
  const [open, setOpen] = useState(false);
  const [industryType, setIndustryType] = useState("steel");
  
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

  // Heavy Industry - Steel
  const [steelBOFTonnes, setSteelBOFTonnes] = useState("");
  const [steelEAFTonnes, setSteelEAFTonnes] = useState("");
  const [driTonnes, setDriTonnes] = useState("");
  const [cokeTonnes, setCokeTonnes] = useState("");
  const [sinterTonnes, setSinterTonnes] = useState("");
  const [pigIronTonnes, setPigIronTonnes] = useState("");
  
  // Heavy Industry - Cement
  const [clinkerTonnes, setClinkerTonnes] = useState("");
  const [cementGrindingTonnes, setCementGrindingTonnes] = useState("");
  const [limestoneCalcinationTonnes, setLimestoneCalcinationTonnes] = useState("");
  
  // Heavy Industry - Aluminum
  const [primaryAluminumTonnes, setPrimaryAluminumTonnes] = useState("");
  const [aluminaTonnes, setAluminaTonnes] = useState("");
  const [anodeTonnes, setAnodeTonnes] = useState("");
  
  // Heavy Industry - Chemicals
  const [ammoniaTonnes, setAmmoniaTonnes] = useState("");
  const [nitricAcidTonnes, setNitricAcidTonnes] = useState("");
  const [hydrogenTonnes, setHydrogenTonnes] = useState("");
  const [methanolTonnes, setMethanolTonnes] = useState("");
  const [ethyleneTonnes, setEthyleneTonnes] = useState("");
  
  // Heavy Industry - Refinery
  const [barrelProcessed, setBarrelProcessed] = useState("");
  const [flareVolumeM3, setFlareVolumeM3] = useState("");
  const [catalyticCrackingTonnes, setCatalyticCrackingTonnes] = useState("");
  
  // Heavy Industry - Other
  const [glassTonnes, setGlassTonnes] = useState("");
  const [pulpTonnes, setPulpTonnes] = useState("");
  const [ironOreTonnes, setIronOreTonnes] = useState("");
  const [coalMiningTonnes, setCoalMiningTonnes] = useState("");

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

  // Process Emissions Calculation
  const steelProcessEmissions = 
    (parseFloat(steelBOFTonnes || "0") * EMISSION_FACTORS.steelBOF) +
    (parseFloat(steelEAFTonnes || "0") * EMISSION_FACTORS.steelEAF) +
    (parseFloat(driTonnes || "0") * EMISSION_FACTORS.steelDRI) +
    (parseFloat(cokeTonnes || "0") * EMISSION_FACTORS.cokeProduction) +
    (parseFloat(sinterTonnes || "0") * EMISSION_FACTORS.sinteringProcess) +
    (parseFloat(pigIronTonnes || "0") * EMISSION_FACTORS.ironOreReduction);

  const cementProcessEmissions = 
    (parseFloat(clinkerTonnes || "0") * EMISSION_FACTORS.cementClinker) +
    (parseFloat(cementGrindingTonnes || "0") * EMISSION_FACTORS.cementGrinding) +
    (parseFloat(limestoneCalcinationTonnes || "0") * EMISSION_FACTORS.limestoneCalcination);

  const aluminumProcessEmissions = 
    (parseFloat(primaryAluminumTonnes || "0") * EMISSION_FACTORS.aluminumSmelting) +
    (parseFloat(aluminaTonnes || "0") * EMISSION_FACTORS.aluminaRefining) +
    (parseFloat(anodeTonnes || "0") * EMISSION_FACTORS.anodeProduction);

  const chemicalProcessEmissions = 
    (parseFloat(ammoniaTonnes || "0") * EMISSION_FACTORS.ammoniaProduction) +
    (parseFloat(nitricAcidTonnes || "0") * EMISSION_FACTORS.nitricAcidProduction) +
    (parseFloat(hydrogenTonnes || "0") * EMISSION_FACTORS.hydrogenProduction) +
    (parseFloat(methanolTonnes || "0") * EMISSION_FACTORS.methanolProduction) +
    (parseFloat(ethyleneTonnes || "0") * EMISSION_FACTORS.ethyleneProduction);

  const refineryProcessEmissions = 
    (parseFloat(barrelProcessed || "0") * EMISSION_FACTORS.refineryProcessing) +
    (parseFloat(flareVolumeM3 || "0") * EMISSION_FACTORS.flareEmissions) +
    (parseFloat(catalyticCrackingTonnes || "0") * EMISSION_FACTORS.catalyticCracking);

  const otherProcessEmissions = 
    (parseFloat(glassTonnes || "0") * EMISSION_FACTORS.glassProduction) +
    (parseFloat(pulpTonnes || "0") * EMISSION_FACTORS.pulpProduction) +
    (parseFloat(ironOreTonnes || "0") * EMISSION_FACTORS.ironOreMining) +
    (parseFloat(coalMiningTonnes || "0") * EMISSION_FACTORS.coalMining);

  const totalProcessEmissions = steelProcessEmissions + cementProcessEmissions + 
    aluminumProcessEmissions + chemicalProcessEmissions + refineryProcessEmissions + otherProcessEmissions;

  const scope1Total = stationaryEmissions + mobileEmissions + fugitiveEmissions + totalProcessEmissions;

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
    // Reset heavy industry fields
    setSteelBOFTonnes("");
    setSteelEAFTonnes("");
    setDriTonnes("");
    setCokeTonnes("");
    setSinterTonnes("");
    setPigIronTonnes("");
    setClinkerTonnes("");
    setCementGrindingTonnes("");
    setLimestoneCalcinationTonnes("");
    setPrimaryAluminumTonnes("");
    setAluminaTonnes("");
    setAnodeTonnes("");
    setAmmoniaTonnes("");
    setNitricAcidTonnes("");
    setHydrogenTonnes("");
    setMethanolTonnes("");
    setEthyleneTonnes("");
    setBarrelProcessed("");
    setFlareVolumeM3("");
    setCatalyticCrackingTonnes("");
    setGlassTonnes("");
    setPulpTonnes("");
    setIronOreTonnes("");
    setCoalMiningTonnes("");
  };

  const hasInput = naturalGas || dieselStationary || furnaceOil || coalTonnes ||
    fleetDiesel || fleetPetrol || refrigerantKg || electricityKwh || dgDiesel ||
    purchasedGoodsLakhs || capitalGoodsLakhs || wasteKg || businessTravelKm ||
    employeeCount || upstreamTransportTonneKm || downstreamTransportTonneKm ||
    steelBOFTonnes || steelEAFTonnes || driTonnes || cokeTonnes || sinterTonnes || pigIronTonnes ||
    clinkerTonnes || cementGrindingTonnes || limestoneCalcinationTonnes ||
    primaryAluminumTonnes || aluminaTonnes || anodeTonnes ||
    ammoniaTonnes || nitricAcidTonnes || hydrogenTonnes || methanolTonnes || ethyleneTonnes ||
    barrelProcessed || flareVolumeM3 || catalyticCrackingTonnes ||
    glassTonnes || pulpTonnes || ironOreTonnes || coalMiningTonnes;

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
              <SheetTitle className="text-2xl">Zero Graph Pro</SheetTitle>
              <SheetDescription>
                Enterprise GHG Inventory Calculator (GHG Protocol Aligned)
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="scope1" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="scope1" className="text-xs">
              <Factory className="h-3 w-3 mr-1" />
              Scope 1
            </TabsTrigger>
            <TabsTrigger value="process" className="text-xs">
              <Hammer className="h-3 w-3 mr-1" />
              Process
            </TabsTrigger>
            <TabsTrigger value="scope2" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Scope 2
            </TabsTrigger>
            <TabsTrigger value="scope3a" className="text-xs">
              <Truck className="h-3 w-3 mr-1" />
              Scope 3↑
            </TabsTrigger>
            <TabsTrigger value="scope3b" className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              Scope 3↓
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

          {/* Industry Process Emissions */}
          <TabsContent value="process" className="space-y-6">
            <div className="p-3 bg-red-500/10 rounded-lg mb-4">
              <p className="text-sm font-medium flex items-center gap-2">
                <Hammer className="h-4 w-4" />
                Heavy Industry Process Emissions
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Direct emissions from industrial chemical/physical processes
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <Label>Select Your Industry</Label>
              <Select value={industryType} onValueChange={setIndustryType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="steel">🏭 Steel & Iron</SelectItem>
                  <SelectItem value="cement">🧱 Cement</SelectItem>
                  <SelectItem value="aluminum">⚡ Aluminum</SelectItem>
                  <SelectItem value="chemicals">🧪 Chemicals</SelectItem>
                  <SelectItem value="refinery">🛢️ Refinery & Petrochemicals</SelectItem>
                  <SelectItem value="other">📦 Other Industries</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Steel Industry */}
            {industryType === "steel" && (
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Steel Production (tonnes/year)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">BOF Steel (Blast Furnace)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={steelBOFTonnes}
                      onChange={(e) => setSteelBOFTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 1,850 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">EAF Steel (Electric Arc)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={steelEAFTonnes}
                      onChange={(e) => setSteelEAFTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 580 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">DRI Production</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={driTonnes}
                      onChange={(e) => setDriTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 1,200 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Coke Production</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={cokeTonnes}
                      onChange={(e) => setCokeTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 770 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Sintering Process</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={sinterTonnes}
                      onChange={(e) => setSinterTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 200 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Pig Iron (BF Route)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={pigIronTonnes}
                      onChange={(e) => setPigIronTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 1,500 kg CO₂e/t</p>
                  </div>
                </div>
              </div>
            )}

            {/* Cement Industry */}
            {industryType === "cement" && (
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Cement Production (tonnes/year)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Clinker Production</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={clinkerTonnes}
                      onChange={(e) => setClinkerTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 850 kg CO₂e/t (process + fuel)</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Cement Grinding</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={cementGrindingTonnes}
                      onChange={(e) => setCementGrindingTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 50 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Limestone Calcination</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={limestoneCalcinationTonnes}
                      onChange={(e) => setLimestoneCalcinationTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 520 kg CO₂e/t (pure process)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Aluminum Industry */}
            {industryType === "aluminum" && (
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Aluminum Production (tonnes/year)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Primary Aluminum Smelting</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={primaryAluminumTonnes}
                      onChange={(e) => setPrimaryAluminumTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 12,000 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Alumina Refining</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={aluminaTonnes}
                      onChange={(e) => setAluminaTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 1,500 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Anode Production</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={anodeTonnes}
                      onChange={(e) => setAnodeTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 450 kg CO₂e/t</p>
                  </div>
                </div>
              </div>
            )}

            {/* Chemicals Industry */}
            {industryType === "chemicals" && (
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    Chemical Production (tonnes/year)
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Ammonia (NH₃)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={ammoniaTonnes}
                      onChange={(e) => setAmmoniaTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 1,800 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Nitric Acid (HNO₃)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={nitricAcidTonnes}
                      onChange={(e) => setNitricAcidTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 2,850 kg CO₂e/t (incl. N₂O)</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Hydrogen (H₂ - SMR)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={hydrogenTonnes}
                      onChange={(e) => setHydrogenTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 9,500 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Methanol</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={methanolTonnes}
                      onChange={(e) => setMethanolTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 670 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Ethylene</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={ethyleneTonnes}
                      onChange={(e) => setEthyleneTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 1,000 kg CO₂e/t</p>
                  </div>
                </div>
              </div>
            )}

            {/* Refinery Industry */}
            {industryType === "refinery" && (
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Flame className="h-4 w-4" />
                    Refinery Operations (annual)
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Crude Oil Processed (barrels)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={barrelProcessed}
                      onChange={(e) => setBarrelProcessed(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 25 kg CO₂e/barrel</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Gas Flaring (m³)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={flareVolumeM3}
                      onChange={(e) => setFlareVolumeM3(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 2.5 kg CO₂e/m³</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Catalytic Cracking (tonnes feed)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={catalyticCrackingTonnes}
                      onChange={(e) => setCatalyticCrackingTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 180 kg CO₂e/t</p>
                  </div>
                </div>
              </div>
            )}

            {/* Other Industries */}
            {industryType === "other" && (
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Other Industrial Processes (tonnes/year)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Glass Production</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={glassTonnes}
                      onChange={(e) => setGlassTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 580 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Pulp Production</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={pulpTonnes}
                      onChange={(e) => setPulpTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 450 kg CO₂e/t</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Iron Ore Mining</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={ironOreTonnes}
                      onChange={(e) => setIronOreTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 15 kg CO₂e/t ore</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Coal Mining</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={coalMiningTonnes}
                      onChange={(e) => setCoalMiningTonnes(e.target.value)}
                      min="0"
                    />
                    <p className="text-xs text-muted-foreground">EF: 25 kg CO₂e/t coal</p>
                  </div>
                </div>
              </div>
            )}

            <Card className="p-4 bg-red-500/10 border-red-500/20">
              <p className="text-sm text-muted-foreground">Total Process Emissions</p>
              <p className="text-2xl font-bold text-red-600">{(totalProcessEmissions / 1000).toFixed(2)} tCO₂e</p>
              <p className="text-xs text-muted-foreground mt-1">Included in Scope 1</p>
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
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Corporate GHG Inventory Summary
              </h3>
              <ShareReport 
                totalTonnes={totalTonnes} 
                treesNeeded={treesNeeded} 
                calculatorType="corporate" 
              />
            </div>

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
