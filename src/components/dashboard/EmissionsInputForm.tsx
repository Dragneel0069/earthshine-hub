import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Truck, Zap, Factory, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const categories = [
  { value: "transportation", label: "Transportation", icon: Truck, scope: "Scope 1" },
  { value: "electricity", label: "Electricity", icon: Zap, scope: "Scope 2" },
  { value: "manufacturing", label: "Manufacturing", icon: Factory, scope: "Scope 1" },
  { value: "purchased_goods", label: "Purchased Goods", icon: ShoppingCart, scope: "Scope 3" },
];

const units = [
  { value: "kg_co2e", label: "kg CO₂e" },
  { value: "tonnes_co2e", label: "tonnes CO₂e" },
  { value: "liters", label: "Liters (Fuel)" },
  { value: "kwh", label: "kWh (Electricity)" },
  { value: "km", label: "Kilometers" },
];

interface EmissionsInputFormProps {
  trigger?: React.ReactNode;
}

export function EmissionsInputForm({ trigger }: EmissionsInputFormProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");

  const selectedCategory = categories.find((c) => c.value === category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!date || !category || !quantity || !unit) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically save to database
    toast({
      title: "Emissions data logged ✓",
      description: `${quantity} ${units.find(u => u.value === unit)?.label} of ${selectedCategory?.label} recorded`,
    });

    // Reset form
    setDate(undefined);
    setCategory("");
    setQuantity("");
    setUnit("");
    setSource("");
    setNotes("");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Data
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl">Log Emissions Data</SheetTitle>
          <SheetDescription>
            Record your carbon emissions by category. All values will be converted to CO₂e.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select emission category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-3">
                      <cat.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{cat.label}</span>
                      <span className="text-xs text-muted-foreground">({cat.scope})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && (
              <p className="text-xs text-muted-foreground">
                This falls under {selectedCategory.scope} emissions
              </p>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label htmlFor="source">Source / Activity</Label>
            <Input
              id="source"
              placeholder="e.g., Delhi-Mumbai flight, Office electricity"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Estimated CO2e Preview */}
          {quantity && unit && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
              <p className="text-sm text-muted-foreground">Estimated Emissions</p>
              <p className="text-2xl font-bold text-primary">
                {unit === "tonnes_co2e" ? quantity : (parseFloat(quantity) * 0.001).toFixed(3)} tCO₂e
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ₹{(parseFloat(quantity) * (unit === "tonnes_co2e" ? 800 : 0.8)).toFixed(0)} carbon credit cost
              </p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Log Emissions
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
