// src/components/Calculators/types/ROITypes.ts
export interface CalculatorInputs {
  manualTesters: number;
  weeklyTestingHours: number;
  monthlyTestCycles: number;
  devicesUsed: number;
  testerSalary: number;
  releaseFrequency: number;
  industry: string;
}

export interface CalculatorResults {
  reductionManualEffort: number;
  efficiencyIncrease: number;
  annualSalarySavings: number;
  deviceCostSavings: number;
  totalAnnualSavings: number;
  releaseCycleImprovement: number;
  testingCoverageImprovement: number;
}

export interface IndustryBenchmark {
  name: string;
  description: string;
  typicalTesters: [number, number];
  typicalSalary: [number, number];
  typicalTestCycles: [number, number];
  typicalDevices: [number, number];
  typicalReleases: [number, number];
  testingComplexity: number;
  regulatoryRequirements: string;
  efficiencyMultiplier: number;
  deviceCost: number;
  coverageBoost: number;
}

export interface UserInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

export interface ImpactMetric {
  label: string;
  value: string;
  change: number;
  isPositive: boolean;
  description: string;
}

export interface ROICalculatorProps {
  onRequestDemo: () => void;
}
