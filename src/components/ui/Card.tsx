'use client';

import React from 'react';
import { CardProps } from '@/types';

/**
 * Componente Card Acessível
 * - Bordas arredondadas
 * - Sombra suave
 * - Clickável (opcional)
 * - Acessível para leitores de tela
 */
export function Card({
  children,
  title,
  className = '',
  onClick,
  padding = 'medium',
}: CardProps) {
  const paddingStyles = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
  };

  const isClickable = !!onClick;

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }
          : undefined
      }
      className={`
        bg-white rounded-2xl border-[3px] border-[#264653]
        ${paddingStyles[padding]}
        ${isClickable
          ? 'cursor-pointer shadow-[4px_4px_0px_#264653] hover:shadow-[6px_6px_0px_#264653] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all focus:outline-none focus:ring-4 focus:ring-blue-500'
          : 'shadow-[4px_4px_0px_#264653]'}
        ${className}
      `}
      aria-label={title}
    >
      {title && (
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      )}
      {children}
    </div>
  );
}
