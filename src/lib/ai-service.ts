/**
 * Serviço de IA - Integração com Groq (API Gratuita)
 * Suporta múltiplos modelos: Qwen 2.5, Llama 3, GLM
 */

import Groq from 'groq-sdk';
import { AIMessage, AIConfig } from '@/types';

// Verificar se a API key está configurada
const groqApiKey = process.env.GROQ_API_KEY;

// Debug para verificar se a chave está sendo lida
console.log('Groq API Key configurada:', groqApiKey ? 'SIM' : 'NÃO');
console.log('Groq API Key (primeiros 10 chars):', groqApiKey ? groqApiKey.substring(0, 10) + '...' : 'Nenhuma');

// Inicializar cliente Groq apenas se a chave existir
const groq = groqApiKey && groqApiKey.length > 20 && !groqApiKey.includes('placeholder')
  ? new Groq({ apiKey: groqApiKey })
  : null;

// Modelos disponíveis no tier gratuito do Groq
export const AVAILABLE_MODELS = {
  LLAMA_3_8B: 'llama3-8b-8192',
  LLAMA_3_70B: 'llama3-70b-8192',
  MIXTRAL_8X7B: 'mixtral-8x7b-32768',
  GEMMA_7B: 'gemma-7b-it',
  QWEN_2_5: 'qwen-2.5-32b', // Se disponível
};

// Configurações padrão
const DEFAULT_CONFIG: AIConfig = {
  model: AVAILABLE_MODELS.LLAMA_3_8B,
  temperature: 0.7,
  max_tokens: 500,
  system_prompt: '',
};

/**
 * Prompt de sistema para PACIENTES com Alzheimer
 * Foco: empatia, validação, estímulo positivo
 */
export const PATIENT_SYSTEM_PROMPT = `
Você é o "Amigo Virtual", um companheiro carinhoso e paciente para uma pessoa idosa com Alzheimer.

SUAS REGRAS PRINCIPAIS:
1. NUNCA contradiga o usuário. Se ele disser algo factualmente errado, valide o sentimento em vez de corrigir o fato.
2. Seja encorajador e afetuoso. Reforce a identidade e autoestima da pessoa.
3. Use frases CURTAS e DIRETAS. Uma ideia por frase.
4. Seja lento e calmo. Não use metáforas complexas ou ironia.
5. Foque no PRESENTE e em MEMÓRIAS FELIZES do passado.
6. NUNCA dê conselhos médicos ou sobre medicação. Diga: "É importante conversarmos sobre isso com seu médico ou sua família".
7. Se o usuário parecer triste ou ansioso, ofereça conforto e sugira algo simples (ouvir música, olhar uma foto, respirar fundo).
8. Incentive a interação com familiares: "Que bonito! Conte isso para seu filho quando ele vier."
9. Use palavras simples e evite termos técnicos.
10. O objetivo principal é fazer o usuário se sentir AMADO, SEGURO e com VONTADE DE VIVER.

TOM DE VOZ:
- Calmo, como um amigo próximo
- Afetuoso, mas não infantilizar
- Paciente, sem pressa
- Positivo, focado nas capacidades, não nas limitações

EXEMPLO DE RESPOSTA:
Usuário: "Não lembro onde coloquei meus óculos..."
Você: "Isso acontece comigo também! Vamos respirar fundo juntos? Os óculos vão aparecer. Enquanto isso, quer me contar sobre seu dia?"

NUNCA FAÇA:
- Corrigir memórias erradas ("Isso não aconteceu assim")
- Usar frases longas ou complexas
- Pressionar por informações
- Dar diagnósticos ou conselhos médicos
- Ignorar sentimentos de tristeza ou medo
`;

/**
 * Prompt de sistema para CUIDADORES
 * Foco: escuta ativa, validação, prevenção de burnout
 */
export const CAREGIVER_SYSTEM_PROMPT = `
Você é um "Companheiro de Cuidados", um assistente empático e informativo para cuidadores de pessoas com Alzheimer.

SUAS REGRAS PRINCIPAIS:
1. Valide SEMPRE os sentimentos do cuidador. Cuidar é exaustivo e ele precisa se sentir compreendido.
2. NUNCA julgue. Cuidadores frequentemente sentem culpa, raiva, frustração. Normalize esses sentimentos.
3. Ofereça dicas PRÁTICAS e baseadas em evidências quando perguntado.
4. Incentive o AUTOCUIDADO. O cuidador não pode cuidar de outros se não se cuidar.
5. Reconheça o TRABALHO INVISÍVEL do cuidador. Elogie esforços, mesmo os pequenos.
6. NUNCA dê conselhos médicos. Para questões clínicas, oriente a procurar o médico.
7. Se detectar sinais de DEPRESSÃO ou BURNOUT severo, sugira ajuda profissional.
8. Lembre o cuidador que ele NÃO ESTÁ SOZINHO.
9. Seja prático, mas acolhedor.
10. Respeite o modo "incógnito" - algumas conversas são muito pessoais.

TOM DE VOZ:
- Empático e acolhedor
- Prático e informativo quando necessário
- Sem julgamentos
- Encorajador, mas realista

TEMAS IMPORTANTES:
- Validação de sentimentos difíceis (raiva, culpa, tristeza)
- Dicas de comunicação com o paciente
- Estratégias para lidar com comportamentos desafiadores
- Autocuidado e prevenção de burnout
- Recursos e apoio disponíveis

NUNCA FAÇA:
- Julgar ou minimizar sentimentos
- Dar conselhos médicos
- Sugerir que o cuidador "deveria" fazer algo sem entender o contexto
- Ignorar sinais de crise emocional
`;

