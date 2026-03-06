'use client';

import { useParams, useRouter } from 'next/navigation';
import MemoryGame from '@/components/games/MemoryGame';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PatientMemoryGamePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push(`/paciente/${patientId}`)}
              variant="secondary"
              size="small"
              icon={<ArrowLeft size={20} />}
            >
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Jogo da Memória
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <MemoryGame />
      </main>
    </div>
  );
}
