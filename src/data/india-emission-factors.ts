import { EmissionFactor } from '@/types/carbon';

// India-specific emission factors based on CEA, IPCC, and local data

export const ELECTRICITY_GRID_FACTORS: Record<string, EmissionFactor> = {
  northern: {
    id: 'elec_northern',
    name: 'Northern Grid',
    category: 'Electricity',
    unit: 'kWh',
    co2e: 0.82, // kg CO2e per kWh
    source: 'CEA CO2 Baseline Database 2023',
    year: 2023,
  },
  western: {
    id: 'elec_western',
    name: 'Western Grid',
    category: 'Electricity',
    unit: 'kWh',
    co2e: 0.79,
    source: 'CEA CO2 Baseline Database 2023',
    year: 2023,
  },
  southern: {
    id: 'elec_southern',
    name: 'Southern Grid',
    category: 'Electricity',
    unit: 'kWh',
    co2e: 0.71,
    source: 'CEA CO2 Baseline Database 2023',
    year: 2023,
  },
  eastern: {
    id: 'elec_eastern',
    name: 'Eastern Grid',
    category: 'Electricity',
    unit: 'kWh',
    co2e: 0.95,
    source: 'CEA CO2 Baseline Database 2023',
    year: 2023,
  },
  north_eastern: {
    id: 'elec_north_eastern',
    name: 'North Eastern Grid',
    category: 'Electricity',
    unit: 'kWh',
    co2e: 0.58,
    source: 'CEA CO2 Baseline Database 2023',
    year: 2023,
  },
  all_india: {
    id: 'elec_all_india',
    name: 'All India Average',
    category: 'Electricity',
    unit: 'kWh',
    co2e: 0.82,
    source: 'CEA CO2 Baseline Database 2023',
    year: 2023,
  },
};

export const FUEL_EMISSION_FACTORS: Record<string, EmissionFactor> = {
  petrol: {
    id: 'fuel_petrol',
    name: 'Petrol/Gasoline',
    category: 'Fuel',
    unit: 'litre',
    co2e: 2.31,
    source: 'IPCC 2006 Guidelines',
    year: 2023,
  },
  diesel: {
    id: 'fuel_diesel',
    name: 'Diesel',
    category: 'Fuel',
    unit: 'litre',
    co2e: 2.68,
    source: 'IPCC 2006 Guidelines',
    year: 2023,
  },
  cng: {
    id: 'fuel_cng',
    name: 'Compressed Natural Gas',
    category: 'Fuel',
    unit: 'kg',
    co2e: 2.75,
    source: 'IPCC 2006 Guidelines',
    year: 2023,
  },
  lpg: {
    id: 'fuel_lpg',
    name: 'Liquefied Petroleum Gas',
    category: 'Fuel',
    unit: 'kg',
    co2e: 2.98,
    source: 'IPCC 2006 Guidelines',
    year: 2023,
  },
  coal: {
    id: 'fuel_coal',
    name: 'Coal',
    category: 'Fuel',
    unit: 'kg',
    co2e: 2.42,
    source: 'IPCC 2006 Guidelines',
    year: 2023,
  },
  natural_gas: {
    id: 'fuel_natural_gas',
    name: 'Natural Gas',
    category: 'Fuel',
    unit: 'm³',
    co2e: 2.03,
    source: 'IPCC 2006 Guidelines',
    year: 2023,
  },
  biomass: {
    id: 'fuel_biomass',
    name: 'Biomass',
    category: 'Fuel',
    unit: 'kg',
    co2e: 0.39,
    source: 'IPCC 2006 Guidelines',
    year: 2023,
  },
};

