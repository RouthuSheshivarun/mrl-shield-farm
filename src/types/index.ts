export interface Animal {
  id: string;
  tagId: string;
  species: 'cattle' | 'buffalo' | 'goat' | 'sheep' | 'poultry' | 'pig';
  breed: string;
  age: number;
  weight: number;
  healthStatus: 'healthy' | 'sick' | 'recovering';
}

export interface Drug {
  id: string;
  name: string;
  activeIngredient: string;
  category: 'antibiotic' | 'antifungal' | 'antiparasitic' | 'anti-inflammatory';
  withdrawalPeriods: {
    cattle: { milk: number; meat: number };
    buffalo: { milk: number; meat: number };
    goat: { milk: number; meat: number };
    sheep: { meat: number };
    poultry: { egg: number; meat: number };
    pig: { meat: number };
  };
  maxResidueLimit: number;
}

export interface TreatmentRecord {
  id: string;
  farmId: string;
  animalId: string;
  drugId: string;
  dosage: number;
  frequency: number;
  duration: number;
  purpose: string;
  startDate: string;
  endDate: string;
  withdrawalEndDate: string;
  status: 'active' | 'completed' | 'withdrawn';
  complianceStatus: 'compliant' | 'pending' | 'violation';
  veterinarianApproved: boolean;
  veterinarianId?: string;
  veterinarianNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceAlert {
  id: string;
  type: 'withdrawal_reminder' | 'mrl_violation' | 'missing_approval';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  treatmentId: string;
  farmId: string;
  dueDate: string;
  acknowledged: boolean;
  createdAt: string;
}

export interface Farm {
  id: string;
  name: string;
  ownerId: string;
  location: {
    state: string;
    district: string;
    village: string;
  };
  animals: Animal[];
  complianceScore: number;
  totalTreatments: number;
  activeTreatments: number;
  violations: number;
}

export interface VeterinaryPractice {
  id: string;
  name: string;
  veterinarianId: string;
  licenseNumber: string;
  assignedFarms: string[];
  totalApprovals: number;
  pendingApprovals: number;
}

export const COMMON_DRUGS: Drug[] = [
  {
    id: 'oxytetracycline',
    name: 'Oxytetracycline',
    activeIngredient: 'Oxytetracycline HCl',
    category: 'antibiotic',
    withdrawalPeriods: {
      cattle: { milk: 4, meat: 22 },
      buffalo: { milk: 4, meat: 22 },
      goat: { milk: 4, meat: 14 },
      sheep: { meat: 14 },
      poultry: { egg: 7, meat: 5 },
      pig: { meat: 22 },
    },
    maxResidueLimit: 0.1,
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    activeIngredient: 'Amoxicillin Trihydrate',
    category: 'antibiotic',
    withdrawalPeriods: {
      cattle: { milk: 3, meat: 14 },
      buffalo: { milk: 3, meat: 14 },
      goat: { milk: 3, meat: 7 },
      sheep: { meat: 7 },
      poultry: { egg: 0, meat: 1 },
      pig: { meat: 14 },
    },
    maxResidueLimit: 0.05,
  },
  {
    id: 'enrofloxacin',
    name: 'Enrofloxacin',
    activeIngredient: 'Enrofloxacin',
    category: 'antibiotic',
    withdrawalPeriods: {
      cattle: { milk: 5, meat: 14 },
      buffalo: { milk: 5, meat: 14 },
      goat: { milk: 5, meat: 10 },
      sheep: { meat: 10 },
      poultry: { egg: 10, meat: 10 },
      pig: { meat: 14 },
    },
    maxResidueLimit: 0.1,
  },
];

export const SPECIES_OPTIONS = [
  { value: 'cattle', label: 'Cattle / गाय', icon: '🐄' },
  { value: 'buffalo', label: 'Buffalo / भैंस', icon: '🐃' },
  { value: 'goat', label: 'Goat / बकरी', icon: '🐐' },
  { value: 'sheep', label: 'Sheep / भेड़', icon: '🐑' },
  { value: 'poultry', label: 'Poultry / मुर्गी', icon: '🐔' },
  { value: 'pig', label: 'Pig / सूअर', icon: '🐷' },
];