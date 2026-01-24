// Carbon Accounting Types for India

export type EmissionScope = 'scope1' | 'scope2' | 'scope3';

export type IndustryType = 
  | 'manufacturing'
  | 'it_services'
  | 'logistics'
  | 'agriculture'
  | 'construction'
  | 'retail'
  | 'hospitality'
  | 'healthcare'
  | 'education'
  | 'financial_services';

export type FuelType = 
  | 'petrol'
  | 'diesel'
  | 'cng'
  | 'lpg'
  | 'coal'
  | 'natural_gas'
  | 'biomass';

export type ElectricityRegion = 
  | 'northern'
  | 'western'
  | 'southern'
  | 'eastern'
  | 'north_eastern'
  | 'all_india';

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  unit: string;
  co2e: number; // kg CO2e per unit
  source: string;
  year: number;
}

export interface CarbonFootprint {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  unit: 'tCO2e' | 'kgCO2e';
  period: {
    start: Date;
    end: Date;
  };
}

export interface EmissionSource {
  id: string;
  name: string;
  scope: EmissionScope;
  category: string;
  amount: number;
  unit: string;
  emissionFactor: number;
  totalEmissions: number; // kg CO2e
  description?: string;
}

export interface ReductionTarget {
  id: string;
  name: string;
  baselineYear: number;
  targetYear: number;
  baselineEmissions: number;
  targetReduction: number; // percentage
  currentProgress: number; // percentage
  status: 'on_track' | 'at_risk' | 'off_track';
}

export interface BRSRMetric {
  id: string;
  principle: number; // BRSR Principle 1-9
  disclosure: string;
  metric: string;
  value: number | string;
  unit?: string;
  status: 'compliant' | 'partial' | 'non_compliant';
}

export interface SupplyChainEmission {
  supplierId: string;
  supplierName: string;
  category: string;
  emissions: number; // kg CO2e
  percentage: number;
  location: string;
}

export interface CalculatorInput {
  type: 'energy' | 'transport' | 'waste' | 'water' | 'supply_chain';
  data: Record<string, any>;
}

export interface CalculatorResult {
  totalEmissions: number; // kg CO2e
  breakdown: {
    category: string;
    emissions: number;
    percentage: number;
  }[];
  recommendations: string[];
}

export interface ComplianceStatus {
  framework: 'BRSR' | 'CDP' | 'GRI' | 'TCFD';
  completeness: number; // percentage
  lastUpdated: Date;
  nextDeadline?: Date;
  status: 'compliant' | 'in_progress' | 'overdue';
}

export interface ReductionInitiative {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedReduction: number; // kg CO2e per year
  cost: number; // INR
  roi: number; // years
  status: 'planned' | 'in_progress' | 'completed';
  implementationDate?: Date;
}

export interface BenchmarkData {
  industry: IndustryType;
  companySize: 'small' | 'medium' | 'large';
  averageEmissions: number; // kg CO2e per employee or revenue
  topPerformer: number;
  yourPosition: number;
  percentile: number;
}
