// EU Carbon Border Adjustment Mechanism (CBAM) Framework
// Applicable to Indian exporters to the European Union

export interface CBAMProduct {
  id: string;
  name: string;
  cnCode: string;
  category: 'cement' | 'iron_steel' | 'aluminium' | 'fertilizers' | 'electricity' | 'hydrogen';
  defaultEmissionFactor: number; // tCO2e per tonne
  description: string;
}

export interface CBAMReport {
  id: string;
  period: {
    quarter: 1 | 2 | 3 | 4;
    year: number;
  };
  products: CBAMProductEntry[];
  totalEmissions: number;
  totalQuantity: number;
  carbonPriceApplied: number; // EUR per tCO2e
  estimatedCost: number; // EUR
  status: 'draft' | 'submitted' | 'verified';
  submittedAt?: Date;
}

export interface CBAMProductEntry {
  productId: string;
  productName: string;
  cnCode: string;
  quantity: number; // tonnes
  directEmissions: number; // tCO2e
  indirectEmissions: number; // tCO2e (electricity)
  totalEmissions: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  installationId?: string;
  countryOfOrigin: string;
}

export interface CBAMInstallation {
  id: string;
  name: string;
  country: string;
  operatorName: string;
  verificationBody?: string;
  lastAuditDate?: Date;
}

// CBAM Product Categories and Default Emission Factors
export const CBAM_PRODUCTS: CBAMProduct[] = [
  // Iron and Steel
  {
    id: 'steel_hot_rolled',
    name: 'Hot-rolled steel products',
    cnCode: '7208',
    category: 'iron_steel',
    defaultEmissionFactor: 2.1,
    description: 'Flat-rolled products of iron or non-alloy steel, hot-rolled',
  },
  {
    id: 'steel_cold_rolled',
    name: 'Cold-rolled steel products',
    cnCode: '7209',
    category: 'iron_steel',
    defaultEmissionFactor: 2.3,
    description: 'Flat-rolled products of iron or non-alloy steel, cold-rolled',
  },
  {
    id: 'steel_bars',
    name: 'Steel bars and rods',
    cnCode: '7214',
    category: 'iron_steel',
    defaultEmissionFactor: 1.9,
    description: 'Bars and rods of iron or non-alloy steel',
  },
  {
    id: 'pig_iron',
    name: 'Pig iron',
    cnCode: '7201',
    category: 'iron_steel',
    defaultEmissionFactor: 1.4,
    description: 'Pig iron and spiegeleisen',
  },
  
  // Aluminium
  {
    id: 'aluminium_unwrought',
    name: 'Unwrought aluminium',
    cnCode: '7601',
    category: 'aluminium',
    defaultEmissionFactor: 8.4,
    description: 'Unwrought aluminium (primary and secondary)',
  },
  {
    id: 'aluminium_bars',
    name: 'Aluminium bars and rods',
    cnCode: '7604',
    category: 'aluminium',
    defaultEmissionFactor: 8.8,
    description: 'Aluminium bars, rods and profiles',
  },
  {
    id: 'aluminium_wire',
    name: 'Aluminium wire',
    cnCode: '7605',
    category: 'aluminium',
    defaultEmissionFactor: 8.6,
    description: 'Aluminium wire',
  },
  
  // Cement
  {
    id: 'cement_clinker',
    name: 'Cement clinker',
    cnCode: '2523',
    category: 'cement',
    defaultEmissionFactor: 0.83,
    description: 'Portland cement, aluminous cement, slag cement and similar',
  },
  {
    id: 'portland_cement',
    name: 'Portland cement',
    cnCode: '252310',
    category: 'cement',
    defaultEmissionFactor: 0.73,
    description: 'Portland cement',
  },
  
  // Fertilizers
  {
    id: 'urea',
    name: 'Urea',
    cnCode: '3102',
    category: 'fertilizers',
    defaultEmissionFactor: 2.1,
    description: 'Urea, whether or not in aqueous solution',
  },
  {
    id: 'ammonia',
    name: 'Ammonia',
    cnCode: '2814',
    category: 'fertilizers',
    defaultEmissionFactor: 2.3,
    description: 'Ammonia, anhydrous or in aqueous solution',
  },
  {
    id: 'nitric_acid',
    name: 'Nitric acid',
    cnCode: '2808',
    category: 'fertilizers',
    defaultEmissionFactor: 2.9,
    description: 'Nitric acid; sulphonitric acids',
  },
  
  // Hydrogen
  {
    id: 'hydrogen_grey',
    name: 'Hydrogen (Grey)',
    cnCode: '280410',
    category: 'hydrogen',
    defaultEmissionFactor: 9.3,
    description: 'Hydrogen produced from natural gas (SMR)',
  },
  {
    id: 'hydrogen_blue',
    name: 'Hydrogen (Blue)',
    cnCode: '280410',
    category: 'hydrogen',
    defaultEmissionFactor: 3.2,
    description: 'Hydrogen with CCS',
  },
  {
    id: 'hydrogen_green',
    name: 'Hydrogen (Green)',
    cnCode: '280410',
    category: 'hydrogen',
    defaultEmissionFactor: 0.4,
    description: 'Hydrogen from renewable electrolysis',
  },
];

