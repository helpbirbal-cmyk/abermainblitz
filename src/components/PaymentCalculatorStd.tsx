'use client';

import { useState, useMemo } from 'react';
import InputField from './InputField';
import CtaSection from './CTASection';
import DetailedAnalysisModal from './Calculators/DetailedAnalysisModal';

interface PaymentCalculatorProps {
  onRequestDemo: () => void;
}

interface UserInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}

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
    feeOptimization: 5 // 5% reduction
  });

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
    if (name === 'declineRate' || name === 'fraudRate' || name === 'chargebackRate' || name === 'processingFee' ||
      name === 'declineReduction' || name === 'fraudReduction' || name === 'chargebackReduction' || name === 'supportReduction' || name === 'feeOptimization') {
      newValue = parseFloat(value);
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
      return 0.005 + (0.0025 * Math.max(0, (latency - 50) / 100));
    };

    const currentAbandonment = abandonmentRate(inputs.currentLatency);
    const mozarkAbandonment = abandonmentRate(inputs.mozarkLatency);

    const currentLostTransactions = inputs.transactions * currentAbandonment;
    const mozarkLostTransactions = inputs.transactions * mozarkAbandonment;
    const savedTransactions = currentLostTransactions - mozarkLostTransactions;

    const dailySavings = savedTransactions * inputs.avgValue;

    const currentDeclines = inputs.transactions * inputs.declineRate;
    const improvedDeclines = currentDeclines * (1 - inputs.declineReduction);
    const declineSavings = (currentDeclines - improvedDeclines) * inputs.avgValue;

    const currentFraudLoss = inputs.transactions * inputs.fraudRate * inputs.avgValue;
    const fraudSavings = currentFraudLoss * inputs.fraudReduction;

    const currentChargebacks = inputs.transactions * inputs.chargebackRate * inputs.avgValue;
    const chargebackSavings = currentChargebacks * inputs.chargebackReduction;

    const currentProcessingFees = inputs.transactions * (inputs.avgValue * inputs.processingFee + inputs.fixedFee);
    const feeSavings = currentProcessingFees * inputs.feeOptimization;

    const currentSupportCost = inputs.supportTickets * inputs.costPerTicket;
    const supportSavings = currentSupportCost * inputs.supportReduction;

    const savedCustomers = (savedTransactions * 0.1);
    const clvSavings = savedCustomers * inputs.customerLifetimeValue / 365;

    const totalDailySavings = dailySavings + declineSavings + fraudSavings +
      chargebackSavings + feeSavings + supportSavings + clvSavings;
    const totalMonthlySavings = totalDailySavings * 22;
    const totalAnnualSavings = totalDailySavings * 252;

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
      roiPercentage
    };
  }, [inputs]);

  const formatNumber = (value: number) => {
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
      min: 10,
      max: 1000,
      step: 10
    }
  ];

  const latencyFields = [
    {
      label: "Current Latency (ms)",
      name: "currentLatency",
      value: inputs.currentLatency,
      min: 50,
      max: 1000,
      step: 10
    },
    {
      label: "Target Latency (ms)",
      name: "mozarkLatency",
      value: inputs.mozarkLatency,
      min: 10,
      max: 200,
      step: 5
    }
  ];

  const riskFields = [
    {
      label: "Decline Rate (%)",
      name: "declineRate",
      value: inputs.declineRate * 100,
      min: 1,
      max: 20,
      step: 0.5,
      formatValue: (v: number) => `${v.toFixed(1)}%`
    },
    {
      label: "Fraud Rate (%)",
      name: "fraudRate",
      value: inputs.fraudRate * 100,
      min: 0.1,
      max: 5,
      step: 0.1,
      formatValue: (v: number) => `${v.toFixed(1)}%`
    },
    {
      label: "Chargeback Rate (%)",
      name: "chargebackRate",
      value: inputs.chargebackRate * 100,
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

  // Revised metrics for the new layout
  const summaryMetrics = [
    {
      label: "Total Daily Savings",
      value: formatCurrency(results.totalDailySavings),
      description: "Combined Financial Impact",
      icon: "🚀"
    },
    {
      label: "Payback Period",
      value: `${results.paybackPeriod.toFixed(1)} months`,
      description: "Faster ROI Timeline",
      icon: "⏱️"
    }
  ];

  const keyAchievements = [
    {
      label: "Latency Savings",
      value: formatCurrency(results.dailySavings),
      description: "Reduced transaction failures",
      icon: "🌟"
    },
    {
      label: "Fraud Prevention",
      value: formatCurrency(results.fraudSavings),
      description: "Fewer fraudulent transactions",
      icon: "🌟"
    },
    {
      label: "Decline Reduction",
      value: formatCurrency(results.declineSavings),
      description: "Fewer declined transactions",
      icon: "🌟"
    },
    {
      label: "Operational Savings",
      value: formatCurrency(results.supportSavings),
      description: "Lower support costs",
      icon: "🌟"
    },
    // You can add more metrics here if needed
  ];


  return (
    <div className="space-y-8">
      {/* Input Form with Clean Layout */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Financial Modelling
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-8">
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
            </div>

            {/* Latency Performance Section */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-4 text-center">Latency Performance</h3>
              <div className="space-y-4">
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
                    onChange={handleInputChange}
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

          {/* Right Column - Comprehensive Impact Analysis (New Layout) */}
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-6 border border-blue-200">
            <h3 className="font-bold text-xl text-gray-800 mb-6 text-center">Impact Estimates</h3>

            {/* Top Call-Outs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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

      {/* Summary Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl text-center shadow-md">
          <h3 className="text-sm font-semibold text-red-700 mb-2">Current Abandonment</h3>
          <p className="text-2xl font-bold text-red-800">
            {formatPercent(results.currentAbandonment)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl text-center shadow-md">
          <h3 className="text-sm font-semibold text-green-700 mb-2">With MozarkAI</h3>
          <p className="text-2xl font-bold text-green-800">
            {formatPercent(results.mozarkAbandonment)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl text-center shadow-md">
          <h3 className="text-sm font-semibold text-blue-700 mb-2">Annual Savings</h3>
          <p className="text-2xl font-bold text-blue-800">
            {formatCurrency(results.totalAnnualSavings)}
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
      </div>

      <CtaSection
        title="Optimize Your Payment Infrastructure"
        description="Reduce latency, increase conversion rates, and prevent revenue loss with MozarkAI"
        buttonText="Request Demo"
        onButtonClick={onRequestDemo}
      />
    </div>
  );
}
