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

// Gauge Component
const Gauge: React.FC<{
  value: number;
  max?: number;
  label: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ value, max = 100, label, color, size = 'md' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeWidth = size === 'lg' ? 10 : size === 'sm' ? 6 : 8;
  const radius = size === 'lg' ? 45 : size === 'sm' ? 35 : 40; // Reduced radius to prevent clipping
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeClass = size === 'lg' ? 'w-28 h-28' : size === 'sm' ? 'w-20 h-20' : 'w-24 h-24';

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClass}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${radius * 2 + strokeWidth} ${radius * 2 + strokeWidth}`}>
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Value circle */}
          <circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-lg' : 'text-lg'}`}>
            {value}%
          </span>
        </div>
      </div>
      <span className="text-xs text-gray-600 mt-2 text-center px-1">{label}</span>
    </div>
  );
};

// Savings Gauge Component - Horizontal layout
const SavingsGauge: React.FC<{
  value: number;
  total: number;
  label: string;
  color: string;
}> = ({ value, total, label, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const radius = 30; // Smaller radius for horizontal layout
  const circumference = 2 * Math.PI * radius;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg flex-1 min-w-0">
      <div className="text-sm font-medium text-gray-700 mb-2 text-center">{label}</div>
      <div className="relative w-20 h-20 mb-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={8}
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth={8}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className="text-lg font-bold text-center" style={{ color }}>
        {formatCurrency(value)}
      </div>
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

  // Format currency with K and M suffixes
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

    <div className="space-y-8">
      {/* Input Form with Clean Layout */}
      <div className="bg-white dark:bg-gray-800  border-sm rounded-xl shadow-lg p-6">


  {/*  <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg"> */}
    <h2 className="text-xl font-bold text-black dark:text-white  mb-6">
      Financial Modelling
    </h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Inputs */}



        <div className="lg:col-span-1 space-y-8">
        {/* Industry Selection */}
        <div className="bg-gray-50 p-6 rounded-lg">
        {/*   <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Industry Settings</h3> */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Industry Type</label>
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

        {/* Right Column - Results */}
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Metrics - Now with properly sized Gauges */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
              <Gauge
                value={results.reductionManualEffort}
                label="Manual Effort Reduction"
                color="#3b82f6"
                size="sm"
              />
              <Gauge
                value={results.efficiencyIncrease}
                label="Efficiency Increase"
                color="#10b981"
                size="sm"
              />
              <Gauge
                value={results.releaseCycleImprovement}
                label="Faster Releases"
                color="#8b5cf6"
                size="sm"
              />
              <Gauge
                value={results.testingCoverageImprovement}
                label="Coverage Improvement"
                color="#f59e0b"
                size="sm"
              />
            </div>
          </div>

          {/* Total Impact */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-lg text-white text-center">
            <div className="text-sm uppercase tracking-wider opacity-90">Total Annual Impact</div>
            <div className="text-4xl font-bold mt-2">{formatCurrency(results.totalAnnualSavings)}</div>
            <div className="text-lg opacity-90 mt-1">Potential Annual Savings</div>
            <div className="text-sm opacity-80 mt-2">
              Equivalent to {Math.round((results.totalAnnualSavings / (inputs.testerSalary * inputs.manualTesters)) * 100)}% of current testing costs
            </div>
          </div>

          {/* Savings Breakdown - Now in same row */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">Savings Breakdown</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SavingsGauge
                value={results.annualSalarySavings}
                total={results.totalAnnualSavings}
                label="Salary Savings"
                color="#10b981"
              />
              <SavingsGauge
                value={results.deviceCostSavings}
                total={results.totalAnnualSavings}
                label="Device Cost Savings"
                color="#3b82f6"
              />
            </div>
          </div>

          {/* Key Achievements */}
          <div className="grid md:grid-cols-2 gap-6">
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
          </div>

          {/* How it works */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">How it works:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                Automated testing reduces manual effort by 60-90% through parallel execution
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                Each automated test cycle can run 5-10x faster than manual testing
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                Reduced device maintenance and cloud infrastructure costs
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                Faster release cycles improve time-to-market and competitive advantage
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
    </div>
  );
};

export default ROICalculator;
