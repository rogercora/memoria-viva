'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { createClient } from '@supabase/supabase-js';
import { Brain, MessageCircle, Image, Gamepad2, Bell, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Patient } from '@/types';
import { PATIENT_SYSTEM_PROMPT } from '@/lib/ai-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function PatientPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useMockAuth();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'memorias' | 'jogos' | 'rotina'>('chat');
  // Carregar mensagens do LocalStorage ao iniciar
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`chat-${patientId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Converter strings de data de volta para Date
          return parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech recognition
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Carregar paciente
    const loadPatient = async () => {
      // Verificar se está usando Supabase configurado
      const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
      
      if (!isSupabaseConfigured) {
        // Usar dados mockados
        const mockPatients: Record<string, Patient> = {
          'mock-patient-1': {
            id: 'mock-patient-1',
            caregiver_id: 'mock-user-1',
            name: 'João Silva',
            birth_date: '1950-05-15',
            gender: 'masculino',
            stage: 'leve',
            diagnosis_date: '2023-01-10',
            medical_info: 'Hipertensão controlada. Gosta de música sertaneja.',
            medications: ['Losartana 50mg', 'Aspirina 100mg'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          'mock-patient-2': {
            id: 'mock-patient-2',
            caregiver_id: 'mock-user-1',
            name: 'Ana Silva',
            birth_date: '1955-08-22',
            gender: 'feminino',
            stage: 'moderado',
            diagnosis_date: '2022-06-15',
            medical_info: 'Diabetes tipo 2. Apaixonada por jardinagem.',
            medications: ['Metformina 850mg', 'Gliclazida 60mg'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        };

        const patientData = mockPatients[patientId];
        if (patientData) {
          setPatient(patientData);
        }
        setLoading(false);
        return;
      }

      // Usar Supabase real
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error || !data) {
        router.push('/dashboard');
        return;
      }

      setPatient(data);
      setLoading(false);
    };

    loadPatient();

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
  }, [patientId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Salvar mensagens no LocalStorage sempre que mudarem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`chat-${patientId}`, JSON.stringify(messages));
    }
  }, [messages, patientId]);

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
      // Filtrar mensagens de erro do histórico (não enviar para a IA)
      const validMessages = messages.filter(m => 
        !m.content.includes('Desculpe, não consegui processar')
      );
      
      // Chamar IA via API Route - enviando TODO o histórico da conversa
      const requestBody = {
        // Envia últimas 10 mensagens válidas (suficiente para contexto)
        messages: validMessages
          .slice(-10)
          .map(m => ({ role: m.role, content: m.content })),
        system_prompt: PATIENT_SYSTEM_PROMPT,
      };
      
      console.log('[Chat] Enviando mensagens:', requestBody.messages.length);
      console.log('[Chat] Última mensagem:', requestBody.messages[requestBody.messages.length - 1]);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      console.log('[Chat] Resposta da API:', data);

      if (!res.ok) {
        console.error('[Chat] ERRO:', data);
        console.error('[Chat] Debug:', data.debug);
      }

      const response = data.response || data.message || 'Desculpe, não consegui responder.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Salvar no banco
      if (user) {
        await supabase.from('messages').insert({
          conversation_id: 'temp', // TODO: Gerenciar conversas
          role: 'user',
          content: inputMessage,
        });
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSending(false);
    }
  };

  const speakMessage = async (text: string) => {
    if ('speechSynthesis' in window) {
      // Aguardar vozes carregarem (necessário no Windows/Chrome)
      let voices = window.speechSynthesis.getVoices();
      
      // Se não tiver vozes ainda, aguardar carregar
      if (voices.length === 0) {
        await new Promise<void>((resolve) => {
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve();
          };
          // Timeout de segurança
          setTimeout(resolve, 500);
        });
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9; // Mais lento para idosos
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Prioridade de vozes (da melhor para a pior)
      // 1. Edge Neural (Francisca, Antonio) - vozes mais naturais
      // 2. Google (se disponível no Android/Chrome)
      // 3. Microsoft Maria (fallback)
      const voicePriority = [
        'Francisca',      // Edge Neural pt-BR feminina (MELHOR)
        'Antonio',        // Edge Neural pt-BR masculina
        'Brenda',         // Edge pt-BR feminina
        'Google português',  // Google TTS
        'Microsoft Maria',   // Fallback Windows
        'Microsoft Daniel',  // Fallback Windows (padrão)
      ];
      
      // Buscar a melhor voz disponível
      let selectedVoice = null;
      for (const voiceName of voicePriority) {
        selectedVoice = voices.find(v => 
          v.name.includes(voiceName) && 
          (v.lang.includes('pt-BR') || v.lang.includes('pt_BR'))
        );
        if (selectedVoice) {
          console.log('[Voz] Selecionada:', selectedVoice.name);
          break;
        }
      }
      
      // Se achou uma voz, usa ela
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="secondary"
                size="small"
                icon={<ArrowLeft size={20} />}
              >
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                {patient.photo_url ? (
                  <img
                    src={patient.photo_url}
                    alt={patient.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">
                      {patient.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                  <p className="text-sm text-gray-600">
                    {patient.stage === 'leve' && 'Estágio Leve'}
                    {patient.stage === 'moderado' && 'Estágio Moderado'}
                    {patient.stage === 'grave' && 'Estágio Grave'}
                    {patient.stage === 'nao_diagnosticado' && 'Em Acompanhamento'}
                  </p>
                </div>
              </div>
            </div>
            <Brain className="w-10 h-10 text-blue-600" />
          </div>

          {/* Tabs de Navegação */}
          <nav className="flex gap-2 mt-4 overflow-x-auto">
            <Button
              onClick={() => setActiveTab('chat')}
              variant={activeTab === 'chat' ? 'primary' : 'secondary'}
              size="large"
              icon={<MessageCircle size={20} />}
              className="flex-1 min-w-fit"
            >
              Conversar
            </Button>
            <Button
              onClick={() => setActiveTab('memorias')}
              variant={activeTab === 'memorias' ? 'primary' : 'secondary'}
              size="large"
              icon={<Image size={20} />}
              className="flex-1 min-w-fit"
            >
              Memórias
            </Button>
            <Button
              onClick={() => setActiveTab('jogos')}
              variant={activeTab === 'jogos' ? 'primary' : 'secondary'}
              size="large"
              icon={<Gamepad2 size={20} />}
              className="flex-1 min-w-fit"
            >
              Jogos
            </Button>
            <Button
              onClick={() => setActiveTab('rotina')}
              variant={activeTab === 'rotina' ? 'primary' : 'secondary'}
              size="large"
              icon={<Bell size={20} />}
              className="flex-1 min-w-fit"
            >
              Rotina
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Chat */}
        {activeTab === 'chat' && (
          <Card className="h-[calc(100vh-280px)] flex flex-col" padding="none">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 mx-auto text-blue-300 mb-4" />
                  <p className="text-xl text-gray-600">
                    Olá! Sou seu amigo virtual. Vamos conversar?
                  </p>
                  <p className="text-gray-500 mt-2">
                    Me conte sobre seu dia, suas memórias, ou o que quiser!
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
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-lg">{message.content}</p>
                        {message.role === 'assistant' && (
                          <button
                            onClick={() => speakMessage(message.content)}
                            className="mt-2 text-sm opacity-70 hover:opacity-100"
                            aria-label="Ouvir mensagem"
                          >
                            🔊 Ouvir
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
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
                  placeholder="Digite ou use o microfone..."
                  className="flex-1 px-4 py-3 text-lg rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500"
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

        {/* Memórias */}
        {activeTab === 'memorias' && (
          <div className="space-y-4">
            <Card padding="large">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📸 Álbum de Memórias
              </h2>

              {/* Memórias mockadas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-4xl">👨‍👩‍👧</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Família</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Fotos especiais com filhos e netos
                  </p>
                  <Button variant="primary" size="small" disabled>
                    Em Breve
                  </Button>
                </div>

                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-4xl">🏠</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Casa Antiga</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Lembranças da casa da infância
                  </p>
                  <Button variant="primary" size="small" disabled>
                    Em Breve
                  </Button>
                </div>

                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-4xl">🎉</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Festas</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Aniversários e celebrações
                  </p>
                  <Button variant="primary" size="small" disabled>
                    Em Breve
                  </Button>
                </div>

                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-4xl">✈️</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Viagens</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Lugares especiais que visitou
                  </p>
                  <Button variant="primary" size="small" disabled>
                    Em Breve
                  </Button>
                </div>
              </div>

              <p className="text-gray-600 mt-6 text-center">
                🚧 Upload de fotos em desenvolvimento. Em breve você poderá adicionar
                fotos e a IA vai descrevê-las para estimular as memórias!
              </p>
            </Card>
          </div>
        )}

        {/* Jogos */}
        {activeTab === 'jogos' && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="text-center cursor-pointer hover:shadow-lg" padding="large">
              <Gamepad2 className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Jogo da Memória
              </h3>
              <p className="text-gray-600 mb-4">
                Exercite sua memória com cartas
              </p>
              <Button
                variant="primary"
                size="medium"
                onClick={() => router.push(`/paciente/${patientId}/jogo-memoria`)}
              >
                Jogar
              </Button>
            </Card>

            <Card className="text-center cursor-pointer hover:shadow-lg" padding="large">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Jogo das Cores
              </h3>
              <p className="text-gray-600 mb-4">
                Associe cores e formas
              </p>
              <Button variant="primary" size="medium" disabled>
                Em Breve
              </Button>
            </Card>
          </div>
        )}

        {/* Rotina */}
        {activeTab === 'rotina' && (
          <div className="space-y-4">
            <Card padding="large">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📅 Lembretes de Rotina
              </h2>

              {/* Lista de rotinas mockadas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💊</span>
                    <div>
                      <p className="font-bold text-gray-900">Tomar Medicamentos</p>
                      <p className="text-gray-600">Losartana 50mg, Aspirina 100mg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">08:00</p>
                    <p className="text-sm text-gray-500">Diário</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🍽️</span>
                    <div>
                      <p className="font-bold text-gray-900">Café da Manhã</p>
                      <p className="text-gray-600">Refeição leve e saudável</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">07:30</p>
                    <p className="text-sm text-gray-500">Diário</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🚶</span>
                    <div>
                      <p className="font-bold text-gray-900">Caminhada</p>
                      <p className="text-gray-600">Exercício leve no quintal</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">16:00</p>
                    <p className="text-sm text-gray-500">Diário</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🌙</span>
                    <div>
                      <p className="font-bold text-gray-900">Hora de Dormir</p>
                      <p className="text-gray-600">Descanso noturno</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">21:00</p>
                    <p className="text-sm text-gray-500">Diário</p>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="large"
                className="w-full mt-6"
                disabled
              >
                ➕ Adicionar Novo Lembrete (Em Breve)
              </Button>
            </Card>

            <Card padding="large" className="bg-blue-50 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                💡 Dica
              </h3>
              <p className="text-gray-700">
                Manter uma rotina regular ajuda a reduzir a ansiedade e confusão
                em pessoas com Alzheimer. Os lembretes suaves são mais eficazes
                que cobranças.
              </p>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
