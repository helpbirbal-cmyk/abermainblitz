// components/calculators/OTTCalculator.tsx
import { useState } from 'react';
import InputField from './InputField';
import ResultsSection from './ResultsSection';
import CTASection from './CTASection';

interface OTTCalculatorProps {
  onRequestDemo: () => void;
}

export default function OTTCalculator({ onRequestDemo }: OTTCalculatorProps) {
  const [inputs, setInputs] = useState({
    monthlyViewers: 1000000,
    avgViewTime: 45,
    avgCpm: 15,
    currentLatency: 4.5,
    targetLatency: 2.0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Calculate results
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

  const revenueLoss = (lostViewTime / 1000) * (inputs.avgCpm / 60);
  const potentialSavings = (savedViewTime / 1000) * (inputs.avgCpm / 60);

  const formatViewers = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const inputFields = [
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
      label: "Average View Time (minutes)",
      name: "avgViewTime",
      value: inputs.avgViewTime,
      min: 1,
      max: 120,
      step: 1
    },
    {
      label: "Average CPM Rate ($)",
      name: "avgCpm",
      value: inputs.avgCpm,
      min: 1,
      max: 50,
      step: 0.5
    },
    {
      label: "Current Latency (seconds)",
      name: "currentLatency",
      value: inputs.currentLatency,
      min: 1.0,
      max: 10.0,
      step: 0.1
    },
    {
      label: "Target Latency (seconds)",
      name: "targetLatency",
      value: inputs.targetLatency,
      min: 0.5,
      max: 5.0,
      step: 0.1
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          OTT Streaming Latency
        </h2>

        <div className="space-y-6">
          {inputFields.map((field) => (
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

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-bold text-sm mb-2 text-gray-900">How it works:</h3>
          <ul className="list-disc pl-4 space-y-1 text-xs text-gray-700">
            <li>Latency affects viewer retention and ad revenue</li>
            <li>Each second of latency can increase buffering by 3%</li>
            <li>MozarkAI optimizes video delivery for minimal latency</li>
          </ul>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Impact Analysis
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ResultsSection
              title="Current Buffering Rate"
              value={`${(currentBufferRate * 100).toFixed(1)}%`}
              bgColor="bg-red-50"
              borderColor="border-red-200"
              textColor="text-red-900"
              titleColor="text-red-800"
            />
            <ResultsSection
              title="Improved Buffering Rate"
              value={`${(improvedBufferRate * 100).toFixed(1)}%`}
              bgColor="bg-green-50"
              borderColor="border-green-200"
              textColor="text-green-900"
              titleColor="text-green-800"
            />
          </div>

          <ResultsSection
            title="Monthly Lost View Time"
            value={`${Math.round(lostViewTime / 60).toLocaleString()} hours`}
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
            textColor="text-blue-900"
            titleColor="text-blue-800"
          />

          <ResultsSection
            title="Monthly Revenue Loss"
            value={`$${revenueLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            bgColor="bg-purple-50"
            borderColor="border-purple-200"
            textColor="text-purple-900"
            titleColor="text-purple-800"
          />

          <ResultsSection
            title="Potential Monthly Savings"
            value={`$${potentialSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            bgColor="bg-teal-50"
            borderColor="border-teal-200"
            textColor="text-teal-900"
            titleColor="text-teal-800"
          />
        </div>

        <CTASection
          title="Optimize Your Streaming Infrastructure"
          description="Reduce latency and increase revenue with MozarkAI"
          buttonText="Request Demo"
          onButtonClick={onRequestDemo}
        />
      </div>
    </div>
  );
}
