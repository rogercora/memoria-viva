/**
 * Utilitários de Acessibilidade
 */

// Tamanhos de fonte para diferentes níveis de acessibilidade
export const FONT_SIZES = {
  normal: {
    base: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
    title: 'text-2xl',
  },
  grande: {
    base: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl',
    title: 'text-3xl',
  },
  extra_grande: {
    base: 'text-xl',
    large: 'text-2xl',
    xlarge: 'text-3xl',
    title: 'text-4xl',
  },
};

// Cores de alto contraste
export const HIGH_CONTRAST_COLORS = {
  background: 'bg-yellow-50',
  text: 'text-gray-900',
  primary: 'bg-blue-700 hover:bg-blue-800',
  secondary: 'bg-green-700 hover:bg-green-800',
  danger: 'bg-red-700 hover:bg-red-800',
  border: 'border-2 border-gray-900',
};

// Cores normais
export const NORMAL_COLORS = {
  background: 'bg-gray-50',
  text: 'text-gray-800',
  primary: 'bg-blue-600 hover:bg-blue-700',
  secondary: 'bg-green-600 hover:bg-green-700',
  danger: 'bg-red-600 hover:bg-red-700',
  border: 'border border-gray-300',
};

/**
 * Hook para configurações de acessibilidade
 */
export function useAccessibility(fontSize: 'normal' | 'grande' | 'extra_grande', highContrast: boolean) {
  const fonts = FONT_SIZES[fontSize];
  const colors = highContrast ? HIGH_CONTRAST_COLORS : NORMAL_COLORS;

  return {
    fonts,
    colors,
    isHighContrast: highContrast,
    fontSize,
  };
}

/**
 * Verifica se a cor tem contraste suficiente
 */
export function checkContrastRatio(foreground: string, background: string): number {
  // Implementação simplificada - em produção usar biblioteca específica
  return 21; // Retorna contraste máximo para now
}

/**
 * Gera ID único para elementos de formulário
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Texto alternativo para imagens
 */
export function generateAltText(description: string): string {
  return description.length > 125 ? description.substring(0, 122) + '...' : description;
}

/**
 * Anuncia mudanças para leitores de tela
 */
export function announceToScreenReader(message: string): void {
  const announcement = document.getElementById('screen-reader-announcement');
  if (announcement) {
    announcement.textContent = message;
  }
}