// CBAM Timeline and Requirements
export const CBAM_TIMELINE = [
  {
    phase: 'Transitional Period',
    startDate: '2023-10-01',
    endDate: '2025-12-31',
    requirements: [
      'Quarterly reporting of embedded emissions',
      'No financial adjustments required',
      'EU default values can be used until end of 2024',
      'After 2025, only verified emissions accepted',
    ],
  },
  {
    phase: 'Definitive Period',
    startDate: '2026-01-01',
    endDate: null,
    requirements: [
      'Purchase CBAM certificates',
      'Surrender certificates by May 31 each year',
      'Mandatory third-party verification',
      'Accredited verifier must be EU-approved',
    ],
  },
];

// Indian Industry Impact Assessment
export const INDIA_CBAM_EXPOSURE = {
  totalExportsToEU: {
    value: 8.2, // billion EUR
    year: 2023,
  },
  affectedSectors: [
    {
      sector: 'Iron & Steel',
      exportValue: 4.1, // billion EUR
      estimatedCBAMCost: 120, // million EUR annually
      majorProducts: ['Hot-rolled steel', 'Cold-rolled steel', 'Steel bars'],
    },
    {
      sector: 'Aluminium',
      exportValue: 2.8,
      estimatedCBAMCost: 95,
      majorProducts: ['Primary aluminium', 'Aluminium products'],
    },
    {
      sector: 'Cement',
      exportValue: 0.3,
      estimatedCBAMCost: 8,
      majorProducts: ['Clinker', 'Portland cement'],
    },
    {
      sector: 'Fertilizers',
      exportValue: 0.5,
      estimatedCBAMCost: 15,
      majorProducts: ['Urea', 'Ammonia'],
    },
  ],
};

// CBAM Calculation Helpers
export function calculateCBAMCost(
  emissions: number, // tCO2e
  euETSPrice: number = 85, // EUR per tCO2e (approximate 2024 price)
  domesticCarbonPrice: number = 0 // Carbon price paid in India (if any)
): { grossCost: number; deductible: number; netCost: number } {
  const grossCost = emissions * euETSPrice;
  const deductible = emissions * domesticCarbonPrice;
  const netCost = Math.max(0, grossCost - deductible);
  
  return {
    grossCost,
    deductible,
    netCost,
  };
}

export function getCBAMCategory(cnCode: string): CBAMProduct['category'] | null {
  const product = CBAM_PRODUCTS.find(p => cnCode.startsWith(p.cnCode));
  return product?.category || null;
}

// Reporting Period Helpers
export function getCurrentCBAMQuarter(): { quarter: 1 | 2 | 3 | 4; year: number } {
  const now = new Date();
  const quarter = (Math.floor(now.getMonth() / 3) + 1) as 1 | 2 | 3 | 4;
  return { quarter, year: now.getFullYear() };
}

export function getCBAMReportingDeadline(quarter: number, year: number): Date {
  // Reports are due one month after the end of the quarter
  const deadlines: Record<number, [number, number]> = {
    1: [4, 30], // Q1 due April 30
    2: [7, 31], // Q2 due July 31
    3: [10, 31], // Q3 due October 31
    4: [1, 31], // Q4 due January 31 (next year)
  };
  
  const [month, day] = deadlines[quarter];
  const reportYear = quarter === 4 ? year + 1 : year;
  return new Date(reportYear, month - 1, day);
}
