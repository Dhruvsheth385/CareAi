import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...rest }, ref) => {
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={rest.id}
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          className={`
            border-2 rounded-lg py-3 px-4 text-lg 
            ${error ? 'border-red-500' : 'border-gray-300'} 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...rest}
        />
        
        {error && (
          <p className="mt-1 text-red-500 text-base">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;