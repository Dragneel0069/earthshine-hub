// BRSR (Business Responsibility and Sustainability Reporting) Framework for India
// Based on SEBI guidelines for listed companies

export interface BRSRPrinciple {
  id: number;
  name: string;
  description: string;
  essentialIndicators: BRSRIndicator[];
  leadershipIndicators: BRSRIndicator[];
}

export interface BRSRIndicator {
  id: string;
  code: string;
  question: string;
  type: 'quantitative' | 'qualitative' | 'yes_no';
  unit?: string;
  scope?: string;
  mandatory: boolean;
}

export const BRSR_PRINCIPLES: BRSRPrinciple[] = [
  {
    id: 1,
    name: 'Businesses should conduct and govern themselves with integrity',
    description: 'Ethics, transparency and accountability',
    essentialIndicators: [
      {
        id: 'p1_e1',
        code: 'P1-E1',
        question: 'Percentage of directors who have undergone training on ethics and anti-corruption',
        type: 'quantitative',
        unit: '%',
        mandatory: true,
      },
      {
        id: 'p1_e2',
        code: 'P1-E2',
        question: 'Details of fines/penalties for non-compliance with laws and regulations',
        type: 'quantitative',
        unit: 'INR',
        mandatory: true,
      },
    ],
    leadershipIndicators: [
      {
        id: 'p1_l1',
        code: 'P1-L1',
        question: 'Awareness programs conducted for value chain partners on ethics and anti-corruption',
        type: 'quantitative',
        unit: 'number',
        mandatory: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Businesses should provide goods and services in a sustainable manner',
    description: 'Product lifecycle sustainability',
    essentialIndicators: [
      {
        id: 'p2_e1',
        code: 'P2-E1',
        question: 'Percentage of R&D and capital expenditure on sustainable products',
        type: 'quantitative',
        unit: '%',
        mandatory: true,
      },
      {
        id: 'p2_e2',
        code: 'P2-E2',
        question: 'Details of sustainable sourcing practices',
        type: 'qualitative',
        mandatory: true,
      },
    ],
    leadershipIndicators: [
      {
        id: 'p2_l1',
        code: 'P2-L1',
        question: 'Percentage of products with extended producer responsibility',
        type: 'quantitative',
        unit: '%',
        mandatory: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Businesses should respect and promote the well-being of all employees',
    description: 'Employee welfare and rights',
    essentialIndicators: [
      {
        id: 'p3_e1',
        code: 'P3-E1',
        question: 'Details of measures for well-being of employees',
        type: 'qualitative',
        mandatory: true,
      },
      {
        id: 'p3_e2',
        code: 'P3-E2',
        question: 'Details of training provided to employees',
        type: 'quantitative',
        unit: 'hours',
        mandatory: true,
      },
    ],
    leadershipIndicators: [
      {
        id: 'p3_l1',
        code: 'P3-L1',
        question: 'Details of performance and career development reviews',
        type: 'quantitative',
        unit: '%',
        mandatory: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Businesses should respect the interests of and be responsive to all stakeholders',
    description: 'Stakeholder engagement',
    essentialIndicators: [
      {
        id: 'p4_e1',
        code: 'P4-E1',
        question: 'Processes for identifying key stakeholder groups',
        type: 'qualitative',
        mandatory: true,
      },
    ],
    leadershipIndicators: [
      {
        id: 'p4_l1',
        code: 'P4-L1',
        question: 'Channels of communication with stakeholders',
        type: 'qualitative',
        mandatory: false,
      },
    ],
  },
  {
    id: 5,
    name: 'Businesses should respect and promote human rights',
    description: 'Human rights protection',
    essentialIndicators: [
      {
        id: 'p5_e1',
        code: 'P5-E1',
        question: 'Employees and workers trained on human rights issues',
        type: 'quantitative',
        unit: 'number',
        mandatory: true,
      },
    ],
    leadershipIndicators: [
      {
        id: 'p5_l1',
        code: 'P5-L1',
        question: 'Details of human rights due diligence process',
        type: 'qualitative',
        mandatory: false,
      },
    ],
  },
  {
    id: 6,
    name: 'Businesses should respect and make efforts to protect and restore the environment',
    description: 'Environmental protection',
    essentialIndicators: [
      {
        id: 'p6_e1',
        code: 'P6-E1',
        question: 'Total energy consumption (in Joules or multiples)',
        type: 'quantitative',
        unit: 'GJ',
        scope: 'Scope 1 & 2',
        mandatory: true,
      },
      {
        id: 'p6_e2',
        code: 'P6-E2',
        question: 'Total Scope 1 emissions (in metric tonnes of CO2 equivalent)',
        type: 'quantitative',
        unit: 'tCO2e',
        scope: 'Scope 1',
        mandatory: true,
      },
      {
        id: 'p6_e3',
        code: 'P6-E3',
        question: 'Total Scope 2 emissions (in metric tonnes of CO2 equivalent)',
        type: 'quantitative',
        unit: 'tCO2e',
        scope: 'Scope 2',
        mandatory: true,
      },
      {
        id: 'p6_e4',
        code: 'P6-E4',
        question: 'Total Scope 3 emissions (in metric tonnes of CO2 equivalent)',
        type: 'quantitative',
        unit: 'tCO2e',
        scope: 'Scope 3',
        mandatory: false,
      },
      {
        id: 'p6_e5',
        code: 'P6-E5',
        question: 'Water withdrawal by source (in kilolitres)',
        type: 'quantitative',
        unit: 'kL',
        mandatory: true,
      },
      {
        id: 'p6_e6',
        code: 'P6-E6',
        question: 'Total waste generated (in metric tonnes)',
        type: 'quantitative',
        unit: 'MT',
        mandatory: true,
      },
      {
        id: 'p6_e7',
        code: 'P6-E7',
        question: 'Details of environmental impact assessments',
        type: 'qualitative',
        mandatory: true,
      },
    ],
    leadershipIndicators: [
      {
        id: 'p6_l1',
        code: 'P6-L1',
        question: 'Details of greenhouse gas emissions reduction initiatives',
        type: 'qualitative',
        mandatory: false,
      },
      {
        id: 'p6_l2',
        code: 'P6-L2',
        question: 'Percentage of renewable energy used',
        type: 'quantitative',
        unit: '%',
        mandatory: false,
      },
    ],
  },
  {
    id: 7,
    name: 'Businesses should support inclusive growth and equitable development',
    description: 'Social development',
    essentialIndicators: [
      {
        id: 'p7_e1',
        code: 'P7-E1',
        question: 'Details of CSR projects undertaken',
        type: 'qualitative',
        mandatory: true,
      },
    ],
    leadershipIndicators: [
      {
        id: 'p7_l1',
        code: 'P7-L1',
        question: 'Number of beneficiaries from CSR projects',
        type: 'quantitative',
        unit: 'number',
        mandatory: false,
      },
    ],
  },
  {
    id: 8,
    name: 'Businesses should promote inclusive growth through innovation',
    description: 'Innovation for social good',
    essentialIndicators: [
      {
        id: 'p8_e1',
        code: 'P8-E1',
        question: 'Details of social impact assessments',
        type: 'qualitative',
        mandatory: true,
      },
    ],
    leadershipIndicators: [
      {
        id: 'p8_l1',
        code: 'P8-L1',
        question: 'Details of corrective actions taken based on social impact assessments',
        type: 'qualitative',
        mandatory: false,
      },
    ],
  },
  {
    id: 9,
    name: 'Businesses should engage with and provide value to their consumers responsibly',
    description: 'Consumer welfare',
    essentialIndicators: [
      {
        id: 'p9_e1',
        code: 'P9-E1',
        question: 'Number of consumer complaints received and resolved',
        type: 'quantitative',
        unit: 'number',
        mandatory: true,
      },
    ],
    leadershipIndicators: [
      {
        id: 'p9_l1',
        code: 'P9-L1',
        question: 'Channels for consumer feedback and grievance redressal',
        type: 'qualitative',
        mandatory: false,
      },
    ],
  },
];

export const BRSR_SECTION_A = {
  name: 'General Disclosures',
  items: [
    'Corporate Identity Number (CIN)',
    'Name of the Company',
    'Year of incorporation',
    'Registered office address',
    'Corporate address',
    'E-mail',
    'Telephone',
    'Website',
    'Financial year for reporting',
    'Name of the Stock Exchange(s)',
    'Paid-up Capital',
    'Contact person details',
  ],
};

export const BRSR_SECTION_B = {
  name: 'Management and Process Disclosures',
  items: [
    'Policy and management processes',
    'Governance, leadership and oversight',
    'Materiality assessment',
    'Stakeholder engagement',
  ],
};

export const BRSR_SECTION_C = {
  name: 'Principle-wise Performance Disclosure',
  principles: BRSR_PRINCIPLES,
};

export const COMPLIANCE_DEADLINES = {
  BRSR: {
    name: 'BRSR Annual Report',
    frequency: 'Annual',
    deadline: 'Within 60 days of AGM',
    applicableTo: 'Top 1000 listed companies by market cap',
  },
  CDP: {
    name: 'CDP Climate Change Questionnaire',
    frequency: 'Annual',
    deadline: 'July 31',
    applicableTo: 'Voluntary',
  },
  GRI: {
    name: 'GRI Sustainability Report',
    frequency: 'Annual',
    deadline: 'Voluntary',
    applicableTo: 'Voluntary',
  },
  TCFD: {
    name: 'TCFD Climate Disclosures',
    frequency: 'Annual',
    deadline: 'Voluntary',
    applicableTo: 'Voluntary',
  },
};

export const REGULATORY_FRAMEWORKS = [
  {
    id: 'sebi_brsr',
    name: 'SEBI BRSR',
    authority: 'Securities and Exchange Board of India',
    description: 'Mandatory ESG reporting for top 1000 listed companies',
    applicability: 'Listed companies',
    year: 2021,
  },
  {
    id: 'mca_csr',
    name: 'MCA CSR Rules',
    authority: 'Ministry of Corporate Affairs',
    description: 'Corporate Social Responsibility requirements',
    applicability: 'Companies meeting threshold criteria',
    year: 2014,
  },
  {
    id: 'cea_perform',
    name: 'CEA PAT Scheme',
    authority: 'Central Electricity Authority',
    description: 'Perform, Achieve and Trade scheme for energy efficiency',
    applicability: 'Energy-intensive industries',
    year: 2012,
  },
  {
    id: 'moefcc_consent',
    name: 'MoEFCC Environmental Clearance',
    authority: 'Ministry of Environment, Forest and Climate Change',
    description: 'Environmental impact assessment and clearance',
    applicability: 'Projects with environmental impact',
    year: 2006,
  },
];
