import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Zap,
  Wind,
  Sun,
  Droplets,
  Leaf,
  Plus,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

interface REC {
  id: string;
  projectName: string;
  energySource: string;
  quantityMwh: number;
  vintageYear: number;
  registry: string;
  pricePerMwh: number;
  location: string;
  verified: boolean;
}

const SAMPLE_RECS: REC[] = [
  {
    id: "1",
    projectName: "Gujarat Solar Park",
    energySource: "Solar",
    quantityMwh: 1000,
    vintageYear: 2024,
    registry: "I-REC",
    pricePerMwh: 150,
    location: "Gujarat, India",
    verified: true,
  },
  {
    id: "2",
    projectName: "Tamil Nadu Wind Farm",
    energySource: "Wind",
    quantityMwh: 500,
    vintageYear: 2024,
    registry: "I-REC",
    pricePerMwh: 180,
    location: "Tamil Nadu, India",
    verified: true,
  },
  {
    id: "3",
    projectName: "Karnataka Small Hydro",
    energySource: "Hydro",
    quantityMwh: 250,
    vintageYear: 2023,
    registry: "REC Registry India",
    pricePerMwh: 200,
    location: "Karnataka, India",
    verified: true,
  },
  {
    id: "4",
    projectName: "Rajasthan Solar Project",
    energySource: "Solar",
    quantityMwh: 2000,
    vintageYear: 2024,
    registry: "I-REC",
    pricePerMwh: 140,
    location: "Rajasthan, India",
    verified: true,
  },
];

const getEnergyIcon = (source: string) => {
  switch (source.toLowerCase()) {
    case "solar":
      return Sun;
    case "wind":
      return Wind;
    case "hydro":
      return Droplets;
    default:
      return Zap;
  }
};

const getEnergyColor = (source: string) => {
  switch (source.toLowerCase()) {
    case "solar":
      return "text-yellow-600 bg-yellow-100";
    case "wind":
      return "text-blue-600 bg-blue-100";
    case "hydro":
      return "text-cyan-600 bg-cyan-100";
    default:
      return "text-green-600 bg-green-100";
  }
};

export function RECsSection() {
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState<REC | null>(null);
  const [quantity, setQuantity] = useState("1");

  const handlePurchase = (rec: REC) => {
    setSelectedRec(rec);
    setQuantity("1");
    setPurchaseDialogOpen(true);
  };

  const confirmPurchase = () => {
    if (!selectedRec) return;
    const qty = parseInt(quantity);
    const total = qty * selectedRec.pricePerMwh;
    toast.success(
      `Successfully purchased ${qty} MWh of RECs from ${selectedRec.projectName} for ₹${total.toLocaleString()}`
    );
    setPurchaseDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Renewable Energy Certificates (RECs)</h2>
          <p className="text-muted-foreground">
            Purchase RECs to claim renewable energy usage for Scope 2 emissions
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Leaf className="h-3 w-3" />
          Scope 2 Reduction
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
                <Sun className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3,000+ MWh</p>
                <p className="text-sm text-muted-foreground">Solar RECs available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Wind className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">500+ MWh</p>
                <p className="text-sm text-muted-foreground">Wind RECs available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹140-200</p>
                <p className="text-sm text-muted-foreground">Price per MWh</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* REC Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_RECS.map((rec) => {
          const Icon = getEnergyIcon(rec.energySource);
          const colorClasses = getEnergyColor(rec.energySource);
          
          return (
            <Card key={rec.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClasses.split(" ")[1]}`}>
                      <Icon className={`h-5 w-5 ${colorClasses.split(" ")[0]}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{rec.projectName}</CardTitle>
                      <CardDescription>{rec.location}</CardDescription>
                    </div>
                  </div>
                  {rec.verified && (
                    <Badge variant="secondary" className="gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Energy Source</p>
                    <p className="font-medium">{rec.energySource}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vintage</p>
                    <p className="font-medium">{rec.vintageYear}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Available</p>
                    <p className="font-medium">{rec.quantityMwh.toLocaleString()} MWh</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Registry</p>
                    <p className="font-medium">{rec.registry}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ₹{rec.pricePerMwh}
                    </p>
                    <p className="text-xs text-muted-foreground">per MWh</p>
                  </div>
                  <Button onClick={() => handlePurchase(rec)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Purchase
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Purchase Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase RECs</DialogTitle>
            <DialogDescription>
              {selectedRec?.projectName} - {selectedRec?.energySource}
            </DialogDescription>
          </DialogHeader>
          {selectedRec && (
            <div className="space-y-4 mt-4">
              <div className="p-4 rounded-lg bg-muted">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Price per MWh:</span>
                  </div>
                  <div className="font-medium">₹{selectedRec.pricePerMwh}</div>
                  <div>
                    <span className="text-muted-foreground">Available:</span>
                  </div>
                  <div className="font-medium">{selectedRec.quantityMwh} MWh</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (MWh)</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedRec.quantityMwh}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-lg bg-primary/10">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{(parseInt(quantity || "0") * selectedRec.pricePerMwh).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Offsets approximately {(parseInt(quantity || "0") * 0.82).toFixed(1)} tCO₂e
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPurchaseDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmPurchase}
                  disabled={!quantity || parseInt(quantity) < 1}
                  className="flex-1"
                >
                  Confirm Purchase
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
