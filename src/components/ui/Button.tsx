'use client';

import React from 'react';
import { ButtonProps } from '@/types';

/**
 * Componente Button Acessível
 * - Foco visível
 * - Tamanhos grandes para facilidade de clique
 * - Alto contraste
 * - Suporte a leitor de tela
 */
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  type = 'button',
  icon,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:bg-green-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-red-300',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 disabled:bg-emerald-300',
  };

  const sizeStyles = {
    small: 'px-3 py-2 text-sm gap-1.5',
    medium: 'px-4 py-3 text-base gap-2',
    large: 'px-6 py-4 text-lg gap-2',
    xlarge: 'px-8 py-5 text-xl gap-3',
  };

  const disabledStyles = disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer active:scale-95';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${className}
      `}
      aria-disabled={disabled}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
