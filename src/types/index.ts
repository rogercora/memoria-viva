/**
 * Tipos e Interfaces do Projeto Memória Viva
 */

// ============================================
// USUÁRIOS E PERFIS
// ============================================
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'cuidador' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// PACIENTES
// ============================================
export interface Patient {
  id: string;
  caregiver_id: string;
  name: string;
  birth_date?: string;
  gender?: 'masculino' | 'feminino' | 'outro';
  diagnosis_date?: string;
  stage?: 'leve' | 'moderado' | 'grave' | 'nao_diagnosticado';
  photo_url?: string;
  medical_info?: string;
  medications?: string[];
  allergies?: string[];
  created_at: string;
  updated_at: string;
}

// ============================================
// RELACIONAMENTOS
// ============================================
export type RelationshipType = 
  | 'pai'
  | 'mae'
  | 'filho'
  | 'filha'
  | 'conjuge'
  | 'neto'
  | 'neta'
  | 'irmao'
  | 'irma'
  | 'profissional'
  | 'outro';

export interface PatientCaregiverRelation {
  id: string;
  patient_id: string;
  caregiver_id: string;
  relationship_type: RelationshipType;
  relationship_other?: string;
  is_primary: boolean;
  created_at: string;
}

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  pai: 'Pai',
  mae: 'Mãe',
  filho: 'Filho',
  filha: 'Filha',
  conjuge: 'Cônjuge',
  neto: 'Neto',
  neta: 'Neta',
  irmao: 'Irmão',
  irma: 'Irmã',
  profissional: 'Cuidador Profissional',
  outro: 'Outro',
};

// ============================================
// MEMÓRIAS
// ============================================
export interface Memory {
  id: string;
  patient_id: string;
  title: string;
  description?: string;
  image_url: string;
  date_taken?: string;
  people_tags?: string[];
  location?: string;
  story?: string;
  is_favorite: boolean;
  created_at: string;
}

// ============================================
// CONVERSAS E MENSAGENS
// ============================================
export type ConversationType = 'paciente' | 'cuidador';

export interface Conversation {
  id: string;
  user_id: string;
  patient_id?: string;
  type: ConversationType;
  title?: string;
  is_incognito: boolean;
  created_at: string;
  last_message_at?: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

// ============================================
// ROTINA
// ============================================
export interface Routine {
  id: string;
  patient_id: string;
  title: string;
  description?: string;
  time: string; // HH:mm
  days_of_week: number[]; // 0-6 (Dom-Sab)
  is_active: boolean;
  sound_enabled: boolean;
  created_by?: string;
  created_at: string;
}

export const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// ============================================
// DIÁRIO DO CUIDADOR
// ============================================
export type MoodType = 
  | 'feliz'
  | 'calmo'
  | 'ansioso'
  | 'agitado'
  | 'triste'
  | 'neutro'
  | 'cansado'
  | 'estressado'
  | 'esperancoso';

export interface CaregiverJournal {
  id: string;
  patient_id: string;
  caregiver_id: string;
  date: string;
  mood_patient?: MoodType;
  mood_caregiver?: MoodType;
  notes?: string;
  events?: string[];
  sleep_hours_patient?: number;
  created_at: string;
}

export const MOOD_LABELS: Record<MoodType, string> = {
  feliz: 'Feliz',
  calmo: 'Calmo',
  ansioso: 'Ansioso',
  agitado: 'Agitado',
  triste: 'Triste',
  neutro: 'Neutro',
  cansado: 'Cansado',
  estressado: 'Estressado',
  esperancoso: 'Esperançoso',
};

// ============================================
// ATIVIDADES
// ============================================
export type ActivityType = 
  | 'jogo_memoria'
  | 'cores'
  | 'palavras'
  | 'musicas'
  | 'respiracao';

export interface Activity {
  id: string;
  patient_id: string;
  type: ActivityType;
  score?: number;
  completed: boolean;
  duration_seconds?: number;
  notes?: string;
  created_at: string;
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  jogo_memoria: 'Jogo da Memória',
  cores: 'Jogo das Cores',
  palavras: 'Palavras Cruzadas',
  musicas: 'Música e Nostalgia',
  respiracao: 'Exercício de Respiração',
};

// ============================================
// CONFIGURAÇÕES DO PACIENTE
// ============================================
export type FontSize = 'normal' | 'grande' | 'extra_grande';
export type AIPersonality = 'carinhoso' | 'animado' | 'calmo';
export type ReminderFrequency = 'pouco' | 'medio' | 'muito';

export interface PatientSettings {
  id: string;
  patient_id: string;
  font_size: FontSize;
  high_contrast: boolean;
  sound_enabled: boolean;
  voice_enabled: boolean;
  ai_personality: AIPersonality;
  reminder_frequency: ReminderFrequency;
  created_at: string;
  updated_at: string;
}

// ============================================
// IA
// ============================================
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIConfig {
  model: string;
  temperature: number;
  max_tokens: number;
  system_prompt: string;
}

// ============================================
// COMPONENTES DE UI
// ============================================
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'small' | 'medium' | 'large';
}