export const TRANSPORT_EMISSION_FACTORS: Record<string, EmissionFactor> = {
  car_petrol: {
    id: 'transport_car_petrol',
    name: 'Car - Petrol',
    category: 'Transport',
    unit: 'km',
    co2e: 0.171,
    source: 'DEFRA 2023',
    year: 2023,
  },
  car_diesel: {
    id: 'transport_car_diesel',
    name: 'Car - Diesel',
    category: 'Transport',
    unit: 'km',
    co2e: 0.168,
    source: 'DEFRA 2023',
    year: 2023,
  },
  car_cng: {
    id: 'transport_car_cng',
    name: 'Car - CNG',
    category: 'Transport',
    unit: 'km',
    co2e: 0.142,
    source: 'India Transport Emissions Study',
    year: 2023,
  },
  car_electric: {
    id: 'transport_car_electric',
    name: 'Car - Electric',
    category: 'Transport',
    unit: 'km',
    co2e: 0.053,
    source: 'India Grid Average',
    year: 2023,
  },
  motorcycle: {
    id: 'transport_motorcycle',
    name: 'Motorcycle',
    category: 'Transport',
    unit: 'km',
    co2e: 0.084,
    source: 'DEFRA 2023',
    year: 2023,
  },
  bus: {
    id: 'transport_bus',
    name: 'Bus',
    category: 'Transport',
    unit: 'km',
    co2e: 0.089,
    source: 'DEFRA 2023',
    year: 2023,
  },
  train: {
    id: 'transport_train',
    name: 'Train',
    category: 'Transport',
    unit: 'km',
    co2e: 0.041,
    source: 'Indian Railways',
    year: 2023,
  },
  metro: {
    id: 'transport_metro',
    name: 'Metro',
    category: 'Transport',
    unit: 'km',
    co2e: 0.028,
    source: 'India Metro Systems',
    year: 2023,
  },
  flight_domestic: {
    id: 'transport_flight_domestic',
    name: 'Flight - Domestic',
    category: 'Transport',
    unit: 'km',
    co2e: 0.255,
    source: 'DEFRA 2023',
    year: 2023,
  },
  flight_international: {
    id: 'transport_flight_international',
    name: 'Flight - International',
    category: 'Transport',
    unit: 'km',
    co2e: 0.195,
    source: 'DEFRA 2023',
    year: 2023,
  },
  truck_light: {
    id: 'transport_truck_light',
    name: 'Light Goods Vehicle',
    category: 'Transport',
    unit: 'km',
    co2e: 0.214,
    source: 'DEFRA 2023',
    year: 2023,
  },
  truck_heavy: {
    id: 'transport_truck_heavy',
    name: 'Heavy Goods Vehicle',
    category: 'Transport',
    unit: 'km',
    co2e: 0.687,
    source: 'DEFRA 2023',
    year: 2023,
  },
};

export const WASTE_EMISSION_FACTORS: Record<string, EmissionFactor> = {
  landfill: {
    id: 'waste_landfill',
    name: 'Landfill',
    category: 'Waste',
    unit: 'kg',
    co2e: 0.57,
    source: 'IPCC Waste Guidelines',
    year: 2023,
  },
  incineration: {
    id: 'waste_incineration',
    name: 'Incineration',
    category: 'Waste',
    unit: 'kg',
    co2e: 0.21,
    source: 'IPCC Waste Guidelines',
    year: 2023,
  },
  recycling: {
    id: 'waste_recycling',
    name: 'Recycling',
    category: 'Waste',
    unit: 'kg',
    co2e: 0.021,
    source: 'IPCC Waste Guidelines',
    year: 2023,
  },
  composting: {
    id: 'waste_composting',
    name: 'Composting',
    category: 'Waste',
    unit: 'kg',
    co2e: 0.015,
    source: 'IPCC Waste Guidelines',
    year: 2023,
  },
};

export const WATER_EMISSION_FACTORS: Record<string, EmissionFactor> = {
  supply: {
    id: 'water_supply',
    name: 'Water Supply',
    category: 'Water',
    unit: 'm³',
    co2e: 0.344,
    source: 'India Water Treatment Study',
    year: 2023,
  },
  treatment: {
    id: 'water_treatment',
    name: 'Wastewater Treatment',
    category: 'Water',
    unit: 'm³',
    co2e: 0.708,
    source: 'India Water Treatment Study',
    year: 2023,
  },
};

export const INDUSTRY_BENCHMARKS = {
  manufacturing: {
    small: 125, // kg CO2e per employee per year
    medium: 450,
    large: 850,
  },
  it_services: {
    small: 45,
    medium: 85,
    large: 120,
  },
  logistics: {
    small: 320,
    medium: 680,
    large: 1250,
  },
  agriculture: {
    small: 280,
    medium: 520,
    large: 890,
  },
  construction: {
    small: 420,
    medium: 780,
    large: 1450,
  },
  retail: {
    small: 95,
    medium: 180,
    large: 320,
  },
  hospitality: {
    small: 150,
    medium: 280,
    large: 450,
  },
  healthcare: {
    small: 180,
    medium: 340,
    large: 580,
  },
  education: {
    small: 65,
    medium: 120,
    large: 210,
  },
  financial_services: {
    small: 55,
    medium: 95,
    large: 145,
  },
};

// Helper function to get emission factor
export const getEmissionFactor = (category: string, type: string): number => {
  switch (category) {
    case 'electricity':
      return ELECTRICITY_GRID_FACTORS[type]?.co2e || ELECTRICITY_GRID_FACTORS.all_india.co2e;
    case 'fuel':
      return FUEL_EMISSION_FACTORS[type]?.co2e || 0;
    case 'transport':
      return TRANSPORT_EMISSION_FACTORS[type]?.co2e || 0;
    case 'waste':
      return WASTE_EMISSION_FACTORS[type]?.co2e || 0;
    case 'water':
      return WATER_EMISSION_FACTORS[type]?.co2e || 0;
    default:
      return 0;
  }
};
