# 📘 Guia de Implementação - Memória Viva

## 🎯 Visão Geral do Projeto

O **Memória Viva** é um webapp gratuito para auxiliar pacientes com Alzheimer e seus cuidadores, usando IA generativa para interação, suporte emocional e exercícios cognitivos.

---

## 🚀 Passo a Passo para Colocar no Ar

### 1. Configurar Supabase (Banco de Dados Gratuito)

1. Acesse https://supabase.com e crie uma conta gratuita
2. Clique em "New Project"
3. Preencha:
   - **Name**: memoria-viva
   - **Database Password**: (guarde em local seguro)
   - **Region**: Escolha a mais próxima (us-east-1 para Brasil)
4. Aguarde a criação (2-3 minutos)

5. **Execute o Schema SQL**:
   - No dashboard do Supabase, vá em "SQL Editor"
   - Copie o conteúdo de `supabase/schema.sql`
   - Cole e execute
   - Isso criará todas as tabelas necessárias

6. **Pegue as Credenciais**:
   - Vá em "Settings" → "API"
   - Copie `Project URL` → Cole no `.env.local` como `SUPABASE_URL`
   - Copie `anon public` key → Cole no `.env.local` como `SUPABASE_ANON_KEY`

---

### 2. Configurar Groq (IA Gratuita)

1. Acesse https://console.groq.com e crie conta
2. Vá em "API Keys"
3. Clique em "Create API Key"
4. Copie a chave gerada
5. Cole no `.env.local` como `GROQ_API_KEY`

**Modelos Disponíveis no Free Tier**:
- `llama3-8b-8192` - Rápido e leve
- `llama3-70b-8192` - Mais inteligente
- `mixtral-8x7b-32768` - Excelente para português
- `gemma-7b-it` - Google

---

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env.local`:

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...

# Groq
GROQ_API_KEY=gsk_xxxxxxxxxxxxx

# URLs Públicas
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 4. Rodar o Projeto Localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Acessar http://localhost:3000
```

---

### 5. Hospedar na Vercel (Gratuito)

1. Crie conta em https://vercel.com
2. Instale a CLI: `npm i -g vercel`
3. No diretório do projeto: `vercel`
4. Siga as instruções
5. **Importante**: Adicione as variáveis de ambiente no painel da Vercel:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - GROQ_API_KEY
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

---

## 🏗️ Arquitetura do Projeto

```
memoria-viva/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Home page
│   │   ├── login/              # Login
│   │   ├── registro/           # Cadastro
│   │   ├── dashboard/          # Dashboard multi-tenant
│   │   ├── paciente/[id]/      # Página do paciente
│   │   ├── cuidador/           # Área do cuidador
│   │   └── globals.css         # Estilos globais
│   ├── components/
│   │   ├── ui/                 # Componentes reutilizáveis
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   └── PatientForm.tsx
│   ├── hooks/
│   │   ├── useAuth.ts          # Autenticação
│   │   └── usePatients.ts      # Gerenciamento de pacientes
│   ├── lib/
│   │   ├── ai-service.ts       # Integração com Groq
│   │   ├── supabase.ts         # Cliente Supabase
│   │   └── accessibility.ts    # Utilitários de acessibilidade
│   └── types/
│       ├── index.ts            # Tipos TypeScript
│       └── database.types.ts   # Tipos do Supabase
├── supabase/
│   └── schema.sql              # Schema do banco de dados
├── public/
│   └── manifest.json           # PWA Manifest
└── .env.local                  # Variáveis de ambiente
```

---

## 🔐 Sistema Multi-Tenant

### Como Funciona

Cada **cuidador** pode:
1. Cadastrar múltiplos **pacientes**
2. Definir grau de **parentesco** com cada paciente
3. Alternar entre pacientes no dashboard

### Estrutura de Dados

```
profiles (cuidadores)
  └── patients (pacientes)
        └── patient_caregiver_relations (relacionamentos)
```

### Tabela `patient_caregiver_relations`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| patient_id | UUID | ID do paciente |
| caregiver_id | UUID | ID do cuidador |
| relationship_type | TEXT | pai, mae, filho, filha, conjuge, profissional, etc. |
| is_primary | BOOLEAN | Se é o cuidador principal |

---

## 🤖 Integração com IA

### Prompts de Sistema

#### Para Pacientes (`PATIENT_SYSTEM_PROMPT`)
- **Tom**: Calmo, afetuoso, frases curtas
- **Regra de Ouro**: Nunca contradizer, sempre validar
- **Objetivo**: Fazer o paciente se sentir amado e seguro

#### Para Cuidadores (`CAREGIVER_SYSTEM_PROMPT`)
- **Tom**: Empático, prático, sem julgamentos
- **Foco**: Validação de sentimentos, prevenção de burnout
- **Objetivo**: Apoio emocional e dicas práticas

### Como Trocar o Modelo de IA

Edite `src/lib/ai-service.ts`:

```typescript
const DEFAULT_CONFIG: AIConfig = {
  model: AVAILABLE_MODELS.LLAMA_3_8B, // Troque aqui
  temperature: 0.7,
  max_tokens: 500,
  system_prompt: '',
};
```

**Modelos Recomendados**:
- **Português**: `mixtral-8x7b-32768`
- **Velocidade**: `llama3-8b-8192`
- **Qualidade**: `llama3-70b-8192`

---

## ♿ Acessibilidade (WCAG AAA)

### Implementado

