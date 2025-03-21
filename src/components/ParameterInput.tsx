
import React from 'react';

interface ParameterInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
}

const ParameterInput: React.FC<ParameterInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "Enter...",
  type = "text",
  min,
  max,
  step
}) => {
  return (
    <div className="mb-4">
      <label className="block text-lg font-semibold mb-2 text-gray-700">
        {label}:
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className="bytewise-input"
        />
      </div>
    </div>
  );
};

export default ParameterInput;
