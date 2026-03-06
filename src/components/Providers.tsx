'use client';

import { AuthProvider } from '@/hooks/useAuth';
import { MockAuthProvider } from '@/hooks/useMockAuth';

// Modo de demonstração ativado quando Supabase não está configurado
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
                       !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                       process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder');

export default function Providers({ children }: { children: React.ReactNode }) {
  // Usar dados mockados para demonstração
  if (USE_MOCK_DATA) {
    return (
      <MockAuthProvider>
        {children}
      </MockAuthProvider>
    );
  }

  // Usar Supabase real
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