- ✅ Fontes grandes (configurável)
- ✅ Alto contraste
- ✅ Botões com área de toque mínima de 56px
- ✅ Foco visível em todos os elementos
- ✅ Suporte a leitores de tela
- ✅ Comandos de voz (Web Speech API)
- ✅ Navegação simplificada (sem menus escondidos)

### Como Testar

1. **Leitor de Tela**: Use NVDA (Windows) ou VoiceOver (Mac)
2. **Navegação por Teclado**: Tente usar apenas Tab/Enter
3. **Contraste**: Use o Chrome DevTools → Rendering → Emulate vision deficiencies

---

## 📱 PWA (Progressive Web App)

### Funcionalidades

- Instalação em celulares (Android/iOS)
- Funciona offline (parcialmente)
- Notificações push (futuro)
- Ícone na tela inicial

### Como Testar

1. Rodar: `npm run dev`
2. Acessar: `http://localhost:3000`
3. No Chrome: Menu → "Instalar aplicativo"

---

## 🎮 Funcionalidades Implementadas

### ✅ Módulo Paciente

| Funcionalidade | Status | Descrição |
|---------------|--------|-----------|
| Chat com IA | ✅ | Conversa empática com validação |
| Reconhecimento de Voz | ✅ | Falar em vez de digitar |
| Síntese de Voz | ✅ | IA "fala" as respostas |
| Memórias | 🟡 | Estrutura pronta, falta upload |
| Jogos | 🟡 | Cards prontos, falta implementação |
| Rotina/Lembretes | 🟡 | Estrutura no banco, falta UI |

### ✅ Módulo Cuidador

| Funcionalidade | Status | Descrição |
|---------------|--------|-----------|
| Chat de Suporte | ✅ | IA empática para cuidadores |
| Diário de Bordo | ✅ | Registro de humor e eventos |
| Exercício de Respiração | ✅ | Técnica 4-4-4 guiada |
| Relatórios | 🔴 | Pendente |

### 🔴 Funcionalidades Futuras

- [ ] Upload de fotos (memórias)
- [ ] Jogos cognitivos completos
- [ ] Lembretes push de rotina
- [ ] Integração com YouTube (músicas)
- [ ] Relatórios em PDF para médicos
- [ ] Comunidade de cuidadores
- [ ] Modo offline completo

---

## 🔒 Segurança e Privacidade

### Row Level Security (RLS)

O Supabase usa RLS para garantir que:
- Cada cuidador só vê **seus** pacientes
- Conversas são privadas
- Dados sensíveis protegidos

### Modo Incógnito

Para conversas sensíveis do cuidador:
- Não salvar no banco (futuro)
- Criptografia adicional (futuro)

### Disclaimer Importante

⚠️ **Este app NÃO substitui acompanhamento médico**

Sempre exiba este aviso em locais visíveis.

---

## 🐛 Troubleshooting

### Erro: "Invalid API Key" no Groq

```bash
# Verifique se a chave está correta
echo $GROQ_API_KEY

# Teste a API
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

### Erro: "Missing Supabase URL"

```bash
# Verifique .env.local
cat .env.local | grep SUPABASE

# Reinicie o servidor
npm run dev
```

### Erro: "Row Level Security"

Se não conseguir salvar dados:
1. Verifique se o schema.sql foi executado
2. Confira se as policies estão ativas
3. Teste no SQL Editor do Supabase

---

## 📊 Limites do Free Tier

### Supabase
- **Banco de Dados**: 500 MB
- **Autenticação**: 50.000 usuários/mês
- **API Requests**: Ilimitado

### Groq
- **Requests/minuto**: 30 (varia por modelo)
- **Requests/dia**: 14.400
- **Tokens/mês**: Ilimitado (por enquanto)

### Vercel
- **Bandwidth**: 100 GB/mês
- **Serverless Functions**: 100 GB-horas
- **Domínios**: Ilimitado

---

## 💰 Como Manter Gratuito

### Estratégias

1. **Otimize chamadas de IA**:
   - Use modelos menores (8B) para tarefas simples
   - Cache de respostas frequentes

2. **Monetização Ética** (opcional):
   - Botão de doação (Pix/Ko-fi)
   - Grants para projetos sociais
   - Parcerias com ONGs de Alzheimer

3. **Reduza Custos**:
   - Hospede modelos em GPU spot instances
   - Use CDN para imagens
   - Minimize queries ao banco

---

## 🤝 Como Contribuir

### Para Desenvolvedores

```bash
# Fork o projeto
# Crie uma branch
git checkout -b feature/nova-funcionalidade

# Faça suas mudanças
# Commit
git commit -m "feat: adiciona nova funcionalidade"

# Push
git push origin feature/nova-funcionalidade

# Pull Request
```

### Áreas que Precisam de Ajuda

- [ ] Tradução para outros idiomas
- [ ] Testes automatizados
- [ ] Jogos cognitivos
- [ ] Integração com APIs de música
- [ ] Design de ícones
- [ ] Documentação

---

## 📚 Recursos Úteis

### Documentação

- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Groq](https://console.groq.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

### Acessibilidade

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project](https://www.a11yproject.com/)

### Alzheimer e Cuidados

- [Alzheimer's Association](https://www.alz.org/)
- [ABRAz (Brasil)](https://abraz.com.br/)

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Abra uma issue no GitHub
2. Consulte a documentação
3. Teste no SQL Editor do Supabase

---

## 🙏 Agradecimentos

Este projeto é feito com ❤️ para ajudar cuidadores e pacientes com Alzheimer.

**Lembre-se**: O cuidador é o verdadeiro herói. Este app é apenas uma ferramenta de apoio.

---

## 📄 Licença

MIT License - Uso livre para fins sociais e educacionais.
