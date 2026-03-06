'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { usePatients } from '@/hooks/usePatients';
import { Brain, Plus, Users, Heart, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import PatientForm from '@/components/PatientForm';

export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut } = useMockAuth();
  const { patients, loading, addPatient, isMock } = usePatients();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Verificar autenticação
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user) {
      setIsChecking(false);
    }
  }, [user, loading, router]);

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 mx-auto text-blue-600 animate-pulse" />
          <p className="mt-4 text-xl text-gray-700">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Verificar se está em modo de demonstração
  const isMockMode = isMock;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Banner de Modo de Demonstração */}
          {isMockMode && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3 mb-4 flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold text-amber-800">Modo de Demonstração Ativo</p>
                <p className="text-sm text-amber-700">
                  Você está usando dados de teste. Para usar o app com dados reais, configure o Supabase.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Memória Viva</h1>
                <p className="text-sm text-gray-600">Olá, {user.full_name}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/perfil')}
                variant="secondary"
                size="medium"
                icon={<Settings size={20} />}
              >
                Perfil
              </Button>
              <Button
                onClick={handleSignOut}
                variant="danger"
                size="medium"
                icon={<LogOut size={20} />}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Seleção de Paciente */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Meus Pacientes
            </h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              size="medium"
              icon={<Plus size={20} />}
            >
              Adicionar Paciente
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando pacientes...</p>
            </div>
          ) : patients.length === 0 ? (
            <Card className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nenhum paciente cadastrado
              </h3>
              <p className="text-gray-600 mb-4">
                Comece adicionando seu primeiro paciente
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="primary"
                size="large"
                icon={<Plus size={20} />}
              >
                Cadastrar Paciente
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <Card
                  key={patient.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/paciente/${patient.id}`)}
                  padding="large"
                >
                  <div className="text-center">
                    {patient.photo_url ? (
                      <img
                        src={patient.photo_url}
                        alt={patient.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-blue-100 flex items-center justify-center">
                        <span className="text-3xl font-bold text-blue-600">
                          {patient.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {patient.name}
                    </h3>
                    {patient.stage && (
                      <p className="text-gray-600 mb-3">
                        Estágio: {patient.stage}
                      </p>
                    )}
                    <Button
                      variant="primary"
                      size="medium"
                      className="w-full"
                      icon={<Heart size={18} />}
                    >
                      Acessar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Ações Rápidas */}
        {patients.length > 0 && (
          <section className="grid md:grid-cols-3 gap-6">
            <Card
              onClick={() => router.push('/cuidador')}
              className="cursor-pointer hover:shadow-lg"
              padding="large"
            >
              <Heart className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Área do Cuidador
              </h3>
              <p className="text-gray-600">
                Suporte emocional, diário de bordo e exercícios de respiração
              </p>
            </Card>

            <Card
              onClick={() => router.push('/comunidade')}
              className="cursor-pointer hover:shadow-lg"
              padding="large"
            >
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Comunidade
              </h3>
              <p className="text-gray-600">
                Conecte-se com outros cuidadores e compartilhe experiências
              </p>
            </Card>

            <Card
              onClick={() => router.push('/recursos')}
              className="cursor-pointer hover:shadow-lg"
              padding="large"
            >
              <Brain className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Recursos
              </h3>
              <p className="text-gray-600">
                Informações, dicas e materiais sobre Alzheimer
              </p>
            </Card>
          </section>
        )}
      </main>

      {/* Modal de Cadastro de Paciente */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cadastrar Paciente"
        size="large"
      >
        <PatientForm
          onSubmit={async (data) => {
            const result = await addPatient(data.patient, data.relation);
            if (result.success) {
              setIsModalOpen(false);
            } else {
              alert('Erro ao cadastrar paciente');
            }
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
