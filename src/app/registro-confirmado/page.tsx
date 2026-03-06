'use client';

import Link from 'next/link';
import { Brain, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RegistroConfirmadoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Verifique seu e-mail
          </h1>

          <p className="text-gray-700 text-lg mb-6">
            Enviamos um link de confirmação para o seu e-mail. 
            Clique no link para ativar sua conta.
          </p>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              Não recebeu o e-mail? Verifique sua caixa de spam ou 
              aguarde alguns minutos.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              size="large"
              className="w-full"
            >
              Reenviar E-mail
            </Button>

            <Link href="/login" className="block">
              <Button
                variant="primary"
                size="large"
                className="w-full"
              >
                Ir para Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
