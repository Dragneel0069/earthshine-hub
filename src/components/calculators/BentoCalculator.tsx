import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Factory,
  Zap,
  Truck,
  Package,
  Flame,
  Car,
  Droplets,
  Hammer,
  Beaker,
  TreePine,
  Leaf,
  TrendingDown,
  Sparkles,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from "recharts";

// Emission factors
const EMISSION_FACTORS = {
  naturalGas: 2.0,
  diesel: 2.68,
  petrol: 2.31,
  lpg: 2.98,
  furnaceOil: 3.17,
  coal: 2420,
  dieselVehicle: 2.68,
  petrolVehicle: 2.31,
  refrigerantR410a: 2088,
  refrigerantR22: 1810,
  refrigerantR134a: 1430,
  electricityGrid: 0.82,
  purchasedGoods: 0.5,
  capitalGoods: 0.3,
  waste: 0.58,
  businessTravel: 0.255,
  employeeCommute: 0.15,
  downstreamTransport: 0.1,
  steelBOF: 1850,
  steelEAF: 580,
  steelDRI: 1200,
  cokeProduction: 770,
  cementClinker: 850,
  aluminumSmelting: 12000,
  ammoniaProduction: 1800,
  hydrogenProduction: 9500,
  refineryProcessing: 25,
};

interface MiniDonutProps {
  value: number;
  total: number;
  color: string;
}

