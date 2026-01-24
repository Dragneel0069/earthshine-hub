/**
 * Carbon Credit Quality Scoring System (0-100)
 * 
 * Scoring Framework:
 * - Additionality: 25 points
 * - Permanence: 20 points
 * - Verification Strength: 15 points
 * - Vintage & Age: 10 points
 * - Registry Reputation: 10 points
 * - Leakage Risk: 10 points
 * - Co-benefits & SDGs: 10 points
 */

export interface QualityScoreBreakdown {
  additionality: number;
  permanence: number;
  verification: number;
  vintage: number;
  registry: number;
  leakage: number;
  coBenefits: number;
  total: number;
}

export interface CreditProject {
  registry: string;
  projectType: string;
  methodologyId?: string;
  verificationBody?: string;
  vintageYear: number;
  permanenceRisk: string;
  additionalityScore?: number;
  coBenefits?: string[];
  sdgAlignment?: number[];
}

// Registry reputation scores
const REGISTRY_SCORES: Record<string, number> = {
  'verra': 10,
  'gold_standard': 10,
  'american_carbon_registry': 8,
  'climate_action_reserve': 8,
  'plan_vivo': 7,
  'puro_earth': 9,
  'iscc': 7,
  'other': 4,
};

// Project type permanence scores
const PERMANENCE_BY_TYPE: Record<string, number> = {
  'geological_storage': 20,
  'direct_air_capture': 19,
  'biochar': 18,
  'enhanced_weathering': 17,
  'industrial': 16,
  'renewable_energy': 15,
  'energy_efficiency': 14,
  'waste_to_energy': 13,
  'avoided_deforestation': 10,
  'afforestation': 12,
  'reforestation': 11,
  'improved_forest_management': 9,
  'blue_carbon': 10,
  'soil_carbon': 8,
  'cookstoves': 12,
  'other': 8,
};

// Leakage risk by project type
const LEAKAGE_RISK_BY_TYPE: Record<string, number> = {
  'geological_storage': 10,
  'direct_air_capture': 10,
  'renewable_energy': 9,
  'industrial': 8,
  'energy_efficiency': 8,
  'biochar': 8,
  'waste_to_energy': 7,
  'cookstoves': 7,
  'afforestation': 5,
  'reforestation': 5,
  'avoided_deforestation': 4,
  'improved_forest_management': 4,
  'blue_carbon': 5,
  'soil_carbon': 4,
  'other': 5,
};

// Verification body scores
const VERIFICATION_SCORES: Record<string, number> = {
  'sgs': 15,
  'bureau_veritas': 15,
  'dnv': 15,
  'rina': 14,
  'tuv': 14,
  'control_union': 13,
  'earthood': 12,
  'other': 8,
};

/**
 * Calculate vintage score based on credit age
 * Newer credits score higher (max 10 for <1 year old)
 */
export function calculateVintageScore(vintageYear: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - vintageYear;
  
  if (age < 1) return 10;
  if (age === 1) return 9;
  if (age === 2) return 8;
  if (age === 3) return 7;
  if (age === 4) return 6;
  if (age === 5) return 5;
  if (age === 6) return 4;
  if (age === 7) return 3;
  return Math.max(1, 10 - age);
}

/**
 * Calculate additionality score
 * Projects with clear financial additionality score higher
 */
export function calculateAdditionalityScore(project: CreditProject): number {
  // If explicit additionality score provided, use it
  if (project.additionalityScore !== undefined) {
    return Math.min(25, Math.max(0, project.additionalityScore));
  }
  
  // Base score by project type
  let score = 15;
  
  // High additionality projects
  if (['direct_air_capture', 'geological_storage', 'biochar', 'enhanced_weathering'].includes(project.projectType)) {
    score = 23;
  }
  // Medium-high additionality
  else if (['renewable_energy', 'energy_efficiency', 'industrial'].includes(project.projectType)) {
    score = 18;
  }
  // Nature-based (variable)
  else if (['afforestation', 'reforestation', 'avoided_deforestation'].includes(project.projectType)) {
    score = 14;
  }
  // Cookstoves and community projects
  else if (['cookstoves', 'waste_to_energy'].includes(project.projectType)) {
    score = 16;
  }
  
  // Boost for Gold Standard (rigorous additionality testing)
  if (project.registry === 'gold_standard') {
    score = Math.min(25, score + 2);
  }
  
  return score;
}

/**
 * Calculate co-benefits and SDG alignment score
 */
