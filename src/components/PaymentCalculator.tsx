'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import InputField from './InputField';
import CtaSection from './CTASection';
import DetailedAnalysisModal from './Calculators/DetailedAnalysisModal';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

interface PaymentCalculatorProps {
  onRequestDemo: () => void;
}

interface UserInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

// Utility functions moved to the top
const formatNumber = (value: number | undefined | null) => {
  // Comprehensive validation
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }

  // Ensure value is a number
  const numValue = Number(value);
  if (isNaN(numValue)) return '0';

  if (numValue >= 1000000) return `${(numValue / 1000000).toFixed(1)}M`;
  if (numValue >= 1000) return `${(numValue / 1000).toFixed(1)}K`;
  return numValue.toString();
};

const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 1000000000) + 'B';
  }
  if (value >= 1000000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 1000000) + 'M';
  }
  if (value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 1,
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
  // Handle extremely small floating point errors
  const percentage = value * 100;

  // Check if it's a very small floating point error near a round number
  const rounded = Math.round(percentage * 100) / 100; // Round to 2 decimal places

  // If the difference is negligible (floating point error), use the rounded value
  if (Math.abs(percentage - rounded) < 0.0000000001) {
    return `${rounded.toFixed(2)}%`;
  }

  // Otherwise, clean up and format normally
  return `${parseFloat(percentage.toFixed(10)).toFixed(2)}%`;
};

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
          {value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}{unit}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

// Revenue Impact KPI Component
const RevenueImpactKPI = ({ savings, tpv, percentage }: {
  savings: number;
  tpv: number;
  percentage: number;
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md">
      <h3 className="font-bold text-blue-800 mb-4 text-center">Revenue Impact</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(savings)}
          </p>
          <p className="text-sm text-gray-600">Annual Savings</p>
        </div>

        <div className="bg-white p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-700">
            {percentage.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-600">of Payment Volume</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg text-center">
        <p className="text-sm text-gray-600 mb-2">
          Based on {formatCurrency(tpv)} annual payment volume
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Equivalent to capturing an additional </span>
          <span className="font-bold text-green-600">{percentage.toFixed(2)}%</span>
          <span className="font-semibold"> of payment volume</span>
        </p>
      </div>
    </div>
  );
};

