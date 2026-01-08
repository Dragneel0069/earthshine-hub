import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check, Leaf, Factory, Zap, Truck, Building2 } from 'lucide-react';

interface EmissionData {
  electricity: number;
  naturalGas: number;
  diesel: number;
  petrol: number;
  fleetDistance: number;
  fleetType: string;
  businessTravel: number;
  wasteGenerated: number;
}

const STEPS = [
  { id: 'intro', title: 'Welcome', icon: Leaf },
  { id: 'scope1', title: 'Direct Emissions', icon: Factory },
  { id: 'scope2', title: 'Energy', icon: Zap },
  { id: 'scope3', title: 'Indirect', icon: Truck },
  { id: 'results', title: 'Your Impact', icon: Building2 },
];

const EMISSION_FACTORS = {
  electricity: 0.82,
  naturalGas: 2.0,
  diesel: 2.68,
  petrol: 2.31,
  fleet: { diesel: 0.27, petrol: 0.23, hybrid: 0.15, electric: 0.05 },
  travel: 0.255,
  waste: 0.5,
};

const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  React.useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="tabular-nums">
      {displayValue.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
      {suffix}
    </span>
  );
};

export const WizardCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<EmissionData>({
    electricity: 0,
    naturalGas: 0,
    diesel: 0,
    petrol: 0,
    fleetDistance: 0,
    fleetType: 'diesel',
    businessTravel: 0,
    wasteGenerated: 0,
  });

  const progress = ((currentStep) / (STEPS.length - 1)) * 100;

  const updateData = (field: keyof EmissionData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: typeof value === 'string' && field !== 'fleetType' ? parseFloat(value) || 0 : value }));
  };

  const calculateEmissions = () => {
    const scope1 = 
      (data.naturalGas * EMISSION_FACTORS.naturalGas) +
      (data.diesel * EMISSION_FACTORS.diesel) +
      (data.petrol * EMISSION_FACTORS.petrol) +
      (data.fleetDistance * EMISSION_FACTORS.fleet[data.fleetType as keyof typeof EMISSION_FACTORS.fleet]);
    
    const scope2 = data.electricity * EMISSION_FACTORS.electricity;
    
    const scope3 = 
      (data.businessTravel * EMISSION_FACTORS.travel) +
      (data.wasteGenerated * EMISSION_FACTORS.waste);

    return { scope1, scope2, scope3, total: scope1 + scope2 + scope3 };
  };

  const emissions = calculateEmissions();

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return data.naturalGas > 0 || data.diesel > 0 || data.petrol > 0 || data.fleetDistance > 0;
      case 2: return data.electricity > 0;
      case 3: return data.businessTravel > 0 || data.wasteGenerated > 0;
      default: return true;
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Leaf className="w-12 h-12 text-primary" />
            </motion.div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
                Calculate Your <span className="text-primary font-medium">Carbon Footprint</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Answer a few simple questions to understand your organization's environmental impact.
              </p>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>3 minute assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Actionable insights</span>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-light text-foreground">
                Direct Emissions <span className="text-muted-foreground">(Scope 1)</span>
              </h2>
              <p className="text-muted-foreground text-lg">Fuel consumption and company vehicles</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="space-y-3">
                <Label className="text-base">Natural Gas (m³/year)</Label>
                <Input
                  type="number"
                  value={data.naturalGas || ''}
                  onChange={e => updateData('naturalGas', e.target.value)}
                  placeholder="0"
                  className="h-14 text-lg bg-background border-border"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base">Diesel (liters/year)</Label>
                <Input
                  type="number"
                  value={data.diesel || ''}
                  onChange={e => updateData('diesel', e.target.value)}
                  placeholder="0"
                  className="h-14 text-lg bg-background border-border"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base">Petrol (liters/year)</Label>
                <Input
                  type="number"
                  value={data.petrol || ''}
                  onChange={e => updateData('petrol', e.target.value)}
                  placeholder="0"
                  className="h-14 text-lg bg-background border-border"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base">Fleet Distance (km/year)</Label>
                <Input
                  type="number"
                  value={data.fleetDistance || ''}
                  onChange={e => updateData('fleetDistance', e.target.value)}
                  placeholder="0"
                  className="h-14 text-lg bg-background border-border"
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label className="text-base">Fleet Vehicle Type</Label>
                <Select value={data.fleetType} onValueChange={v => updateData('fleetType', v)}>
                  <SelectTrigger className="h-14 text-lg bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-light text-foreground">
                Energy Consumption <span className="text-muted-foreground">(Scope 2)</span>
              </h2>
              <p className="text-muted-foreground text-lg">Purchased electricity and heating</p>
            </div>
            <div className="max-w-md mx-auto space-y-8">
              <div className="space-y-3">
                <Label className="text-base">Annual Electricity (kWh)</Label>
                <Input
                  type="number"
                  value={data.electricity || ''}
                  onChange={e => updateData('electricity', e.target.value)}
                  placeholder="Enter your annual consumption"
                  className="h-14 text-lg bg-background border-border"
                />
                <p className="text-sm text-muted-foreground">
                  Tip: Check your utility bills for this information
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="font-medium">India Grid Factor</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Using 0.82 kg CO₂e per kWh based on India's current electricity grid mix
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-light text-foreground">
                Indirect Emissions <span className="text-muted-foreground">(Scope 3)</span>
              </h2>
              <p className="text-muted-foreground text-lg">Business travel and waste</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="space-y-3">
                <Label className="text-base">Business Travel (km/year)</Label>
                <Input
                  type="number"
                  value={data.businessTravel || ''}
                  onChange={e => updateData('businessTravel', e.target.value)}
                  placeholder="0"
                  className="h-14 text-lg bg-background border-border"
                />
                <p className="text-sm text-muted-foreground">Include flights, trains, and taxi rides</p>
              </div>
              <div className="space-y-3">
                <Label className="text-base">Waste Generated (tonnes/year)</Label>
                <Input
                  type="number"
                  value={data.wasteGenerated || ''}
                  onChange={e => updateData('wasteGenerated', e.target.value)}
                  placeholder="0"
                  className="h-14 text-lg bg-background border-border"
                />
                <p className="text-sm text-muted-foreground">Office and operational waste</p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
              >
                <Check className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-light text-foreground">
                Your Carbon Footprint
              </h2>
              <p className="text-muted-foreground text-lg">Annual emissions breakdown</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-12"
              >
                <div className="text-7xl md:text-8xl font-extralight text-primary mb-2">
                  <AnimatedCounter value={emissions.total / 1000} suffix="" />
                </div>
                <p className="text-xl text-muted-foreground">tonnes CO₂e per year</p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: 'Scope 1', value: emissions.scope1, desc: 'Direct emissions', color: 'bg-red-500' },
                  { label: 'Scope 2', value: emissions.scope2, desc: 'Energy', color: 'bg-amber-500' },
                  { label: 'Scope 3', value: emissions.scope3, desc: 'Indirect', color: 'bg-blue-500' },
                ].map((scope, i) => (
                  <motion.div
                    key={scope.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border text-center"
                  >
                    <div className={`w-3 h-3 rounded-full ${scope.color} mx-auto mb-4`} />
                    <div className="text-3xl font-light text-foreground mb-1">
                      <AnimatedCounter value={scope.value / 1000} />
                    </div>
                    <p className="text-sm font-medium text-foreground">{scope.label}</p>
                    <p className="text-xs text-muted-foreground">{scope.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center"
              >
                <p className="text-lg text-foreground mb-2">
                  Equivalent to <span className="font-medium text-primary">{Math.round(emissions.total / 21)}</span> trees needed for one year
                </p>
                <p className="text-sm text-muted-foreground">
                  Ready to reduce your impact? Explore our offset marketplace.
                </p>
              </motion.div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;
              return (
                <button
                  key={step.id}
                  onClick={() => index < currentStep && setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={`flex items-center gap-2 transition-colors ${
                    isActive ? 'text-primary' : isComplete ? 'text-primary/60 cursor-pointer' : 'text-muted-foreground/40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : isComplete ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{step.title}</span>
                </button>
              );
            })}
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Main content */}
      <div className="pt-32 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={nextStep} className="gap-2 px-8">
              {currentStep === 0 ? 'Get Started' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="default" className="gap-2 px-8">
              Explore Offsets
              <Leaf className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
