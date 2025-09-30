// src/components/Calculators/components/DialInputs.tsx
'use client';

import React from 'react';

interface DialInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  formatValue?: (value: number) => string;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

interface DialInputWithCapacityProps extends DialInputProps {
  capacityValue: number;
}

export const DialInput: React.FC<DialInputProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  formatValue,
  onChange,
  size = 'md'
}) => {
  const radius = size === 'sm' ? 30 : size === 'md' ? 40 : 50;
  const strokeWidth = size === 'sm' ? 6 : 8;
  const circumference = 2 * Math.PI * radius;
  const progress = ((value - min) / (max - min)) * circumference;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const displayValue = formatValue ? formatValue(value) : `${prefix}${value}${suffix}`;

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <label className={`font-medium text-gray-700 ${textSizeClasses[size]} text-center`}>
        {label}
      </label>

      <div className="relative">
        <svg className={`${sizeClasses[size]} transform -rotate-90`}>
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#3b82f6"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold text-gray-800 ${textSizeClasses[size]}`}>
            {displayValue}
          </div>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export const DialInputWithCapacity: React.FC<DialInputWithCapacityProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  formatValue,
  capacityValue,
  onChange,
  size = 'md'
}) => {
  const radius = size === 'sm' ? 30 : size === 'md' ? 40 : 50;
  const strokeWidth = size === 'sm' ? 6 : 8;
  const circumference = 2 * Math.PI * radius;

  // Main value progress (blue)
  const progress = ((value - min) / (max - min)) * circumference;
  // Capacity value progress (green, semi-transparent)
  const capacityProgress = ((capacityValue - min) / (max - min)) * circumference;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const displayValue = formatValue ? formatValue(value) : `${prefix}${value}${suffix}`;

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <label className={`font-medium text-gray-700 ${textSizeClasses[size]} text-center`}>
        {label}
      </label>

      <div className="relative">
        <svg className={`${sizeClasses[size]} transform -rotate-90`}>
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Capacity circle (green) */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#10b981"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - capacityProgress}
            strokeLinecap="round"
            opacity={0.4}
          />
          {/* Main value progress (blue) */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#3b82f6"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold text-gray-800 ${textSizeClasses[size]}`}>
            {displayValue}
          </div>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};
