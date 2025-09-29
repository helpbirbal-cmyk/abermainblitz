import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  onChange
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <span className="text-lg font-semibold text-blue-600">
        {prefix}{value.toLocaleString()}{suffix}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
    />
    <div className="flex justify-between text-xs text-gray-500">
      <span>{prefix}{min.toLocaleString()}{suffix}</span>
      <span>{prefix}{max.toLocaleString()}{suffix}</span>
    </div>
  </div>
);

interface SliderInputWithCapacityProps extends SliderInputProps {
  capacityValue: number;
}

export const SliderInputWithCapacity: React.FC<SliderInputWithCapacityProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  capacityValue,
  onChange
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <span className="text-lg font-semibold text-blue-600">
        {prefix}{value.toLocaleString()}{suffix}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
    />
    <div className="flex justify-between text-xs text-gray-500">
      <span>{prefix}{min.toLocaleString()}{suffix}</span>
      <span>{prefix}{max.toLocaleString()}{suffix}</span>
    </div>
    <div className="text-xs font-light bg-blue-50 text-blue-700 p-2 rounded text-center">
        Max: {Math.round(capacityValue)} tests/month(est.)
    </div>
  </div>
);
