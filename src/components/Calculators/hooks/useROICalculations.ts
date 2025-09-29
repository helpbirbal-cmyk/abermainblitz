import { useCallback, useMemo } from 'react';
import { CalculatorInputs, CalculatorResults, IndustryBenchmark } from '../types/ROITypes';
import { INDUSTRY_BENCHMARKS } from '../data/industryBenchmarks';

export const useROICalculations = (inputs: CalculatorInputs) => {
  const currentBenchmark = useMemo((): IndustryBenchmark =>
    INDUSTRY_BENCHMARKS[inputs.industry] || INDUSTRY_BENCHMARKS.general,
    [inputs.industry]
  );

  const calculateTestCycleCapacity = useCallback((): number => {
    const cyclesPerTesterPerWeek = 4;
    const baseMonthlyCycles = inputs.manualTesters * cyclesPerTesterPerWeek * 4;
    const hoursMultiplier = inputs.weeklyTestingHours / 40;
    const releaseMultiplier = 1 + (inputs.releaseFrequency * 0.1);

    let calculatedCycles = baseMonthlyCycles * hoursMultiplier * releaseMultiplier;
    calculatedCycles = calculatedCycles * (currentBenchmark.testingComplexity / 3);

    return Math.min(
      currentBenchmark.typicalTestCycles[1],
      Math.max(currentBenchmark.typicalTestCycles[0], calculatedCycles)
    );
  }, [inputs.manualTesters, inputs.weeklyTestingHours, inputs.releaseFrequency, currentBenchmark]);

  const testCycleCapacity = useMemo(() => calculateTestCycleCapacity(), [calculateTestCycleCapacity]);

  const results = useMemo((): CalculatorResults => {
    const baseReduction = Math.min(90, Math.max(60, 85 - (inputs.monthlyTestCycles / 100)));
    const reductionManualEffort = baseReduction * currentBenchmark.efficiencyMultiplier;

    const baseEfficiency = Math.min(80, Math.max(50, 65 + (inputs.releaseFrequency * 2)));
    const efficiencyIncrease = baseEfficiency * currentBenchmark.efficiencyMultiplier;

    const annualSalarySavings = (inputs.testerSalary * inputs.manualTesters * (reductionManualEffort / 100)) * 0.7;
    const deviceCostSavings = inputs.devicesUsed * currentBenchmark.deviceCost * 0.6;
    const totalAnnualSavings = annualSalarySavings + deviceCostSavings;

    const releaseCycleImprovement = Math.min(70, Math.max(30, 50 + (inputs.releaseFrequency * 5)));
    const testingCoverageImprovement = Math.min(95, Math.max(40, 60 + (inputs.monthlyTestCycles * 0.5))) * currentBenchmark.coverageBoost;

    return {
      reductionManualEffort: Math.round(reductionManualEffort),
      efficiencyIncrease: Math.round(efficiencyIncrease),
      annualSalarySavings: Math.round(annualSalarySavings),
      deviceCostSavings: Math.round(deviceCostSavings),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      releaseCycleImprovement: Math.round(releaseCycleImprovement),
      testingCoverageImprovement: Math.round(testingCoverageImprovement),
    };
  }, [inputs, currentBenchmark]);

  return {
    results,
    testCycleCapacity,
    currentBenchmark
  };
};
