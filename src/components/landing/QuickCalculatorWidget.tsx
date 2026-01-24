import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Leaf, ArrowRight, Zap, Car, Factory, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

// India-specific emission factors
const emissionFactors = {
  electricity: 0.82, // kg CO₂/kWh (Indian grid average)
  diesel: 2.68,      // kg CO₂/L
  petrol: 2.31,      // kg CO₂/L
  naturalGas: 2.0,   // kg CO₂/m³
  lpg: 1.51,         // kg CO₂/kg
};

const calculatorOptions = [
  { value: 'electricity', label: 'Electricity (kWh)', icon: Zap, factor: emissionFactors.electricity },
  { value: 'diesel', label: 'Diesel (Litres)', icon: Factory, factor: emissionFactors.diesel },
  { value: 'petrol', label: 'Petrol (Litres)', icon: Car, factor: emissionFactors.petrol },
  { value: 'lpg', label: 'LPG (kg)', icon: Home, factor: emissionFactors.lpg },
];

export function QuickCalculatorWidget() {
  const [category, setCategory] = useState('electricity');
  const [quantity, setQuantity] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return;
    
    const option = calculatorOptions.find(o => o.value === category);
    if (option) {
      const co2 = qty * option.factor;
      setResult(co2);
    }
  };

  const selectedOption = calculatorOptions.find(o => o.value === category);
  const IconComponent = selectedOption?.icon || Zap;

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
      <div className="absolute inset-0 dot-background opacity-20" />
      
      <div className="container relative z-10">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-primary mb-6">
            <Calculator className="h-4 w-4" />
            <span>FREE TOOL</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-4">
            <span className="text-foreground">Estimate Your </span>
            <span className="text-primary">Carbon Footprint</span>
            <span className="text-foreground"> in Seconds</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Quick calculation using India-specific emission factors from CEA and IPCC standards.
          </p>
        </ScrollReveal>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-strong rounded-3xl p-8 lg:p-10 shadow-xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Source Type</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {calculatorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4 text-primary" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Monthly Usage</Label>
                <div className="relative">
                  <IconComponent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCalculate} 
              size="lg" 
              className="w-full gap-2 mb-6"
              disabled={!quantity || parseFloat(quantity) <= 0}
            >
              <Calculator className="h-5 w-5" />
              Calculate Emissions
            </Button>

            {/* Result Display */}
            {result !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center"
              >
                <p className="text-sm text-muted-foreground mb-2">Estimated Monthly Emissions</p>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                  <span className="text-4xl font-bold font-display text-primary">
                    {result >= 1000 ? (result / 1000).toFixed(2) : result.toFixed(1)}
                  </span>
                  <span className="text-xl text-muted-foreground">
                    {result >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  ≈ {Math.ceil(result / 21)} trees needed annually to offset
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/calculators">
                    <Button variant="outline" className="gap-2">
                      Get Detailed Analysis
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="gap-2">
                      Start Tracking
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Data Source Badge */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Emission factors from</span>
              <span className="font-medium text-foreground">CEA India</span>
              <span>•</span>
              <span className="font-medium text-foreground">IPCC</span>
              <span>•</span>
              <span className="font-medium text-foreground">GHG Protocol</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
