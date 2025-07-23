import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  AlertTriangle,
  Clock,
  Thermometer,
  Activity,
  Heart,
  Droplets,
  User,
  Pill,
  FileText,
  CheckCircle,
  Edit
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useAuth } from '../../hooks/useAuth';
import { usePatients } from '../../hooks/usePatients';
import { useVitalSigns } from '../../hooks/useVitalSigns';
import { VitalSigns } from '../../types';

interface VitalSignWithDetails extends VitalSigns {
  created_at: string;
  medications_administered: string[];
  mobility: string;
  consciousness: string;
  nutrition: string;
  notes?: string;
  anomaly_detected: boolean;
}

interface FollowUpData {
  date: string;
  time: string;
  temperature: string;
  blood_pressure: string;
  heart_rate: string;
  oxygen_saturation: string;
  mobility: string;
  consciousness: string;
  nutrition: string;
  medications_administered: string[];
  comments: string;
  anomaly_detected: boolean;
}

const NurseFollowUp: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients = [] } = usePatients();
  const { vitalSigns = [] } = useVitalSigns();

  if (!id) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Identifiant du patient manquant.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Retour</Button>
      </div>
    );
  }

  const numericId = parseInt(id);
  const patient = patients.find(p => p.id === numericId);
  const patientSigns = vitalSigns.filter(v => v.patient_id === numericId);
  const lastSign = patientSigns[patientSigns.length - 1];

  const [form, setForm] = useState<FollowUpData>({
    date: '',
    time: '',
    temperature: '',
    blood_pressure: '',
    heart_rate: '',
    oxygen_saturation: '',
    mobility: '',
    consciousness: '',
    nutrition: '',
    medications_administered: [],
    comments: '',
    anomaly_detected: false
  });

  useEffect(() => {
    if (lastSign) {
      setForm({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        temperature: String(lastSign.temperature),
        blood_pressure: lastSign.blood_pressure,
        heart_rate: String(lastSign.heart_rate),
        oxygen_saturation: String(lastSign.oxygen_saturation),
        mobility: lastSign.mobility,
        consciousness: lastSign.consciousness,
        nutrition: lastSign.nutrition,
        medications_administered: lastSign.medications_administered || [],
        comments: lastSign.notes || '',
        anomaly_detected: lastSign.anomaly_detected
      });
    }
  }, [lastSign]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    // Appel à l'API à faire ici
    console.log('Données de suivi envoyées :', form);
  };

  if (!patient) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Patient introuvable</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Retour</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Suivi infirmier - {patient.first_name} {patient.last_name}</h2>
        <Button icon={ArrowLeft} variant="secondary" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </div>

      <Card title="Constantes vitales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="temperature" label="Température (°C)" value={form.temperature} onChange={handleChange} />
          <Input name="heart_rate" label="Rythme cardiaque (bpm)" value={form.heart_rate} onChange={handleChange} />
          <Input name="blood_pressure" label="Tension artérielle" value={form.blood_pressure} onChange={handleChange} />
          <Input name="oxygen_saturation" label="Saturation O₂ (%)" value={form.oxygen_saturation} onChange={handleChange} />
        </div>
      </Card>

      <Card title="Observations infirmières">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="consciousness" label="Conscience" value={form.consciousness} onChange={handleChange} />
          <Input name="mobility" label="Mobilité" value={form.mobility} onChange={handleChange} />
          <Input name="nutrition" label="Nutrition" value={form.nutrition} onChange={handleChange} />
        </div>
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Commentaires</label>
          <textarea
            name="comments"
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-2"
            value={form.comments}
            onChange={handleChange}
          />
        </div>
      </Card>

      <Card title="Détection d'anomalie">
        <label className="inline-flex items-center mt-2">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-red-600"
            name="anomaly_detected"
            checked={form.anomaly_detected}
            onChange={handleChange}
          />
          <span className="ml-2 text-gray-700">Anomalie détectée</span>
        </label>
      </Card>

      <div className="flex justify-end">
        <Button icon={Save} variant="primary" onClick={handleSubmit}>
          Enregistrer le suivi
        </Button>
      </div>
    </div>
  );
};

export default NurseFollowUp;
