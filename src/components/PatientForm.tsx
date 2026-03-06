'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Patient, PatientCaregiverRelation, RELATIONSHIP_LABELS, RelationshipType } from '@/types';
import { useMockAuth } from '@/hooks/useMockAuth';

interface PatientFormProps {
  onSubmit: (data: { patient: Partial<Patient>; relation: Partial<PatientCaregiverRelation> }) => Promise<void>;
  onCancel: () => void;
}

export default function PatientForm({ onSubmit, onCancel }: PatientFormProps) {
  const { user } = useMockAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '' as 'masculino' | 'feminino' | 'outro',
    stage: '' as 'leve' | 'moderado' | 'grave' | 'nao_diagnosticado',
    diagnosisDate: '',
    medicalInfo: '',
    relationship: '' as RelationshipType,
    relationshipOther: '',
    isPrimary: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const patientData: Partial<Patient> = {
      name: formData.name,
      birth_date: formData.birthDate || undefined,
      gender: formData.gender || undefined,
      stage: formData.stage || 'nao_diagnosticado',
      diagnosis_date: formData.diagnosisDate || undefined,
      medical_info: formData.medicalInfo || undefined,
      caregiver_id: user?.id || 'mock-user-1',
    };

    const relationData: Partial<PatientCaregiverRelation> = {
      caregiver_id: user?.id || 'mock-user-1',
      relationship_type: formData.relationship,
      relationship_other: formData.relationship === 'outro' ? formData.relationshipOther : undefined,
      is_primary: formData.isPrimary,
    };

    await onSubmit({ patient: patientData, relation: relationData });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações do Paciente */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Informações do Paciente
        </h3>

        <div className="space-y-4">
          <Input
            label="Nome Completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nome do paciente"
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Data de Nascimento"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            />

            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Gênero
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600"
              >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                Estágio do Alzheimer
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600"
              >
                <option value="">Selecione</option>
                <option value="leve">Leve</option>
                <option value="moderado">Moderado</option>
                <option value="grave">Grave</option>
                <option value="nao_diagnosticado">Não Diagnosticado</option>
              </select>
            </div>

            <Input
              label="Data do Diagnóstico"
              type="date"
              value={formData.diagnosisDate}
              onChange={(e) => setFormData({ ...formData, diagnosisDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Informações Médicas Importantes
            </label>
            <textarea
              value={formData.medicalInfo}
              onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
              placeholder="Condições, medicamentos, alergias..."
              rows={3}
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Relacionamento */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Seu Relacionamento
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">
              Grau de Parentesco
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value as RelationshipType })}
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600"
              required
            >
              <option value="">Selecione</option>
              {Object.entries(RELATIONSHIP_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {formData.relationship === 'outro' && (
            <Input
              label="Especifique o Parentesco"
              value={formData.relationshipOther}
              onChange={(e) => setFormData({ ...formData, relationshipOther: e.target.value })}
              placeholder="Ex: Amigo da família, Vizinho..."
            />
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPrimary"
              checked={formData.isPrimary}
              onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
              className="w-6 h-6 text-blue-600 rounded focus:ring-4 focus:ring-blue-500"
            />
            <label htmlFor="isPrimary" className="text-lg text-gray-700">
              Sou o cuidador principal deste paciente
            </label>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-4 pt-4 border-t">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          size="large"
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="large"
          className="flex-1"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Paciente'}
        </Button>
      </div>
    </form>
  );
}
