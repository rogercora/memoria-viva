'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Profile, Patient, PatientCaregiverRelation } from '@/types';

// Dados mockados para demonstração
const MOCK_USER: Profile = {
  id: 'mock-user-1',
  email: 'cuidador@exemplo.com',
  full_name: 'Maria Silva',
  role: 'cuidador',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

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

interface MockAuthContextType {
  user: Profile | null;
  loading: boolean;
  isMock: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  patients: Patient[];
  relations: PatientCaregiverRelation[];
}

const MockAuthContext = createContext<MockAuthContextType | undefined>(undefined);

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);
  const [relations] = useState<PatientCaregiverRelation[]>(MOCK_RELATIONS);

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      // Verificar se já tem usuário salvo no sessionStorage
      const savedUser = sessionStorage.getItem('mock-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Login mockado - aceita qualquer email/senha
    setUser(MOCK_USER);
    sessionStorage.setItem('mock-user', JSON.stringify(MOCK_USER));
    
    setLoading(false);
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Cadastro mockado - cria usuário temporário
    const newUser: Profile = {
      ...MOCK_USER,
      email,
      full_name: fullName,
    };
    
    setUser(newUser);
    sessionStorage.setItem('mock-user', JSON.stringify(newUser));
    
    setLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    sessionStorage.removeItem('mock-user');
  };

  return (
    <MockAuthContext.Provider
      value={{
        user,
        loading,
        isMock: true,
        signIn,
        signUp,
        signOut,
        patients,
        relations,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    return {
      user: null,
      loading: false,
      isMock: true,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => {},
      patients: [],
      relations: [],
    };
  }
  return context;
}
