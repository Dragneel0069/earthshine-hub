import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Trash2, Calculator } from 'lucide-react';
import { calculateSupplyChainFootprint } from '@/lib/carbon-calculations';

interface Supplier {
  id: string;
  name: string;
  category: string;
  spend: number;
  emissionIntensity: number;
}

const EMISSION_INTENSITIES: Record<string, number> = {
  'raw_materials': 0.025, // kg CO2e per INR
  'manufacturing': 0.018,
  'logistics': 0.012,
  'packaging': 0.015,
  'it_services': 0.005,
  'professional_services': 0.003,
};

export const SupplyChainCalculator = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: '1', name: '', category: 'raw_materials', spend: 0, emissionIntensity: 0.025 }
  ]);
  const [result, setResult] = useState<any>(null);

  const addSupplier = () => {
    setSuppliers([
      ...suppliers,
      { 
        id: Date.now().toString(), 
        name: '', 
        category: 'raw_materials', 
        spend: 0, 
        emissionIntensity: 0.025 
      }
    ]);
  };

  const removeSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const updateSupplier = (id: string, field: keyof Supplier, value: any) => {
    setSuppliers(suppliers.map(s => {
      if (s.id === id) {
        const updated = { ...s, [field]: value };
        if (field === 'category') {
          updated.emissionIntensity = EMISSION_INTENSITIES[value as string];
        }
        return updated;
      }
      return s;
    }));
  };

  const handleCalculate = () => {
    const validSuppliers = suppliers.filter(s => s.name && s.spend > 0);
    
    if (validSuppliers.length === 0) {
      return;
    }

    const calculationResult = calculateSupplyChainFootprint({
      suppliers: validSuppliers
    });

    setResult(calculationResult);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Supply Chain Emissions Calculator
        </CardTitle>
        <CardDescription>
          Estimate Scope 3 emissions from your supply chain based on spend data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {suppliers.map((supplier, index) => (
            <div key={supplier.id} className="p-4 rounded-lg border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Supplier {index + 1}</h4>
                {suppliers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSupplier(supplier.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Supplier Name</Label>
                  <Input
                    placeholder="e.g., ABC Steel Ltd"
                    value={supplier.name}
                    onChange={(e) => updateSupplier(supplier.id, 'name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={supplier.category} 
                    onValueChange={(value) => updateSupplier(supplier.id, 'category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raw_materials">Raw Materials</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="packaging">Packaging</SelectItem>
                      <SelectItem value="it_services">IT Services</SelectItem>
                      <SelectItem value="professional_services">Professional Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Annual Spend (₹)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 5000000"
                    value={supplier.spend || ''}
                    onChange={(e) => updateSupplier(supplier.id, 'spend', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Emission Intensity: {supplier.emissionIntensity} kg CO₂e per ₹
              </p>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={addSupplier} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>

        <Button onClick={handleCalculate} className="w-full gap-2">
          <Calculator className="h-4 w-4" />
          Calculate Supply Chain Emissions
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Total Supply Chain Emissions</h3>
              <Badge variant="default" className="text-lg px-3 py-1">
                {(result.totalEmissions / 1000).toFixed(2)} tCO₂e
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Breakdown by Category</h4>
              {result.breakdown.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.category}</span>
                  <span className="font-medium">
                    {(item.emissions / 1000).toFixed(2)} tCO₂e ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recommendations</h4>
              <ul className="space-y-1">
                {result.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> These are estimated emissions based on spend-based methodology. 
                For more accurate results, request primary emissions data from your suppliers.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