export function calculateCoBenefitsScore(project: CreditProject): number {
  let score = 0;
  
  // SDG alignment (up to 5 points)
  const sdgCount = project.sdgAlignment?.length || 0;
  score += Math.min(5, sdgCount);
  
  // Co-benefits (up to 5 points)
  const benefitsCount = project.coBenefits?.length || 0;
  score += Math.min(5, benefitsCount);
  
  // Specific high-impact co-benefits
  const highImpactBenefits = ['biodiversity', 'community_development', 'water_security', 'gender_equality'];
  const hasHighImpact = project.coBenefits?.some(b => highImpactBenefits.includes(b.toLowerCase()));
  if (hasHighImpact) {
    score = Math.min(10, score + 2);
  }
  
  return score;
}

/**
 * Calculate complete quality score for a carbon credit
 */
export function calculateQualityScore(project: CreditProject): QualityScoreBreakdown {
  const additionality = calculateAdditionalityScore(project);
  const permanence = PERMANENCE_BY_TYPE[project.projectType] || 8;
  const verification = VERIFICATION_SCORES[project.verificationBody?.toLowerCase() || 'other'] || 8;
  const vintage = calculateVintageScore(project.vintageYear);
  const registry = REGISTRY_SCORES[project.registry?.toLowerCase()] || 4;
  const leakage = LEAKAGE_RISK_BY_TYPE[project.projectType] || 5;
  const coBenefits = calculateCoBenefitsScore(project);
  
  const total = additionality + permanence + verification + vintage + registry + leakage + coBenefits;
  
  return {
    additionality,
    permanence,
    verification,
    vintage,
    registry,
    leakage,
    coBenefits,
    total: Math.min(100, total),
  };
}

/**
 * Get quality tier based on score
 */
export function getQualityTier(score: number): {
  tier: 'premium' | 'high' | 'standard' | 'basic';
  label: string;
  color: string;
} {
  if (score >= 85) {
    return { tier: 'premium', label: 'Premium Quality', color: 'emerald' };
  }
  if (score >= 70) {
    return { tier: 'high', label: 'High Quality', color: 'green' };
  }
  if (score >= 55) {
    return { tier: 'standard', label: 'Standard Quality', color: 'yellow' };
  }
  return { tier: 'basic', label: 'Basic Quality', color: 'orange' };
}

/**
 * Get recommended use case based on score
 */
export function getRecommendedUseCase(score: number): string[] {
  if (score >= 85) {
    return ['Net-zero claims', 'Science-based targets', 'Voluntary disclosure', 'Premium offsetting'];
  }
  if (score >= 70) {
    return ['Compliance offsetting', 'ESG reporting', 'Corporate sustainability'];
  }
  if (score >= 55) {
    return ['Basic offsetting', 'Internal tracking'];
  }
  return ['Volume offsetting', 'Cost-effective compliance'];
}

/**
 * Format score breakdown for display
 */
export function formatScoreBreakdown(breakdown: QualityScoreBreakdown): {
  dimension: string;
  score: number;
  maxScore: number;
  percentage: number;
  description: string;
}[] {
  return [
    {
      dimension: 'Additionality',
      score: breakdown.additionality,
      maxScore: 25,
      percentage: (breakdown.additionality / 25) * 100,
      description: 'Would this emission reduction happen without carbon finance?',
    },
    {
      dimension: 'Permanence',
      score: breakdown.permanence,
      maxScore: 20,
      percentage: (breakdown.permanence / 20) * 100,
      description: 'How long will the carbon stay sequestered?',
    },
    {
      dimension: 'Verification',
      score: breakdown.verification,
      maxScore: 15,
      percentage: (breakdown.verification / 15) * 100,
      description: 'Strength of third-party verification and MRV',
    },
    {
      dimension: 'Vintage',
      score: breakdown.vintage,
      maxScore: 10,
      percentage: (breakdown.vintage / 10) * 100,
      description: 'Credit age - newer is generally better',
    },
    {
      dimension: 'Registry',
      score: breakdown.registry,
      maxScore: 10,
      percentage: (breakdown.registry / 10) * 100,
      description: 'Reputation and standards of issuing registry',
    },
    {
      dimension: 'Leakage Risk',
      score: breakdown.leakage,
      maxScore: 10,
      percentage: (breakdown.leakage / 10) * 100,
      description: 'Risk of emissions shifting elsewhere',
    },
    {
      dimension: 'Co-benefits',
      score: breakdown.coBenefits,
      maxScore: 10,
      percentage: (breakdown.coBenefits / 10) * 100,
      description: 'SDG alignment and community benefits',
    },
  ];
}
