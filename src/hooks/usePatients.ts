'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Patient, PatientCaregiverRelation } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Verificar se está usando Supabase real
const isSupabaseConfigured = supabaseUrl && 
                              !supabaseUrl.includes('placeholder') && 
                              supabaseAnonKey && 
                              !supabaseAnonKey.includes('placeholder');

const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Dados mockados para fallback
const MOCK_PATIENTS: Patient[] = [
  {
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
  {
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
];

const MOCK_RELATIONS: PatientCaregiverRelation[] = [
  {
    id: 'mock-relation-1',
    patient_id: 'mock-patient-1',
    caregiver_id: 'mock-user-1',
    relationship_type: 'conjuge',
    is_primary: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-relation-2',
    patient_id: 'mock-patient-2',
    caregiver_id: 'mock-user-1',
    relationship_type: 'mae',
    is_primary: true,
    created_at: new Date().toISOString(),
  },
];

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [relations, setRelations] = useState<PatientCaregiverRelation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isMock, setIsMock] = useState(!isSupabaseConfigured);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      
      // Se não tem Supabase configurado, usar dados mockados
      if (!supabase || !isSupabaseConfigured) {
        setIsMock(true);
        setPatients(MOCK_PATIENTS);
        setRelations(MOCK_RELATIONS);
        setLoading(false);
        return;
      }

      // Buscar pacientes do Supabase
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .order('name');

      if (patientsError) throw patientsError;

      // Buscar relacionamentos
      const { data: relationsData, error: relationsError } = await supabase
        .from('patient_caregiver_relations')
        .select('*');

      if (relationsError) throw relationsError;

      setIsMock(false);
      setPatients(patientsData || []);
      setRelations(relationsData || []);
    } catch (err) {
      console.error('Erro ao buscar pacientes:', err);
      setError(err as Error);
      // Fallback para dados mockados em caso de erro
      setPatients(MOCK_PATIENTS);
      setRelations(MOCK_RELATIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const addPatient = async (patientData: Partial<Patient>, relationship: Partial<PatientCaregiverRelation>) => {
    // Se estiver em modo mock, apenas simular adição
    if (!supabase || !isSupabaseConfigured) {
      const newPatient: Patient = {
        id: `mock-patient-${Date.now()}`,
        caregiver_id: 'mock-user-1',
        name: patientData.name || 'Paciente',
        birth_date: patientData.birth_date,
        gender: patientData.gender,
        stage: patientData.stage,
        diagnosis_date: patientData.diagnosis_date,
        medical_info: patientData.medical_info,
        medications: patientData.medications,
        allergies: patientData.allergies,
        photo_url: patientData.photo_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Patient;

      setPatients(prev => [...prev, newPatient]);
      return { success: true, patient: newPatient };
    }

    // Usar Supabase real
    try {
      const { data: newPatient, error: patientError } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single();

      if (patientError) throw patientError;

      const { error: relationError } = await supabase
        .from('patient_caregiver_relations')
        .insert({
          patient_id: newPatient.id,
          caregiver_id: relationship.caregiver_id,
          relationship_type: relationship.relationship_type,
          relationship_other: relationship.relationship_other,
          is_primary: relationship.is_primary ?? true,
        });

      if (relationError) throw relationError;

      await fetchPatients();
      return { success: true, patient: newPatient };
    } catch (err) {
      console.error('Erro ao adicionar paciente:', err);
      return { success: false, error: err as Error };
    }
  };

  const updatePatient = async (patientId: string, updates: Partial<Patient>) => {
    if (!supabase || !isSupabaseConfigured) {
      setPatients(prev =>
        prev.map(p => (p.id === patientId ? { ...p, ...updates } : p))
      );
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', patientId);

      if (error) throw error;

      await fetchPatients();
      return { success: true };
    } catch (err) {
      return { success: false, error: err as Error };
    }
  };

  const deletePatient = async (patientId: string) => {
    if (!supabase || !isSupabaseConfigured) {
      setPatients(prev => prev.filter(p => p.id !== patientId));
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);

      if (error) throw error;

      await fetchPatients();
      return { success: true };
    } catch (err) {
      return { success: false, error: err as Error };
    }
  };

  const getPatientRelation = (patientId: string) => {
    return relations.find(r => r.patient_id === patientId);
  };

  return {
    patients,
    relations,
    loading,
    error,
    isMock,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientRelation,
    refresh: fetchPatients,
  };
}
