// components/calculators/PaymentCalculator.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import InputField from './InputField';
import CtaSection from './CTASection';
import ResultsDashboard from './ui/ResultsDashboard';

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
    // Core latency calculations
    const lossPerTransaction = (latency: number): number => {
      return inputs.avgValue * (0.0005 + (0.000002 * latency));
    };

    const currentLossVal = inputs.transactions * lossPerTransaction(inputs.currentLatency);
    const mozarkLossVal = inputs.transactions * lossPerTransaction(inputs.mozarkLatency);
    const dailySavings = currentLossVal - mozarkLossVal;

    // Fraud and decline improvements
    const currentDeclines = inputs.transactions * inputs.declineRate;
    const improvedDeclines = currentDeclines * 0.6;
    const declineSavings = (currentDeclines - improvedDeclines) * inputs.avgValue;

    // Fraud prevention
    const currentFraudLoss = inputs.transactions * inputs.fraudRate * inputs.avgValue;
    const fraudReduction = 0.35;
    const fraudSavings = currentFraudLoss * fraudReduction;

    // Chargeback savings
    const currentChargebacks = inputs.transactions * inputs.chargebackRate * inputs.avgValue;
    const chargebackReduction = 0.4;
    const chargebackSavings = currentChargebacks * chargebackReduction;

    // Processing fee optimization
    const currentProcessingFees = inputs.transactions * (inputs.avgValue * inputs.processingFee + inputs.fixedFee);
    const feeOptimization = 0.08;
    const feeSavings = currentProcessingFees * feeOptimization;

    // Operational efficiency
    const currentSupportCost = inputs.supportTickets * inputs.costPerTicket;
    const supportReduction = 0.25;
    const supportSavings = currentSupportCost * supportReduction;

    // Customer retention
    const savedCustomers = (inputs.transactions * 0.0001) * 2.5;
    const clvSavings = savedCustomers * inputs.customerLifetimeValue;

    // Comprehensive totals
    const totalDailySavings = dailySavings + declineSavings + fraudSavings + chargebackSavings +
                             feeSavings + supportSavings + (clvSavings / 365);
    const totalMonthlySavings = totalDailySavings * 30;
    const totalAnnualSavings = totalDailySavings * 365;

    const implementationCost = 35000;
    const paybackPeriod = implementationCost / totalMonthlySavings;
    const roiPercentage = ((totalAnnualSavings - implementationCost) / implementationCost) * 100;

    return {
      currentLossVal,
      mozarkLossVal,
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

  const inputFields = [
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
    },
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
    },
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
  ];

  const dashboardMetrics = [
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
      change: 40,
      isPositive: true,
      description: "Fewer declined transactions"
    },
    {
      label: "Fraud Prevention Savings",
      value: formatCurrency(results.fraudSavings),
      change: 35,
      isPositive: true,
      description: "Reduced fraudulent transactions"
    },
    {
      label: "Operational Savings",
      value: formatCurrency(results.supportSavings),
      change: 25,
      isPositive: true,
      description: "Reduced support costs"
    },
    {
      label: "Total Daily Savings",
      value: formatCurrency(results.totalDailySavings),
      change: 45,
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
      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Financial RP Analyzer
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {inputFields.slice(0, 3).map((field) => (
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
              />
            ))}
          </div>
          <div className="space-y-6">
            {inputFields.slice(3).map((field) => (
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
              />
            ))}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2 text-gray-900">How it works:</h3>
          <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700">
            <li>Latency directly impacts transaction success rates</li>
            <li>Each 100ms delay can reduce conversion by 1-2%</li>
            <li>Reduced fraud and declines significantly impact revenue</li>
            <li>MozarkAI optimizes payment infrastructure for minimal latency</li>
          </ul>
        </div>
      </div>

      {/* Results Dashboard */}
      <ResultsDashboard
        title="Comprehensive Impact Analysis"
        metrics={dashboardMetrics}
      />

      {/* Detailed Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-xs font-medium text-red-800 mb-1">Current Daily Loss</h3>
          <p className="text-lg font-bold text-red-900">
            {formatCurrency(results.currentLossVal)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-xs font-medium text-green-800 mb-1">With MozarkAI</h3>
          <p className="text-lg font-bold text-green-900">
            {formatCurrency(results.mozarkLossVal)}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-xs font-medium text-blue-800 mb-1">Annual Savings</h3>
          <p className="text-lg font-bold text-blue-900">
            {formatCurrency(results.totalAnnualSavings)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-xs font-medium text-purple-800 mb-1">ROI</h3>
          <p className="text-lg font-bold text-purple-900">
            {results.roiPercentage.toFixed(0)}%
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
