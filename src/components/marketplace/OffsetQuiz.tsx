import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Leaf,
  Wind,
  Sun,
  Factory,
  TreePine,
  Droplets,
  Mountain,
  Users,
  BadgeCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface OffsetQuizProps {
  onComplete: (preferences: OffsetPreferences) => void;
}

interface OffsetPreferences {
  projectTypes: string[];
  locations: string[];
  budgetRange: string;
  priorities: string[];
}

const PROJECT_TYPES = [
  { id: "forestry", label: "Forestry & Reforestation", icon: TreePine },
  { id: "renewable", label: "Renewable Energy", icon: Wind },
  { id: "solar", label: "Solar Projects", icon: Sun },
  { id: "methane", label: "Methane Capture", icon: Factory },
  { id: "blue_carbon", label: "Blue Carbon (Coastal)", icon: Droplets },
  { id: "dac", label: "Direct Air Capture", icon: Mountain },
];

const LOCATIONS = [
  { id: "india", label: "India (Local Impact)" },
  { id: "south_asia", label: "South Asia" },
  { id: "africa", label: "Africa" },
  { id: "latin_america", label: "Latin America" },
  { id: "global", label: "Global / No Preference" },
];

const BUDGET_RANGES = [
  { id: "low", label: "₹500 - ₹1,000 per tonne" },
  { id: "medium", label: "₹1,000 - ₹2,000 per tonne" },
  { id: "high", label: "₹2,000 - ₹5,000 per tonne" },
  { id: "premium", label: "₹5,000+ per tonne (Premium)" },
];

const PRIORITIES = [
  { id: "verified", label: "Third-party verification (Gold Standard, Verra)", icon: BadgeCheck },
  { id: "community", label: "Community co-benefits", icon: Users },
  { id: "biodiversity", label: "Biodiversity impact", icon: Leaf },
  { id: "permanence", label: "Long-term permanence", icon: Mountain },
  { id: "additionality", label: "Strong additionality", icon: Sparkles },
];

export function OffsetQuiz({ onComplete }: OffsetQuizProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);

  const toggleProjectType = (id: string) => {
    setProjectTypes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleLocation = (id: string) => {
    setLocations((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const togglePriority = (id: string) => {
    setPriorities((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    const preferences: OffsetPreferences = {
      projectTypes,
      locations,
      budgetRange,
      priorities,
    };
    onComplete(preferences);
    setOpen(false);
    // Reset for next time
    setStep(1);
    setProjectTypes([]);
    setLocations([]);
    setBudgetRange("");
    setPriorities([]);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return projectTypes.length > 0;
      case 2:
        return locations.length > 0;
      case 3:
        return budgetRange !== "";
      case 4:
        return priorities.length > 0;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Find My Perfect Offset
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Carbon Offset Quiz</DialogTitle>
          <DialogDescription>
            Answer a few questions to find the perfect offset projects for you
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Progress indicator */}
          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium">What types of projects interest you?</h3>
              <p className="text-sm text-muted-foreground">Select all that apply</p>
              <div className="grid grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const selected = projectTypes.includes(type.id);
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleProjectType(type.id)}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-colors text-left ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium">Where would you like your impact?</h3>
              <p className="text-sm text-muted-foreground">Select preferred regions</p>
              <div className="space-y-2">
                {LOCATIONS.map((location) => {
                  const selected = locations.includes(location.id);
                  return (
                    <button
                      key={location.id}
                      onClick={() => toggleLocation(location.id)}
                      className={`flex items-center gap-3 w-full p-3 rounded-lg border transition-colors text-left ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <Checkbox checked={selected} />
                      <span>{location.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium">What's your budget per tonne of CO₂?</h3>
              <p className="text-sm text-muted-foreground">
                Higher prices often mean more rigorous verification
              </p>
              <RadioGroup value={budgetRange} onValueChange={setBudgetRange}>
                {BUDGET_RANGES.map((range) => (
                  <div key={range.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={range.id} id={range.id} />
                    <Label htmlFor={range.id} className="cursor-pointer flex-1 py-2">
                      {range.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-medium">What matters most to you?</h3>
              <p className="text-sm text-muted-foreground">Select your top priorities</p>
              <div className="space-y-2">
                {PRIORITIES.map((priority) => {
                  const Icon = priority.icon;
                  const selected = priorities.includes(priority.id);
                  return (
                    <button
                      key={priority.id}
                      onClick={() => togglePriority(priority.id)}
                      className={`flex items-center gap-3 w-full p-3 rounded-lg border transition-colors text-left ${
                        selected
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="flex-1">{priority.label}</span>
                      {selected && <BadgeCheck className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <div />
            )}
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={!canProceed()}>
                See Recommendations
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
