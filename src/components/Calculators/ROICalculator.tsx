// src/components/Calculators/ROICalculator.tsx
'use client';

import React, { useState } from 'react';

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

const INDUSTRY_PRESETS = {
  general: { efficiencyMultiplier: 1, deviceCost: 500, coverageBoost: 1 },
  banking: { efficiencyMultiplier: 1.2, deviceCost: 800, coverageBoost: 1.3 },
  fintech: { efficiencyMultiplier: 1.15, deviceCost: 700, coverageBoost: 1.25 },
  enterprise: { efficiencyMultiplier: 1.1, deviceCost: 600, coverageBoost: 1.15 },
};

// Pie Chart Component for Savings Breakdown
// Replace just the SavingsPieChart component with this fixed version
const SavingsPieChart: React.FC<{
  salarySavings: number;
  deviceSavings: number;
  totalSavings: number;
}> = ({ salarySavings, deviceSavings, totalSavings }) => {
  const salaryPercentage = totalSavings > 0 ? (salarySavings / totalSavings) * 100 : 0;
  const devicePercentage = totalSavings > 0 ? (deviceSavings / totalSavings) * 100 : 0;

  const radius = 50; // Reduced radius to prevent clipping
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
      <div className="relative w-32 h-32"> {/* Reduced container size */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="20" // Reduced stroke width
            fill="none"
          />
          {/* Salary Savings Segment */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#10b981"
            strokeWidth="20"
            fill="none"
            strokeDasharray={salaryDashArray}
            strokeDashoffset={salaryDashOffset}
            strokeLinecap="round"
          />
          {/* Device Savings Segment - starts where salary segment ends */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#3b82f6"
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

      {/* Legend */}
      <div className="mt-4 space-y-2 w-full px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Salary Savings</span>
          </div>
          <span className="text-sm font-semibold text-green-600">
            {Math.round(salaryPercentage)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
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

export const ROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    manualTesters: 5,
    weeklyTestingHours: 40,
    monthlyTestCycles: 20,
    devicesUsed: 10,
    testerSalary: 75000,
    releaseFrequency: 4,
    industry: 'general',
  });

  const calculateROI = (): CalculatorResults => {
    const industry = inputs.industry as keyof typeof INDUSTRY_PRESETS;
    const preset = INDUSTRY_PRESETS[industry] || INDUSTRY_PRESETS.general;

    const reductionManualEffort = Math.min(90, Math.max(60, 85 - (inputs.monthlyTestCycles / 100)));
    const efficiencyIncrease = Math.min(80, Math.max(50, 65 + (inputs.releaseFrequency * 2))) * preset.efficiencyMultiplier;
    const annualSalarySavings = (inputs.testerSalary * inputs.manualTesters * (reductionManualEffort / 100)) * 0.7;
    const deviceCostSavings = inputs.devicesUsed * preset.deviceCost * 0.6;
    const totalAnnualSavings = annualSalarySavings + deviceCostSavings;
    const releaseCycleImprovement = Math.min(70, Math.max(30, 50 + (inputs.releaseFrequency * 5)));
    const testingCoverageImprovement = Math.min(95, Math.max(40, 60 + (inputs.monthlyTestCycles * 0.5))) * preset.coverageBoost;

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

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const handleInputChange = (field: keyof CalculatorInputs, value: number | string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSliderChange = (field: keyof Omit<CalculatorInputs, 'industry'>, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

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

  return (
    <div className="bg-white dark:bg-gray-800  rounded-xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-dark dark:text-white mb-6">
      Financial Modelling
    </h2>
     Potential savings by automating manual testing processes
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Column 1: Inputs */}
        <div className="space-y-8">
          {/* Industry Selection */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Industry Type</h3>
            <div className="space-y-3">
              <select
                value={inputs.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">General Software</option>
                <option value="banking">Banking/Finance</option>
                <option value="fintech">FinTech</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          {/* Resource Metrics */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Resource Metrics</h3>
            <div className="space-y-6">
              <SliderInput
                label="Manual Testers Count"
                value={inputs.manualTesters}
                min={1}
                max={50}
                onChange={(value) => handleSliderChange('manualTesters', value)}
              />

              <SliderInput
                label="Weekly Testing Hours"
                value={inputs.weeklyTestingHours}
                min={10}
                max={80}
                suffix=" hrs"
                onChange={(value) => handleSliderChange('weeklyTestingHours', value)}
              />

              <SliderInput
                label="Average Tester Salary"
                value={inputs.testerSalary}
                min={40000}
                max={150000}
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
              <SliderInput
                label="Monthly Test Cycles"
                value={inputs.monthlyTestCycles}
                min={5}
                max={100}
                onChange={(value) => handleSliderChange('monthlyTestCycles', value)}
              />

              <SliderInput
                label="Devices Used"
                value={inputs.devicesUsed}
                min={5}
                max={100}
                onChange={(value) => handleSliderChange('devicesUsed', value)}
              />

              <SliderInput
                label="Releases Per Month"
                value={inputs.releaseFrequency}
                min={1}
                max={20}
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
            <div className="flex justify-center">
              <SavingsPieChart
                salarySavings={results.annualSalarySavings}
                deviceSavings={results.deviceCostSavings}
                totalSavings={results.totalAnnualSavings}
              />
            </div>
          </div>

          {/* Key Achievements
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(results.annualSalarySavings)}
              </div>
              <div className="text-sm text-gray-600">Annual Labor Savings</div>
              <div className="text-xs text-gray-500 mt-1">
                Reduces manual testing effort by {results.reductionManualEffort}%
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {results.efficiencyIncrease}% Faster
              </div>
              <div className="text-sm text-gray-600">Testing Execution</div>
              <div className="text-xs text-gray-500 mt-1">
                Parallel testing across multiple devices
              </div>
            </div>
          </div> */}
        </div>

        {/* Column 3: Impact Estimates */}
        <div className="space-y-8">
          {/* Total Impact
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white text-center">
            <div className="text-sm uppercase tracking-wider opacity-90">TOTAL ANNUAL IMPACT</div>
            <div className="text-4xl font-bold mt-2">{formatCurrency(results.totalAnnualSavings)}</div>
            <div className="text-lg opacity-90 mt-1">Potential Annual Savings</div>
            <div className="text-sm opacity-80 mt-2">
              Adds {Math.round((results.totalAnnualSavings / (inputs.testerSalary * inputs.manualTesters)) * 100)}% to your testing efficiency
            </div>
          </div> */}

          {/* Revenue Impact */}
          <div className="bg-white border border-gray-200 rounded-lg p-20">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Impact Estimates</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(results.totalAnnualSavings)}</div>
              <div className="text-sm text-gray-600">Annual Savings</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Current Testing Costs</span>
                <span className="font-semibold">{formatCurrency(inputs.testerSalary * inputs.manualTesters)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Potential Savings</span>
                <span className="font-semibold text-green-600">{formatCurrency(results.totalAnnualSavings)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Efficiency Gain</span>
                <span className="font-semibold text-blue-600">
                  {Math.round((results.totalAnnualSavings / (inputs.testerSalary * inputs.manualTesters)) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Key Achievements */}
          <div className="bg-gray-50 p-20 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3 text-center">Key Achievements</h3>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(results.annualSalarySavings)}
                </div>
                <div className="text-sm text-gray-600">Labor Cost Reduction</div>
                <div className="text-xs text-gray-500">
                  Saves {Math.round(results.annualSalarySavings / inputs.testerSalary)} tester equivalents
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {results.releaseCycleImprovement}% Faster
                </div>
                <div className="text-sm text-gray-600">Release Cycles</div>
                <div className="text-xs text-gray-500">
                  Time-to-market improvement
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white border border-gray-200 rounded-lg p-20">
            <h3 className="font-semibold text-gray-800 mb-2">How it works:</h3>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                Automated testing reduces manual effort by 60-90%
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                5-10x faster test execution
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                Reduced device maintenance costs
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                Faster time-to-market
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default ROICalculator;
