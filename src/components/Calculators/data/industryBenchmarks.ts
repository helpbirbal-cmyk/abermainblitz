// src/components/Calculators/data/industryBenchmarks.ts
import { IndustryBenchmark } from '../types/ROITypes';

export const INDUSTRY_BENCHMARKS: { [key: string]: IndustryBenchmark } = {
  general: {
    name: "General Software",
    description: "Moderate testing requirements",
    typicalTesters: [2, 10],
    typicalSalary: [60000, 90000],
    typicalTestCycles: [8, 500],
    typicalDevices: [5, 20],
    typicalReleases: [2, 8],
    testingComplexity: 3,
    regulatoryRequirements: "Low",
    efficiencyMultiplier: 1,
    deviceCost: 500,
    coverageBoost: 1
  },
  banking: {
    name: "Banking/Finance (BFSI)",
    description: "Strict compliance requirements",
    typicalTesters: [8, 25],
    typicalSalary: [80000, 120000],
    typicalTestCycles: [15, 500],
    typicalDevices: [15, 40],
    typicalReleases: [1, 4],
    testingComplexity: 5,
    regulatoryRequirements: "Very High",
    efficiencyMultiplier: 1.3,
    deviceCost: 800,
    coverageBoost: 1.3
  },
  fintech: {
    name: "FinTech",
    description: "Rapid iteration cycles",
    typicalTesters: [5, 15],
    typicalSalary: [85000, 110000],
    typicalTestCycles: [20, 500],
    typicalDevices: [10, 30],
    typicalReleases: [4, 12],
    testingComplexity: 4,
    regulatoryRequirements: "High",
    efficiencyMultiplier: 1.2,
    deviceCost: 700,
    coverageBoost: 1.25
  },
  enterprise: {
    name: "Enterprise",
    description: "Apps with complex integrations",
    typicalTesters: [6, 20],
    typicalSalary: [70000, 100000],
    typicalTestCycles: [10, 500],
    typicalDevices: [8, 25],
    typicalReleases: [1, 6],
    testingComplexity: 4,
    regulatoryRequirements: "Medium compliance",
    efficiencyMultiplier: 1.1,
    deviceCost: 600,
    coverageBoost: 1.15
  }
};
