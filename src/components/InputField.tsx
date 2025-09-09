// components/calculators/InputField.tsx
interface InputFieldProps {
  label: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  formatValue?: (value: number) => string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  compact?: boolean;
}

export default function InputField({
  label,
  name,
  value,
  min,
  max,
  step,
  formatValue,
  onChange,
  compact = false
}: InputFieldProps) {
  const displayValue = formatValue ? formatValue(value) : value.toString();

  if (compact) {
    return (
      <div className="space-y-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            id={name}
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-900 min-w-[70px] text-right">
            {displayValue}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="range"
        id={name}
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{formatValue ? formatValue(min) : min}</span>
        <span className="text-sm font-medium text-gray-900">{displayValue}</span>
        <span className="text-xs text-gray-500">{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  );
}
