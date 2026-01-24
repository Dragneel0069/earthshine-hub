import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, Fuel, Calculator } from 'lucide-react';
import { calculateEnergyFootprint } from '@/lib/carbon-calculations';
import { ELECTRICITY_GRID_FACTORS, FUEL_EMISSION_FACTORS } from '@/data/india-emission-factors';

export const EnergyCalculator = () => {
  const [electricityRegion, setElectricityRegion] = useState('all_india');
  const [electricityConsumption, setElectricityConsumption] = useState('');
  const [fuelType, setFuelType] = useState('diesel');
  const [fuelAmount, setFuelAmount] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const electricity = electricityConsumption ? [{
      consumption: parseFloat(electricityConsumption),
      region: electricityRegion
    }] : [];

    const fuel = fuelAmount ? [{
      type: fuelType,
      amount: parseFloat(fuelAmount)
    }] : [];

    const calculationResult = calculateEnergyFootprint({
      electricity,
      fuel
    });

    setResult(calculationResult);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Energy Emissions Calculator
        </CardTitle>
        <CardDescription>
          Calculate emissions from electricity and fuel consumption
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Electricity Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Electricity Consumption</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="electricity">Monthly Consumption (kWh)</Label>
              <Input
                id="electricity"
                type="number"
                placeholder="e.g., 50000"
                value={electricityConsumption}
                onChange={(e) => setElectricityConsumption(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Grid Region</Label>
              <Select value={electricityRegion} onValueChange={setElectricityRegion}>
                <SelectTrigger id="region">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_india">All India Average</SelectItem>
                  <SelectItem value="northern">Northern Grid</SelectItem>
                  <SelectItem value="western">Western Grid</SelectItem>
                  <SelectItem value="southern">Southern Grid</SelectItem>
                  <SelectItem value="eastern">Eastern Grid</SelectItem>
                  <SelectItem value="north_eastern">North Eastern Grid</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Emission Factor: {ELECTRICITY_GRID_FACTORS[electricityRegion].co2e} kg CO₂e/kWh
              </p>
            </div>
          </div>
        </div>

        {/* Fuel Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-warning" />
            <h3 className="font-medium">Fuel Consumption</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fuel-type">Fuel Type</Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger id="fuel-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="cng">CNG</SelectItem>
                  <SelectItem value="lpg">LPG</SelectItem>
                  <SelectItem value="coal">Coal</SelectItem>
                  <SelectItem value="natural_gas">Natural Gas</SelectItem>
                  <SelectItem value="biomass">Biomass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fuel-amount">
                Monthly Amount ({FUEL_EMISSION_FACTORS[fuelType].unit})
              </Label>
              <Input
                id="fuel-amount"
                type="number"
                placeholder="e.g., 5000"
                value={fuelAmount}
                onChange={(e) => setFuelAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Emission Factor: {FUEL_EMISSION_FACTORS[fuelType].co2e} kg CO₂e/{FUEL_EMISSION_FACTORS[fuelType].unit}
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full gap-2">
          <Calculator className="h-4 w-4" />
          Calculate Emissions
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Total Monthly Emissions</h3>
              <Badge variant="default" className="text-lg px-3 py-1">
                {(result.totalEmissions / 1000).toFixed(2)} tCO₂e
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Breakdown</h4>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};
