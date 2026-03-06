/**
 * Tipos gerados automaticamente do Supabase
 * Execute `npx supabase gen types typescript --project-id YOUR_PROJECT_ID` para atualizar
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'cuidador' | 'admin';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'cuidador' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'cuidador' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          caregiver_id: string;
          name: string;
          birth_date: string | null;
          gender: 'masculino' | 'feminino' | 'outro' | null;
          diagnosis_date: string | null;
          stage: 'leve' | 'moderado' | 'grave' | 'nao_diagnosticado' | null;
          photo_url: string | null;
          medical_info: string | null;
          medications: string[] | null;
          allergies: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          caregiver_id: string;
          name: string;
          birth_date?: string | null;
          gender?: 'masculino' | 'feminino' | 'outro' | null;
          diagnosis_date?: string | null;
          stage?: 'leve' | 'moderado' | 'grave' | 'nao_diagnosticado' | null;
          photo_url?: string | null;
          medical_info?: string | null;
          medications?: string[] | null;
          allergies?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          caregiver_id?: string;
          name?: string;
          birth_date?: string | null;
          gender?: 'masculino' | 'feminino' | 'outro' | null;
          diagnosis_date?: string | null;
          stage?: 'leve' | 'moderado' | 'grave' | 'nao_diagnosticado' | null;
          photo_url?: string | null;
          medical_info?: string | null;
          medications?: string[] | null;
          allergies?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      patient_caregiver_relations: {
        Row: {
          id: string;
          patient_id: string;
          caregiver_id: string;
          relationship_type: string;
          relationship_other: string | null;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          caregiver_id: string;
          relationship_type: string;
          relationship_other?: string | null;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          caregiver_id?: string;
          relationship_type?: string;
          relationship_other?: string | null;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      memories: {
        Row: {
          id: string;
          patient_id: string;
          title: string;
          description: string | null;
          image_url: string;
          date_taken: string | null;
          people_tags: string[] | null;
          location: string | null;
          story: string | null;
          is_favorite: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          title: string;
          description?: string | null;
          image_url: string;
          date_taken?: string | null;
          people_tags?: string[] | null;
          location?: string | null;
          story?: string | null;
          is_favorite?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          date_taken?: string | null;
          people_tags?: string[] | null;
          location?: string | null;
          story?: string | null;
          is_favorite?: boolean;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          patient_id: string | null;
          type: 'paciente' | 'cuidador';
          title: string | null;
          is_incognito: boolean;
          created_at: string;
          last_message_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          patient_id?: string | null;
          type: 'paciente' | 'cuidador';
          title?: string | null;
          is_incognito?: boolean;
          created_at?: string;
          last_message_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          patient_id?: string | null;
          type?: 'paciente' | 'cuidador';
          title?: string | null;
          is_incognito?: boolean;
          created_at?: string;
          last_message_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          created_at?: string;
        };
      };
      routines: {
        Row: {
          id: string;
          patient_id: string;
          title: string;
          description: string | null;
          time: string;
          days_of_week: number[] | null;
          is_active: boolean;
          sound_enabled: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          title: string;
          description?: string | null;
          time: string;
          days_of_week?: number[] | null;
          is_active?: boolean;
          sound_enabled?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          title?: string;
          description?: string | null;
          time?: string;
          days_of_week?: number[] | null;
          is_active?: boolean;
          sound_enabled?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
      };
      caregiver_journal: {
        Row: {
          id: string;
          patient_id: string;
          caregiver_id: string;
          date: string;
          mood_patient: string | null;
          mood_caregiver: string | null;
          notes: string | null;
          events: string[] | null;
          sleep_hours_patient: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          caregiver_id: string;
          date: string;
          mood_patient?: string | null;
          mood_caregiver?: string | null;
          notes?: string | null;
          events?: string[] | null;
          sleep_hours_patient?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          caregiver_id?: string;
          date?: string;
          mood_patient?: string | null;
          mood_caregiver?: string | null;
          notes?: string | null;
          events?: string[] | null;
          sleep_hours_patient?: number | null;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          patient_id: string;
          type: string;
          score: number | null;
          completed: boolean;
          duration_seconds: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          type: string;
          score?: number | null;
          completed?: boolean;
          duration_seconds?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          type?: string;
          score?: number | null;
          completed?: boolean;
          duration_seconds?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      patient_settings: {
        Row: {
          id: string;
          patient_id: string;
          font_size: 'normal' | 'grande' | 'extra_grande';
          high_contrast: boolean;
          sound_enabled: boolean;
          voice_enabled: boolean;
          ai_personality: string;
          reminder_frequency: 'pouco' | 'medio' | 'muito';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          font_size?: 'normal' | 'grande' | 'extra_grande';
          high_contrast?: boolean;
          sound_enabled?: boolean;
          voice_enabled?: boolean;
          ai_personality?: string;
          reminder_frequency?: 'pouco' | 'medio' | 'muito';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          font_size?: 'normal' | 'grande' | 'extra_grande';
          high_contrast?: boolean;
          sound_enabled?: boolean;
          voice_enabled?: boolean;
          ai_personality?: string;
          reminder_frequency?: 'pouco' | 'medio' | 'muito';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
