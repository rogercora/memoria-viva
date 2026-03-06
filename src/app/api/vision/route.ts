import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
    if (!groqApiKey || groqApiKey.includes('placeholder')) {
        return NextResponse.json(
            { description: "Modo demonstração: Uma bela foto de família no parque. (Configure a chave API Groq para descrições reais)" },
            { status: 200 }
        );
    }

    try {
        const { imageUrl, prompt } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'URL da imagem é obrigatória' }, { status: 400 });
        }

        const groq = new Groq({ apiKey: groqApiKey });

        // O modelo Llama 3.2 Vision suporta imagens via URL pública ou Base64
        const response = await groq.chat.completions.create({
            model: "llama-3.2-11b-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt || "Descreva esta imagem de forma carinhosa, simples e evocativa, adequada para um paciente com Alzheimer. Foco em sentimentos positivos, pessoas, cores e no ambiente. Máximo de 3 frases curtas."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300,
            temperature: 0.7,
        });

        const description = response.choices[0]?.message?.content || "Imagem recebida, mas não pude gerar uma descrição.";

        return NextResponse.json({ description });

    } catch (error) {
        console.error('[Vision API] Erro ao processar imagem:', error);
        return NextResponse.json(
            { error: 'Falha ao processar a imagem. Tente novamente mais tarde.' },
            { status: 500 }
        );
    }
}
