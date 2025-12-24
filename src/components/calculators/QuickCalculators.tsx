import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Car, Plane, Home, Factory, TreePine } from "lucide-react";

const EMISSION_FACTORS = {
  electricity: 0.82,
  petrolCar: 0.192,
  dieselCar: 0.171,
  motorcycle: 0.072,
  bus: 0.089,
  domesticFlight: 0.255,
  internationalFlight: 0.195,
  officePerSqm: 120,
  industrialPerTonne: 500,
};

interface QuickCalcProps {
  type: "electricity" | "transport" | "airTravel" | "building" | "industrial";
  trigger: React.ReactNode;
}

export function QuickCalculator({ type, trigger }: QuickCalcProps) {
  const [open, setOpen] = useState(false);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [selectValue, setSelectValue] = useState("petrol");

  const getConfig = () => {
    switch (type) {
      case "electricity":
        return {
          icon: Zap,
          title: "Electricity Calculator",
          label1: "Monthly Consumption (kWh)",
          placeholder1: "e.g., 500",
          factor: EMISSION_FACTORS.electricity,
          unit: "kg CO₂e/kWh",
          calculate: () => parseFloat(value1 || "0") * EMISSION_FACTORS.electricity * 12,
        };
      case "transport":
        return {
          icon: Car,
          title: "Transport Calculator",
          label1: "Weekly Distance (km)",
          placeholder1: "e.g., 100",
          hasSelect: true,
          calculate: () => {
            const factor = selectValue === "petrol" ? EMISSION_FACTORS.petrolCar :
              selectValue === "diesel" ? EMISSION_FACTORS.dieselCar :
              selectValue === "motorcycle" ? EMISSION_FACTORS.motorcycle : EMISSION_FACTORS.bus;
            return parseFloat(value1 || "0") * factor * 52;
          },
        };
      case "airTravel":
        return {
          icon: Plane,
          title: "Air Travel Calculator",
          label1: "Domestic Flights/Year",
          label2: "International Flights/Year",
          placeholder1: "e.g., 4",
          placeholder2: "e.g., 2",
          calculate: () => 
            (parseFloat(value1 || "0") * 1000 * EMISSION_FACTORS.domesticFlight) +
            (parseFloat(value2 || "0") * 5000 * EMISSION_FACTORS.internationalFlight),
        };
      case "building":
        return {
          icon: Home,
          title: "Building Energy Calculator",
          label1: "Office Area (sq.m)",
          placeholder1: "e.g., 500",
          calculate: () => parseFloat(value1 || "0") * EMISSION_FACTORS.officePerSqm,
        };
      case "industrial":
        return {
          icon: Factory,
          title: "Industrial Process Calculator",
          label1: "Production Output (tonnes/year)",
          placeholder1: "e.g., 1000",
          calculate: () => parseFloat(value1 || "0") * EMISSION_FACTORS.industrialPerTonne,
        };
    }
  };

  const config = getConfig();
  const emissions = config.calculate();
  const Icon = config.icon;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <SheetTitle>{config.title}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{config.label1}</Label>
            <Input
              type="number"
              placeholder={config.placeholder1}
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              min="0"
            />
          </div>

          {type === "transport" && (
            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Petrol Car</SelectItem>
                  <SelectItem value="diesel">Diesel Car</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {config.label2 && (
            <div className="space-y-2">
              <Label>{config.label2}</Label>
              <Input
                type="number"
                placeholder={config.placeholder2}
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                min="0"
              />
            </div>
          )}

          {parseFloat(value1 || "0") > 0 && (
            <Card className="p-4 bg-primary/5 border-primary/20 mt-6">
              <p className="text-sm text-muted-foreground">Annual Emissions</p>
              <p className="text-3xl font-bold text-primary">
                {(emissions / 1000).toFixed(2)} <span className="text-lg">tCO₂e</span>
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                <TreePine className="h-4 w-4" />
                {Math.ceil(emissions / 21)} trees needed to offset
              </div>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => { setValue1(""); setValue2(""); }}>
              Reset
            </Button>
            <Button className="flex-1" onClick={() => setOpen(false)}>Done</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
