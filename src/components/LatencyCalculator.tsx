// src/components/LatencyCalculator.tsx
'use client';

import { useState } from 'react';

interface CalculatorInputs {
  monthlyViewers: number;
  avgViewTime: number;
  avgCpm: number;
  currentLatency: number;
  targetLatency: number;
}

export default function LatencyCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
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

  // Industry metrics (based on various studies)
  const metrics = {
    baseBufferRate: 0.02, // 2% base buffering rate
    bufferIncreasePerSecond: 0.03, // 3% increase per second of latency
    abandonmentThreshold: 8, // Seconds before viewers abandon
    viewTimeDecreasePerSecond: 0.02 // 2% decrease in view time per second of latency
  };

  // Calculate buffer rates
  const currentBufferRate = metrics.baseBufferRate + 
                          (metrics.bufferIncreasePerSecond * Math.max(0, inputs.currentLatency - 2));
  const improvedBufferRate = metrics.baseBufferRate + 
                           (metrics.bufferIncreasePerSecond * Math.max(0, inputs.targetLatency - 2));
  
  // Calculate lost view time
  const lostViewTime = inputs.monthlyViewers * inputs.avgViewTime * currentBufferRate;
  const savedViewTime = inputs.monthlyViewers * inputs.avgViewTime * (currentBufferRate - improvedBufferRate);
  
  // Calculate revenue impact (assuming CPM model)
  const revenueLoss = (lostViewTime / 1000) * (inputs.avgCpm / 60);
  const potentialSavings = (savedViewTime / 1000) * (inputs.avgCpm / 60);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Calculate Your Latency Costs</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Viewers
              </label>
              <input
                type="number"
                name="monthlyViewers"
                value={inputs.monthlyViewers}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Average View Time (minutes)
              </label>
              <input
                type="number"
                name="avgViewTime"
                value={inputs.avgViewTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Average CPM Rate ($)
              </label>
              <input
                type="number"
                name="avgCpm"
                value={inputs.avgCpm}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Latency (seconds)
              </label>
              <input
                type="number"
                step="0.1"
                name="currentLatency"
                value={inputs.currentLatency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Latency with MozarkAI (seconds)
              </label>
              <input
                type="number"
                step="0.1"
                name="targetLatency"
                value={inputs.targetLatency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Impact Analysis</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-red-800">Current Buffering Rate</h3>
                <p className="text-2xl font-bold text-red-900">{(currentBufferRate * 100).toFixed(1)}%</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Improved Buffering Rate</h3>
                <p className="text-2xl font-bold text-green-900">{(improvedBufferRate * 100).toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Monthly Lost View Time Due to Latency</h3>
              <p className="text-2xl font-bold text-blue-900">
                {Math.round(lostViewTime / 60).toLocaleString()} hours
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800">Monthly Revenue Loss</h3>
              <p className="text-2xl font-bold text-purple-900">
                ${revenueLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-teal-800">Potential Monthly Savings with MozarkAI</h3>
              <p className="text-2xl font-bold text-teal-900">
                ${potentialSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">Annualized Potential Savings</h3>
              <p className="text-2xl font-bold text-yellow-900">
                ${(potentialSavings * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
              Contact MozarkAI to Recover Your Revenue
            </button>
          </div>
        </div>
      </div>

      {/* MozarkAI Services Section */}
      <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          How MozarkAI Reduces Latency for OTT Platforms
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-time Optimization</h3>
            <p className="text-gray-600">
              Our AI-powered algorithms continuously analyze and optimize your video delivery in real-time, reducing buffering and latency.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Predictive CDN Selection</h3>
            <p className="text-gray-600">
              MozarkAI predicts network conditions and intelligently routes traffic through the most optimal CDN paths for each viewer.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Comprehensive Analytics</h3>
            <p className="text-gray-600">
              Get detailed insights into your streaming performance with actionable recommendations to further improve viewer experience.
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 mr-4">
            Request a Demo
          </button>
          <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition duration-300">
            Download Technical White Paper
          </button>
        </div>
      </div>
    </div>
  );
}