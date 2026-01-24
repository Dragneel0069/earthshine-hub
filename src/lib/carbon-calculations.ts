import { 
  CarbonFootprint, 
  EmissionSource, 
  CalculatorInput, 
  CalculatorResult,
  EmissionScope 
} from '@/types/carbon';
import { getEmissionFactor } from '@/data/india-emission-factors';

/**
 * Calculate total emissions from an array of emission sources
 */
export const calculateTotalEmissions = (sources: EmissionSource[]): CarbonFootprint => {
  const scope1 = sources
    .filter(s => s.scope === 'scope1')
    .reduce((sum, s) => sum + s.totalEmissions, 0);
  
  const scope2 = sources
    .filter(s => s.scope === 'scope2')
    .reduce((sum, s) => sum + s.totalEmissions, 0);
  
  const scope3 = sources
    .filter(s => s.scope === 'scope3')
    .reduce((sum, s) => sum + s.totalEmissions, 0);
  
  const total = scope1 + scope2 + scope3;
  
  return {
    scope1: scope1 / 1000, // Convert to tonnes
    scope2: scope2 / 1000,
    scope3: scope3 / 1000,
    total: total / 1000,
    unit: 'tCO2e',
    period: {
      start: new Date(new Date().getFullYear(), 0, 1),
      end: new Date(new Date().getFullYear(), 11, 31),
    },
  };
};

/**
 * Calculate emissions from electricity consumption
 */
export const calculateElectricityEmissions = (
  consumption: number, // kWh
  region: string = 'all_india'
): number => {
  const emissionFactor = getEmissionFactor('electricity', region);
  return consumption * emissionFactor; // kg CO2e
};

/**
 * Calculate emissions from fuel consumption
 */
export const calculateFuelEmissions = (
  fuelType: string,
  amount: number, // litres or kg
): number => {
  const emissionFactor = getEmissionFactor('fuel', fuelType);
  return amount * emissionFactor; // kg CO2e
};

/**
 * Calculate emissions from transport
 */
export const calculateTransportEmissions = (
  transportType: string,
  distance: number, // km
  passengers: number = 1
): number => {
  const emissionFactor = getEmissionFactor('transport', transportType);
  return (distance * emissionFactor) / passengers; // kg CO2e per passenger
};

/**
 * Calculate emissions from waste
 */
export const calculateWasteEmissions = (
  wasteType: string,
  amount: number // kg
): number => {
  const emissionFactor = getEmissionFactor('waste', wasteType);
  return amount * emissionFactor; // kg CO2e
};

/**
 * Calculate emissions from water
 */
export const calculateWaterEmissions = (
  waterType: string,
  volume: number // m³
): number => {
  const emissionFactor = getEmissionFactor('water', waterType);
  return volume * emissionFactor; // kg CO2e
};

/**
 * Energy calculator - comprehensive energy consumption
 */
export const calculateEnergyFootprint = (input: {
  electricity: { consumption: number; region: string }[];
  fuel: { type: string; amount: number }[];
}): CalculatorResult => {
  const electricityEmissions = input.electricity.reduce(
    (sum, e) => sum + calculateElectricityEmissions(e.consumption, e.region),
    0
  );
  
  const fuelEmissions = input.fuel.reduce(
    (sum, f) => sum + calculateFuelEmissions(f.type, f.amount),
    0
  );
  
  const totalEmissions = electricityEmissions + fuelEmissions;
  
  return {
    totalEmissions,
    breakdown: [
      {
        category: 'Electricity',
        emissions: electricityEmissions,
        percentage: (electricityEmissions / totalEmissions) * 100,
      },
      {
        category: 'Fuel',
        emissions: fuelEmissions,
        percentage: (fuelEmissions / totalEmissions) * 100,
      },
    ],
    recommendations: generateEnergyRecommendations(electricityEmissions, fuelEmissions),
  };
};

/**
 * Transport calculator - employee commute and business travel
 */
export const calculateTransportFootprint = (input: {
  commute: { type: string; distance: number; days: number }[];
  businessTravel: { type: string; distance: number; trips: number }[];
}): CalculatorResult => {
  const commuteEmissions = input.commute.reduce(
    (sum, c) => sum + calculateTransportEmissions(c.type, c.distance * c.days * 52), // Annual
    0
  );
  
  const travelEmissions = input.businessTravel.reduce(
    (sum, t) => sum + calculateTransportEmissions(t.type, t.distance * t.trips),
    0
  );
  
  const totalEmissions = commuteEmissions + travelEmissions;
  
  return {
    totalEmissions,
    breakdown: [
      {
        category: 'Employee Commute',
        emissions: commuteEmissions,
        percentage: (commuteEmissions / totalEmissions) * 100,
      },
      {
        category: 'Business Travel',
        emissions: travelEmissions,
        percentage: (travelEmissions / totalEmissions) * 100,
      },
    ],
    recommendations: generateTransportRecommendations(commuteEmissions, travelEmissions),
  };
};

/**
 * Waste calculator
 */
