'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { Brain, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useMockAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <Brain className="w-16 h-16 mx-auto text-[#963C67] animate-pulse" />
          <p className="mt-4 text-xl text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="p-6">
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Brain className="w-10 h-10 text-[#963C67]" />
            <h1 className="text-3xl font-bold text-gray-900">Memória Viva</h1>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/login')}
              variant="secondary"
              size="large"
            >
              Entrar
            </Button>
            <Button
              onClick={() => router.push('/registro')}
              variant="primary"
              size="large"
            >
              Cadastrar
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Apoio e Carinho para quem cuida de memórias
          </h2>
          <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Um aplicativo gratuito para auxiliar pacientes com Alzheimer e seus
            cuidadores, usando Inteligência Artificial para dar suporte emocional
            e cognitivo.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push('/registro')}
              variant="primary"
              size="xlarge"
            >
              Começar Agora - É Grátis
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white border-[3px] border-[#264653] shadow-[4px_4px_0px_#264653] rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Para Pacientes
            </h3>
            <p className="text-gray-700 text-lg">
              Chat companheiro, lembretes suaves de rotina, jogos cognitivos
              e álbum de memórias para estimular a mente e o coração.
            </p>
          </div>

          <div className="bg-white border-[3px] border-[#264653] shadow-[4px_4px_0px_#264653] rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Para Cuidadores
            </h3>
            <p className="text-gray-700 text-lg">
              Suporte emocional, diário de bordo, exercícios de respiração
              e prevenção de burnout. Você não está sozinho.
            </p>
          </div>

          <div className="bg-white border-[3px] border-[#264653] shadow-[4px_4px_0px_#264653] rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              100% Gratuito
            </h3>
            <p className="text-gray-700 text-lg">
              Usamos IA de código aberto e servidores gratuitos para manter
              este app acessível para todos que precisam.
            </p>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="mt-20 bg-white border-[3px] border-[#264653] shadow-[4px_4px_0px_#264653] rounded-2xl p-10">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Como Funciona
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-3">
                1
              </div>
              <p className="text-gray-800 font-medium">Cadastre-se gratuitamente</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-3">
                2
              </div>
              <p className="text-gray-800 font-medium">Cadastre seu paciente</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-3">
                3
              </div>
              <p className="text-gray-800 font-medium">Personalize a IA</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-3">
                4
              </div>
              <p className="text-gray-800 font-medium">Comece a usar</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-lg">
            ⚠️ Este aplicativo não substitui acompanhamento médico profissional.
          </p>
          <p className="mt-4 text-gray-400">
            Feito com ❤️ para ajudar cuidadores e pacientes com Alzheimer
          </p>
        </div>
      </footer>
    </div>
  );
}
