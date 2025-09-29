import React from 'react';

interface SavingsPieChartProps {
  salarySavings: number;
  deviceSavings: number;
  totalSavings: number;
}

export const SavingsPieChart: React.FC<SavingsPieChartProps> = ({
  salarySavings,
  deviceSavings,
  totalSavings
}) => {
  const salaryPercentage = totalSavings > 0 ? (salarySavings / totalSavings) * 100 : 0;
  const devicePercentage = totalSavings > 0 ? (deviceSavings / totalSavings) * 100 : 0;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const salaryDashArray = circumference;
  const salaryDashOffset = circumference - (salaryPercentage / 100) * circumference;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-50 h-50">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="20"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#3b82f6"
            strokeWidth="20"
            fill="none"
            strokeDasharray={salaryDashArray}
            strokeDashoffset={salaryDashOffset}
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#10b981"
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (devicePercentage / 100) * circumference + salaryDashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xl font-bold text-gray-800">{formatCurrency(totalSavings)}</div>
          <div className="text-xs text-gray-600">Total Savings</div>
        </div>
      </div>

      <div className="mt-4 space-y-2 w-full px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Salary Savings</span>
          </div>
          <span className="text-sm font-semibold text-green-600">
            {Math.round(salaryPercentage)}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Device Savings</span>
          </div>
          <span className="text-sm font-semibold text-blue-600">
            {Math.round(devicePercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
};
