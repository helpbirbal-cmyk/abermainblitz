// src/components/Calculators/ROICalculator.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DetailedAnalysisModal from './DetailedROIAnalysisModal';

// ------------------------------------
// INTERFACES & BENCHMARKS (UNCHANGED)
// ------------------------------------

interface CalculatorInputs {
  manualTesters: number;
  weeklyTestingHours: number;
  monthlyTestCycles: number;
  devicesUsed: number;
  testerSalary: number;
  releaseFrequency: number;
  industry: string;
}

interface CalculatorResults {
  reductionManualEffort: number;
  efficiencyIncrease: number;
  annualSalarySavings: number;
  deviceCostSavings: number;
  totalAnnualSavings: number;
  releaseCycleImprovement: number;
  testingCoverageImprovement: number;
}

interface IndustryBenchmark {
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

const INDUSTRY_BENCHMARKS: { [key: string]: IndustryBenchmark } = {
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

interface UserInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

interface ROICalculatorProps {
  onRequestDemo: () => void;
}

// ------------------------------------
// HELPER COMPONENTS (UNCHANGED)
// ------------------------------------

// Pie Chart Component for Savings Breakdown
const SavingsPieChart: React.FC<{
  salarySavings: number;
  deviceSavings: number;
  totalSavings: number;
}> = ({ salarySavings, deviceSavings, totalSavings }) => {
  const salaryPercentage = totalSavings > 0 ? (salarySavings / totalSavings) * 100 : 0;
  const devicePercentage = totalSavings > 0 ? (deviceSavings / totalSavings) * 100 : 0;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const salaryDashArray = circumference;
  const salaryDashOffset = circumference - (salaryPercentage / 100) * circumference;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-50 h-50">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="20"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#3b82f6"
            strokeWidth="20"
            fill="none"
            strokeDasharray={salaryDashArray}
            strokeDashoffset={salaryDashOffset}
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#10b981"
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (devicePercentage / 100) * circumference + salaryDashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xl font-bold text-gray-800">{formatCurrency(totalSavings)}</div>
          <div className="text-xs text-gray-600">Total Savings</div>
        </div>
      </div>

      <div className="mt-4 space-y-2 w-full px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Salary Savings</span>
          </div>
          <span className="text-sm font-semibold text-green-600">
            {Math.round(salaryPercentage)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Device Savings</span>
          </div>
          <span className="text-sm font-semibold text-blue-600">
            {Math.round(devicePercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Gauge Component
const Gauge: React.FC<{
  value: number;
  label: string;
  color: string;
}> = ({ value, label, color }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-3">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-600 mt-2 text-center">{label}</span>
    </div>
  );
};

// Industry Info Component
const IndustryInfo: React.FC<{ benchmark: IndustryBenchmark }> = ({ benchmark }) => (
  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-semibold text-blue-900">{benchmark.name} Benchmarks</h4>
        <p className="text-sm text-blue-700 mt-1">{benchmark.description}</p>
        <div className="text-xs text-blue-600 mt-2">
          <div> {benchmark.typicalTesters[0]}-{benchmark.typicalTesters[1]} testers | {benchmark.typicalReleases[0]}-{benchmark.typicalReleases[1]} Releases/month</div>
          <div>Regulatory: {benchmark.regulatoryRequirements} | Complexity: {"★".repeat(benchmark.testingComplexity)}</div>
        </div>
      </div>
    </div>
  </div>
);

// Slider Input Component
const SliderInput: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
}> = ({ label, value, min, max, step = 1, prefix = '', suffix = '', onChange }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <span className="text-lg font-semibold text-blue-600">
        {prefix}{value.toLocaleString()}{suffix}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
    />
    <div className="flex justify-between text-xs text-gray-500">
      <span>{prefix}{min.toLocaleString()}{suffix}</span>
      <span>{prefix}{max.toLocaleString()}{suffix}</span>
    </div>
  </div>
);

// Slider Input with Capacity Display
const SliderInputWithCapacity: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  capacityValue: number;
  onChange: (value: number) => void;
}> = ({ label, value, min, max, step = 1, prefix = '', suffix = '', capacityValue, onChange }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <span className="text-lg font-semibold text-blue-600">
        {prefix}{value.toLocaleString()}{suffix}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
    />
    <div className="flex justify-between text-xs text-gray-500">
      <span>{prefix}{min.toLocaleString()}{suffix}</span>
      <span>{prefix}{max.toLocaleString()}{suffix}</span>
    </div>
    <div className="text-xs font-light bg-blue-50 text-blue-700 p-2 rounded text-center">
        Max: {Math.round(capacityValue)} tests/month(est.)
    </div>
  </div>
);

// ------------------------------------
// MAIN COMPONENT
// ------------------------------------

export function ROICalculator({ onRequestDemo }: ROICalculatorProps) {

  // New State Declarations for Modal/Submission
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  // User Info State
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  // Calculator Input State
  const [inputs, setInputs] = useState<CalculatorInputs>({
    manualTesters: 5,
    weeklyTestingHours: 40,
    monthlyTestCycles: 20,
    devicesUsed: 10,
    testerSalary: 75000,
    releaseFrequency: 4,
    industry: 'general',
  });

  // Helper Functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  // Calculation Logic (Memoized for performance)
  const calculateTestCycleCapacity = useCallback((): number => {
    const benchmark = INDUSTRY_BENCHMARKS[inputs.industry] || INDUSTRY_BENCHMARKS.general;

    // Simple calculation: testers × cycles per tester × weeks × adjustments
    const cyclesPerTesterPerWeek = 4; // Base capacity per tester
    const baseMonthlyCycles = inputs.manualTesters * cyclesPerTesterPerWeek * 4; // 4 weeks/month

    // Adjust for working hours (40h week as baseline)
    const hoursMultiplier = inputs.weeklyTestingHours / 40;

    // Adjust for release frequency (more releases = more testing)
    const releaseMultiplier = 1 + (inputs.releaseFrequency * 0.1);

    let calculatedCycles = baseMonthlyCycles * hoursMultiplier * releaseMultiplier;

    // Apply industry complexity (more complex = more testing needed)
    calculatedCycles = calculatedCycles * (benchmark.testingComplexity / 3);

    // Clamp to industry range
    return Math.min(
      benchmark.typicalTestCycles[1],
      Math.max(
        benchmark.typicalTestCycles[0],
        calculatedCycles
      )
    );
  }, [inputs.industry, inputs.manualTesters, inputs.weeklyTestingHours, inputs.releaseFrequency]);

  const testCycleCapacity = calculateTestCycleCapacity();

  const calculateROI = (): CalculatorResults => {
    const benchmark = INDUSTRY_BENCHMARKS[inputs.industry] || INDUSTRY_BENCHMARKS.general;

    const baseReduction = Math.min(90, Math.max(60, 85 - (inputs.monthlyTestCycles / 100)));
    const reductionManualEffort = baseReduction * benchmark.efficiencyMultiplier;

    const baseEfficiency = Math.min(80, Math.max(50, 65 + (inputs.releaseFrequency * 2)));
    const efficiencyIncrease = baseEfficiency * benchmark.efficiencyMultiplier;

    // 0.7 is the estimated % of salary dedicated to manual tasks
    const annualSalarySavings = (inputs.testerSalary * inputs.manualTesters * (reductionManualEffort / 100)) * 0.7;
    // 0.6 is estimated annual saving from using a cloud lab (e.g., maintenance/replacement)
    const deviceCostSavings = inputs.devicesUsed * benchmark.deviceCost * 0.6;
    const totalAnnualSavings = annualSalarySavings + deviceCostSavings;

    const releaseCycleImprovement = Math.min(70, Math.max(30, 50 + (inputs.releaseFrequency * 5)));
    const testingCoverageImprovement = Math.min(95, Math.max(40, 60 + (inputs.monthlyTestCycles * 0.5))) * benchmark.coverageBoost;

    return {
      reductionManualEffort: Math.round(reductionManualEffort),
      efficiencyIncrease: Math.round(efficiencyIncrease),
      annualSalarySavings: Math.round(annualSalarySavings),
      deviceCostSavings: Math.round(deviceCostSavings),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      releaseCycleImprovement: Math.round(releaseCycleImprovement),
      testingCoverageImprovement: Math.round(testingCoverageImprovement),
    };
  };

  const results = calculateROI();

  // Submission Logic (Moved inside component and fixed)
  const sendEmails = async (userData: UserInfo, currentResults: CalculatorResults) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          calculatorInputs: inputs, // Send inputs for full context
          calculatorResults: currentResults, // FIX: Pass the results object directly
        }),
      });

      if (!response.ok) {
        // Log the failing status code and try to read the error message from the server
         const errorData = await response.json().catch(() => ({ message: 'No body provided' }));
         console.error('API Error Status:', response.status);
         console.error('API Error Details:', errorData);
        throw new Error('Failed to send information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending emails:', error);
      setSubmitError('Failed to send your information. Please try again.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalSubmit = async (modalUserInfo: UserInfo) => {
    // This function receives userInfo from the modal, not an event object
    if (!modalUserInfo.name || !modalUserInfo.email || !modalUserInfo.company) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    if (!isValidEmail(modalUserInfo.email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    try {
      await sendEmails(modalUserInfo, results); // FIX: Now has access to sendEmails and results
      setFormSubmitted(true);
      setShowDetailedAnalysis(true);
      closeModal(); // FIX: Now has access to closeModal
    } catch (error) {
      // Error is already handled in sendEmails
      console.log("email failed")
    }
  };

  // Effect to update monthlyTestCycles when relevant inputs change
  useEffect(() => {
    const newCapacity = calculateTestCycleCapacity();
    setInputs(prev => ({
      ...prev,
      monthlyTestCycles: Math.round(newCapacity)
    }));
  }, [inputs.manualTesters, inputs.weeklyTestingHours, inputs.releaseFrequency, inputs.industry, calculateTestCycleCapacity]);

  const handleIndustryChange = (industry: string) => {
    const benchmark = INDUSTRY_BENCHMARKS[industry];

    // Calculate proper averages
    const averageTesters = Math.round((benchmark.typicalTesters[0] + benchmark.typicalTesters[1]) / 2);
    const averageSalary = Math.round((benchmark.typicalSalary[0] + benchmark.typicalSalary[1]) / 2);
    const averageReleases = Math.round((benchmark.typicalReleases[0] + benchmark.typicalReleases[1]) / 2);

    setInputs(prev => ({
      ...prev,
      industry,
      manualTesters: averageTesters,
      testerSalary: averageSalary,
      releaseFrequency: averageReleases,
      // devicesUsed stays the same - market-driven decision
    }));
  };

  const handleSliderChange = (field: keyof Omit<CalculatorInputs, 'industry'>, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const currentBenchmark = INDUSTRY_BENCHMARKS[inputs.industry];

  // ------------------------------------
  // RENDER LOGIC
  // ------------------------------------

  return (
    <div className="space-y-8">
      {/* Input Form with Clean Layout */}
      <div className="bg-white dark:bg-gray-800 border-sm rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-black dark:text-white mb-6">
          Financial Modelling
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Column 1: Inputs */}
          <div className="space-y-8">
            {/* Industry Selection */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Industry Settings</h3>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Industry Type</label>
                <select
                  value={inputs.industry}
                  onChange={(e) => handleIndustryChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(INDUSTRY_BENCHMARKS).map(([key, benchmark]) => (
                    <option key={key} value={key}>{benchmark.name}</option>
                  ))}
                </select>

                <IndustryInfo benchmark={currentBenchmark} />
              </div>
            </div>

            {/* Resource Metrics */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Resource Metrics</h3>
              <div className="space-y-6">
                <SliderInputWithCapacity
                  label="Manual Testers Count"
                  value={inputs.manualTesters}
                  min={currentBenchmark.typicalTesters[0]}
                  max={currentBenchmark.typicalTesters[1]}
                  capacityValue={testCycleCapacity}
                  onChange={(value) => handleSliderChange('manualTesters', value)}
                />

                <SliderInputWithCapacity
                  label="Weekly Testing Hours"
                  value={inputs.weeklyTestingHours}
                  min={10}
                  max={80}
                  suffix=" hrs"
                  capacityValue={testCycleCapacity}
                  onChange={(value) => handleSliderChange('weeklyTestingHours', value)}
                />

                {/* Salary: Independent variable - no linkage */}
                <SliderInput
                  label="Average Tester Salary"
                  value={inputs.testerSalary}
                  min={currentBenchmark.typicalSalary[0]}
                  max={currentBenchmark.typicalSalary[1]}
                  step={5000}
                  prefix="$"
                  onChange={(value) => handleSliderChange('testerSalary', value)}
                />
              </div>
            </div>

            {/* Testing Metrics */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Testing Metrics</h3>
              <div className="space-y-6">
                {/* Test Cycles: Auto-calculated based on logical linkages */}
                <SliderInput
                  label="Monthly Test Cycles"
                  value={inputs.monthlyTestCycles}
                  min={currentBenchmark.typicalTestCycles[0]}
                  max={currentBenchmark.typicalTestCycles[1]}
                  onChange={(value) => handleSliderChange('monthlyTestCycles', value)}
                />

                {/* Devices: Market-driven decision - independent variable */}
                <SliderInput
                  label="Devices Used"
                  value={inputs.devicesUsed}
                  min={currentBenchmark.typicalDevices[0]}
                  max={currentBenchmark.typicalDevices[1]}
                  onChange={(value) => handleSliderChange('devicesUsed', value)}
                />

                <SliderInput
                  label="Releases Per Month"
                  value={inputs.releaseFrequency}
                  min={currentBenchmark.typicalReleases[0]}
                  max={currentBenchmark.typicalReleases[1]}
                  onChange={(value) => handleSliderChange('releaseFrequency', value)}
                />
              </div>
            </div>
          </div>

          {/* Column 2: Performance Metrics & Savings */}
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <Gauge
                  value={results.reductionManualEffort}
                  label="Manual Effort Reduction"
                  color="#3b82f6"
                />
                <Gauge
                  value={results.efficiencyIncrease}
                  label="Efficiency Increase"
                  color="#10b981"
                />
                <Gauge
                  value={results.releaseCycleImprovement}
                  label="Faster Releases"
                  color="#8b5cf6"
                />
                <Gauge
                  value={results.testingCoverageImprovement}
                  label="Test Coverage"
                  color="#f59e0b"
                />
              </div>
            </div>

            {/* Savings Breakdown with Pie Chart */}
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

            {/* How it works */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  Test cycle capacity auto-calculates based on team size, hours, and release frequency
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  Device requirements are market-driven (set based on your target customers)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  Industry selection provides realistic benchmark ranges and multipliers
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  Automation reduces manual effort and increases testing efficiency
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Impact Estimates */}
          <div className="space-y-8">
            {/* Total Impact */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white text-center shadow-lg">
              <div className="text-sm uppercase tracking-wider opacity-90">TOTAL ANNUAL SAVINGS</div>
              <div className="text-5xl font-extrabold my-2">
                {formatCurrency(results.totalAnnualSavings)}
              </div>
              <div className="text-xs opacity-80">Estimated savings with automation in year 1</div>
            </div>

            {/* Key Achievements */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {results.reductionManualEffort}%
                </div>
                <div className="text-sm text-gray-600">Manual Effort Reduced</div>
                <div className="text-xs text-gray-500 mt-1">
                  Re-allocate {formatCurrency(results.annualSalarySavings)} of labor to strategic work.
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">
                  {results.testingCoverageImprovement}%
                </div>
                <div className="text-sm text-gray-600">Increased Test Coverage</div>
                <div className="text-xs text-gray-500 mt-1">
                  Catch more defects before production releases.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <button
                onClick={openModal}
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
          </div>
        </div>
      </div>

      {/* Detailed Analysis Modal */}
      {isModalOpen && (
        <DetailedAnalysisModal
          isOpen={isModalOpen}
          onClose={closeModal}
          results={results}
          inputs={inputs}
          industryBenchmark={currentBenchmark}
          onFormSubmit={handleModalSubmit} // FIX: Now references the inner function
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}

      {/* Detailed Results Display (After submission, if needed) */}
      {showDetailedAnalysis && formSubmitted && (
        <div className="bg-green-50 p-6 rounded-xl text-center shadow-lg">
          <h3 className="text-xl font-semibold text-green-700">Analysis Sent!</h3>
          <p className="text-green-600 mt-1">Check your email for the detailed ROI report.</p>
        </div>
      )}
    </div>
  );
}
