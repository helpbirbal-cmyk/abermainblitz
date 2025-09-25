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

  // Fixed: Handle both number and string inputs
  const handleInputChange = (field: keyof CalculatorInputs, value: number | string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // For numeric slider inputs only
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
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Testing Automation ROI Calculator</h2>
        <p className="text-gray-600 mt-2">
          Calculate your potential savings by automating manual testing processes
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Inputs */}
        <div className="lg:col-span-1 space-y-8">
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

          {/* Industry Selection */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Industry Settings</h3>
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
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2 space-y-8">
          {/* Performance Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{results.reductionManualEffort}%</div>
              <div className="text-sm text-gray-600 mt-1">Reduction in Manual Effort</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${results.reductionManualEffort}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{results.efficiencyIncrease}%</div>
              <div className="text-sm text-gray-600 mt-1">Testing Efficiency Increase</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${results.efficiencyIncrease}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{results.releaseCycleImprovement}%</div>
              <div className="text-sm text-gray-600 mt-1">Faster Release Cycles</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${results.releaseCycleImprovement}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{results.testingCoverageImprovement}%</div>
              <div className="text-sm text-gray-600 mt-1">Testing Coverage Improvement</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${results.testingCoverageImprovement}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Total Impact */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-lg text-white text-center">
            <div className="text-sm uppercase tracking-wider opacity-90">Total Annual Impact</div>
            <div className="text-4xl font-bold mt-2">${results.totalAnnualSavings.toLocaleString()}</div>
            <div className="text-lg opacity-90 mt-1">Potential Annual Savings</div>
            <div className="text-sm opacity-80 mt-2">
              Equivalent to {Math.round((results.totalAnnualSavings / (inputs.testerSalary * inputs.manualTesters)) * 100)}% of current testing costs
            </div>
          </div>

          {/* Savings Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Savings Breakdown</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Salary Savings</span>
                  <span className="text-sm font-semibold text-green-600">
                    ${results.annualSalarySavings.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(results.annualSalarySavings / results.totalAnnualSavings) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Device Cost Savings</span>
                  <span className="text-sm font-semibold text-blue-600">
                    ${results.deviceCostSavings.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(results.deviceCostSavings / results.totalAnnualSavings) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Achievements */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${Math.round(results.annualSalarySavings / 1000000)}M+
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
  );
};

export default ROICalculator;
