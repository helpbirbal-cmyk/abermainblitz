// components/calculators/OTTCalculator.tsx
'use client';

import { useState, useMemo } from 'react';
import InputField from './InputField';
import CtaSection from './CTASection';

interface OTTCalculatorProps {
  onRequestDemo: () => void;
}

interface UserInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
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

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
            roiPercentage: `${results.roiPercentage > 1000 ?
              `${(results.roiPercentage/1000).toFixed(0)}x` :
              `${results.roiPercentage.toFixed(0)}%`}`,
            paybackPeriod: results.paybackPeriod.toFixed(1),
            monthlySavings: formatCurrency(results.totalMonthlySavings),
            currentBufferRate: formatPercent(results.currentBufferRate),
            improvedBufferRate: formatPercent(results.improvedBufferRate)
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!userInfo.name || !userInfo.email || !userInfo.company) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    if (!isValidEmail(userInfo.email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    try {
      await sendEmails(userInfo);
      setFormSubmitted(true);
      setShowDetailedAnalysis(true);
    } catch (error) {
      // Error is already handled in sendEmails
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    const revenueLoss = (lostViewTime / 60) * (inputs.avgCpm / 1000);
    const potentialSavings = (savedViewTime / 60) * (inputs.avgCpm / 1000);

    // Additional revenue calculations - more conservative
    const subscriptionRevenue = inputs.subscriberCount * inputs.subscriptionPrice;
    const potentialChurnReduction = inputs.churnRate * 0.12;
    const savedSubscribers = inputs.subscriberCount * potentialChurnReduction;
    const churnSavings = savedSubscribers * inputs.subscriptionPrice * 12;

    // Cost calculations
    const bandwidthCosts = inputs.monthlyBandwidth * inputs.cdnCostPerGb;
    const totalMonthlyCosts = bandwidthCosts + inputs.supportCosts + inputs.licensingFees;
    const operationalSavings = bandwidthCosts * 0.10;

    // Comprehensive totals
    const totalMonthlySavings = potentialSavings + (churnSavings / 12) + operationalSavings;

    // REALISTIC COSTS - Implementation + Annual Service Fees
    const implementationCost = 75000;
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
      value: inputs.churnRate * 100,
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

          {/* Right Column - Basic Impact Analysis */}
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-6 border border-blue-200">
            <h3 className="font-bold text-xl text-gray-800 mb-6 text-center">Impact Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {impactMetrics.slice(0, 4).map((metric, index) => (
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

            {/* Gated Access Form */}
            {!showDetailedAnalysis && (
              <div className="mt-6 bg-white p-4 rounded-lg border border-blue-300">
                <h3 className="font-bold text-blue-800 mb-3 text-center">Get Detailed Analysis</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Provide your details to unlock the complete ROI breakdown and personalized recommendations
                </p>
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userInfo.name}
                      onChange={handleUserInfoChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userInfo.email}
                      onChange={handleUserInfoChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={userInfo.company}
                      onChange={handleUserInfoChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleUserInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number (optional)"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition duration-200"
                  >
                    {isSubmitting ? 'Processing...' : 'Unlock Detailed Analysis'}
                  </button>
                  {submitError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-700 text-sm">{submitError}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our Privacy Policy and consent to contact from our sales team.
                  </p>
                </form>
              </div>
            )}

            {/* Detailed Analysis (shown after form submission) */}
            {showDetailedAnalysis && (
              <div className="mt-6">
                <h3 className="font-bold text-xl text-gray-800 mb-4 text-center">Detailed Analysis</h3>
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
                {formSubmitted && (
                  <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-700 text-sm text-center">
                      Thank you! Your detailed analysis is ready. Our team will contact you shortly to discuss these results.
                    </p>
                  </div>
                )}
              </div>
            )}
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
        buttonText="Request Demo"
        onButtonClick={onRequestDemo}
      />
    </div>
  );
}
