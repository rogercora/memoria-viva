'use client';

import React, { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

/**
 * Componente Input Acessível
 * - Label associado
 * - Mensagens de erro e ajuda
 * - Foco visível
 * - Tamanho grande para facilidade de uso
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = '', icon, ...props }, ref) => {
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="block text-lg font-bold text-gray-900 mb-2"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-3 text-lg rounded-lg border-2
              focus:outline-none focus:ring-4 focus:ring-offset-2
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${icon ? 'pl-12' : ''}
              ${error
                ? 'border-red-600 focus:border-red-600 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-600 focus:ring-blue-500'
              }
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-600">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