export default function PaymentCalculator({ onRequestDemo }: PaymentCalculatorProps) {
  // State declarations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    company: '',
    phone: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [animatedValue, setAnimatedValue] = useState(0);
  const isInitialMount = useRef(true);

  const [inputs, setInputs] = useState({
    transactions: 1000000,
    avgValue: 100,
    currentLatency: 200,
    mozarkLatency: 50,
    declineRate: 0.08,
    fraudRate: 0.015,
    chargebackRate: 0.006,
    processingFee: 0.029,
    fixedFee: 0.30,
    supportTickets: 500,
    costPerTicket: 15,
    customerLifetimeValue: 450,
    // User-configurable reduction rates
    declineReduction: 15, // 15% reduction
    fraudReduction: 25, // 25% reduction
    chargebackReduction: 30, // 30% reduction
    supportReduction: 20, // 20% reduction
    feeOptimization: 5, // 5% reduction
  });

  // Animation effect for values
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setAnimatedValue(results.totalDailySavings);
    } else {
      const timer = setTimeout(() => {
        setAnimatedValue(results.totalDailySavings);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inputs]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: number;

    // Handle empty or invalid values
    if (value === '' || isNaN(parseFloat(value))) {
      // Set to 0 or appropriate default for the field
      newValue = 0;
    } else {
      // Handle percentage inputs correctly
      if (name === 'declineRate' || name === 'fraudRate' || name === 'chargebackRate' || name === 'processingFee' ||
        name === 'declineReduction' || name === 'fraudReduction' || name === 'chargebackReduction' || name === 'supportReduction' || name === 'feeOptimization') {
        newValue = parseFloat(value);
      } else {
        newValue = parseFloat(value) || 0;
      }
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
            annualSavings: formatCurrency(results.totalAnnualSavings),
            roiPercentage: `${results.roiPercentage > 1000 ?
              `${(results.roiPercentage / 1000).toFixed(0)}x` :
              `${results.roiPercentage.toFixed(0)}%`}`,
            paybackPeriod: results.paybackPeriod.toFixed(1),
            dailySavings: formatCurrency(results.totalDailySavings),
            currentAbandonment: formatPercent(results.currentAbandonment),
            improvedAbandonment: formatPercent(results.mozarkAbandonment)
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

  const handleModalSubmit = async (modalUserInfo: UserInfo) => {
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
      closeModal();
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
    const abandonmentRate = (latency: number): number => {
    const part1 = (latency - 50) / 100;

    const part2 = 0.0025 * Math.max(0, part1);

    const result = 0.005 + part2;

    return result;
  };

    const currentAbandonment = abandonmentRate(inputs.currentLatency);
    const mozarkAbandonment = abandonmentRate(inputs.mozarkLatency);

    const currentLostTransactions = inputs.transactions * currentAbandonment;
    const mozarkLostTransactions = inputs.transactions * mozarkAbandonment;
    const savedTransactions = currentLostTransactions - mozarkLostTransactions;

    const dailySavings = savedTransactions * inputs.avgValue;

    const currentDeclines = inputs.transactions * inputs.declineRate;
    const improvedDeclines = currentDeclines * (1 - inputs.declineReduction / 100);
    const declineSavings = (currentDeclines - improvedDeclines) * inputs.avgValue * 0.3;

    const currentFraudLoss = inputs.transactions * inputs.fraudRate * inputs.avgValue;
    const fraudSavings = currentFraudLoss * (inputs.fraudReduction / 100) *.5;

    const currentChargebacks = inputs.transactions * inputs.chargebackRate * inputs.avgValue;
    const chargebackSavings = currentChargebacks * (inputs.chargebackReduction / 100)*.5;

    const currentProcessingFees = inputs.transactions * (inputs.avgValue * inputs.processingFee + inputs.fixedFee);
    const feeSavings = currentProcessingFees * (inputs.feeOptimization / 100);

    const currentSupportCost = inputs.supportTickets * inputs.costPerTicket;
    const supportSavings = currentSupportCost * (inputs.supportReduction / 100);

    const savedCustomers = (savedTransactions * 0.1);
    const clvSavings = savedCustomers * inputs.customerLifetimeValue / 365;

    const totalDailySavings = dailySavings + declineSavings + fraudSavings +
      chargebackSavings + feeSavings + supportSavings + clvSavings;

    const totalMonthlySavings = totalDailySavings * 30;
    // For annual revenue/savings, use 365 days
    const totalAnnualSavings = totalDailySavings * 365;
    // Only use 252 for stock market/trading scenarios

    // Calculate Total Payment Volume (TPV)
    const dailyTPV = inputs.transactions * inputs.avgValue;
    const annualTPV = dailyTPV * 365;

    const savingsAsPercentageOfRevenue = (totalAnnualSavings / annualTPV) * 100;
    const revenueIncreasePercentage = savingsAsPercentageOfRevenue;

    const implementationCost = 125000;
    const annualServiceCost = 60000;
    const totalCost = implementationCost + annualServiceCost;

    const paybackPeriod = implementationCost / totalMonthlySavings;
    const roiPercentage = ((totalAnnualSavings - totalCost) / totalCost) * 100;

    return {
      currentAbandonment,
      mozarkAbandonment,
      currentLostTransactions,
      mozarkLostTransactions,
      savedTransactions,
      dailySavings,
      declineSavings,
      fraudSavings,
      chargebackSavings,
      feeSavings,
      supportSavings,
      clvSavings,
      totalDailySavings,
      totalMonthlySavings,
      totalAnnualSavings,
      implementationCost,
      annualServiceCost,
      totalCost,
      paybackPeriod,
      roiPercentage,
      dailyTPV,
      annualTPV,
      savingsAsPercentageOfRevenue,
      revenueIncreasePercentage,
      currentSupportCost
    };
  }, [inputs]);

  // Data for charts
  const savingsBreakdownData = [
    { name: 'Latency Savings', value: results.dailySavings, color: '#4f46e5' },
    { name: 'Decline Reduction', value: results.declineSavings, color: '#10b981' },
    { name: 'Fraud Prevention', value: results.fraudSavings, color: '#f59e0b' },
    { name: 'Chargeback Reduction', value: results.chargebackSavings, color: '#ef4444' },
    { name: 'Fee Optimization', value: results.feeSavings, color: '#8b5cf6' },
    { name: 'Support Savings', value: results.supportSavings, color: '#06b6d4' },
  ];

  const latencyComparisonData = [
    { name: 'Current', latency: inputs.currentLatency, abandonment: results.currentAbandonment * 100 },
    { name: 'Target', latency: inputs.mozarkLatency, abandonment: results.mozarkAbandonment * 100 },
  ];


  const riskComparisonData = [
    { name: 'Current', declines: inputs.declineRate * 100, fraud: inputs.fraudRate * 100, chargebacks: inputs.chargebackRate * 100 },
    { name: 'With Optimization',
      declines: inputs.declineRate * 100 * (1 - inputs.declineReduction / 100),
      fraud: inputs.fraudRate * 100 * (1 - inputs.fraudReduction / 100),
      chargebacks: inputs.chargebackRate * 100 * (1 - inputs.chargebackReduction / 100)
    },
  ];

  const generateTrendData = () => {
  const baseValue = inputs.transactions;
  const months = 6;
  const data = [];

  // Calculate significant improvement factors
  const abandonmentImprovement = results.currentAbandonment - results.mozarkAbandonment;
  const totalImprovement = abandonmentImprovement * 2; // Make impact more visible

  for (let i = 0; i < months; i++) {
    const month = `M${i + 1}`;
    const progress = (i + 1) / months;

    // Current scenario - declining due to problems
    const currentDecline = 1 - (progress * 0.15); // 15% decline over 6 months
    const currentValue = baseValue * currentDecline;

    // Optimized scenario - improving due to solutions
    const optimizedGrowth = 1 + (progress * 0.25); // 25% growth over 6 months
    const optimizedValue = baseValue * optimizedGrowth;

    data.push({
      month,
      current: currentValue,
      optimized: optimizedValue
    });
  }

  return data;
};

const monthlyTrendData = useMemo(() => generateTrendData(), [inputs, results]);

  const transactionFields = [
    {
      label: "Daily Transactions",
      name: "transactions",
      value: inputs.transactions,
      min: 1000,
      max: 10000000,
      step: 1000,
      formatValue: formatNumber
    },
    {
      label: "Average Transaction Value ($)",
      name: "avgValue",
      value: inputs.avgValue,
      min: 1,
      max: 100,
      step: 1,
      formatValue: (v: number) => `$ ${v}` // ← Add this
    }
  ];

  const latencyFields = [
    {
      label: "Current Latency (ms)",
      name: "currentLatency",
      value: inputs.currentLatency,
      min: 50,
      max: 1000,
      step: 10,
      formatValue: (v: number) => `${v}ms` // ← Add this
    },
    {
      label: "Target Latency (ms)",
      name: "mozarkLatency",
      value: inputs.mozarkLatency,
      min: 10,
      max: 200,
      step: 5,
      formatValue: (v: number) => `${v}ms` // ← Add this
    }
  ];

  const riskFields = [
    {
      label: "Decline Rate (%)",
      name: "declineRate",
      value: inputs.declineRate,
      min: 1,
      max: 20,
      step: 0.5,
      formatValue: (v: number) => `${v.toFixed(1)}%`
    },
    {
      label: "Fraud Rate (%)",
      name: "fraudRate",
      value: inputs.fraudRate,
      min: 0.1,
      max: 5,
      step: 0.1,
      formatValue: (v: number) => `${v.toFixed(1)}%`
    },
    {
      label: "Chargeback Rate (%)",
      name: "chargebackRate",
      value: inputs.chargebackRate,
      min: 0.1,
      max: 5,
      step: 0.1,
      formatValue: (v: number) => `${v.toFixed(1)}%`
    },
  ];

  const optimizationFields = [
    {
      label: "Decline Reduction (%)",
      name: "declineReduction",
      value: inputs.declineReduction,
      min: 1,
      max: 50,
      step: 1,
      formatValue: (v: number) => `${v.toFixed(1)}%`
    },
    {
      label: "Fraud Reduction (%)",
      name: "fraudReduction",
      value: inputs.fraudReduction,
      min: 5,
      max: 50,
      step: 1,
      formatValue: (v: number) => `${v.toFixed(1)}%`
    },
    {
      label: "Chargeback Reduction (%)",
      name: "chargebackReduction",
      value: inputs.chargebackReduction,
      min: 5,
      max: 50,
      step: 1,
      formatValue: (v: number) => `${v.toFixed(1)}%`
    },
    {
      label: "Support Cost Reduction (%)",
      name: "supportReduction",
      value: inputs.supportReduction,
      min: 5,
      max: 50,
      step: 1,
      formatValue: (v: number) => `${v.toFixed(1)}%`
    },
    {
      label: "Fee Optimization (%)",
      name: "feeOptimization",
      value: inputs.feeOptimization,
      min: 1,
      max: 10,
      step: 1,
      formatValue: (v: number) => `${v.toFixed(1)}%`
    }
  ];

  // For latency savings - calculate actual improvement percentage
  const latencyImprovement = ((results.currentAbandonment - results.mozarkAbandonment) / results.currentAbandonment) * 100;

  // For fraud/decline reductions - use the configured percentages but adjust for realism
  const effectiveFraudReduction = inputs.fraudReduction * 0.8; // 80% of configured value (more realistic)

  // Revised metrics for the new layout
  const summaryMetrics = [
    {
      label: "Total Annual Impact",
      value: formatCurrency(results.totalAnnualSavings),
      change: Math.round((results.totalAnnualSavings / results.annualTPV) * 100), // % of total volume
      isPositive: true,
      description: `Adds ${Math.round((results.totalAnnualSavings / results.annualTPV) * 100)}% to your bottom line`,
      icon: "🚀"
    }
  ];
  const keyAchievements = [
  // Decline Reduction - shows actual impact
  {
    label: "Decline Prevention",
    value: formatCurrency(results.declineSavings * 365),
    change: Math.round(inputs.declineReduction * 0.85), // 85% of target (realistic)
    isPositive: true,
    description: `Prevents ${Math.round(inputs.declineReduction * 0.85)} declined transactions daily`,
    icon: "📉"
  },

  // Operational Savings - shows cost efficiency
  {
    label: "Operational Efficiency",
    value: formatCurrency(results.supportSavings * 365),
    change: Math.round((results.supportSavings / results.currentSupportCost) * 100),
    isPositive: true,
    description: `Reduces support costs by ${Math.round(results.supportSavings / results.currentSupportCost * 100)}%`,
    icon: "⚙️"
  },

  // Fraud Prevention - shows risk reduction
  {
    label: "Fraud Prevention",
    value: formatCurrency(results.fraudSavings * 365),
    change: Math.round(inputs.fraudReduction * 0.9), // 90% of target
    isPositive: true,
    description: `Reduces fraud losses by ${Math.round(inputs.fraudReduction)}%`,
    icon: "🛡️"
  }
];
  return (
    <div className="space-y-8">
      {/* Input Form with Clean Layout */}
      <div className="bg-white dark:bg-gray-800  rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-black dark:text-white mb-6">
          Financial Modelling
        </h2>

        <div className=" grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-1 space-y-8">
            {/* Transaction Volume Section */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-4 text-center">Transaction Volume</h3>
              <div className="space-y-4">
                {transactionFields.map((field) => (
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
              {/* Display calculated TPV */}
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  <strong>Calculated Annual Payment Volume:</strong> {formatCurrency(results.annualTPV)}
                  <br />
                  <span className="text-xs">(Daily: {formatCurrency(results.dailyTPV)} × 365 days)</span>
                </p>
              </div>
            </div>

            {/* Latency Performance Section */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-4 text-center">Latency Performance</h3>
              < div className="space-y-4">
                {latencyFields.map((field) => (
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

            {/* Risk Metrics Section */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-4 text-center">Risk Metrics</h3>
              <div className="space-y-4">
                {riskFields.map((field) => (
                  <InputField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={field.value}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    formatValue={field.formatValue}
                    onChange={ handleInputChange}
                    compact={true}
                  />
                ))}
              </div>
            </div>

            {/* Optimization Metrics Section */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-4 text-center">Optimization Metrics</h3>
              <div className="space-y-4">
                {optimizationFields.map((field) => (
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
                  value={Math.round(inputs.currentLatency)} // Round to 0 decimals
                  min={10}
                  max={1000}
                  label="Current Latency"
                  unit="ms"
                />
                <Gauge
                  value={Math.round(inputs.mozarkLatency)} // Round to 0 decimals
                  min={10}
                  max={1000}
                  label="Target Latency"
                  unit="ms"
                />
                <Gauge
                  value={results.currentAbandonment*100 }
                  min={0}
                  max={20}
                  label="Current Abandonment"
                  unit="%"
                />
                <Gauge
                  value={results.mozarkAbandonment * 100}
                  min={0}
                  max={20}
                  label="Improved Abandonment"
                  unit="%"
                />
              </div>
            </div>

            {/* Savings Breakdown Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-gray-800 mb-4 text-center">Savings Breakdown</h3>
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

            {/* Risk Comparison Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-gray-800 mb-4 text-center">Risk Reduction</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      domain={['dataMin - dataMin * 0.05', 'dataMax + dataMax * 0.05']}
                      tickFormatter={formatNumber}
                      tick={{ fontSize: 10 }} // Reduce font size
                      width={60} // Set fixed width for Y-axis
                    />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="declines" fill="#4f46e5" name="Decline Rate (%)" />
                    <Bar dataKey="fraud" fill="#ef4444" name="Fraud Rate (%)" />
                    <Bar dataKey="chargebacks" fill="#f59e0b" name="Chargeback Rate (%)" />
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
              {/* Add the new Revenue Impact KPI */}
              <RevenueImpactKPI
                savings={results.totalAnnualSavings}
                tpv={results.annualTPV}
                percentage={results.savingsAsPercentageOfRevenue}
              />
            </div>

            {/* Key Achievements Bulleted List */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Key Achievements</h4>
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

            {/* Monthly Trend Chart
            <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Projected Transaction Trend</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis
    dataKey="month"
    interval={0}
    angle={-45}
    textAnchor="end"
    height={60}
  />
  <YAxis
    domain={['dataMin - dataMin * 0.05', 'dataMax + dataMax * 0.05']} // 5% padding
    tickFormatter={formatNumber}
  />
  <Tooltip
    formatter={(value) => [
      formatNumber(Number(value)),
      null
    ]}
    labelFormatter={(label) => label}
  />
  <Area
    type="monotone"
    dataKey="current"
    stackId="1"
    stroke="#ef4444"
    fill="#fecaca"
    name="Current"
  />
  <Area
    type="monotone"
    dataKey="optimized"
    stackId="1"
    stroke="#10b981"
    fill="#bbf7d0"
    name="With Optimization"
  />
</AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
*/}
            {/* Get Detailed Analysis Button */}
            <div className="mt-8 text-center">
              <button
                onClick={openModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md ring-2 ring-red-500"
              >
                Email Me this!
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-5 border-l-4 border-purple-500">
          <h3 className="font-bold text-purple-800 mb-3">How it works:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Latency directly impacts transaction success rates</li>
              <li>Each 100ms delay can reduce conversion by 1-2%</li>
              <li>Reduced fraud and declines significantly impact revenue</li>
            </ul>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>MozarkAI optimizes payment infrastructure for minimal latency</li>
              <li>ROI calculation includes implementation and service costs</li>
              <li>Real-time optimization improves customer experience</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Modal */}
      <DetailedAnalysisModal
        isOpen={isModalOpen}
        onClose={closeModal}
        impactMetrics={[...summaryMetrics, ...keyAchievements]}
        onFormSubmit={handleModalSubmit}
        initialUserInfo={userInfo}
      />
    </div>
  );
}
