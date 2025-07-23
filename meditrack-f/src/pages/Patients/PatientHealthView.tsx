import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Thermometer,
  Activity,
  Droplets,
  Brain,
  User,
  AlertTriangle,
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { usePatients } from '../../hooks/usePatients';
import { useVitalSigns } from '../../hooks/useVitalSigns';
import { useConsultations } from '../../hooks/useConsultations';

const PatientHealthView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients = [] } = usePatients();
  const { vitalSigns = [] } = useVitalSigns();
  const { consultations = [] } = useConsultations();

  if (!id) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Identifiant du patient manquant dans l'URL.</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  const numericId = parseInt(id);
  const patient = patients.find(p => p.id === numericId);
  const patientVitalSigns = vitalSigns.filter(v => v.patient_id === numericId);
  const patientConsultations = consultations.filter(c => c.patient_id === numericId);

  const latestVitalSigns = patientVitalSigns[patientVitalSigns.length - 1];

  if (!patient) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Patient non trouvé</p>
        <Button onClick={() => navigate('/infirmier/dashboard')} className="mt-4">
          Retour au tableau de bord
        </Button>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Infos patient */}
      <Card>
        <div className="flex items-center space-x-4">
          <User className="w-8 h-8 text-gray-500" />
          <div>
            <p className="text-xl font-bold text-gray-900">{patient.first_name} {patient.last_name}</p>
            <p className="text-gray-500">Âge : {calculateAge(patient.date_of_birth)} ans</p>
            <p className="text-gray-500">Statut : {patient.status}</p>
          </div>
        </div>
      </Card>

      {/* Signes vitaux */}
      {latestVitalSigns && (
        <Card title="Derniers signes vitaux">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Thermometer className="w-6 h-6 mx-auto text-blue-500" />
              <p className="text-gray-700">Température</p>
              <p className="font-bold">{latestVitalSigns.temperature} °C</p>
            </div>
            <div className="text-center">
              <Activity className="w-6 h-6 mx-auto text-red-500" />
              <p className="text-gray-700">Rythme cardiaque</p>
              <p className="font-bold">{latestVitalSigns.heart_rate} bpm</p>
            </div>
            <div className="text-center">
              <Droplets className="w-6 h-6 mx-auto text-purple-500" />
              <p className="text-gray-700">Tension</p>
              <p className="font-bold">{latestVitalSigns.blood_pressure}</p>
            </div>
            <div className="text-center">
              <Heart className="w-6 h-6 mx-auto text-pink-500" />
              <p className="text-gray-700">Saturation O₂</p>
              <p className="font-bold">{latestVitalSigns.oxygen_saturation} %</p>
            </div>
            <div className="text-center">
              <Brain className="w-6 h-6 mx-auto text-yellow-500" />
              <p className="text-gray-700">Conscience</p>
              <p className="font-bold">{latestVitalSigns.consciousness}</p>
            </div>
            <div className="text-center">
              <Eye className="w-6 h-6 mx-auto text-indigo-500" />
              <p className="text-gray-700">Mobilité</p>
              <p className="font-bold">{latestVitalSigns.mobility}</p>
            </div>
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto text-teal-500" />
              <p className="text-gray-700">Nutrition</p>
              <p className="font-bold">{latestVitalSigns.nutrition}</p>
            </div>
            {latestVitalSigns.notes && (
              <div className="text-center col-span-2">
                <AlertTriangle className="w-6 h-6 mx-auto text-red-500" />
                <p className="text-gray-700">Notes</p>
                <p className="font-bold">{latestVitalSigns.notes}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Consultations */}
      <Card title="Historique des consultations">
        {patientConsultations.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune consultation enregistrée</p>
        ) : (
          <ul className="space-y-2">
            {patientConsultations.map((consultation) => (
              <li key={consultation.id} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded">
                <div>
                  <p className="text-gray-900 font-medium">{consultation.diagnosis}</p>
                  <p className="text-gray-500 text-sm">{consultation.recommendations}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{consultation.consultation_date}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex justify-start">
        <Button icon={ArrowLeft} variant="secondary" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </div>
    </div>
  );
};

export default PatientHealthView;
