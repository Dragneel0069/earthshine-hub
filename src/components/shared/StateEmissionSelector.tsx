import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";

interface StateEmissionData {
  name: string;
  code: string;
  emissionFactor: number;
}

const indianStates: StateEmissionData[] = [
  { name: "Andhra Pradesh", code: "AP", emissionFactor: 0.79 },
  { name: "Arunachal Pradesh", code: "AR", emissionFactor: 0.42 },
  { name: "Assam", code: "AS", emissionFactor: 0.68 },
  { name: "Bihar", code: "BR", emissionFactor: 0.82 },
  { name: "Chhattisgarh", code: "CG", emissionFactor: 0.96 },
  { name: "Delhi", code: "DL", emissionFactor: 0.71 },
  { name: "Goa", code: "GA", emissionFactor: 0.64 },
  { name: "Gujarat", code: "GJ", emissionFactor: 0.78 },
  { name: "Haryana", code: "HR", emissionFactor: 0.77 },
  { name: "Himachal Pradesh", code: "HP", emissionFactor: 0.32 },
  { name: "Jharkhand", code: "JH", emissionFactor: 0.91 },
  { name: "Karnataka", code: "KA", emissionFactor: 0.58 },
  { name: "Kerala", code: "KL", emissionFactor: 0.47 },
  { name: "Madhya Pradesh", code: "MP", emissionFactor: 0.84 },
  { name: "Maharashtra", code: "MH", emissionFactor: 0.72 },
  { name: "Manipur", code: "MN", emissionFactor: 0.45 },
  { name: "Meghalaya", code: "ML", emissionFactor: 0.52 },
  { name: "Mizoram", code: "MZ", emissionFactor: 0.38 },
  { name: "Nagaland", code: "NL", emissionFactor: 0.48 },
  { name: "Odisha", code: "OD", emissionFactor: 0.88 },
  { name: "Punjab", code: "PB", emissionFactor: 0.76 },
  { name: "Rajasthan", code: "RJ", emissionFactor: 0.81 },
  { name: "Sikkim", code: "SK", emissionFactor: 0.28 },
  { name: "Tamil Nadu", code: "TN", emissionFactor: 0.75 },
  { name: "Telangana", code: "TS", emissionFactor: 0.74 },
  { name: "Tripura", code: "TR", emissionFactor: 0.56 },
  { name: "Uttar Pradesh", code: "UP", emissionFactor: 0.79 },
  { name: "Uttarakhand", code: "UK", emissionFactor: 0.35 },
  { name: "West Bengal", code: "WB", emissionFactor: 0.83 },
];

interface StateEmissionSelectorProps {
  value?: string;
  onSelect?: (state: StateEmissionData) => void;
  className?: string;
}

export function StateEmissionSelector({
  value,
  onSelect,
  className,
}: StateEmissionSelectorProps) {
  const [selectedState, setSelectedState] = useState<StateEmissionData | null>(
    value ? indianStates.find((s) => s.code === value) || null : null
  );

  const handleSelect = (code: string) => {
    const state = indianStates.find((s) => s.code === code);
    if (state) {
      setSelectedState(state);
      onSelect?.(state);
    }
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium mb-2 block">
        Select State (Grid Emission Factor)
      </Label>
      <Select value={selectedState?.code} onValueChange={handleSelect}>
        <SelectTrigger className="w-full bg-background border-border">
          <SelectValue placeholder="Select your state" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50 max-h-[300px]">
          {indianStates.map((state) => (
            <SelectItem
              key={state.code}
              value={state.code}
              className="hover:bg-accent cursor-pointer"
            >
              <div className="flex items-center justify-between w-full gap-4">
                <span>{state.name}</span>
                <span className="text-muted-foreground text-xs">
                  {state.emissionFactor} kg CO₂/kWh
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedState && (
        <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-medium">{selectedState.name}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Grid Emission Factor:{" "}
            <span className="font-semibold text-foreground">
              {selectedState.emissionFactor} kg CO₂/kWh
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export { indianStates };
export type { StateEmissionData };
