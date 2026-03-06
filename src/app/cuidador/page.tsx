'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { createClient } from '@supabase/supabase-js';
import { Heart, ArrowLeft, Mic, MicOff, Wind, BookOpen, MessageCircle, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CAREGIVER_SYSTEM_PROMPT } from '@/lib/ai-service';
import { MOOD_LABELS, MoodType } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'
);

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function CuidadorPage() {
  const router = useRouter();
  const { user } = useMockAuth();

  const [activeTab, setActiveTab] = useState<'visao-geral' | 'chat' | 'diario' | 'respiracao' | 'desabafo'>('visao-geral');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Diário
  const [moodCaregiver, setMoodCaregiver] = useState<MoodType>('neutro');
  const [journalNotes, setJournalNotes] = useState('');
  const [savingJournal, setSavingJournal] = useState(false);

  // Respiração
  const [breathingPhase, setBreathingPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathingText, setBreathingText] = useState('Clique em Iniciar');
  const [breathingCount, setBreathingCount] = useState(0);
  const breathingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Configurar reconhecimento de voz
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'pt-BR';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: inputMessage }],
          system_prompt: CAREGIVER_SYSTEM_PROMPT,
        }),
      });

      const data = await res.json();
      const response = data.response || data.message || 'Desculpe, não consegui responder.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const saveJournal = async () => {
    if (!user) return;

    setSavingJournal(true);
    try {
      await supabase.from('caregiver_journal').insert({
        patient_id: 'temp', // TODO: Selecionar paciente
        caregiver_id: user.id,
        date: new Date().toISOString().split('T')[0],
        mood_caregiver: moodCaregiver,
        notes: journalNotes,
      });

      alert('Diário salvo com sucesso!');
      setJournalNotes('');
      setMoodCaregiver('neutro');
    } catch (error) {
      console.error('Erro ao salvar diário:', error);
      alert('Erro ao salvar diário');
    } finally {
      setSavingJournal(false);
    }
  };

  const startBreathing = () => {
    setBreathingPhase('inhale');
    setBreathingCount(0);

    const runBreathing = () => {
      setBreathingPhase('inhale');
      setBreathingText('Inspire... (4s)');

      setTimeout(() => {
        setBreathingPhase('hold');
        setBreathingText('Segure... (4s)');

        setTimeout(() => {
          setBreathingPhase('exhale');
          setBreathingText('Expire... (4s)');
          setBreathingCount((prev) => prev + 1);
        }, 4000);
      }, 4000);
    };

    runBreathing();
    breathingInterval.current = setInterval(runBreathing, 12000);
  };

  const stopBreathing = () => {
    if (breathingInterval.current) {
      clearInterval(breathingInterval.current);
    }
    setBreathingPhase('idle');
    setBreathingText('Clique em Iniciar');
  };

  useEffect(() => {
    return () => {
      if (breathingInterval.current) {
        clearInterval(breathingInterval.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="secondary"
                size="large"
                icon={<ArrowLeft size={24} strokeWidth={3} />}
              >
                Voltar
              </Button>
              <div className="flex items-center gap-4">
                <Heart className="w-12 h-12 text-[#2A9D8F]" strokeWidth={2.5} />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Área do Cuidador</h1>
                  <p className="text-lg text-gray-700 font-medium">Cuide de quem cuida 💚</p>
                </div>
              </div>
            </div>

            {/* Patient Selector Mockup */}
            <div className="flex items-center gap-3 bg-white border-[3px] border-[#264653] shadow-[4px_4px_0px_#264653] rounded-2xl p-2 px-4 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/150?img=11" alt="Paciente" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                <img src="https://i.pravatar.cc/150?img=5" alt="Outro Paciente" className="w-10 h-10 rounded-full border-2 border-white object-cover opacity-50" />
              </div>
              <div className="ml-2">
                <p className="text-sm font-bold text-gray-900">João Silva</p>
                <p className="text-xs text-gray-600 font-medium">Alternar Paciente</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-4 mt-6 overflow-x-auto pb-2">
            <Button
              onClick={() => setActiveTab('visao-geral')}
              variant={activeTab === 'visao-geral' ? 'primary' : 'secondary'}
              size="large"
              icon={<LayoutDashboard size={20} strokeWidth={3} />}
              className="flex-1 min-w-fit"
            >
              Visão Geral
            </Button>
            <Button
              onClick={() => setActiveTab('chat')}
              variant={activeTab === 'chat' ? 'primary' : 'secondary'}
              size="large"
              icon={<Heart size={20} />}
              className="flex-1 min-w-fit"
            >
              Conversar
            </Button>
            <Button
              onClick={() => setActiveTab('desabafo')}
              variant={activeTab === 'desabafo' ? 'primary' : 'secondary'}
              size="large"
              icon={<MessageCircle size={20} />}
              className="flex-1 min-w-fit"
            >
              Desabafo
            </Button>
            <Button
              onClick={() => setActiveTab('diario')}
              variant={activeTab === 'diario' ? 'primary' : 'secondary'}
              size="large"
              icon={<BookOpen size={20} />}
              className="flex-1 min-w-fit"
            >
              Diário
            </Button>
            <Button
              onClick={() => setActiveTab('respiracao')}
              variant={activeTab === 'respiracao' ? 'primary' : 'secondary'}
              size="large"
              icon={<Wind size={20} />}
              className="flex-1 min-w-fit"
            >
              Respiração
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Visão Geral */}
        {activeTab === 'visao-geral' && (
          <div className="space-y-8">
            {/* Mensagem de Apoio */}
            <Card padding="large" className="bg-[#E9F5F1] border-[#2A9D8F] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2A9D8F] opacity-10 rounded-full -mr-10 -mt-10 pointer-events-none" />
              <h2 className="text-2xl font-bold text-[#1B4332] mb-3 flex items-center gap-2">
                <Heart className="text-[#E63946]" fill="#E63946" /> Momento de Apoio
              </h2>
              <p className="text-xl text-[#264653] italic font-medium leading-relaxed">
                "Cuidar de quem amamos é um ato de coragem diária. Lembre-se de que sua dedicação faz toda a diferença, mas o seu bem-estar também importa. Aproveite 5 minutos hoje para respirar fundo e cuidar de você."
              </p>
            </Card>

            {/* Status Semânticos do Paciente Atual */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Status de João Silva</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#2D6A4F] text-white p-6 rounded-2xl border-[3px] border-[#264653] shadow-[4px_4px_0px_#264653]">
                  <h4 className="text-xl font-bold mb-2">Manhã</h4>
                  <p className="text-lg flex items-center gap-2">Tranquilo 🟢</p>
                  <p className="text-sm border-t border-white/20 mt-3 pt-3">Tomou o café e medicação sem resistência.</p>
                </div>
                <div className="bg-[#F4A261] text-[#264653] p-6 rounded-2xl border-[3px] border-[#264653] shadow-[4px_4px_0px_#264653]">
                  <h4 className="text-xl font-bold mb-2">Tarde</h4>
                  <p className="text-lg font-bold">Confuso 🟡</p>
                  <p className="text-sm border-t border-[#264653]/20 mt-3 pt-3">Perguntou pela casa antiga algumas vezes.</p>
                </div>
                <div className="bg-white text-[#264653] p-6 rounded-2xl border-[3px] border-[#264653] shadow-[4px_4px_0px_#264653] opacity-70">
                  <h4 className="text-xl font-bold mb-2">Noite</h4>
                  <p className="text-lg font-bold text-gray-500">Pendente ⚪</p>
                  <p className="text-sm border-t border-gray-200 mt-3 pt-3 text-gray-500">Aguardando registro do cuidador do turno noturno.</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setActiveTab('diario')}
              variant="primary"
              size="xlarge"
              className="w-full text-center"
            >
              Registrar Pior/Melhor Momento do Dia
            </Button>
          </div>
        )}

        {/* Chat de Suporte */}
        {activeTab === 'chat' && (
          <Card className="h-[calc(100vh-280px)] flex flex-col" padding="none">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto text-green-300 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Como você está se sentindo hoje?
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Este é um espaço seguro para você desabafar, compartilhar
                    dificuldades e receber apoio. Estou aqui para ouvir sem julgamentos.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                          }`}
                      >
                        <p className="text-lg">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Como está se sentindo?..."
                  className="flex-1 px-4 py-3 text-lg rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-green-500"
                  disabled={sending}
                />
                <Button
                  onClick={startListening}
                  variant="secondary"
                  size="large"
                  disabled={isListening || !recognition}
                  icon={isListening ? <MicOff size={20} /> : <Mic size={20} />}
                >
                  {isListening ? 'Ouvindo...' : 'Voz'}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  variant="primary"
                  size="large"
                  disabled={sending || !inputMessage.trim()}
                >
                  {sending ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Diário do Cuidador */}
        {activeTab === 'diario' && (
          <div className="space-y-6">
            <Card padding="large">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Diário de Bordo
              </h2>

              <div className="space-y-6">
                {/* Humor do Cuidador */}
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    Como você está se sentindo hoje?
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {(Object.keys(MOOD_LABELS) as MoodType[]).map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setMoodCaregiver(mood)}
                        className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${moodCaregiver === mood
                            ? 'border-green-600 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-gray-400'
                          }`}
                      >
                        {MOOD_LABELS[mood]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-2">
                    Anotações do Dia
                  </label>
                  <textarea
                    value={journalNotes}
                    onChange={(e) => setJournalNotes(e.target.value)}
                    placeholder="Descreva como foi o dia, desafios, conquistas, observações..."
                    rows={6}
                    className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-green-500"
                  />
                </div>

                <Button
                  onClick={saveJournal}
                  variant="primary"
                  size="large"
                  className="w-full"
                  disabled={savingJournal || !journalNotes.trim()}
                >
                  {savingJournal ? 'Salvando...' : 'Salvar Diário'}
                </Button>
              </div>
            </Card>

            {/* Dicas */}
            <Card padding="large" className="bg-yellow-50 border-yellow-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                💡 Lembrete Importante
              </h3>
              <p className="text-gray-700 text-lg">
                Cuidar de alguém com Alzheimer é uma jornada desafiadora.
                Não se culpe pelos momentos difíceis. Celebre as pequenas
                vitórias e lembre-se: você não está sozinho.
              </p>
            </Card>
          </div>
        )}

        {/* Exercício de Respiração */}
        {activeTab === 'respiracao' && (
          <div className="space-y-6">
            <Card padding="large" className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Exercício de Respiração 4-4-4
              </h2>
              <p className="text-gray-600 mb-8">
                Uma técnica simples para reduzir o estresse e ansiedade
              </p>

              {/* Círculo de Respiração */}
              <div className="relative w-64 h-64 mx-auto mb-8">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-[4000ms] ${breathingPhase === 'inhale'
                      ? 'bg-green-400 scale-100'
                      : breathingPhase === 'hold'
                        ? 'bg-blue-400 scale-100'
                        : breathingPhase === 'exhale'
                          ? 'bg-purple-400 scale-50'
                          : 'bg-gray-200 scale-75'
                    }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {breathingText}
                    </p>
                    {breathingCount > 0 && (
                      <p className="text-gray-600">
                        Ciclos: {breathingCount}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Controles */}
              <div className="flex gap-4 justify-center">
                {breathingPhase === 'idle' ? (
                  <Button
                    onClick={startBreathing}
                    variant="primary"
                    size="xlarge"
                    icon={<Wind size={24} />}
                  >
                    Iniciar Exercício
                  </Button>
                ) : (
                  <Button
                    onClick={stopBreathing}
                    variant="danger"
                    size="xlarge"
                  >
                    Parar
                  </Button>
                )}
              </div>
            </Card>

            {/* Instruções */}
            <Card padding="large" className="bg-blue-50 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                📖 Como Funciona
              </h3>
              <ul className="space-y-2 text-gray-700 text-lg">
                <li><strong>Inspire</strong> profundamente pelo nariz (4 segundos)</li>
                <li><strong>Segure</strong> o ar nos pulmões (4 segundos)</li>
                <li><strong>Expire</strong> lentamente pela boca (4 segundos)</li>
                <li>Repita o ciclo quantas vezes precisar</li>
              </ul>
              <p className="mt-4 text-gray-700">
                Este exercício ajuda a ativar o sistema nervoso parassimpático,
                reduzindo a frequência cardíaca e promovendo relaxamento.
              </p>
            </Card>
          </div>
        )}

        {/* Desabafo */}
        {activeTab === 'desabafo' && (
          <Card padding="large" className="text-center">
            <MessageCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Espaço de Desabafo
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Em breve: um espaço seguro para você desabafar, colocar para fora
              o que está sentindo e receber apoio. Estamos trabalhando nisso.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
