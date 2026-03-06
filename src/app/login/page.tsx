'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMockAuth } from '@/hooks/useMockAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Brain, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useMockAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Aviso de Modo de Demonstração */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800">Modo de Demonstração</p>
            <p className="text-sm text-amber-700 mt-1">
              Use qualquer e-mail e senha para testar. Os dados são temporários.
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Memória Viva</h1>
          </div>
          <p className="text-gray-700 text-lg">
            Entre para continuar
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg" role="alert">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-sm text-blue-800 font-medium">
              💡 Dica: Use qualquer e-mail e senha para testar!
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-700">
              Não tem uma conta?{' '}
              <Link href="/registro" className="text-blue-600 font-bold hover:underline">
                Cadastre-se grátis
              </Link>
            </p>
          </div>
        </div>

        {/* Link para home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