/**
 * Envia mensagem para a IA
 */
export async function sendMessage(
  messages: AIMessage[],
  config: Partial<AIConfig> = {}
): Promise<string> {
  // Se não houver cliente Groq configurado, retornar mensagem de fallback
  if (!groq) {
    console.warn('Groq API não configurada. Usando resposta de fallback.');
    return 'Olá! Estou em modo de demonstrção. Para usar a IA completa, configure a chave da API Groq nas variáveis de ambiente.';
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    // Adicionar system prompt como primeira mensagem
    const messagesWithSystem: AIMessage[] = [
      { role: 'system', content: finalConfig.system_prompt },
      ...messages,
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messagesWithSystem,
      model: finalConfig.model,
      temperature: finalConfig.temperature,
      max_tokens: finalConfig.max_tokens,
      top_p: 1,
      stream: false,
    });

    return chatCompletion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';
  } catch (error) {
    console.error('Erro na IA:', error);
    
    // Fallback para modelo mais leve se o principal falhar
    if (error instanceof Error && error.message.includes('rate_limit')) {
      return sendMessage(messages, { ...config, model: AVAILABLE_MODELS.LLAMA_3_8B });
    }
    
    return 'Estou com dificuldade de responder agora. Vamos tentar de novo em instantes?';
  }
}

/**
 * Stream de resposta da IA (para UX mais fluida)
 */
export async function sendMessageStream(
  messages: AIMessage[],
  config: Partial<AIConfig> = {},
  onChunk: (chunk: string) => void
): Promise<void> {
  // Se não houver cliente Groq configurado, retornar mensagem de fallback
  if (!groq) {
    onChunk('Olá! Estou em modo de demonstração. Para usar a IA completa, configure a chave da API Groq.');
    return;
  }

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    const messagesWithSystem: AIMessage[] = [
      { role: 'system', content: finalConfig.system_prompt },
      ...messages,
    ];

    const stream = await groq.chat.completions.create({
      messages: messagesWithSystem,
      model: finalConfig.model,
      temperature: finalConfig.temperature,
      max_tokens: finalConfig.max_tokens,
      top_p: 1,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Erro no stream da IA:', error);
    onChunk('Desculpe, tive uma dificuldade técnica. Vamos tentar de novo?');
  }
}

/**
 * Gera sugestão de atividade baseada no perfil do paciente
 */
export async function suggestActivity(
  patientName: string,
  stage: string,
  interests: string[]
): Promise<string> {
  const prompt = `
O paciente ${patientName} tem Alzheimer em estágio ${stage}.
Interesses: ${interests.join(', ') || 'não especificado'}.

Sugira UMA atividade simples e adequada para estimular cognitivamente, 
considerando as limitações do estágio. Seja específico sobre como fazer.
Máximo 3 frases.
`;

  const response = await sendMessage(
    [{ role: 'user', content: prompt }],
    { system_prompt: 'Você é um terapeuta ocupacional especializado em Alzheimer.' }
  );

  return response;
}

/**
 * Analisa humor do paciente baseado nas conversas
 */
export async function analyzeMood(messages: AIMessage[]): Promise<{
  mood: string;
  confidence: number;
  suggestions: string[];
}> {
  const prompt = `
Analise as últimas mensagens do paciente e determine:
1. Humor predominante (feliz, calmo, ansioso, agitado, triste, neutro)
2. Nível de confiança (0-100)
3. 2-3 sugestões de ações para o cuidador

Retorne em JSON:
{
  "mood": "humor",
  "confidence": numero,
  "suggestions": ["sugestao1", "sugestao2"]
}
`;

  const conversationText = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  
  const response = await sendMessage(
    [{ role: 'user', content: `${prompt}\n\nConversas:\n${conversationText}` }],
    { max_tokens: 200 }
  );

  try {
    // Extrair JSON da resposta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Erro ao parsear análise de humor:', e);
  }

  return {
    mood: 'neutro',
    confidence: 50,
    suggestions: ['Observe o paciente nas próximas horas', 'Mantenha rotina calma'],
  };
}

/**
 * Gera resumo semanal para o cuidador
 */
export async function generateWeeklySummary(
  journalEntries: Array<{ date: string; mood_patient: string; notes?: string }>
): Promise<string> {
  const prompt = `
Baseado nestas entradas do diário da semana, crie um resumo CARINHOSO e ENCOURAJADOR para o cuidador:

${journalEntries.map(e => `${e.date}: Humor=${e.mood_patient}, Notas=${e.notes || 'sem notas'}`).join('\n')}

Destaque:
- Padrões positivos observados
- Momentos especiais mencionados
- Uma mensagem de apoio ao cuidador

Máximo 5 frases. Tom acolhedor e positivo.
`;

  const response = await sendMessage(
    [{ role: 'user', content: prompt }],
    { system_prompt: CAREGIVER_SYSTEM_PROMPT }
  );

  return response;
}
