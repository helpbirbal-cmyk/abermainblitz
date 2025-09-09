'use client';

import { useState, useMemo, useEffect } from 'react';
import InputField from './InputField';
import CtaSection from './CTASection';
import DetailedAnalysisModal from './Calculators/DetailedAnalysisModal';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

interface OTTCalculatorProps {
  onRequestDemo: () => void;
}

interface UserInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

// Gauge component for visualization
const Gauge = ({ value, min, max, label, unit }: { value: number, min: number, max: number, label: string, unit?: string }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-2">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          <circle
            className="text-blue-600"
            strokeWidth="10"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">
            {value}{unit}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

export default function OTTCalculator({ onRequestDemo }: OTTCalculatorProps) {
  // State declarations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

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
    licensingFees: 75000,
    churnReduction: 12
  });

  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [animatedValue, setAnimatedValue] = useState(0);

  // Animation effect for values
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(results.totalMonthlySavings);
    }, 500);
    return () => clearTimeout(timer);
}, [inputs]); // Use inputs as dependency instead of results

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: number;

    // Handle percentage inputs correctly
    if (name === 'churnRate' || name === 'churnReduction') {
      newValue = parseFloat(value) / 100;
    } else {
      newValue = parseFloat(value) || 0;
    }

    setInputs(prev => ({
      ...prev,
      [name]: newValue
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
              `${(results.roiPercentage / 1000).toFixed(0)}x` :
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

  // The function you pass to the modal must match the modal's prop type
  const handleModalSubmit = async (modalUserInfo: UserInfo) => {
    // This function receives userInfo from the modal, not an event object
    // Perform validation and submission logic here
    if (!modalUserInfo.name || !modalUserInfo.email || !modalUserInfo.company) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    if (!isValidEmail(modalUserInfo.email)) {
      setSubmitError('Please enter a valid email address');
      return;
    }

    try {
      await sendEmails(modalUserInfo);
      setFormSubmitted(true);
      setShowDetailedAnalysis(true);
      closeModal(); // Close the modal on successful submission
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
    // Use user-configurable churn reduction
    const potentialChurnReduction = inputs.churnRate * inputs.churnReduction;
    const savedSubscribers = inputs.subscriberCount * potentialChurnReduction;
    const churnSavings = savedSubscribers * inputs.subscriptionPrice * 12;

    // Cost calculations
    const bandwidthCosts = inputs.monthlyBandwidth * inputs.cdnCostPerGb;
    const totalMonthlyCosts = bandwidthCosts + inputs.supportCosts + inputs.licensingFees;
    const operationalSavings = bandwidthCosts * 0.10;

    // Comprehensive totals
    const totalMonthlySavings = (potentialSavings + (churnSavings / 12) + operationalSavings)*12;

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

  // Data for charts
  const savingsBreakdownData = [
    { name: 'Ad Revenue', value: results.potentialSavings, color: '#4f46e5' },
    { name: 'Churn Reduction', value: results.churnSavings / 12, color: '#10b981' },
    { name: 'Operational', value: results.operationalSavings, color: '#f59e0b' },
  ];

  const latencyComparisonData = [
    { name: 'Current', latency: inputs.currentLatency, buffer: results.currentBufferRate * 100 },
    { name: 'Target', latency: inputs.targetLatency, buffer: results.improvedBufferRate * 100 },
  ];

  const monthlyTrendData = [
    { month: 'Jan', current: 120000, optimized: 120000 },
    { month: 'Feb', current: 118000, optimized: 119500 },
    { month: 'Mar', current: 115000, optimized: 121000 },
    { month: 'Apr', current: 112000, optimized: 122500 },
    { month: 'May', current: 109000, optimized: 124000 },
    { month: 'Jun', current: 105000, optimized: 125500 },
  ];

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
    },
    {
      label: "Churn Reduction (%)",
      name: "churnReduction",
      value: inputs.churnReduction ,
      min: 1,
      max: 50,
      step: 1,
      formatValue: (v: number) => `${v.toFixed(1)}%`
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

  // Revised metrics for the new layout
  const summaryMetrics = [
    {
      label: "Total Annual Impact",
      value: formatCurrency(results.totalMonthlySavings),
      description: "Combined Financial Impact",
      icon: "💸"
    },
  /**  {
      label: "Payback Period",
      value: `${results.paybackPeriod.toFixed(1)} months`,
      description: "Faster ROI Timeline",
      icon: "⏱️"
    } **/
  ];

  // Modified labels and icons for key achievements
  const keyAchievements = [
    {
      label: "Ad Revenue Impact",
      value: formatCurrency(results.potentialSavings),
      description: "From reduced buffering",
      icon: "⬆️"
    },
    {
      label: "Churn Reduction Impact",
      value: formatCurrency(results.churnSavings / 12),
      description: "Monthly subscriber retention",
      icon: "⬆️"
    },
    {
      label: "Operational Impact",
      value: formatCurrency(results.operationalSavings),
      description: "Bandwidth optimization",
      icon: "⬆️"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Input Form with Clean Layout */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Financial Modelling
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-1 space-y-8">
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

          {/* Middle Column - Visualizations */}
          <div className="lg:col-span-1 space-y-8">
            {/* Performance Gauges */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-gray-800 mb-4 text-center">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <Gauge
                  value={inputs.currentLatency}
                  min={0.5}
                  max={10}
                  label="Current Latency"
                  unit="s"
                />
                <Gauge
                  value={inputs.targetLatency}
                  min={0.5}
                  max={10}
                  label="Target Latency"
                  unit="s"
                />
                <Gauge
                  value={results.currentBufferRate * 100}
                  min={0}
                  max={20}
                  label="Current Buffer Rate"
                  unit="%"
                />
                <Gauge
                  value={results.improvedBufferRate * 100}
                  min={0}
                  max={20}
                  label="Improved Buffer Rate"
                  unit="%"
                />
              </div>
            </div>

            {/* Savings Breakdown Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-gray-800 mb-4 text-center">Impact Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={savingsBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {savingsBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Latency Comparison Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-gray-800 mb-4 text-center">Latency Impact</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={latencyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="latency" fill="#8884d8" name="Latency (s)" />
                    <Bar yAxisId="right" dataKey="buffer" fill="#82ca9d" name="Buffer Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Comprehensive Impact Analysis */}
          <div className="lg:col-span-1 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-6 border border-blue-200">
            <h3 className="font-bold text-xl text-gray-800 mb-6 text-center">Impact Estimates</h3>

            {/* Top Call-Outs */}
            <div className="mb-8">
              {summaryMetrics.map((metric, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
                  <p className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
                    <span className="mr-2 text-2xl">{metric.icon}</span>{metric.value}
                  </p>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{metric.label}</h4>
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                </div>
              ))}
            </div>

            {/* Key Achievements Bulleted List */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Key Elements</h4>
              <ul className="space-y-4">
                {keyAchievements.map((metric, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3 text-lg">{metric.icon}</span>
                    <div>
                      <h5 className="font-semibold text-gray-800">{metric.value} <span className="text-sm font-normal text-gray-600 ml-1">{metric.label}</span></h5>
                      <p className="text-xs text-gray-500">{metric.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Monthly Trend Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Projected Subscriber Trend</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatViewers(Number(value))} />
                    <Area type="monotone" dataKey="current" stackId="1" stroke="#ef4444" fill="#fecaca" name="Current" />
                    <Area type="monotone" dataKey="optimized" stackId="1" stroke="#10b981" fill="#bbf7d0" name="With Optimization" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Get Detailed Analysis Button */}
            <div className="mt-8 text-center">
              <button
                onClick={openModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md w-full"
              >
                Get Detailed Analysis
              </button>
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

      {/* Detailed Analysis Modal */}
      <DetailedAnalysisModal
        isOpen={isModalOpen}
        onClose={closeModal}
        // Correctly pass the combined metrics to the modal
        impactMetrics={[...summaryMetrics, ...keyAchievements]}
        onFormSubmit={handleModalSubmit}
        initialUserInfo={userInfo}
      />

      {/* Summary Results */}
  {/* (    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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
              `${(results.roiPercentage / 1000).toFixed(0)}x` :
              `${results.roiPercentage.toFixed(0)}%`}
          </p>
        </div>
      </div>  **/}

    </div>
  );
}
