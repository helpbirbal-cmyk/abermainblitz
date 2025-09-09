// components/calculators/PaymentCalculator.tsx
'use client';

import { useState, useMemo } from 'react';
import InputField from './InputField';
import CtaSection from './CTASection';

interface PaymentCalculatorProps {
  onRequestDemo: () => void;
}

export default function PaymentCalculator({ onRequestDemo }: PaymentCalculatorProps) {
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
    customerLifetimeValue: 450
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
    // Core latency calculations - more realistic formula
    const abandonmentRate = (latency: number): number => {
      // More realistic: 0.5% base + 0.25% per 100ms over 50ms
      return 0.005 + (0.0025 * Math.max(0, (latency - 50) / 100));
    };

    const currentAbandonment = abandonmentRate(inputs.currentLatency);
    const mozarkAbandonment = abandonmentRate(inputs.mozarkLatency);

    const currentLostTransactions = inputs.transactions * currentAbandonment;
    const mozarkLostTransactions = inputs.transactions * mozarkAbandonment;
    const savedTransactions = currentLostTransactions - mozarkLostTransactions;

    const dailySavings = savedTransactions * inputs.avgValue;

    // Fraud and decline improvements
    const currentDeclines = inputs.transactions * inputs.declineRate;
    const improvedDeclines = currentDeclines * 0.85; // 15% improvement
    const declineSavings = (currentDeclines - improvedDeclines) * inputs.avgValue;

    // Fraud prevention
    const currentFraudLoss = inputs.transactions * inputs.fraudRate * inputs.avgValue;
    const fraudReduction = 0.25; // 25% improvement
    const fraudSavings = currentFraudLoss * fraudReduction;

    // Chargeback savings
    const currentChargebacks = inputs.transactions * inputs.chargebackRate * inputs.avgValue;
    const chargebackReduction = 0.3; // 30% improvement
    const chargebackSavings = currentChargebacks * chargebackReduction;

    // Processing fee optimization
    const currentProcessingFees = inputs.transactions * (inputs.avgValue * inputs.processingFee + inputs.fixedFee);
    const feeOptimization = 0.05; // 5% improvement
    const feeSavings = currentProcessingFees * feeOptimization;

    // Operational efficiency
    const currentSupportCost = inputs.supportTickets * inputs.costPerTicket;
    const supportReduction = 0.2; // 20% improvement
    const supportSavings = currentSupportCost * supportReduction;

    // Customer retention
    const savedCustomers = (savedTransactions * 0.1); // 10% of saved transactions become loyal customers
    const clvSavings = savedCustomers * inputs.customerLifetimeValue / 365; // Daily portion of CLV

    // Comprehensive totals - more realistic numbers
    const totalDailySavings = dailySavings + declineSavings + fraudSavings +
                             chargebackSavings + feeSavings + supportSavings + clvSavings;
    const totalMonthlySavings = totalDailySavings * 22; // Business days
    const totalAnnualSavings = totalDailySavings * 252; // Trading days

    // REALISTIC COSTS - Implementation + Annual Service Fees
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

  // Organized input fields into logical groups
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
    }
  ];

  const impactMetrics = [
    {
      label: "Daily Latency Savings",
      value: formatCurrency(results.dailySavings),
      change: 40,
      isPositive: true,
      description: "From reduced transaction failures"
    },
    {
      label: "Decline Reduction Savings",
      value: formatCurrency(results.declineSavings),
      change: 15,
      isPositive: true,
      description: "Fewer declined transactions"
    },
    {
      label: "Fraud Prevention Savings",
      value: formatCurrency(results.fraudSavings),
      change: 25,
      isPositive: true,
      description: "Reduced fraudulent transactions"
    },
    {
      label: "Operational Savings",
      value: formatCurrency(results.supportSavings),
      change: 20,
      isPositive: true,
      description: "Reduced support costs"
    },
    {
      label: "Total Daily Savings",
      value: formatCurrency(results.totalDailySavings),
      change: 30,
      isPositive: true,
      description: "Combined impact"
    },
    {
      label: "Payback Period",
      value: `${results.paybackPeriod.toFixed(1)} months`,
      change: -65,
      isPositive: true,
      description: "ROI timeline"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Input Form with Clean Layout */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Financial ROI Analyzer
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
              `${(results.roiPercentage/1000).toFixed(0)}x` :
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
