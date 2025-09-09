// components/CostCalculators.tsx
"use client"

import { useState, useEffect } from 'react'

interface CostCalculatorsProps {
  openModal: (type?: 'general' | 'bfsi' | 'ott' | 'payment') => void
}

function OTTCalculator({ onRequestDemo }: { onRequestDemo: () => void }) {
  const [inputs, setInputs] = useState({
    monthlyViewers: 1000000,
    avgViewTime: 45,
    avgCpm: 15,
    currentLatency: 4.5,
    targetLatency: 2.0
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  // Calculate results
  const metrics = {
    baseBufferRate: 0.02,
    bufferIncreasePerSecond: 0.03,
  }

  const currentBufferRate = metrics.baseBufferRate +
                          (metrics.bufferIncreasePerSecond * Math.max(0, inputs.currentLatency - 2))
  const improvedBufferRate = metrics.baseBufferRate +
                           (metrics.bufferIncreasePerSecond * Math.max(0, inputs.targetLatency - 2))

  const lostViewTime = inputs.monthlyViewers * inputs.avgViewTime * currentBufferRate
  const savedViewTime = inputs.monthlyViewers * inputs.avgViewTime * (currentBufferRate - improvedBufferRate)

  const revenueLoss = (lostViewTime / 1000) * (inputs.avgCpm / 60)
  const potentialSavings = (savedViewTime / 1000) * (inputs.avgCpm / 60)

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          OTT Streaming Latency
        </h2>

        <div className="space-y-4">
          {[
            { label: "Monthly Viewers", name: "monthlyViewers", value: inputs.monthlyViewers },
            { label: "Average View Time (minutes)", name: "avgViewTime", value: inputs.avgViewTime },
            { label: "Average CPM Rate ($)", name: "avgCpm", value: inputs.avgCpm },
            { label: "Current Latency (seconds)", name: "currentLatency", value: inputs.currentLatency, step: "0.1" },
            { label: "Target Latency (seconds)", name: "targetLatency", value: inputs.targetLatency, step: "0.1" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="number"
                name={field.name}
                value={field.value}
                step={field.step || "1"}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <h3 className="text-xs font-medium text-red-800 mb-1">Current Buffering Rate</h3>
              <p className="text-lg font-bold text-red-900">{(currentBufferRate * 100).toFixed(1)}%</p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h3 className="text-xs font-medium text-green-800 mb-1">Improved Buffering Rate</h3>
              <p className="text-lg font-bold text-green-900">{(improvedBufferRate * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h3 className="text-xs font-medium text-blue-800 mb-1">Monthly Lost View Time</h3>
            <p className="text-lg font-bold text-blue-900">
              {Math.round(lostViewTime / 60).toLocaleString()} hours
            </p>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <h3 className="text-xs font-medium text-purple-800 mb-1">Monthly Revenue Loss</h3>
            <p className="text-lg font-bold text-purple-900">
              ${revenueLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
            <h3 className="text-xs font-medium text-teal-800 mb-1">Potential Monthly Savings</h3>
            <p className="text-lg font-bold text-teal-900">
              ${potentialSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-4 text-center">
          <h3 className="font-bold text-sm mb-2">
            Optimize Your Streaming Infrastructure
          </h3>
          <p className="text-xs mb-3">
            Reduce latency and increase revenue with MozarkAI
          </p>
          <button
            onClick={onRequestDemo}
            className="bg-white text-blue-800 font-bold py-2 px-4 rounded text-xs hover:bg-blue-50 transition-colors"
          >
            Request Demo
          </button>
        </div>
      </div>
    </div>
  )
}

function PaymentCalculator({ onRequestDemo }: { onRequestDemo: () => void }) {
  const [transactions, setTransactions] = useState<number>(1000000)
  const [avgValue, setAvgValue] = useState<number>(100)
  const [currentLatency, setCurrentLatency] = useState<number>(200)
  const [mozarkLatency, setMozarkLatency] = useState<number>(50)

  const [currentLoss, setCurrentLoss] = useState<number>(0)
  const [mozarkLoss, setMozarkLoss] = useState<number>(0)
  const [dailySavings, setDailySavings] = useState<number>(0)
  const [annualSavings, setAnnualSavings] = useState<number>(0)

  // Calculate losses
  useEffect(() => {
    const lossPerTransaction = (latency: number): number => {
      return avgValue * (0.0005 + (0.000002 * latency))
    }

    const currentLossVal = transactions * lossPerTransaction(currentLatency)
    const mozarkLossVal = transactions * lossPerTransaction(mozarkLatency)

    setCurrentLoss(currentLossVal)
    setMozarkLoss(mozarkLossVal)
    setDailySavings(currentLossVal - mozarkLossVal)
    setAnnualSavings((currentLossVal - mozarkLossVal) * 365)
  }, [transactions, avgValue, currentLatency, mozarkLatency])

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    setter(value)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Payment System Latency
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Transactions
            </label>
            <input
              type="range"
              min="1000"
              max="10000000"
              step="1000"
              value={transactions}
              onChange={(e) => handleInputChange(setTransactions, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-900">
              <span>1K</span>
              <span className="font-medium">
                {new Intl.NumberFormat().format(transactions)}
              </span>
              <span>10M</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Transaction Value ($)
            </label>
            <input
              type="number"
              value={avgValue}
              onChange={(e) => handleInputChange(setAvgValue, Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Latency (ms)
              </label>
              <input
                type="number"
                value={currentLatency}
                onChange={(e) => handleInputChange(setCurrentLatency, Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Latency (ms)
              </label>
              <input
                type="number"
                value={mozarkLatency}
                onChange={(e) => handleInputChange(setMozarkLatency, Number(e.target.value))}
                className="w-full p-3 border border-green-500 rounded-lg text-gray-900 bg-white text-sm"
              />
            </div>
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

        <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-4 text-center">
          <h3 className="font-bold text-sm mb-2">
            Optimize Your Payment Infrastructure
          </h3>
          <p className="text-xs mb-3">
            Reduce latency and increase revenue with MozarkAI
          </p>
          <button
            onClick={onRequestDemo}
            className="bg-white text-blue-800 font-bold py-2 px-4 rounded text-xs hover:bg-blue-50 transition-colors"
          >
            Request Demo
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CostCalculators({ openModal }: CostCalculatorsProps) {
  const [calculatorType, setCalculatorType] = useState<'ott' | 'payment'>('ott')

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Estimate Your ROI
          </h2>
          <p className="text-xl text-gray-600">
            See how MozarkAI can optimize your operations and increase revenue
          </p>
        </div>

        {/* Calculator Type Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setCalculatorType('ott')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                calculatorType === 'ott'
                  ? 'bg-gradient-media text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              OTT Streaming
            </button>
            <button
              onClick={() => setCalculatorType('payment')}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                calculatorType === 'payment'
                  ? 'bg-gradient-finance text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Payment Systems
            </button>
          </div>
        </div>

        {/* Calculator */}
        {calculatorType === 'ott' ?
          <OTTCalculator onRequestDemo={() => openModal('ott')} /> :
          <PaymentCalculator onRequestDemo={() => openModal('payment')} />
        }

        {/* Trust & Use Case Tiles */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Trusted by Industry Leaders to Solve Complex Challenges
          </h3>

          {calculatorType === 'ott' ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
                <div className="text-blue-600 text-lg mb-2">📈</div>
                <h3 className="font-bold text-gray-900 mb-2">Proactive Live Event Assurance</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Ensure flawless streaming for millions during peak live events like IPL or FIFA.
                </p>
                <a href="#solutions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Learn more →
                </a>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
                <div className="text-blue-600 text-lg mb-2">🔒</div>
                <h3 className="font-bold text-gray-900 mb-2">DRM-Compliant Content & Ad Validation</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Monetize with confidence. Uniquely monitor the performance and quality of DRM-protected streams.
                </p>
                <a href="#solutions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Learn more →
                </a>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
                <div className="text-blue-600 text-lg mb-2">🌍</div>
                <h3 className="font-bold text-gray-900 mb-2">Global Consistency Benchmarking</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Discover why your app performs inconsistently across different geographies.
                </p>
                <a href="#solutions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Learn more →
                </a>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
                <div className="text-blue-600 text-lg mb-2">☁️</div>
                <h3 className="font-bold text-gray-900 mb-2">Secure, Governance-Compliant Test Infrastructure</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Eliminate device management headaches and security risks.
                </p>
                <a href="#solutions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Learn more →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
