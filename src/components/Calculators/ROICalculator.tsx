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
}

const INDUSTRY_PRESETS = {
  general: { efficiencyMultiplier: 1, deviceCost: 500 },
  banking: { efficiencyMultiplier: 1.2, deviceCost: 800 },
  fintech: { efficiencyMultiplier: 1.15, deviceCost: 700 },
  enterprise: { efficiencyMultiplier: 1.1, deviceCost: 600 },
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

    return {
      reductionManualEffort: Math.round(reductionManualEffort),
      efficiencyIncrease: Math.round(efficiencyIncrease),
      annualSalarySavings: Math.round(annualSalarySavings),
      deviceCostSavings: Math.round(deviceCostSavings),
      totalAnnualSavings: Math.round(totalAnnualSavings),
      releaseCycleImprovement: Math.round(releaseCycleImprovement),
    };
  };

  const results = calculateROI();

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value),
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">ROI & Savings Calculator</h2>
        <p className="text-gray-600 mt-2">
          See how much you can save by automating your testing process with MozarkAI
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Current Setup</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry Type
                </label>
                <select
                  value={inputs.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="banking">Banking/Finance</option>
                  <option value="fintech">FinTech</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Manual Testers
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={inputs.manualTesters}
                  onChange={(e) => handleInputChange('manualTesters', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weekly Testing Hours (per tester)
                </label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={inputs.weeklyTestingHours}
                  onChange={(e) => handleInputChange('weeklyTestingHours', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Test Cycles
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={inputs.monthlyTestCycles}
                  onChange={(e) => handleInputChange('monthlyTestCycles', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Devices Used
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={inputs.devicesUsed}
                  onChange={(e) => handleInputChange('devicesUsed', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average Tester Salary (Annual)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    min="30000"
                    max="200000"
                    step="5000"
                    value={inputs.testerSalary}
                    onChange={(e) => handleInputChange('testerSalary', e.target.value)}
                    className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Releases Per Month
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={inputs.releaseFrequency}
                  onChange={(e) => handleInputChange('releaseFrequency', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Potential Savings</h3>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Reduction in Manual Effort</span>
                  <span className="text-2xl font-bold text-green-600">
                    {results.reductionManualEffort}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${results.reductionManualEffort}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Increase in Testing Efficiency</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {results.efficiencyIncrease}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${results.efficiencyIncrease}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600">Annual Salary Savings</div>
                  <div className="text-xl font-bold text-green-600">
                    ${results.annualSalarySavings.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600">Device Cost Savings</div>
                  <div className="text-xl font-bold text-green-600">
                    ${results.deviceCostSavings.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                <div className="text-sm">Total Annual Savings</div>
                <div className="text-3xl font-bold">
                  ${results.totalAnnualSavings.toLocaleString()}
                </div>
                <div className="text-sm opacity-90 mt-1">
                  With MozarkAI Automation
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Release Cycle Improvement</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {results.releaseCycleImprovement}% Faster
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${results.releaseCycleImprovement}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Key Benefits with MozarkAI</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Reduced manual testing effort by 60-90%
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                65% boost in testing efficiency
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Significant reduction in device maintenance costs
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Faster time-to-market with automated testing
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Increased test coverage and consistency
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
