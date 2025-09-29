// src/components/Calculators/ROICalculator.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DetailedAnalysisModal from './DetailedROIAnalysisModal';
import {
  CalculatorInputs,
  CalculatorResults,
  IndustryBenchmark,
  UserInfo,
  ROICalculatorProps
} from './types/ROITypes';
import { INDUSTRY_BENCHMARKS } from './data/industryBenchmarks';
import { SavingsPieChart } from './components/SavingsPieChart';
import { Gauge } from './components/Gauge';
import { IndustryInfo } from './components/IndustryInfo';
import { SliderInput, SliderInputWithCapacity } from './components/SliderInputs';
import { useROICalculations } from './hooks/useROICalculations';
import { useFormSubmission } from './hooks/useFormSubmission';

// ------------------------------------
// MAIN COMPONENT
// ------------------------------------

export function ROICalculator({ onRequestDemo }: ROICalculatorProps) {
  // State
  const [inputs, setInputs] = useState<CalculatorInputs>({
    manualTesters: 5,
    weeklyTestingHours: 40,
    monthlyTestCycles: 20,
    devicesUsed: 10,
    testerSalary: 75000,
    releaseFrequency: 4,
    industry: 'general',
  });

  const {
    isModalOpen,
    isSubmitting,
    submitError,
    formSubmitted,
    showDetailedAnalysis,
    openModal,
    closeModal,
    handleFormSubmission
  } = useFormSubmission();

  const {
    results,
    testCycleCapacity,
    currentBenchmark
  } = useROICalculations(inputs);

  // Effects
  useEffect(() => {
    const newCapacity = Math.round(testCycleCapacity);
    setInputs(prev => ({
      ...prev,
      monthlyTestCycles: newCapacity
    }));
  }, [inputs.manualTesters, inputs.weeklyTestingHours, inputs.releaseFrequency, inputs.industry, testCycleCapacity]);

  // Event Handlers
  const handleIndustryChange = (industry: string) => {
    const benchmark = INDUSTRY_BENCHMARKS[industry];
    const averageTesters = Math.round((benchmark.typicalTesters[0] + benchmark.typicalTesters[1]) / 2);
    const averageSalary = Math.round((benchmark.typicalSalary[0] + benchmark.typicalSalary[1]) / 2);
    const averageReleases = Math.round((benchmark.typicalReleases[0] + benchmark.typicalReleases[1]) / 2);

    setInputs(prev => ({
      ...prev,
      industry,
      manualTesters: averageTesters,
      testerSalary: averageSalary,
      releaseFrequency: averageReleases,
    }));
  };

  const handleSliderChange = (field: keyof Omit<CalculatorInputs, 'industry'>, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleModalSubmit = async (modalUserInfo: UserInfo) => {
    await handleFormSubmission(modalUserInfo, results, inputs);
  };

  // Render
  return (
    <div className="space-y-8">
      <CalculatorForm
        inputs={inputs}
        results={results}
        currentBenchmark={currentBenchmark}
        testCycleCapacity={testCycleCapacity}
        onIndustryChange={handleIndustryChange}
        onSliderChange={handleSliderChange}
        onOpenModal={openModal}
        onRequestDemo={onRequestDemo}
        submitError={submitError}
      />

      {/* Detailed Analysis Modal */}
      {isModalOpen && (
        <DetailedAnalysisModal
          isOpen={isModalOpen}
          onClose={closeModal}
          results={results}
          inputs={inputs}
          industryBenchmark={currentBenchmark}
          onFormSubmit={handleModalSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}

      {/* Success Message */}
      {showDetailedAnalysis && formSubmitted && (
        <SubmissionSuccess />
      )}
    </div>
  );
}

// ------------------------------------
// SUB-COMPONENTS
// ------------------------------------

interface CalculatorFormProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
  currentBenchmark: IndustryBenchmark;
  testCycleCapacity: number;
  onIndustryChange: (industry: string) => void;
  onSliderChange: (field: keyof Omit<CalculatorInputs, 'industry'>, value: number) => void;
  onOpenModal: () => void;
  onRequestDemo: () => void;
  submitError: string | null;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  inputs,
  results,
  currentBenchmark,
  testCycleCapacity,
  onIndustryChange,
  onSliderChange,
  onOpenModal,
  onRequestDemo,
  submitError
}) => (
  <div className="bg-white dark:bg-gray-800 border-sm rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-black dark:text-white mb-6">
      Financial Modelling
    </h2>

    <div className="grid lg:grid-cols-3 gap-8">
      {/* Column 1: Inputs */}
      <InputSection
        inputs={inputs}
        currentBenchmark={currentBenchmark}
        testCycleCapacity={testCycleCapacity}
        onIndustryChange={onIndustryChange}
        onSliderChange={onSliderChange}
      />

      {/* Column 2: Performance Metrics & Savings */}
      <MetricsSection results={results} />

      {/* Column 3: Impact Estimates */}
      <ImpactSection
        results={results}
        onOpenModal={onOpenModal}
        onRequestDemo={onRequestDemo}
        submitError={submitError}
      />
    </div>
  </div>
);

const InputSection: React.FC<{
  inputs: CalculatorInputs;
  currentBenchmark: IndustryBenchmark;
  testCycleCapacity: number;
  onIndustryChange: (industry: string) => void;
  onSliderChange: (field: keyof Omit<CalculatorInputs, 'industry'>, value: number) => void;
}> = ({ inputs, currentBenchmark, testCycleCapacity, onIndustryChange, onSliderChange }) => (
  <div className="space-y-8">
    <IndustrySelection
      industry={inputs.industry}
      benchmark={currentBenchmark}
      onIndustryChange={onIndustryChange}
    />

    <ResourceMetrics
      inputs={inputs}
      benchmark={currentBenchmark}
      testCycleCapacity={testCycleCapacity}
      onSliderChange={onSliderChange}
    />

    <TestingMetrics
      inputs={inputs}
      benchmark={currentBenchmark}
      onSliderChange={onSliderChange}
    />
  </div>
);

const IndustrySelection: React.FC<{
  industry: string;
  benchmark: IndustryBenchmark;
  onIndustryChange: (industry: string) => void;
}> = ({ industry, benchmark, onIndustryChange }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Industry Settings</h3>
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Industry Type</label>
      <select
        value={industry}
        onChange={(e) => onIndustryChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {Object.entries(INDUSTRY_BENCHMARKS).map(([key, bench]) => (
          <option key={key} value={key}>{bench.name}</option>
        ))}
      </select>
      <IndustryInfo benchmark={benchmark} />
    </div>
  </div>
);

const ResourceMetrics: React.FC<{
  inputs: CalculatorInputs;
  benchmark: IndustryBenchmark;
  testCycleCapacity: number;
  onSliderChange: (field: keyof Omit<CalculatorInputs, 'industry'>, value: number) => void;
}> = ({ inputs, benchmark, testCycleCapacity, onSliderChange }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Resource Metrics</h3>
    <div className="space-y-6">
      <SliderInputWithCapacity
        label="Manual Testers Count"
        value={inputs.manualTesters}
        min={benchmark.typicalTesters[0]}
        max={benchmark.typicalTesters[1]}
        capacityValue={testCycleCapacity}
        onChange={(value) => onSliderChange('manualTesters', value)}
      />

      <SliderInputWithCapacity
        label="Weekly Testing Hours"
        value={inputs.weeklyTestingHours}
        min={10}
        max={80}
        suffix=" hrs"
        capacityValue={testCycleCapacity}
        onChange={(value) => onSliderChange('weeklyTestingHours', value)}
      />

      <SliderInput
        label="Average Tester Salary"
        value={inputs.testerSalary}
        min={benchmark.typicalSalary[0]}
        max={benchmark.typicalSalary[1]}
        step={5000}
        prefix="$"
        onChange={(value) => onSliderChange('testerSalary', value)}
      />
    </div>
  </div>
);

const TestingMetrics: React.FC<{
  inputs: CalculatorInputs;
  benchmark: IndustryBenchmark;
  onSliderChange: (field: keyof Omit<CalculatorInputs, 'industry'>, value: number) => void;
}> = ({ inputs, benchmark, onSliderChange }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Testing Metrics</h3>
    <div className="space-y-6">
      <SliderInput
        label="Monthly Test Cycles"
        value={inputs.monthlyTestCycles}
        min={benchmark.typicalTestCycles[0]}
        max={benchmark.typicalTestCycles[1]}
        onChange={(value) => onSliderChange('monthlyTestCycles', value)}
      />

      <SliderInput
        label="Devices Used"
        value={inputs.devicesUsed}
        min={benchmark.typicalDevices[0]}
        max={benchmark.typicalDevices[1]}
        onChange={(value) => onSliderChange('devicesUsed', value)}
      />

      <SliderInput
        label="Releases Per Month"
        value={inputs.releaseFrequency}
        min={benchmark.typicalReleases[0]}
        max={benchmark.typicalReleases[1]}
        onChange={(value) => onSliderChange('releaseFrequency', value)}
      />
    </div>
  </div>
);

const MetricsSection: React.FC<{ results: CalculatorResults }> = ({ results }) => (
  <div className="space-y-8">
    <PerformanceMetrics results={results} />
    <SavingsBreakdown results={results} />
    <HowItWorks />
  </div>
);

const PerformanceMetrics: React.FC<{ results: CalculatorResults }> = ({ results }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Performance Metrics</h3>
    <div className="grid grid-cols-2 gap-4">
      <Gauge value={results.reductionManualEffort} label="Manual Effort Reduction" color="#3b82f6" />
      <Gauge value={results.efficiencyIncrease} label="Efficiency Increase" color="#10b981" />
      <Gauge value={results.releaseCycleImprovement} label="Faster Releases" color="#8b5cf6" />
      <Gauge value={results.testingCoverageImprovement} label="Test Coverage" color="#f59e0b" />
    </div>
  </div>
);

const SavingsBreakdown: React.FC<{ results: CalculatorResults }> = ({ results }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Savings Breakdown</h3>
    <div className="flex justify-center px-4">
      <SavingsPieChart
        salarySavings={results.annualSalarySavings}
        deviceSavings={results.deviceCostSavings}
        totalSavings={results.totalAnnualSavings}
      />
    </div>
  </div>
);

const HowItWorks: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
    <ul className="space-y-1 text-xs text-gray-600">
      <InfoListItem>
        Test cycle capacity auto-calculates based on team size, hours, and release frequency
      </InfoListItem>
      <InfoListItem>
        Device requirements are market-driven (set based on your target customers)
      </InfoListItem>
      <InfoListItem>
        Industry selection provides realistic benchmark ranges and multipliers
      </InfoListItem>
      <InfoListItem>
        Automation reduces manual effort and increases testing efficiency
      </InfoListItem>
    </ul>
  </div>
);

const InfoListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start">
    <span className="text-green-500 mr-2 mt-1">•</span>
    {children}
  </li>
);

