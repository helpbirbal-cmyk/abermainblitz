// src/components/Calculators/ROICalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Knob } from 'primereact/knob';
import DetailedAnalysisModal from './DetailedROIAnalysisModal';
import {
  CalculatorInputs,
  UserInfo,
  ImpactMetric,
  ROICalculatorProps
} from './types/ROITypes';
import { INDUSTRY_BENCHMARKS } from './data/industryBenchmarks';
import { SavingsPieChart } from './components/SavingsPieChart';
import { Gauge } from './components/Gauge';
import { IndustryInfo } from './components/IndustryInfo';
import { useROICalculations } from './hooks/useROICalculations';
import { useFormSubmission } from './hooks/useFormSubmission';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export function ROICalculator({ onRequestDemo }: ROICalculatorProps) {
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

  // Auto-update monthlyTestCycles when relevant inputs change
  useEffect(() => {
    const newCapacity = Math.round(testCycleCapacity);
    setInputs(prev => ({
      ...prev,
      monthlyTestCycles: newCapacity
    }));
  }, [inputs.manualTesters, inputs.weeklyTestingHours, inputs.releaseFrequency, inputs.industry, testCycleCapacity]);

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

  const handleKnobChange = (field: keyof Omit<CalculatorInputs, 'industry'>, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleModalSubmit = async (modalUserInfo: UserInfo) => {
    await handleFormSubmission(modalUserInfo, results, inputs);
  };

  const formatImpactMetrics = (): ImpactMetric[] => {
    if (!results || !inputs || !currentBenchmark) {
      return [];
    }

    const formatCurrency = (amount: number) => {
      if (!amount && amount !== 0) return '$0';
      if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
      } else if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(0)}K`;
      }
      return `$${amount}`;
    };

    try {
      return [
        {
          label: "Annual Savings",
          value: formatCurrency(results.totalAnnualSavings),
          change: results.totalAnnualSavings / (inputs.testerSalary * inputs.manualTesters) * 100,
          isPositive: true,
          description: "Total estimated annual cost savings"
        },
        {
          label: "Manual Effort Reduction",
          value: `${results.reductionManualEffort}%`,
          change: results.reductionManualEffort,
          isPositive: true,
          description: "Reduction in manual testing time"
        },
        {
          label: "Testing Efficiency",
          value: `${results.efficiencyIncrease}%`,
          change: results.efficiencyIncrease,
          isPositive: true,
          description: "Increase in testing productivity"
        },
        {
          label: "Release Speed",
          value: `${results.releaseCycleImprovement}%`,
          change: results.releaseCycleImprovement,
          isPositive: true,
          description: "Faster release cycles"
        },
        {
          label: "Test Coverage",
          value: `${results.testingCoverageImprovement}%`,
          change: results.testingCoverageImprovement,
          isPositive: true,
          description: "Improved test coverage"
        },
        {
          label: "Device Cost Savings",
          value: formatCurrency(results.deviceCostSavings),
          change: results.deviceCostSavings / (inputs.devicesUsed * currentBenchmark.deviceCost) * 100,
          isPositive: true,
          description: "Savings from reduced device maintenance"
        }
      ];
    } catch (error) {
      console.error('Error formatting impact metrics:', error);
      return [];
    }
  };

  const impactMetrics = formatImpactMetrics();

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  // Format value templates as strings
  const getKnobValueTemplate = (value: number, prefix: string = '', suffix: string = '') => {
    return `${prefix}${value}${suffix}`;
  };

  const getSalaryKnobValueTemplate = (value: number) => {
    return value >= 1000 ? `$${value/1000}K` : `$${value}`;
  };

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
              <div className="grid grid-cols-2 gap-6">
                {/* Manual Testers */}
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <Knob
                      value={inputs.manualTesters}
                      onChange={(e) => handleKnobChange('manualTesters', e.value)}
                      min={currentBenchmark.typicalTesters[0]}
                      max={currentBenchmark.typicalTesters[1]}
                      size={80}
                      valueTemplate={getKnobValueTemplate(inputs.manualTesters)}
                      strokeWidth={8}
                      rangeColor="#e5e7eb"
                      valueColor="#3b82f6"
                      textColor="#1f2937"
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Capacity: {Math.round(testCycleCapacity)} cycles
                  </div>
                  <label className="text-sm font-medium text-gray-700 text-center">Manual Testers</label>
                </div>

                {/* Weekly Testing Hours */}
                <div className="flex flex-col items-center space-y-2">

                  <div className="relative">
                    <Knob
                      value={inputs.weeklyTestingHours}
                      onChange={(e) => handleKnobChange('weeklyTestingHours', e.value)}
                      min={10}
                      max={80}
                      size={80}
                      valueTemplate={getKnobValueTemplate(inputs.weeklyTestingHours, '', 'h')}
                      strokeWidth={8}
                      rangeColor="#e5e7eb"
                      valueColor="#10b981"
                      textColor="#1f2937"
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Capacity: {Math.round(testCycleCapacity)} cycles
                  </div>
                <label className="text-sm font-medium text-gray-700 text-center">Weekly Hours</label>
                </div>

                {/* Tester Salary */}
                <div className="flex flex-col items-center space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700 text-center">Tester Salary</label>
                  <div className="relative">
                    <Knob
                      value={inputs.testerSalary}
                      onChange={(e) => handleKnobChange('testerSalary', e.value)}
                      min={currentBenchmark.typicalSalary[0]}
                      max={currentBenchmark.typicalSalary[1]}
                      step={5000}
                      size={100}
                      valueTemplate={getSalaryKnobValueTemplate(inputs.testerSalary)}
                      strokeWidth={10}
                      rangeColor="#e5e7eb"
                      valueColor="#f59e0b"
                      textColor="#1f2937"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Testing Metrics */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Testing Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Monthly Test Cycles */}
                <div className="flex flex-col items-center space-y-2">
                  <label className="text-sm font-medium text-gray-700 text-center">Test Cycles</label>
                  <div className="relative">
                    <Knob
                      value={inputs.monthlyTestCycles}
                      onChange={(e) => handleKnobChange('monthlyTestCycles', e.value)}
                      min={currentBenchmark.typicalTestCycles[0]}
                      max={currentBenchmark.typicalTestCycles[1]}
                      size={80}
                      valueTemplate={getKnobValueTemplate(inputs.monthlyTestCycles)}
                      strokeWidth={8}
                      rangeColor="#e5e7eb"
                      valueColor="#8b5cf6"
                      textColor="#1f2937"
                    />
                  </div>
                </div>

                {/* Devices Used */}
                <div className="flex flex-col items-center space-y-2">
                  <label className="text-sm font-medium text-gray-700 text-center">Devices</label>
                  <div className="relative">
                    <Knob
                      value={inputs.devicesUsed}
                      onChange={(e) => handleKnobChange('devicesUsed', e.value)}
                      min={currentBenchmark.typicalDevices[0]}
                      max={currentBenchmark.typicalDevices[1]}
                      size={80}
                      valueTemplate={getKnobValueTemplate(inputs.devicesUsed)}
                      strokeWidth={8}
                      rangeColor="#e5e7eb"
                      valueColor="#ef4444"
                      textColor="#1f2937"
                    />
                  </div>
                </div>

                {/* Releases Per Month */}
                <div className="flex flex-col items-center space-y-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700 text-center">Releases/Month</label>
                  <div className="relative">
                    <Knob
                      value={inputs.releaseFrequency}
                      onChange={(e) => handleKnobChange('releaseFrequency', e.value)}
                      min={currentBenchmark.typicalReleases[0]}
                      max={currentBenchmark.typicalReleases[1]}
                      size={100}
                      valueTemplate={getKnobValueTemplate(inputs.releaseFrequency)}
                      strokeWidth={10}
                      rangeColor="#e5e7eb"
                      valueColor="#06b6d4"
                      textColor="#1f2937"
                    />
                  </div>
                </div>
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
          impactMetrics={impactMetrics}
          onFormSubmit={handleModalSubmit}
        />
      )}

      {/* Detailed Results Display (After submission) */}
      {showDetailedAnalysis && formSubmitted && (
        <div className="bg-green-50 p-6 rounded-xl text-center shadow-lg">
          <h3 className="text-xl font-semibold text-green-700">Analysis Sent!</h3>
          <p className="text-green-600 mt-1">Check your email for the detailed ROI report.</p>
        </div>
      )}
    </div>
  );
}
