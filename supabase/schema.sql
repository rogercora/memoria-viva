-- ============================================
-- SCHEMA DO BANCO DE DADOS - MEMÓRIA VIVA
-- ============================================
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA DE PERFIS (USUÁRIOS)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('cuidador', 'admin')) DEFAULT 'cuidador',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- TABELA DE PACIENTES
-- ============================================
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  caregiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('masculino', 'feminino', 'outro')),
  diagnosis_date DATE,
  stage TEXT CHECK (stage IN ('leve', 'moderado', 'grave', 'nao_diagnosticado')),
  photo_url TEXT,
  medical_info TEXT, -- Informações médicas importantes
  medications TEXT[], -- Array de medicamentos
  allergies TEXT[], -- Array de alergias
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- TABELA DE RELACIONAMENTOS (CUIDADOR-PACIENTE)
-- ============================================
CREATE TABLE patient_caregiver_relations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  caregiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  relationship_type TEXT NOT NULL, -- 'pai', 'mae', 'filho', 'filha', 'conjuge', 'profissional', 'outro'
  relationship_other TEXT, -- Se relationship_type = 'outro'
  is_primary BOOLEAN DEFAULT false, -- Cuidador principal
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(patient_id, caregiver_id)
);

-- ============================================
-- TABELA DE MEMÓRIAS (FOTOS E HISTÓRIAS)
-- ============================================
CREATE TABLE memories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  date_taken DATE, -- Data da foto
  people_tags TEXT[], -- Pessoas na foto
  location TEXT,
  story TEXT, -- História associada (gerada ou inserida)
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- TABELA DE CONVERSAS (CHAT)
-- ============================================
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('paciente', 'cuidador')) NOT NULL,
  title TEXT, -- Título automático da conversa
  is_incognito BOOLEAN DEFAULT false, -- Modo incógnito para cuidador
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- TABELA DE ROTINA (LEMBRETES)
-- ============================================
CREATE TABLE routines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL, -- "Tomar remédio", "Almoço", etc.
  description TEXT,
  time TIME NOT NULL,
  days_of_week INTEGER[], -- [0,1,2,3,4,5,6] = Dom a Sab
  is_active BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- TABELA DE DIÁRIO DO CUIDADOR
-- ============================================
CREATE TABLE caregiver_journal (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  caregiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  mood_patient TEXT CHECK (mood_patient IN ('feliz', 'calmo', 'ansioso', 'agitado', 'triste', 'neutro')),
  mood_caregiver TEXT CHECK (mood_caregiver IN ('feliz', 'cansado', 'estressado', 'triste', 'esperancoso', 'neutro')),
  notes TEXT,
  events TEXT[], -- Eventos importantes do dia
  sleep_hours_patient INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(patient_id, caregiver_id, date)
);

-- ============================================
-- TABELA DE ATIVIDADES E JOGOS
-- ============================================
CREATE TABLE activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('jogo_memoria', 'cores', 'palavras', 'musicas', 'respiracao')) NOT NULL,
  score INTEGER,
  completed BOOLEAN DEFAULT false,
  duration_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- TABELA DE CONFIGURAÇÕES DO PACIENTE
-- ============================================
CREATE TABLE patient_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE UNIQUE NOT NULL,
  font_size TEXT CHECK (font_size IN ('normal', 'grande', 'extra_grande')) DEFAULT 'grande',
  high_contrast BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  voice_enabled BOOLEAN DEFAULT false,
  ai_personality TEXT DEFAULT 'carinhoso', -- 'carinhoso', 'animado', 'calmo'
  reminder_frequency TEXT CHECK (reminder_frequency IN ('pouco', 'medio', 'muito')) DEFAULT 'medio',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX idx_patients_caregiver ON patients(caregiver_id);
CREATE INDEX idx_relations_patient ON patient_caregiver_relations(patient_id);
CREATE INDEX idx_relations_caregiver ON patient_caregiver_relations(caregiver_id);
CREATE INDEX idx_memories_patient ON memories(patient_id);
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_routines_patient ON routines(patient_id);
CREATE INDEX idx_journal_patient ON caregiver_journal(patient_id);
CREATE INDEX idx_journal_caregiver ON caregiver_journal(caregiver_id);

