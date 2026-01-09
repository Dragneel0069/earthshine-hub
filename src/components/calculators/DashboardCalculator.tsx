import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Factory,
  Zap,
  Truck,
  Flame,
  Car,
  Droplets,
  Beaker,
  TreePine,
  Leaf,
  TrendingDown,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Circle,
  Package,
  Building,
  Plane,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

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
  cementClinker: 850,
  aluminumSmelting: 12000,
  ammoniaProduction: 1800,
  hydrogenProduction: 9500,
};

type ScopeId = "scope1" | "scope2" | "scope3" | "process";

interface NavItem {
  id: ScopeId;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const navItems: NavItem[] = [
  { id: "scope1", label: "Scope 1", icon: Factory, color: "text-orange-500", bgColor: "bg-orange-500/20" },
  { id: "scope2", label: "Scope 2", icon: Zap, color: "text-yellow-500", bgColor: "bg-yellow-500/20" },
  { id: "scope3", label: "Scope 3", icon: Truck, color: "text-blue-500", bgColor: "bg-blue-500/20" },
  { id: "process", label: "Process", icon: Beaker, color: "text-purple-500", bgColor: "bg-purple-500/20" },
];

export function DashboardCalculator() {
  const [activeScope, setActiveScope] = useState<ScopeId>("scope1");

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

  const scope1Total = scope1Calculations.total;
  const scope2Total = scope2Calculations.total;
  const scope3Total = scope3Calculations.total;
  const processTotal = processCalculations.total;
  const totalKg = scope1Total + scope2Total + scope3Total + processTotal;
  const totalTonnes = totalKg / 1000;
  const treesNeeded = Math.ceil(totalKg / 21);

  // Progress calculation
  const scope1HasInput = naturalGas || dieselStationary || furnaceOil || coalTonnes || fleetDiesel || fleetPetrol || refrigerantKg;
  const scope2HasInput = electricityKwh || dgDiesel;
  const scope3HasInput = purchasedGoodsLakhs || wasteKg || businessTravelKm || employeeCount || downstreamTransportTonneKm;
  const processHasInput = steelBOFTonnes || steelEAFTonnes || clinkerTonnes || primaryAluminumTonnes || ammoniaTonnes || hydrogenTonnes;

  const completedScopes = [scope1HasInput, scope2HasInput, scope3HasInput, processHasInput].filter(Boolean).length;
  const overallProgress = (completedScopes / 4) * 100;

  const pieData = [
    { name: "Scope 1", value: scope1Total, color: "hsl(24, 95%, 53%)" },
    { name: "Scope 2", value: scope2Total, color: "hsl(48, 96%, 53%)" },
    { name: "Scope 3", value: scope3Total, color: "hsl(217, 91%, 60%)" },
    { name: "Process", value: processTotal, color: "hsl(271, 91%, 60%)" },
  ].filter(d => d.value > 0);

  const barData = [
    { name: "S1", value: scope1Total / 1000, fill: "hsl(24, 95%, 53%)" },
    { name: "S2", value: scope2Total / 1000, fill: "hsl(48, 96%, 53%)" },
    { name: "S3", value: scope3Total / 1000, fill: "hsl(217, 91%, 60%)" },
    { name: "Proc", value: processTotal / 1000, fill: "hsl(271, 91%, 60%)" },
  ];

  const handleReset = () => {
    setNaturalGas(""); setDieselStationary(""); setFurnaceOil(""); setCoalTonnes("");
    setFleetDiesel(""); setFleetPetrol(""); setRefrigerantKg("");
    setElectricityKwh(""); setRenewablePercent(""); setDgDiesel("");
    setPurchasedGoodsLakhs(""); setWasteKg(""); setRecycledPercent("");
    setBusinessTravelKm(""); setEmployeeCount(""); setAvgCommute("");
    setDownstreamTransportTonneKm("");
    setSteelBOFTonnes(""); setSteelEAFTonnes(""); setClinkerTonnes("");
    setPrimaryAluminumTonnes(""); setAmmoniaTonnes(""); setHydrogenTonnes("");
  };

  const getScopeStatus = (id: ScopeId) => {
    switch (id) {
      case "scope1": return !!scope1HasInput;
      case "scope2": return !!scope2HasInput;
      case "scope3": return !!scope3HasInput;
      case "process": return !!processHasInput;
    }
  };

  const getScopeValue = (id: ScopeId) => {
    switch (id) {
      case "scope1": return scope1Total;
      case "scope2": return scope2Total;
      case "scope3": return scope3Total;
      case "process": return processTotal;
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[600px] gap-6">
      {/* Sidebar Navigation */}
      <motion.div 
        className="w-64 shrink-0"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="h-full bg-card border border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Emission Scopes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = activeScope === item.id;
              const isComplete = getScopeStatus(item.id);
              const value = getScopeValue(item.id);

              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveScope(item.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    isActive 
                      ? "bg-primary/10 border border-primary/30 shadow-sm" 
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.bgColor}`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                          {item.label}
                        </span>
                        {isComplete ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {value > 0 ? `${(value / 1000).toFixed(1)} tCO₂e` : "Not started"}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}

            {/* Progress indicator */}
            <div className="pt-6 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Completion</span>
                <span className="text-primary font-medium">{completedScopes}/4 scopes</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            {/* Reset button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="w-full mt-4 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Calculator Area */}
      <motion.div 
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="h-full bg-card border border-border shadow-sm overflow-hidden">
          {/* Progress Stepper */}
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              {navItems.map((item, index) => {
                const isActive = activeScope === item.id;
                const isComplete = getScopeStatus(item.id);
                
                return (
                  <div key={item.id} className="flex items-center">
                    <button
                      onClick={() => setActiveScope(item.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : isComplete 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      {isComplete && !isActive && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </button>
                    {index < navItems.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${isComplete ? "bg-primary/40" : "bg-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calculator Content */}
          <ScrollArea className="h-[calc(100%-64px)]">
            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeScope === "scope1" && (
                  <Scope1Form
                    key="scope1"
                    naturalGas={naturalGas} setNaturalGas={setNaturalGas}
                    dieselStationary={dieselStationary} setDieselStationary={setDieselStationary}
                    furnaceOil={furnaceOil} setFurnaceOil={setFurnaceOil}
                    coalTonnes={coalTonnes} setCoalTonnes={setCoalTonnes}
                    fleetDiesel={fleetDiesel} setFleetDiesel={setFleetDiesel}
                    fleetPetrol={fleetPetrol} setFleetPetrol={setFleetPetrol}
                    refrigerantKg={refrigerantKg} setRefrigerantKg={setRefrigerantKg}
                    refrigerantType={refrigerantType} setRefrigerantType={setRefrigerantType}
                  />
                )}
                {activeScope === "scope2" && (
                  <Scope2Form
                    key="scope2"
                    electricityKwh={electricityKwh} setElectricityKwh={setElectricityKwh}
                    renewablePercent={renewablePercent} setRenewablePercent={setRenewablePercent}
                    dgDiesel={dgDiesel} setDgDiesel={setDgDiesel}
                  />
                )}
                {activeScope === "scope3" && (
                  <Scope3Form
                    key="scope3"
                    purchasedGoodsLakhs={purchasedGoodsLakhs} setPurchasedGoodsLakhs={setPurchasedGoodsLakhs}
                    wasteKg={wasteKg} setWasteKg={setWasteKg}
                    recycledPercent={recycledPercent} setRecycledPercent={setRecycledPercent}
                    businessTravelKm={businessTravelKm} setBusinessTravelKm={setBusinessTravelKm}
                    employeeCount={employeeCount} setEmployeeCount={setEmployeeCount}
                    avgCommute={avgCommute} setAvgCommute={setAvgCommute}
                    downstreamTransportTonneKm={downstreamTransportTonneKm} setDownstreamTransportTonneKm={setDownstreamTransportTonneKm}
                  />
                )}
                {activeScope === "process" && (
                  <ProcessForm
                    key="process"
                    steelBOFTonnes={steelBOFTonnes} setSteelBOFTonnes={setSteelBOFTonnes}
                    steelEAFTonnes={steelEAFTonnes} setSteelEAFTonnes={setSteelEAFTonnes}
                    clinkerTonnes={clinkerTonnes} setClinkerTonnes={setClinkerTonnes}
                    primaryAluminumTonnes={primaryAluminumTonnes} setPrimaryAluminumTonnes={setPrimaryAluminumTonnes}
                    ammoniaTonnes={ammoniaTonnes} setAmmoniaTonnes={setAmmoniaTonnes}
                    hydrogenTonnes={hydrogenTonnes} setHydrogenTonnes={setHydrogenTonnes}
                  />
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </Card>
      </motion.div>

      {/* Fixed Results Panel */}
      <motion.div 
        className="w-80 shrink-0"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="h-full bg-card border border-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingDown className="h-5 w-5 text-primary" />
              Real-time Results
            </CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-64px)]">
            <CardContent className="p-4 space-y-6">
              {/* Total Emissions */}
              <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Total Emissions</p>
                <motion.p 
                  className="text-4xl font-bold text-primary"
                  key={totalTonnes}
                  initial={{ scale: 1.1, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {totalTonnes.toFixed(1)}
                </motion.p>
                <p className="text-sm text-muted-foreground">tCO₂e/year</p>
              </div>

              {/* Pie Chart */}
              {pieData.length > 0 && (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Legend */}
              <div className="space-y-2">
                {[
                  { label: "Scope 1", value: scope1Total, color: "bg-orange-500" },
                  { label: "Scope 2", value: scope2Total, color: "bg-yellow-500" },
                  { label: "Scope 3", value: scope3Total, color: "bg-blue-500" },
                  { label: "Process", value: processTotal, color: "bg-purple-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="font-medium text-foreground">{(item.value / 1000).toFixed(1)} t</span>
                  </div>
                ))}
              </div>

              {/* Bar Chart */}
              <div className="h-32 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis hide />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const val = payload[0].value;
                          return (
                            <div className="bg-card border border-border rounded-lg px-3 py-2 text-sm shadow-sm">
                              {typeof val === 'number' ? val.toFixed(1) : val} tCO₂e
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Trees needed */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TreePine className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trees to offset</p>
                    <p className="text-xl font-bold text-foreground">{treesNeeded.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-2">
                <Link to="/marketplace" className="block">
                  <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Leaf className="h-4 w-4" />
                    Offset Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/reports" className="block">
                  <Button variant="outline" className="w-full gap-2 border-border">
                    Generate BRSR Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </motion.div>
    </div>
  );
}

// Form Components
interface FormProps {
  [key: string]: string | ((value: string) => void);
}

function Scope1Form({
  naturalGas, setNaturalGas,
  dieselStationary, setDieselStationary,
  furnaceOil, setFurnaceOil,
  coalTonnes, setCoalTonnes,
  fleetDiesel, setFleetDiesel,
  fleetPetrol, setFleetPetrol,
  refrigerantKg, setRefrigerantKg,
  refrigerantType, setRefrigerantType,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Factory className="h-5 w-5 text-orange-500" />
          Scope 1 - Direct Emissions
        </h3>
        <p className="text-sm text-muted-foreground">Emissions from sources owned or controlled by your organization</p>
      </div>

      {/* Stationary Combustion */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
          <Flame className="h-4 w-4" />
          Stationary Combustion
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Natural Gas (m³/month)" value={naturalGas} onChange={setNaturalGas} />
          <InputField label="Diesel (L/month)" value={dieselStationary} onChange={setDieselStationary} />
          <InputField label="Furnace Oil (L/month)" value={furnaceOil} onChange={setFurnaceOil} />
          <InputField label="Coal (tonnes/year)" value={coalTonnes} onChange={setCoalTonnes} />
        </div>
      </div>

      {/* Mobile Combustion */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
          <Car className="h-4 w-4" />
          Fleet Vehicles
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Fleet Diesel (L/month)" value={fleetDiesel} onChange={setFleetDiesel} />
          <InputField label="Fleet Petrol (L/month)" value={fleetPetrol} onChange={setFleetPetrol} />
        </div>
      </div>

      {/* Fugitive Emissions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
          <Droplets className="h-4 w-4" />
          Refrigerant Leakage
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Refrigerant Leakage (kg/year)" value={refrigerantKg} onChange={setRefrigerantKg} />
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Refrigerant Type</Label>
            <Select value={refrigerantType} onValueChange={setRefrigerantType}>
              <SelectTrigger className="bg-background">
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
    </motion.div>
  );
}

function Scope2Form({
  electricityKwh, setElectricityKwh,
  renewablePercent, setRenewablePercent,
  dgDiesel, setDgDiesel,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Scope 2 - Indirect Energy Emissions
        </h3>
        <p className="text-sm text-muted-foreground">Emissions from purchased electricity and energy</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-yellow-500">
          <Building className="h-4 w-4" />
          Purchased Electricity
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Grid Electricity (kWh/month)" value={electricityKwh} onChange={setElectricityKwh} />
          <InputField label="Renewable Energy (%)" value={renewablePercent} onChange={setRenewablePercent} placeholder="0-100" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-yellow-500">
          <Factory className="h-4 w-4" />
          Diesel Generator
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="DG Set Diesel (L/month)" value={dgDiesel} onChange={setDgDiesel} />
        </div>
      </div>
    </motion.div>
  );
}

function Scope3Form({
  purchasedGoodsLakhs, setPurchasedGoodsLakhs,
  wasteKg, setWasteKg,
  recycledPercent, setRecycledPercent,
  businessTravelKm, setBusinessTravelKm,
  employeeCount, setEmployeeCount,
  avgCommute, setAvgCommute,
  downstreamTransportTonneKm, setDownstreamTransportTonneKm,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Truck className="h-5 w-5 text-blue-500" />
          Scope 3 - Value Chain Emissions
        </h3>
        <p className="text-sm text-muted-foreground">Emissions from upstream and downstream activities</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
          <Package className="h-4 w-4" />
          Purchased Goods & Waste
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Purchased Goods (₹ Lakhs)" value={purchasedGoodsLakhs} onChange={setPurchasedGoodsLakhs} />
          <InputField label="Waste Generated (kg/month)" value={wasteKg} onChange={setWasteKg} />
          <InputField label="Waste Recycled (%)" value={recycledPercent} onChange={setRecycledPercent} placeholder="0-100" />
          <InputField label="Downstream Transport (tonne-km)" value={downstreamTransportTonneKm} onChange={setDownstreamTransportTonneKm} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
          <Plane className="h-4 w-4" />
          Business Travel
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Air Travel (km/year)" value={businessTravelKm} onChange={setBusinessTravelKm} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
          <Users className="h-4 w-4" />
          Employee Commute
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Number of Employees" value={employeeCount} onChange={setEmployeeCount} />
          <InputField label="Avg. Commute Distance (km)" value={avgCommute} onChange={setAvgCommute} />
        </div>
      </div>
    </motion.div>
  );
}

function ProcessForm({
  steelBOFTonnes, setSteelBOFTonnes,
  steelEAFTonnes, setSteelEAFTonnes,
  clinkerTonnes, setClinkerTonnes,
  primaryAluminumTonnes, setPrimaryAluminumTonnes,
  ammoniaTonnes, setAmmoniaTonnes,
  hydrogenTonnes, setHydrogenTonnes,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Beaker className="h-5 w-5 text-purple-500" />
          Process Emissions
        </h3>
        <p className="text-sm text-muted-foreground">Emissions from industrial chemical processes</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Steel BOF (tonnes/year)" value={steelBOFTonnes} onChange={setSteelBOFTonnes} />
        <InputField label="Steel EAF (tonnes/year)" value={steelEAFTonnes} onChange={setSteelEAFTonnes} />
        <InputField label="Cement Clinker (tonnes/year)" value={clinkerTonnes} onChange={setClinkerTonnes} />
        <InputField label="Primary Aluminum (tonnes/year)" value={primaryAluminumTonnes} onChange={setPrimaryAluminumTonnes} />
        <InputField label="Ammonia (tonnes/year)" value={ammoniaTonnes} onChange={setAmmoniaTonnes} />
        <InputField label="Hydrogen (tonnes/year)" value={hydrogenTonnes} onChange={setHydrogenTonnes} />
      </div>
    </motion.div>
  );
}

function InputField({ label, value, onChange, placeholder = "0" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <Input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background border-border focus:border-primary"
      />
    </div>
  );
}
