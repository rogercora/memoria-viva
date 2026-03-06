'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMockAuth } from '@/hooks/useMockAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Brain, AlertTriangle, User, Mail, Lock } from 'lucide-react';

export default function RegistroPage() {
  const router = useRouter();
  const { signUp } = useMockAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    const { error } = await signUp(formData.email, formData.password, formData.fullName);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Redirecionar para confirmação de e-mail ou dashboard
      router.push('/registro-confirmado');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Aviso de Modo de Demonstração */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-800">Modo de Demonstração</p>
            <p className="text-sm text-amber-700 mt-1">
              Cadastro simulado. Os dados não serão salvos permanentemente.
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-[#963C67]" />
            <h1 className="text-3xl font-bold text-gray-900">Memória Viva</h1>
          </div>
          <p className="text-gray-700 text-lg">
            Crie sua conta gratuitamente
          </p>
        </div>

        {/* Card de Registro */}
        <div className="bg-white border-[3px] border-[#264653] shadow-[4px_4px_0px_#264653] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nome Completo"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Seu nome"
              required
              icon={<User />}
            />

            <Input
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              required
              icon={<Mail />}
            />

            <Input
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              required
              icon={<Lock />}
              helperText="Use uma senha forte"
            />

            <Input
              label="Confirmar Senha"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Repita a senha"
              required
              icon={<Lock />}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg" role="alert">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Este app é gratuito e não substitui
                acompanhamento médico profissional.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Criar Conta Grátis'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-700">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-blue-600 font-bold hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