const ImpactSection: React.FC<{
  results: CalculatorResults;
  onOpenModal: () => void;
  onRequestDemo: () => void;
  submitError: string | null;
}> = ({ results, onOpenModal, onRequestDemo, submitError }) => (
  <div className="space-y-8">
    <TotalSavings totalSavings={results.totalAnnualSavings} />

    <KeyAchievements
      reductionManualEffort={results.reductionManualEffort}
      annualSalarySavings={results.annualSalarySavings}
      testingCoverageImprovement={results.testingCoverageImprovement}
    />

    <ActionButtons
      onOpenModal={onOpenModal}
      onRequestDemo={onRequestDemo}
      submitError={submitError}
    />
  </div>
);

const TotalSavings: React.FC<{ totalSavings: number }> = ({ totalSavings }) => (
  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white text-center shadow-lg">
    <div className="text-sm uppercase tracking-wider opacity-90">TOTAL ANNUAL SAVINGS</div>
    <div className="text-5xl font-extrabold my-2">
      {formatCurrency(totalSavings)}
    </div>
    <div className="text-xs opacity-80">Estimated savings with automation in year 1</div>
  </div>
);

const KeyAchievements: React.FC<{
  reductionManualEffort: number;
  annualSalarySavings: number;
  testingCoverageImprovement: number;
}> = ({ reductionManualEffort, annualSalarySavings, testingCoverageImprovement }) => (
  <div className="space-y-4">
    <AchievementCard
      value={reductionManualEffort}
      label="Manual Effort Reduced"
      description={`Re-allocate ${formatCurrency(annualSalarySavings)} of labor to strategic work.`}
      color="blue"
    />
    <AchievementCard
      value={testingCoverageImprovement}
      label="Increased Test Coverage"
      description="Catch more defects before production releases."
      color="yellow"
    />
  </div>
);

const AchievementCard: React.FC<{
  value: number;
  label: string;
  description: string;
  color: 'blue' | 'yellow';
}> = ({ value, label, description, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{value}%</div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-xs text-gray-500 mt-1">{description}</div>
    </div>
  );
};

const ActionButtons: React.FC<{
  onOpenModal: () => void;
  onRequestDemo: () => void;
  submitError: string | null;
}> = ({ onOpenModal, onRequestDemo, submitError }) => (
  <div className="space-y-4 pt-4">
    <button
      onClick={onOpenModal}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 shadow-md"
    >
      Get Detailed Analysis
    </button>
    <button
      onClick={onRequestDemo}
      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition duration-200"
    >
      Request a Demo
    </button>

    {submitError && (
      <p className="text-red-500 text-sm text-center mt-2">{submitError}</p>
    )}
  </div>
);

const SubmissionSuccess: React.FC = () => (
  <div className="bg-green-50 p-6 rounded-xl text-center shadow-lg">
    <h3 className="text-xl font-semibold text-green-700">Analysis Sent!</h3>
    <p className="text-green-600 mt-1">Check your email for the detailed ROI report.</p>
  </div>
);

// ------------------------------------
// UTILITY FUNCTIONS
// ------------------------------------

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};
