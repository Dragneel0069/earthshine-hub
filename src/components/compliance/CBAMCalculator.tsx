import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  FileText,
  AlertTriangle,
  Calculator,
  TrendingUp,
  Info,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Euro,
  Factory,
  Ship,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  CBAM_PRODUCTS,
  CBAM_TIMELINE,
  INDIA_CBAM_EXPOSURE,
  calculateCBAMCost,
  getCurrentCBAMQuarter,
  getCBAMReportingDeadline,
  type CBAMProductEntry,
} from "@/data/cbam-framework";

interface ProductLine {
  id: string;
  productId: string;
  quantity: number;
  directEmissions: number;
  indirectEmissions: number;
}

export function CBAMCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [productLines, setProductLines] = useState<ProductLine[]>([
    { id: "1", productId: "", quantity: 0, directEmissions: 0, indirectEmissions: 0 },
  ]);
  const [euETSPrice, setEuETSPrice] = useState(85);
  const [domesticCarbonPrice, setDomesticCarbonPrice] = useState(0);

  const currentQuarter = getCurrentCBAMQuarter();
  const reportingDeadline = getCBAMReportingDeadline(currentQuarter.quarter, currentQuarter.year);
  const daysUntilDeadline = Math.ceil((reportingDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const addProductLine = () => {
    setProductLines([
      ...productLines,
      { id: Date.now().toString(), productId: "", quantity: 0, directEmissions: 0, indirectEmissions: 0 },
    ]);
  };

  const removeProductLine = (id: string) => {
    if (productLines.length > 1) {
      setProductLines(productLines.filter((p) => p.id !== id));
    }
  };

  const updateProductLine = (id: string, field: keyof ProductLine, value: string | number) => {
    setProductLines(
      productLines.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const calculations = useMemo(() => {
    const entries: CBAMProductEntry[] = productLines
      .filter((pl) => pl.productId && pl.quantity > 0)
      .map((pl) => {
        const product = CBAM_PRODUCTS.find((p) => p.id === pl.productId);
        const directEmissions = pl.directEmissions || (product?.defaultEmissionFactor || 0) * pl.quantity;
        const indirectEmissions = pl.indirectEmissions;
        return {
          productId: pl.productId,
          productName: product?.name || "",
          cnCode: product?.cnCode || "",
          quantity: pl.quantity,
          directEmissions,
          indirectEmissions,
          totalEmissions: directEmissions + indirectEmissions,
          verificationStatus: "pending" as const,
          countryOfOrigin: "India",
        };
      });

    const totalEmissions = entries.reduce((sum, e) => sum + e.totalEmissions, 0);
    const totalQuantity = entries.reduce((sum, e) => sum + e.quantity, 0);
    const costBreakdown = calculateCBAMCost(totalEmissions, euETSPrice, domesticCarbonPrice);

    return {
      entries,
      totalEmissions,
      totalQuantity,
      ...costBreakdown,
    };
  }, [productLines, euETSPrice, domesticCarbonPrice]);

  const handleDownloadReport = () => {
    toast.success("CBAM quarterly report generated", {
      description: `Q${currentQuarter.quarter} ${currentQuarter.year} report ready for download`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Deadline</p>
                <p className="font-semibold">
                  {reportingDeadline.toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <Badge
              variant={daysUntilDeadline < 30 ? "destructive" : "secondary"}
              className="mt-2"
            >
              {daysUntilDeadline} days remaining
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Euro className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">EU ETS Price</p>
                <p className="font-semibold">€{euETSPrice}/tCO₂e</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calculated Cost</p>
                <p className="font-semibold">
                  €{calculations.netCost.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Factory className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Emissions</p>
                <p className="font-semibold">{calculations.totalEmissions.toFixed(1)} tCO₂e</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="w-4 h-4" />
            Cost Calculator
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <Clock className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="exposure" className="gap-2">
            <Globe className="w-4 h-4" />
            India Exposure
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6 mt-4">
          {/* EU ETS Price Setting */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Euro className="w-5 h-5" />
                Carbon Price Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ets-price">EU ETS Price (€/tCO₂e)</Label>
                  <Input
                    id="ets-price"
                    type="number"
                    value={euETSPrice}
                    onChange={(e) => setEuETSPrice(Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current market price ~€80-90
                  </p>
                </div>
                <div>
                  <Label htmlFor="domestic-price">Domestic Carbon Price (€/tCO₂e)</Label>
                  <Input
                    id="domestic-price"
                    type="number"
                    value={domesticCarbonPrice}
                    onChange={(e) => setDomesticCarbonPrice(Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Carbon tax paid in India (deductible)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Lines */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ship className="w-5 h-5" />
                    Export Products
                  </CardTitle>
                  <CardDescription>Add products being exported to the EU</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addProductLine}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {productLines.map((line, index) => (
                      <motion.div
                        key={line.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-12 gap-3 items-end p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="col-span-4">
                          <Label className="text-xs">Product</Label>
                          <Select
                            value={line.productId}
                            onValueChange={(v) => updateProductLine(line.id, "productId", v)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {CBAM_PRODUCTS.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  <span className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {product.cnCode}
                                    </Badge>
                                    {product.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Quantity (tonnes)</Label>
                          <Input
                            type="number"
                            value={line.quantity || ""}
                            onChange={(e) =>
                              updateProductLine(line.id, "quantity", Number(e.target.value))
                            }
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Direct (tCO₂e)</Label>
                          <Input
                            type="number"
                            value={line.directEmissions || ""}
                            onChange={(e) =>
                              updateProductLine(line.id, "directEmissions", Number(e.target.value))
                            }
                            placeholder="Auto"
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Indirect (tCO₂e)</Label>
                          <Input
                            type="number"
                            value={line.indirectEmissions || ""}
                            onChange={(e) =>
                              updateProductLine(line.id, "indirectEmissions", Number(e.target.value))
                            }
                            placeholder="0"
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          {line.productId && (
                            <Badge variant="secondary">
                              {(
                                (line.directEmissions ||
                                  (CBAM_PRODUCTS.find((p) => p.id === line.productId)
                                    ?.defaultEmissionFactor || 0) *
                                    line.quantity) + line.indirectEmissions
                              ).toFixed(1)}{" "}
                              tCO₂e
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProductLine(line.id)}
                            disabled={productLines.length === 1}
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Cost Summary */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">CBAM Cost Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Quantity</span>
                    <span className="font-medium">{calculations.totalQuantity.toFixed(1)} tonnes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Embedded Emissions</span>
                    <span className="font-medium">{calculations.totalEmissions.toFixed(1)} tCO₂e</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross CBAM Cost</span>
                    <span className="font-medium">
                      €{calculations.grossCost.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Less: Domestic Carbon Price Credit</span>
                    <span>
                      -€{calculations.deductible.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Net CBAM Liability</span>
                    <span className="text-primary">
                      €{calculations.netCost.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      During the transitional period (until Dec 2025), only reporting is required.
                      Financial obligations begin January 2026.
                    </AlertDescription>
                  </Alert>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleDownloadReport}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Submit to EU
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6 mt-4">
          <div className="space-y-6">
            {CBAM_TIMELINE.map((phase, index) => (
              <Card key={phase.phase}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === 0 ? "bg-amber-500/20 text-amber-500" : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {index === 0 ? <Clock className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div>
                      <CardTitle>{phase.phase}</CardTitle>
                      <CardDescription>
                        {new Date(phase.startDate).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        - {phase.endDate ? new Date(phase.endDate).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        }) : "Ongoing"}
                      </CardDescription>
                    </div>
                    {index === 0 && (
                      <Badge className="ml-auto bg-amber-500">Current Phase</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {phase.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exposure" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                India's CBAM Exposure
              </CardTitle>
              <CardDescription>
                Estimated impact on Indian exports to the European Union
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Total CBAM-affected exports to EU ({INDIA_CBAM_EXPOSURE.totalExportsToEU.year})
                  </span>
                  <span className="font-bold text-lg">
                    €{INDIA_CBAM_EXPOSURE.totalExportsToEU.value}B
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {INDIA_CBAM_EXPOSURE.affectedSectors.map((sector) => (
                  <div key={sector.sector} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{sector.sector}</h4>
                      <Badge variant="outline">€{sector.exportValue}B exports</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Est. CBAM Cost:{" "}
                        <span className="text-destructive font-medium">€{sector.estimatedCBAMCost}M/year</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sector.majorProducts.map((product) => (
                        <Badge key={product} variant="secondary" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                    <Progress
                      value={(sector.exportValue / INDIA_CBAM_EXPOSURE.totalExportsToEU.value) * 100}
                      className="h-1.5 mt-3"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Action Required:</strong> Indian exporters should start measuring and verifying
              embedded emissions now to prepare for CBAM certificate purchases starting January 2026.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}