export const calculateWasteFootprint = (input: {
  waste: { type: string; amount: number }[];
}): CalculatorResult => {
  const breakdown = input.waste.map(w => {
    const emissions = calculateWasteEmissions(w.type, w.amount);
    return {
      category: w.type.charAt(0).toUpperCase() + w.type.slice(1),
      emissions,
      percentage: 0, // Will be calculated after total
    };
  });
  
  const totalEmissions = breakdown.reduce((sum, b) => sum + b.emissions, 0);
  
  breakdown.forEach(b => {
    b.percentage = (b.emissions / totalEmissions) * 100;
  });
  
  return {
    totalEmissions,
    breakdown,
    recommendations: generateWasteRecommendations(breakdown),
  };
};

/**
 * Supply chain emissions calculator
 */
export const calculateSupplyChainFootprint = (input: {
  suppliers: { name: string; category: string; spend: number; emissionIntensity: number }[];
}): CalculatorResult => {
  const breakdown = input.suppliers.map(s => {
    const emissions = s.spend * s.emissionIntensity; // kg CO2e
    return {
      category: s.category,
      emissions,
      percentage: 0,
    };
  });
  
  const totalEmissions = breakdown.reduce((sum, b) => sum + b.emissions, 0);
  
  breakdown.forEach(b => {
    b.percentage = (b.emissions / totalEmissions) * 100;
  });
  
  return {
    totalEmissions,
    breakdown,
    recommendations: generateSupplyChainRecommendations(breakdown),
  };
};

/**
 * Generate recommendations for energy
 */
const generateEnergyRecommendations = (
  electricityEmissions: number,
  fuelEmissions: number
): string[] => {
  const recommendations: string[] = [];
  
  if (electricityEmissions > fuelEmissions) {
    recommendations.push('Consider switching to renewable energy sources or purchasing renewable energy certificates (RECs)');
    recommendations.push('Implement energy-efficient lighting (LED) and HVAC systems');
    recommendations.push('Install solar panels to reduce grid electricity dependency');
  }
  
  if (fuelEmissions > 0) {
    recommendations.push('Transition to cleaner fuels like CNG or electric alternatives');
    recommendations.push('Optimize fuel consumption through regular maintenance and efficient operations');
  }
  
  recommendations.push('Conduct regular energy audits to identify efficiency opportunities');
  recommendations.push('Set up energy monitoring systems for real-time tracking');
  
  return recommendations;
};

/**
 * Generate recommendations for transport
 */
const generateTransportRecommendations = (
  commuteEmissions: number,
  travelEmissions: number
): string[] => {
  const recommendations: string[] = [];
  
  if (commuteEmissions > travelEmissions) {
    recommendations.push('Implement work-from-home policies to reduce commute frequency');
    recommendations.push('Provide incentives for public transport or carpooling');
    recommendations.push('Set up shuttle services for employees');
  }
  
  if (travelEmissions > 0) {
    recommendations.push('Encourage virtual meetings to reduce business travel');
    recommendations.push('Prefer train travel over flights for shorter distances');
    recommendations.push('Implement a sustainable travel policy');
  }
  
  recommendations.push('Consider electric vehicle fleet for company vehicles');
  
  return recommendations;
};

/**
 * Generate recommendations for waste
 */
const generateWasteRecommendations = (
  breakdown: { category: string; emissions: number }[]
): string[] => {
  const recommendations: string[] = [];
  
  const landfillWaste = breakdown.find(b => b.category.toLowerCase().includes('landfill'));
  if (landfillWaste && landfillWaste.emissions > 0) {
    recommendations.push('Increase recycling rates to divert waste from landfills');
    recommendations.push('Implement composting for organic waste');
  }
  
  recommendations.push('Conduct waste audits to identify reduction opportunities');
  recommendations.push('Partner with certified waste management companies');
  recommendations.push('Implement circular economy principles in operations');
  
  return recommendations;
};

/**
 * Generate recommendations for supply chain
 */
const generateSupplyChainRecommendations = (
  breakdown: { category: string; emissions: number }[]
): string[] => {
  const recommendations: string[] = [];
  
  const topCategory = breakdown.sort((a, b) => b.emissions - a.emissions)[0];
  
  if (topCategory) {
    recommendations.push(`Focus on reducing emissions in ${topCategory.category} category - your highest contributor`);
  }
  
  recommendations.push('Engage with suppliers to collect primary emissions data');
  recommendations.push('Prioritize local suppliers to reduce transportation emissions');
  recommendations.push('Set sustainability criteria in supplier selection process');
  recommendations.push('Collaborate with suppliers on emission reduction initiatives');
  
  return recommendations;
};

/**
 * Calculate year-over-year change
 */
export const calculateYoYChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Calculate progress towards reduction target
 */
export const calculateTargetProgress = (
  baseline: number,
  current: number,
  target: number
): number => {
  const totalReductionNeeded = baseline - target;
  const reductionAchieved = baseline - current;
  
  if (totalReductionNeeded === 0) return 100;
  return (reductionAchieved / totalReductionNeeded) * 100;
};

/**
 * Determine if target is on track
 */
export const isTargetOnTrack = (
  baselineYear: number,
  targetYear: number,
  currentYear: number,
  progressPercentage: number
): 'on_track' | 'at_risk' | 'off_track' => {
  const yearsElapsed = currentYear - baselineYear;
  const totalYears = targetYear - baselineYear;
  const expectedProgress = (yearsElapsed / totalYears) * 100;
  
  if (progressPercentage >= expectedProgress) return 'on_track';
  if (progressPercentage >= expectedProgress * 0.8) return 'at_risk';
  return 'off_track';
};
