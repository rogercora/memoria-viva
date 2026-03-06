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
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl border-[3px] border-[#264653] transition-all focus:outline-none focus:ring-4 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-[#2D6A4F] hover:bg-[#1B4332] text-white',
    secondary: 'bg-white hover:bg-gray-100 text-[#264653]',
    danger: 'bg-[#E63946] hover:bg-[#D90429] text-white',
    success: 'bg-[#2A9D8F] hover:bg-[#21867A] text-white',
  };

  const sizeStyles = {
    small: 'px-4 py-3 text-base gap-2',
    medium: 'px-6 py-4 text-lg gap-3',
    large: 'px-8 py-5 text-xl gap-4',
    xlarge: 'px-10 py-6 text-2xl gap-4',
  };

  const disabledStyles = disabled
    ? 'cursor-not-allowed opacity-60 shadow-none'
    : 'cursor-pointer shadow-[4px_4px_0px_#264653] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none';

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
