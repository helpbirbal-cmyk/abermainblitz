import React, { CSSProperties } from 'react'; // <-- Import CSSProperties


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
}) =>  { // <-- Change to EXPLICIT return function body

  // 🎯 FIX: Calculate the percentage here, inside the component's scope
    const rangePercent = ((value - min) / (max - min)) * 100;

    // Define the dynamic style object
    const dynamicStyle: CSSProperties = {
      // This uses the calculated percentage to create the progress fill
      background: `linear-gradient(to right, #3b82f6 ${rangePercent}%, #e5e7eb ${rangePercent}%)`,
    };

  return ( // <-- Explicit return
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
      className="w-full compact"
      style={dynamicStyle}
      //className="range text-blue-300 [--range-bg:orange] [--range-thumb:blue] [--range-fill:0] w-full"
      //className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
    />
    <div className="flex justify-between text-xs text-gray-500">
      <span>{prefix}{min.toLocaleString()}{suffix}</span>
      <span>{prefix}{max.toLocaleString()}{suffix}</span>
    </div>
  </div>
);
};
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
}) =>  { // <-- Change to EXPLICIT return function body

  // 🎯 FIX: Calculate the percentage here, inside the component's scope
    const rangePercent = ((value - min) / (max - min)) * 100;

    // Define the dynamic style object
    const dynamicStyle: CSSProperties = {
      // This uses the calculated percentage to create the progress fill
      background: `linear-gradient(to right, #3b82f6 ${rangePercent}%, #e5e7eb ${rangePercent}%)`,
    };

  return ( // <-- Explicit return
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
      className="w-full compact"
      style={dynamicStyle}
      //className="range text-blue-300 [--range-bg:orange] [--range-thumb:blue] [--range-fill:0] w-full"
      //className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
};
