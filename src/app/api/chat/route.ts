/**
 * API Route para Chat com IA
 * Server-side apenas - variáveis de ambiente seguras
 */

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Verificar se a API key está configurada
const groqApiKey = process.env.GROQ_API_KEY;

// Debug para verificar se a chave está sendo lida
console.log('[API Chat] Groq API Key configurada:', groqApiKey ? 'SIM' : 'NÃO');
console.log('[API Chat] Groq API Key (primeiros 10 chars):', groqApiKey ? groqApiKey.substring(0, 10) + '...' : 'Nenhuma');

// Inicializar cliente Groq apenas se a chave existir
const groq = groqApiKey && groqApiKey.length > 20 && !groqApiKey.includes('placeholder')
  ? new Groq({ apiKey: groqApiKey })
  : null;

// Modelos disponíveis (atualizado 2026-03)
const AVAILABLE_MODELS = {
  LLAMA_3_1_8B: 'llama-3.1-8b-instant', // Modelo atual gratuito
  LLAMA_3_70B: 'llama-3.2-70b-versatile',
  GEMMA_7B: 'gemma2-9b-it',
  QWEN_2_5: 'qwen-2.5-coder-32b',
};

/**
 * Prompt de sistema para PACIENTES com Alzheimer
 */
const PATIENT_SYSTEM_PROMPT = `
Você é o "Amigo Virtual", um companheiro carinhoso e paciente para uma pessoa idosa com Alzheimer.

SUAS REGRAS PRINCIPAIS:
1. NUNCA contradiga o usuário. Valide o sentimento em vez de corrigir o fato.
2. Seja encorajador e afetuoso.
3. Use frases CURTAS e DIRETAS. Uma ideia por frase.
4. Seja lento e calmo. Não use metáforas complexas ou ironia.
5. Foque no PRESENTE e em MEMÓRIAS FELIZES do passado.
6. NUNCA dê conselhos médicos.
7. Use palavras simples e evite termos técnicos.
8. O objetivo é fazer o usuário se sentir AMADO, SEGURO e com VONTADE DE VIVER.

TOM DE VOZ: Calmo, afetuoso, paciente, positivo.
`;

export async function POST(request: NextRequest) {
  // Verificar se Groq está configurado
  if (!groq) {
    console.error('[API Chat] Groq não configurado');
    console.error('[API Chat] GROQ_API_KEY valor:', process.env.GROQ_API_KEY ? 'definida' : 'não definida');
    console.error('[API Chat] Valor real:', process.env.GROQ_API_KEY);
    return NextResponse.json({
      error: 'Groq API não configurada',
      message: 'Olá! Estou em modo de demonstração. Para usar a IA completa, configure a chave da API Groq.'
    }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { messages, system_prompt = PATIENT_SYSTEM_PROMPT } = body;

    console.log('[API Chat] Body recebido:', body);
    console.log('[API Chat] Messages:', messages);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('[API Chat] Mensagens vazias ou inválidas');
      return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
    }

    // Adicionar system prompt como primeira mensagem
    const messagesWithSystem = [
      { role: 'system', content: system_prompt },
      ...messages,
    ];

    console.log('[API Chat] Enviando para Groq...', messagesWithSystem.length, 'mensagens');
    console.log('[API Chat] Última mensagem:', messages[messages.length - 1]);

    const chatCompletion = await groq.chat.completions.create({
      messages: messagesWithSystem,
      model: AVAILABLE_MODELS.LLAMA_3_1_8B,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1,
      stream: false,
    });

    const response = chatCompletion.choices[0]?.message?.content ||
      'Desculpe, não consegui processar sua mensagem.';

    console.log('[API Chat] Resposta recebida:', response.substring(0, 50) + '...');

    return NextResponse.json({
      response,
      model: AVAILABLE_MODELS.LLAMA_3_1_8B
    });

  } catch (error) {
    console.error('[API Chat] Erro:', error);
    console.error('[API Chat] Error stack:', error instanceof Error ? error.stack : 'N/A');
    
    // Extrair detalhes do erro da Groq
    let errorDetails = 'Erro desconhecido';
    if (error instanceof Error) {
      errorDetails = `${error.name}: ${error.message}`;
    }
    
    return NextResponse.json({
      error: 'Erro ao processar mensagem',
      message: 'Estou com dificuldade de responder agora. Vamos tentar de novo em instantes?',
      debug: errorDetails
    }, { status: 500 });
  }
}
