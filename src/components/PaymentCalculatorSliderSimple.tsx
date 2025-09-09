// components/calculators/PaymentCalculator.tsx
import { useState, useEffect } from 'react';
import InputField from './InputField';
import ResultsSection from './ResultsSection';
import CTASection from './CTASection';

interface PaymentCalculatorProps {
  onRequestDemo: () => void;
}

export default function PaymentCalculator({ onRequestDemo }: PaymentCalculatorProps) {
  const [transactions, setTransactions] = useState<number>(1000000);
  const [avgValue, setAvgValue] = useState<number>(100);
  const [currentLatency, setCurrentLatency] = useState<number>(200);
  const [mozarkLatency, setMozarkLatency] = useState<number>(50);

  const [currentLoss, setCurrentLoss] = useState<number>(0);
  const [mozarkLoss, setMozarkLoss] = useState<number>(0);
  const [dailySavings, setDailySavings] = useState<number>(0);
  const [annualSavings, setAnnualSavings] = useState<number>(0);

  // Calculate losses
  useEffect(() => {
    const lossPerTransaction = (latency: number): number => {
      return avgValue * (0.0005 + (0.000002 * latency));
    };

    const currentLossVal = transactions * lossPerTransaction(currentLatency);
    const mozarkLossVal = transactions * lossPerTransaction(mozarkLatency);

    setCurrentLoss(currentLossVal);
    setMozarkLoss(mozarkLossVal);
    setDailySavings(currentLossVal - mozarkLossVal);
    setAnnualSavings((currentLossVal - mozarkLossVal) * 365);
  }, [transactions, avgValue, currentLatency, mozarkLatency]);

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Payment System Latency
        </h2>

        <div className="space-y-6">
          <InputField
            label="Daily Transactions"
            name="transactions"
            value={transactions}
            min={1000}
            max={10000000}
            step={1000}
            formatValue={formatNumber}
            onChange={(e) => setTransactions(Number(e.target.value))}
          />

          <InputField
            label="Average Transaction Value ($)"
            name="avgValue"
            value={avgValue}
            min={10}
            max={1000}
            step={10}
            onChange={(e) => setAvgValue(Number(e.target.value))}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Current Latency (ms)"
              name="currentLatency"
              value={currentLatency}
              min={50}
              max={1000}
              step={10}
              onChange={(e) => setCurrentLatency(Number(e.target.value))}
            />
            <InputField
              label="Target Latency (ms)"
              name="mozarkLatency"
              value={mozarkLatency}
              min={10}
              max={200}
              step={5}
              onChange={(e) => setMozarkLatency(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2 text-gray-900">How it works:</h3>
          <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700">
            <li>Latency directly impacts transaction success rates</li>
            <li>Each 100ms delay can reduce conversion by 1-2%</li>
            <li>MozarkAI optimizes payment infrastructure for minimal latency</li>
          </ul>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Your Potential Savings
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-sm text-gray-700">Current Daily Loss</span>
            <span className="text-lg font-bold text-red-600">
              ${currentLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-sm text-gray-700">With MozarkAI</span>
            <span className="text-lg font-bold text-green-600">
              ${mozarkLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-sm text-gray-700">Daily Savings</span>
            <span className="text-lg font-bold text-blue-700">
              ${dailySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-700">Annual Savings</span>
              <p className="text-xs text-gray-500">Based on 365 days</p>
            </div>
            <span className="text-xl font-bold text-blue-800">
              ${annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        <CTASection
          title="Optimize Your Payment Infrastructure"
          description="Reduce latency and increase revenue with MozarkAI"
          buttonText="Request Demo"
          onButtonClick={onRequestDemo}
        />
      </div>
    </div>
  );
}
