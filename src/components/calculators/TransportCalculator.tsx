import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Car, Plane, Calculator } from 'lucide-react';
import { calculateTransportFootprint } from '@/lib/carbon-calculations';

export const TransportCalculator = () => {
  const [commuteType, setCommuteType] = useState('car_petrol');
  const [commuteDistance, setCommuteDistance] = useState('');
  const [commuteDays, setCommuteDays] = useState('250');
  const [travelType, setTravelType] = useState('flight_domestic');
  const [travelDistance, setTravelDistance] = useState('');
  const [travelTrips, setTravelTrips] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const commute = commuteDistance ? [{
      type: commuteType,
      distance: parseFloat(commuteDistance),
      days: parseInt(commuteDays)
    }] : [];

    const businessTravel = travelDistance && travelTrips ? [{
      type: travelType,
      distance: parseFloat(travelDistance),
      trips: parseInt(travelTrips)
    }] : [];

    const calculationResult = calculateTransportFootprint({
      commute,
      businessTravel
    });

    setResult(calculationResult);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          Transport Emissions Calculator
        </CardTitle>
        <CardDescription>
          Calculate emissions from employee commute and business travel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Employee Commute Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Employee Commute</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="commute-type">Transport Mode</Label>
              <Select value={commuteType} onValueChange={setCommuteType}>
                <SelectTrigger id="commute-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car_petrol">Car - Petrol</SelectItem>
                  <SelectItem value="car_diesel">Car - Diesel</SelectItem>
                  <SelectItem value="car_cng">Car - CNG</SelectItem>
                  <SelectItem value="car_electric">Car - Electric</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                  <SelectItem value="metro">Metro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commute-distance">Daily Distance (km)</Label>
              <Input
                id="commute-distance"
                type="number"
                placeholder="e.g., 20"
                value={commuteDistance}
                onChange={(e) => setCommuteDistance(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commute-days">Working Days/Year</Label>
              <Input
                id="commute-days"
                type="number"
                placeholder="e.g., 250"
                value={commuteDays}
                onChange={(e) => setCommuteDays(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Business Travel Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-warning" />
            <h3 className="font-medium">Business Travel</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="travel-type">Travel Mode</Label>
              <Select value={travelType} onValueChange={setTravelType}>
                <SelectTrigger id="travel-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flight_domestic">Flight - Domestic</SelectItem>
                  <SelectItem value="flight_international">Flight - International</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                  <SelectItem value="car_petrol">Car - Petrol</SelectItem>
                  <SelectItem value="car_diesel">Car - Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="travel-distance">Distance per Trip (km)</Label>
              <Input
                id="travel-distance"
                type="number"
                placeholder="e.g., 1200"
                value={travelDistance}
                onChange={(e) => setTravelDistance(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="travel-trips">Annual Trips</Label>
              <Input
                id="travel-trips"
                type="number"
                placeholder="e.g., 12"
                value={travelTrips}
                onChange={(e) => setTravelTrips(e.target.value)}
              />
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
              <h3 className="font-semibold">Total Annual Emissions</h3>
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

            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-muted-foreground">
                <strong>Cost Savings Potential:</strong> Switching to public transport or EVs could save approximately ₹
                {((result.totalEmissions / 1000) * 850).toLocaleString()} in carbon costs annually.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
