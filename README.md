# 🧠 Memória Viva - App de Apoio para Alzheimer

Um webapp gratuito para auxiliar pacientes com Alzheimer e seus cuidadores, usando IA generativa.

## 🎯 Objetivo

- **Para Pacientes**: Chat companheiro, lembretes de rotina, jogos cognitivos e álbum de memórias
- **Para Cuidadores**: Dashboard de acompanhamento, suporte emocional e prevenção de burnout

## 🛠️ Stack Tecnológica (100% Free Tier)

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend/Banco**: Supabase (Auth + Database)
- **IA**: Groq API (Qwen 2.5, Llama 3, GLM)
- **Hospedagem**: Vercel

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env.local

# Rodar em desenvolvimento
npm run dev
```

## 📋 Configuração das APIs Gratuitas

### 1. Supabase (Banco de Dados)
1. Crie conta em https://supabase.com
2. Crie novo projeto
3. Em SQL Editor, rode o script em `supabase/schema.sql`
4. Copie `SUPABASE_URL` e `SUPABASE_ANON_KEY` para `.env.local`

### 2. Groq (IA Gratuita)
1. Crie conta em https://console.groq.com
2. Vá em API Keys e crie uma chave
3. Copie para `GROQ_API_KEY` no `.env.local`

## 🏗️ Arquitetura Multi-Tenant

Cada cuidador pode:
- Cadastrar múltiplos pacientes
- Selecionar grau de parentesco
- Alternar entre pacientes ativos

## 📱 Funcionalidades

### Módulo Paciente
- Chat com IA empática (não corrige, acolhe)
- Lembretes suaves de rotina
- Jogos de memória e cores
- Álbum de memórias com descrição por IA

### Módulo Cuidador
- Diário de bordo do paciente
- Chat de suporte emocional
- Exercícios de respiração
- Relatórios de evolução

## ♿ Acessibilidade

- WCAG AAA (alto contraste, fontes grandes)
- Navegação simplificada (sem menus escondidos)
- Suporte a comandos de voz (Web Speech API)
- PWA para instalação em celulares

## ⚠️ Avisos Importantes

- **NÃO substitui acompanhamento médico**
- IA pode alucinar - sempre validar informações
- Dados sensíveis - usar modo incógnito para conversas privadas

## 🤝 Como Contribuir

Este é um projeto open source e social. Contribuições são bem-vindas!

## 📄 Licença

MIT - Uso livre para fins sociais
