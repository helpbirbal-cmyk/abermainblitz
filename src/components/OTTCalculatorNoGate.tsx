// components/calculators/OTTCalculator.tsx
'use client';

import { useState, useMemo } from 'react';
import InputField from './InputField';
import CtaSection from './CTASection';

interface OTTCalculatorProps {
  onRequestDemo: () => void;
}

export default function OTTCalculator({ onRequestDemo }: OTTCalculatorProps) {
  const [inputs, setInputs] = useState({
    monthlyViewers: 1000000,
    avgViewTime: 45,
    avgCpm: 15,
    currentLatency: 4.5,
    targetLatency: 2.0,
    subscriptionPrice: 9.99,
    subscriberCount: 50000,
    churnRate: 0.05,
    contentProductionCost: 250000,
    cdnCostPerGb: 0.02,
    monthlyBandwidth: 50000,
    supportCosts: 15000,
    licensingFees: 75000
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Calculate all results
  const results = useMemo(() => {
    // Core latency calculations
    const metrics = {
      baseBufferRate: 0.02,
      bufferIncreasePerSecond: 0.03,
    };

    const currentBufferRate = metrics.baseBufferRate +
                            (metrics.bufferIncreasePerSecond * Math.max(0, inputs.currentLatency - 2));
    const improvedBufferRate = metrics.baseBufferRate +
                             (metrics.bufferIncreasePerSecond * Math.max(0, inputs.targetLatency - 2));

    const lostViewTime = inputs.monthlyViewers * inputs.avgViewTime * currentBufferRate;
    const savedViewTime = inputs.monthlyViewers * inputs.avgViewTime * (currentBufferRate - improvedBufferRate);

    // More realistic ad revenue calculation
    const revenueLoss = (lostViewTime / 60) * (inputs.avgCpm / 1000); // CPM is cost per 1000 impressions
    const potentialSavings = (savedViewTime / 60) * (inputs.avgCpm / 1000);

    // Additional revenue calculations - more conservative
    const subscriptionRevenue = inputs.subscriberCount * inputs.subscriptionPrice;
    const potentialChurnReduction = inputs.churnRate * 0.12; // Reduced from 15% to 12%
    const savedSubscribers = inputs.subscriberCount * potentialChurnReduction;
    const churnSavings = savedSubscribers * inputs.subscriptionPrice * 12;

    // Cost calculations
    const bandwidthCosts = inputs.monthlyBandwidth * inputs.cdnCostPerGb;
    const totalMonthlyCosts = bandwidthCosts + inputs.supportCosts + inputs.licensingFees;
    const operationalSavings = bandwidthCosts * 0.10; // Reduced from 12% to 10%

    // Comprehensive totals
    const totalMonthlySavings = potentialSavings + (churnSavings / 12) + operationalSavings;

    // REALISTIC COSTS - Implementation + Annual Service Fees
    const implementationCost = 75000; // Increased from 25,000
    const annualServiceCost = 30000;
    const totalAnnualCost = implementationCost + annualServiceCost;

    const annualSavings = totalMonthlySavings * 12;
    const paybackPeriod = implementationCost / totalMonthlySavings;

    // Proper ROI calculation including service costs
    const roiPercentage = ((annualSavings - totalAnnualCost) / totalAnnualCost) * 100;

    return {
      currentBufferRate,
      improvedBufferRate,
      lostViewTime,
      savedViewTime,
      revenueLoss,
      potentialSavings,
      subscriptionRevenue,
      churnSavings,
      bandwidthCosts,
      totalMonthlyCosts,
      operationalSavings,
      totalMonthlySavings,
      implementationCost,
      annualServiceCost,
      totalAnnualCost,
      paybackPeriod,
      annualSavings,
      roiPercentage
    };
  }, [inputs]);

  const formatViewers = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      }).format(value / 1000000) + 'M';
    }
    if (value >= 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      }).format(value / 1000) + 'K';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Organized input fields into logical groups
  const audienceFields = [
    {
      label: "Monthly Viewers",
      name: "monthlyViewers",
      value: inputs.monthlyViewers,
      min: 1000,
      max: 10000000,
      step: 1000,
      formatValue: formatViewers
    },
    {
      label: "Subscriber Count",
      name: "subscriberCount",
      value: inputs.subscriberCount,
      min: 1000,
      max: 1000000,
      step: 1000,
      formatValue: formatViewers
    }
  ];

  const engagementFields = [
    {
      label: "Average View Time (minutes)",
      name: "avgViewTime",
      value: inputs.avgViewTime,
      min: 1,
      max: 120,
      step: 1
    },
    {
      label: "Monthly Churn Rate (%)",
      name: "churnRate",
      value: inputs.churnRate,
      min: 1,
      max: 100,
      step: 1,
      formatValue: (v: number) => `${v.toFixed(1)}%`
    }
  ];

  const monetizationFields = [
    {
      label: "Average CPM Rate ($)",
      name: "avgCpm",
      value: inputs.avgCpm,
      min: 1,
      max: 50,
      step: 0.5
    },
    {
      label: "Subscription Price ($)",
      name: "subscriptionPrice",
      value: inputs.subscriptionPrice,
      min: 4.99,
      max: 29.99,
      step: 0.01
    }
  ];

  const performanceFields = [
    {
      label: "Current Latency (seconds)",
      name: "currentLatency",
      value: inputs.currentLatency,
      min: 1.0,
      max: 20.0,
      step: 0.1
    },
    {
      label: "Target Latency (seconds)",
      name: "targetLatency",
      value: inputs.targetLatency,
      min: 0.5,
      max: 5.0,
      step: 0.1
    }
  ];

  const impactMetrics = [
    {
      label: "Monthly Ad Revenue Loss",
      value: formatCurrency(results.revenueLoss),
      change: -30,
      isPositive: false,
      description: "Current loss due to buffering"
    },
    {
      label: "Potential Monthly Savings",
      value: formatCurrency(results.potentialSavings),
      change: 30,
      isPositive: true,
      description: "From reduced buffering"
    },
    {
      label: "Churn Reduction Savings",
      value: formatCurrency(results.churnSavings / 12),
      change: 12,
      isPositive: true,
      description: "Monthly subscriber retention"
    },
    {
      label: "Operational Savings",
      value: formatCurrency(results.operationalSavings),
      change: 10,
      isPositive: true,
      description: "Bandwidth optimization"
    },
    {
      label: "Total Monthly Savings",
      value: formatCurrency(results.totalMonthlySavings),
      change: 35,
      isPositive: true,
      description: "Combined impact"
    },
    {
      label: "Payback Period",
      value: `${results.paybackPeriod.toFixed(1)} months`,
      change: -50,
      isPositive: true,
      description: "ROI timeline"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Input Form with Clean Layout */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          OTT Streaming ROI Analyzer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-8">
            {/* Audience Metrics Section */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-4 text-center">Audience Metrics</h3>
              <div className="space-y-4">
                {audienceFields.map((field) => (
                  <InputField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={field.value}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    formatValue={field.formatValue}
                    onChange={handleInputChange}
                    compact={true}
                  />
                ))}
              </div>
            </div>

            {/* Engagement Metrics Section */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-4 text-center">Engagement Metrics</h3>
              <div className="space-y-4">
                {engagementFields.map((field) => (
                  <InputField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={field.value}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    formatValue={field.formatValue}
                    onChange={handleInputChange}
                    compact={true}
                  />
                ))}
              </div>
            </div>

            {/* Monetization Section */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-4 text-center">Monetization</h3>
              <div className="space-y-4">
                {monetizationFields.map((field) => (
                  <InputField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={field.value}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    formatValue={field.formatValue}
                    onChange={handleInputChange}
                    compact={true}
                  />
                ))}
              </div>
            </div>

            {/* Performance Section */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-4 text-center">Performance</h3>
              <div className="space-y-4">
                {performanceFields.map((field) => (
                  <InputField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={field.value}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    formatValue={field.formatValue}
                    onChange={handleInputChange}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Comprehensive Impact Analysis */}
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-6 border border-blue-200">
            <h3 className="font-bold text-xl text-gray-800 mb-6 text-center">Comprehensive Impact Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {impactMetrics.map((metric, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-400">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">{metric.label}</h4>
                  <p className="text-xl font-bold text-gray-800">{metric.value}</p>
                  <p className={`text-xs font-medium mt-1 ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.isPositive ? '+' : ''}{metric.change}% with optimization
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-5 border-l-4 border-purple-500">
          <h3 className="font-bold text-purple-800 mb-3">How it works:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Latency affects viewer retention and ad revenue</li>
              <li>Each second of latency can increase buffering by 3%</li>
              <li>Reduced churn and better bandwidth utilization add to savings</li>
            </ul>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>MozarkAI optimizes video delivery for minimal latency</li>
              <li>ROI calculation includes implementation and service costs</li>
              <li>Real-time optimization improves viewer experience</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl text-center shadow-md">
          <h3 className="text-sm font-semibold text-red-700 mb-2">Current Buffering Rate</h3>
          <p className="text-2xl font-bold text-red-800">
            {formatPercent(results.currentBufferRate)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl text-center shadow-md">
          <h3 className="text-sm font-semibold text-green-700 mb-2">Improved Buffering Rate</h3>
          <p className="text-2xl font-bold text-green-800">
            {formatPercent(results.improvedBufferRate)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl text-center shadow-md">
          <h3 className="text-sm font-semibold text-blue-700 mb-2">Annual Savings</h3>
          <p className="text-2xl font-bold text-blue-800">
            {formatCurrency(results.annualSavings)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl text-center shadow-md">
          <h3 className="text-sm font-semibold text-purple-700 mb-2">ROI</h3>
          <p className="text-2xl font-bold text-purple-800">
            {results.roiPercentage > 1000 ?
              `${(results.roiPercentage/1000).toFixed(0)}x` :
              `${results.roiPercentage.toFixed(0)}%`}
          </p>
        </div>
      </div>

      <CtaSection
        title="Optimize Your Streaming Infrastructure"
        description="Reduce latency, increase revenue, and improve subscriber retention with MozarkAI"
        buttonText="Book Demo"
        onButtonClick={onRequestDemo}
      />
    </div>
  );
}


// Add this function to your component
const sendEmails = async (userData: UserInfo) => {
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
        calculatorResults: {
          annualSavings: formatCurrency(results.annualSavings),
          roiPercentage: `${results.roiPercentage.toFixed(0)}%`,
          paybackPeriod: results.paybackPeriod.toFixed(1),
          monthlySavings: formatCurrency(results.totalMonthlySavings)
        }
      }),
    });

    if (!response.ok) {
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

// Update the form submission handler
const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await sendEmails(userInfo);
    setFormSubmitted(true);
    setShowDetailedAnalysis(true);
  } catch (error) {
    // Error is already handled in sendEmails
  }
};