const MiniDonut = ({ value, total, color }: MiniDonutProps) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const data = [
    { value: percentage, color },
    { value: 100 - percentage, color: "hsl(var(--muted))" },
  ];

  return (
    <div className="w-16 h-16">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={18}
            outerRadius={28}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MiniSparklineProps {
  data: number[];
  color: string;
}

const MiniSparkline = ({ data, color }: MiniSparklineProps) => {
  const chartData = data.map((value, index) => ({ value, index }));
  
  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={`url(#gradient-${color})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export function BentoCalculator() {
  // Section open states
  const [scope1Open, setScope1Open] = useState(true);
  const [scope2Open, setScope2Open] = useState(true);
  const [scope3Open, setScope3Open] = useState(true);
  const [processOpen, setProcessOpen] = useState(false);

  // Scope 1 inputs
  const [naturalGas, setNaturalGas] = useState("");
  const [dieselStationary, setDieselStationary] = useState("");
  const [furnaceOil, setFurnaceOil] = useState("");
  const [coalTonnes, setCoalTonnes] = useState("");
  const [fleetDiesel, setFleetDiesel] = useState("");
  const [fleetPetrol, setFleetPetrol] = useState("");
  const [refrigerantKg, setRefrigerantKg] = useState("");
  const [refrigerantType, setRefrigerantType] = useState("R410a");

  // Scope 2 inputs
  const [electricityKwh, setElectricityKwh] = useState("");
  const [renewablePercent, setRenewablePercent] = useState("");
  const [dgDiesel, setDgDiesel] = useState("");

  // Scope 3 inputs
  const [purchasedGoodsLakhs, setPurchasedGoodsLakhs] = useState("");
  const [wasteKg, setWasteKg] = useState("");
  const [recycledPercent, setRecycledPercent] = useState("");
  const [businessTravelKm, setBusinessTravelKm] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [avgCommute, setAvgCommute] = useState("");
  const [downstreamTransportTonneKm, setDownstreamTransportTonneKm] = useState("");

  // Process inputs
  const [industryType, setIndustryType] = useState("steel");
  const [steelBOFTonnes, setSteelBOFTonnes] = useState("");
  const [steelEAFTonnes, setSteelEAFTonnes] = useState("");
  const [clinkerTonnes, setClinkerTonnes] = useState("");
  const [primaryAluminumTonnes, setPrimaryAluminumTonnes] = useState("");
  const [ammoniaTonnes, setAmmoniaTonnes] = useState("");
  const [hydrogenTonnes, setHydrogenTonnes] = useState("");

  // Calculations
  const scope1Calculations = useMemo(() => {
    const stationary = 
      (parseFloat(naturalGas || "0") * EMISSION_FACTORS.naturalGas * 12) +
      (parseFloat(dieselStationary || "0") * EMISSION_FACTORS.diesel * 12) +
      (parseFloat(furnaceOil || "0") * EMISSION_FACTORS.furnaceOil * 12) +
      (parseFloat(coalTonnes || "0") * EMISSION_FACTORS.coal);

    const mobile = 
      (parseFloat(fleetDiesel || "0") * EMISSION_FACTORS.dieselVehicle * 12) +
      (parseFloat(fleetPetrol || "0") * EMISSION_FACTORS.petrolVehicle * 12);

    const refrigerantGWP = refrigerantType === "R410a" ? EMISSION_FACTORS.refrigerantR410a :
      refrigerantType === "R22" ? EMISSION_FACTORS.refrigerantR22 : EMISSION_FACTORS.refrigerantR134a;
    const fugitive = parseFloat(refrigerantKg || "0") * refrigerantGWP;

    return { stationary, mobile, fugitive, total: stationary + mobile + fugitive };
  }, [naturalGas, dieselStationary, furnaceOil, coalTonnes, fleetDiesel, fleetPetrol, refrigerantKg, refrigerantType]);

  const processCalculations = useMemo(() => {
    const steel = 
      (parseFloat(steelBOFTonnes || "0") * EMISSION_FACTORS.steelBOF) +
      (parseFloat(steelEAFTonnes || "0") * EMISSION_FACTORS.steelEAF);
    const cement = parseFloat(clinkerTonnes || "0") * EMISSION_FACTORS.cementClinker;
    const aluminum = parseFloat(primaryAluminumTonnes || "0") * EMISSION_FACTORS.aluminumSmelting;
    const chemical = 
      (parseFloat(ammoniaTonnes || "0") * EMISSION_FACTORS.ammoniaProduction) +
      (parseFloat(hydrogenTonnes || "0") * EMISSION_FACTORS.hydrogenProduction);

    return { steel, cement, aluminum, chemical, total: steel + cement + aluminum + chemical };
  }, [steelBOFTonnes, steelEAFTonnes, clinkerTonnes, primaryAluminumTonnes, ammoniaTonnes, hydrogenTonnes]);

  const scope2Calculations = useMemo(() => {
    const renewableFactor = 1 - (parseFloat(renewablePercent || "0") / 100);
    const grid = parseFloat(electricityKwh || "0") * EMISSION_FACTORS.electricityGrid * renewableFactor * 12;
    const dg = parseFloat(dgDiesel || "0") * EMISSION_FACTORS.diesel * 12;

    return { grid, dg, total: grid + dg };
  }, [electricityKwh, renewablePercent, dgDiesel]);

  const scope3Calculations = useMemo(() => {
    const purchasedGoods = parseFloat(purchasedGoodsLakhs || "0") * 100000 / 1000 * EMISSION_FACTORS.purchasedGoods;
    const recycleRate = parseFloat(recycledPercent || "0") / 100;
    const waste = parseFloat(wasteKg || "0") * (1 - recycleRate) * EMISSION_FACTORS.waste * 12;
    const businessTravel = parseFloat(businessTravelKm || "0") * EMISSION_FACTORS.businessTravel;
    const commute = parseFloat(employeeCount || "0") * parseFloat(avgCommute || "0") * 2 * 
      EMISSION_FACTORS.employeeCommute * 250;
    const downstream = parseFloat(downstreamTransportTonneKm || "0") * EMISSION_FACTORS.downstreamTransport;

    return { purchasedGoods, waste, businessTravel, commute, downstream, total: purchasedGoods + waste + businessTravel + commute + downstream };
  }, [purchasedGoodsLakhs, wasteKg, recycledPercent, businessTravelKm, employeeCount, avgCommute, downstreamTransportTonneKm]);

  const scope1Total = scope1Calculations.total + processCalculations.total;
  const scope2Total = scope2Calculations.total;
  const scope3Total = scope3Calculations.total;
  const totalKg = scope1Total + scope2Total + scope3Total;
  const totalTonnes = totalKg / 1000;
  const treesNeeded = Math.ceil(totalKg / 21);

  const pieData = [
    { name: "Scope 1", value: scope1Total, color: "hsl(24, 95%, 53%)" },
    { name: "Scope 2", value: scope2Total, color: "hsl(48, 96%, 53%)" },
    { name: "Scope 3", value: scope3Total, color: "hsl(217, 91%, 60%)" },
  ].filter(d => d.value > 0);

  const hasInput = totalKg > 0;

  const handleReset = () => {
    setNaturalGas("");
    setDieselStationary("");
    setFurnaceOil("");
    setCoalTonnes("");
    setFleetDiesel("");
    setFleetPetrol("");
    setRefrigerantKg("");
    setElectricityKwh("");
    setRenewablePercent("");
    setDgDiesel("");
    setPurchasedGoodsLakhs("");
    setWasteKg("");
    setRecycledPercent("");
    setBusinessTravelKm("");
    setEmployeeCount("");
    setAvgCommute("");
    setDownstreamTransportTonneKm("");
    setSteelBOFTonnes("");
    setSteelEAFTonnes("");
    setClinkerTonnes("");
    setPrimaryAluminumTonnes("");
    setAmmoniaTonnes("");
    setHydrogenTonnes("");
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Scope 1 - Large card */}
        <motion.div 
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Collapsible open={scope1Open} onOpenChange={setScope1Open}>
            <Card className="glass-strong border-orange-500/20 overflow-hidden">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-orange-500/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/20">
                        <Factory className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Scope 1 - Direct Emissions</CardTitle>
                        <p className="text-sm text-muted-foreground">Fuel combustion & fugitive</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-500">{(scope1Calculations.total / 1000).toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">tCO₂e</p>
                      </div>
                      <MiniDonut value={scope1Calculations.total} total={totalKg} color="hsl(24, 95%, 53%)" />
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${scope1Open ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6 pt-0">
                  {/* Stationary Combustion */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
                      <Flame className="h-4 w-4" />
                      Stationary Combustion
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Natural Gas (m³/mo)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={naturalGas}
                          onChange={(e) => setNaturalGas(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Diesel (L/mo)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={dieselStationary}
                          onChange={(e) => setDieselStationary(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Furnace Oil (L/mo)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={furnaceOil}
                          onChange={(e) => setFurnaceOil(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Coal (t/yr)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={coalTonnes}
                          onChange={(e) => setCoalTonnes(e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Combustion */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
                      <Car className="h-4 w-4" />
                      Fleet Vehicles
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Fleet Diesel (L/mo)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={fleetDiesel}
                          onChange={(e) => setFleetDiesel(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Fleet Petrol (L/mo)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={fleetPetrol}
                          onChange={(e) => setFleetPetrol(e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fugitive */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
                      <Droplets className="h-4 w-4" />
                      Refrigerants
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Leakage (kg/yr)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={refrigerantKg}
                          onChange={(e) => setRefrigerantKg(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Type</Label>
                        <Select value={refrigerantType} onValueChange={setRefrigerantType}>
                          <SelectTrigger className="h-9 bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background border">
                            <SelectItem value="R410a">R-410A</SelectItem>
                            <SelectItem value="R22">R-22</SelectItem>
                            <SelectItem value="R134a">R-134a</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </motion.div>

        {/* Scope 2 - Medium card */}
        <motion.div 
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Collapsible open={scope2Open} onOpenChange={setScope2Open}>
            <Card className="glass-strong border-yellow-500/20 h-full">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-yellow-500/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-500/20">
                        <Zap className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Scope 2</CardTitle>
                        <p className="text-sm text-muted-foreground">Purchased energy</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-500">{(scope2Total / 1000).toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">tCO₂e</p>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${scope2Open ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Grid Electricity (kWh/mo)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 100000"
                      value={electricityKwh}
                      onChange={(e) => setElectricityKwh(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Renewable Energy (%)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={renewablePercent}
                      onChange={(e) => setRenewablePercent(e.target.value)}
                      className="h-9"
                      max="100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">DG Backup Diesel (L/mo)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={dgDiesel}
                      onChange={(e) => setDgDiesel(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </motion.div>

        {/* Scope 3 - Full width */}
        <motion.div 
          className="lg:col-span-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Collapsible open={scope3Open} onOpenChange={setScope3Open}>
            <Card className="glass-strong border-blue-500/20">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-blue-500/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <Truck className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Scope 3 - Value Chain</CardTitle>
                        <p className="text-sm text-muted-foreground">Upstream & downstream activities</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-500">{(scope3Total / 1000).toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">tCO₂e</p>
                      </div>
                      <MiniDonut value={scope3Total} total={totalKg} color="hsl(217, 91%, 60%)" />
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${scope3Open ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1">
                        <Package className="h-3 w-3" /> Goods (₹L/yr)
                      </Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={purchasedGoodsLakhs}
                        onChange={(e) => setPurchasedGoodsLakhs(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Waste (kg/mo)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={wasteKg}
                        onChange={(e) => setWasteKg(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Recycled (%)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={recycledPercent}
                        onChange={(e) => setRecycledPercent(e.target.value)}
                        className="h-9"
                        max="100"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Air Travel (km/yr)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={businessTravelKm}
                        onChange={(e) => setBusinessTravelKm(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Employees</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={employeeCount}
                        onChange={(e) => setEmployeeCount(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Commute (km)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={avgCommute}
                        onChange={(e) => setAvgCommute(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Transport (t-km)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={downstreamTransportTonneKm}
                        onChange={(e) => setDownstreamTransportTonneKm(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </motion.div>

        {/* Process Emissions - Heavy Industry */}
        <motion.div 
          className="lg:col-span-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Collapsible open={processOpen} onOpenChange={setProcessOpen}>
            <Card className="glass-strong border-red-500/20">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-red-500/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/20">
                        <Hammer className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Process Emissions</CardTitle>
                        <p className="text-sm text-muted-foreground">Heavy industry (Steel, Cement, Chemicals)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-500">{(processCalculations.total / 1000).toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">tCO₂e</p>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${processOpen ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Industry Type</Label>
                    <Select value={industryType} onValueChange={setIndustryType}>
                      <SelectTrigger className="h-9 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border">
                        <SelectItem value="steel">🏭 Steel & Iron</SelectItem>
                        <SelectItem value="cement">🧱 Cement</SelectItem>
                        <SelectItem value="aluminum">⚡ Aluminum</SelectItem>
                        <SelectItem value="chemicals">🧪 Chemicals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {industryType === "steel" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">BOF Steel (t/yr) - EF: 1,850</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={steelBOFTonnes}
                          onChange={(e) => setSteelBOFTonnes(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">EAF Steel (t/yr) - EF: 580</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={steelEAFTonnes}
                          onChange={(e) => setSteelEAFTonnes(e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  )}

                  {industryType === "cement" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Clinker Production (t/yr) - EF: 850</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={clinkerTonnes}
                        onChange={(e) => setClinkerTonnes(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  )}

                  {industryType === "aluminum" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Primary Aluminum (t/yr) - EF: 12,000</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={primaryAluminumTonnes}
                        onChange={(e) => setPrimaryAluminumTonnes(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  )}

                  {industryType === "chemicals" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Ammonia (t/yr) - EF: 1,800</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={ammoniaTonnes}
                          onChange={(e) => setAmmoniaTonnes(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Hydrogen SMR (t/yr) - EF: 9,500</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={hydrogenTonnes}
                          onChange={(e) => setHydrogenTonnes(e.target.value)}
                          className="h-9"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </motion.div>

        {/* Quick Stats Card */}
        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-strong border-emerald-500/20 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-emerald-500" />
                Reduction Potential
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {parseFloat(steelBOFTonnes || "0") > 0 && (
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">BOF → EAF</span>
                    <span className="text-xs text-emerald-500 font-bold">-69%</span>
                  </div>
                  <Progress value={31} className="h-1.5" />
                </div>
              )}
              {parseFloat(hydrogenTonnes || "0") > 0 && (
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">Grey → Green H₂</span>
                    <span className="text-xs text-emerald-500 font-bold">-95%</span>
                  </div>
                  <Progress value={5} className="h-1.5" />
                </div>
              )}
              {parseFloat(electricityKwh || "0") > 0 && parseFloat(renewablePercent || "0") < 100 && (
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">100% Renewable</span>
                    <span className="text-xs text-emerald-500 font-bold">-100% S2</span>
                  </div>
                  <Progress value={0} className="h-1.5" />
                </div>
              )}
              {!hasInput && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Enter data to see reduction scenarios
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Floating Summary Bar */}
      <AnimatePresence>
        {hasInput && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-xl border-t border-primary/20"
          >
            <div className="container mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Pie Chart */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={30}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Scope Breakdown */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-muted-foreground">S1:</span>
                      <span className="font-semibold">{(scope1Total / 1000).toFixed(1)}t</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-muted-foreground">S2:</span>
                      <span className="font-semibold">{(scope2Total / 1000).toFixed(1)}t</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">S3:</span>
                      <span className="font-semibold">{(scope3Total / 1000).toFixed(1)}t</span>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{totalTonnes.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Total tCO₂e/year</p>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10">
                    <TreePine className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-emerald-500">{treesNeeded.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">trees to offset</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                    <Link to="/marketplace">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Leaf className="h-4 w-4 mr-1" />
                        Offset Now
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