-- ============================================
-- TRIGGER PARA ATUALIZAR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_settings_updated_at BEFORE UPDATE ON patient_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_caregiver_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregiver_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_settings ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies para patients (cuidadores podem ver seus pacientes)
CREATE POLICY "Cuidadores podem ver seus pacientes"
  ON patients FOR SELECT
  USING (
    auth.uid() = caregiver_id OR
    auth.uid() IN (
      SELECT caregiver_id FROM patient_caregiver_relations 
      WHERE patient_id = patients.id
    )
  );

CREATE POLICY "Cuidadores podem inserir seus pacientes"
  ON patients FOR INSERT
  WITH CHECK (auth.uid() = caregiver_id);

CREATE POLICY "Cuidadores podem atualizar seus pacientes"
  ON patients FOR UPDATE
  USING (
    auth.uid() = caregiver_id OR
    auth.uid() IN (
      SELECT caregiver_id FROM patient_caregiver_relations 
      WHERE patient_id = patients.id
    )
  );

-- Policies para patient_caregiver_relations
CREATE POLICY "Cuidadores podem ver relações"
  ON patient_caregiver_relations FOR SELECT
  USING (auth.uid() = caregiver_id);

CREATE POLICY "Cuidadores podem criar relações"
  ON patient_caregiver_relations FOR INSERT
  WITH CHECK (auth.uid() = caregiver_id);

-- Policies para memories
CREATE POLICY "Cuidadores podem ver memórias dos pacientes"
  ON memories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = memories.patient_id 
      AND (patients.caregiver_id = auth.uid() OR EXISTS (
        SELECT 1 FROM patient_caregiver_relations 
        WHERE patient_id = patients.id AND caregiver_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Cuidadores podem criar memórias"
  ON memories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = memories.patient_id 
      AND patients.caregiver_id = auth.uid()
    )
  );

-- Policies para conversations e messages
CREATE POLICY "Usuários podem ver suas conversas"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar conversas"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver mensagens das suas conversas"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem criar mensagens"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND conversations.user_id = auth.uid()
    )
  );

-- Policies para routines
CREATE POLICY "Cuidadores podem ver rotinas dos pacientes"
  ON routines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = routines.patient_id 
      AND patients.caregiver_id = auth.uid()
    )
  );

CREATE POLICY "Cuidadores podem criar rotinas"
  ON routines FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = routines.patient_id 
      AND patients.caregiver_id = auth.uid()
    )
  );

-- Policies para caregiver_journal
CREATE POLICY "Cuidadores podem ver seu diário"
  ON caregiver_journal FOR SELECT
  USING (auth.uid() = caregiver_id);

CREATE POLICY "Cuidadores podem criar entradas no diário"
  ON caregiver_journal FOR INSERT
  WITH CHECK (auth.uid() = caregiver_id);

-- Policies para activities
CREATE POLICY "Cuidadores podem ver atividades dos pacientes"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = activities.patient_id 
      AND patients.caregiver_id = auth.uid()
    )
  );

CREATE POLICY "Sistema pode criar atividades"
  ON activities FOR INSERT
  WITH CHECK (true);

-- Policies para patient_settings
CREATE POLICY "Cuidadores podem ver configurações dos pacientes"
  ON patient_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = patient_settings.patient_id 
      AND patients.caregiver_id = auth.uid()
    )
  );

CREATE POLICY "Cuidadores podem atualizar configurações"
  ON patient_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM patients 
      WHERE patients.id = patient_settings.patient_id 
      AND patients.caregiver_id = auth.uid()
    )
  );

-- ============================================
-- FUNÇÃO PARA CRIAR CONFIGURAÇÕES PADRÃO
-- ============================================
CREATE OR REPLACE FUNCTION create_default_patient_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO patient_settings (patient_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_patient_settings_on_create
  AFTER INSERT ON patients
  FOR EACH ROW
  EXECUTE FUNCTION create_default_patient_settings();

-- ============================================
-- DADOS INICIAIS (OPCIONAL)
-- ============================================
-- Tipos de relacionamento pré-definidos
COMMENT ON COLUMN patient_caregiver_relations.relationship_type IS 
  'Opções: pai, mae, filho, filha, conjuge, profissional, outro';
