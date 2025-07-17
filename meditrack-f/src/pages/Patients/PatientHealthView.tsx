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
  Pill,
  FileText,
  TrendingUp,
  Eye
} from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { useData } from '../../contexts/DataContext';

const PatientHealthView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, vitalSigns, consultations } = useData();

  const patient = patients.find(p => p.id === id);
  const patientVitalSigns = vitalSigns.filter(v => v.patientId === id);
  const patientConsultations = consultations.filter(c => c.patientId === id);
  const latestVitalSigns = patientVitalSigns[patientVitalSigns.length - 1];

  if (!patient) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Patient non trouvé</p>
          <Button onClick={() => navigate('/infirmier/dashboard')} className="mt-4">
            Retour au tableau de bord
          </Button>
        </div>
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

  const getVitalSignStatus = (value: number, type: string) => {
    switch (type) {
      case 'temperature':
        if (value < 36.1 || value > 37.8) return 'danger';
        if (value < 36.5 || value > 37.5) return 'warning';
        return 'normal';
      case 'heartRate':
        if (value < 60 || value > 100) return 'danger';
        if (value < 70 || value > 90) return 'warning';
        return 'normal';
      case 'oxygenSaturation':
        if (value < 95) return 'danger';
        if (value < 98) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'danger':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      case 'normal':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="secondary" 
            icon={ArrowLeft} 
            onClick={() => navigate('/infirmier/patients')}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              État de santé - {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-gray-600 mt-1">
              Chambre {patient.room} • {calculateAge(patient.dateOfBirth)} ans • {patient.gender === 'M' ? 'Masculin' : 'Féminin'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="primary" icon={Heart}>
            Nouveau suivi
          </Button>
          <Button variant="secondary" icon={FileText}>
            Rapport
          </Button>
        </div>
      </div>

      {/* Patient Info Card */}
      <Card title="Informations patient">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
              <p className="text-sm text-gray-500">{patient.email}</p>
              <p className="text-sm text-gray-500">{patient.phone}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Groupe sanguin:</span>
              <span className="text-sm font-medium text-gray-900">{patient.bloodType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Statut:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                patient.status === 'aigu' ? 'bg-red-100 text-red-800' :
                patient.status === 'suivi-chronique' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {patient.status === 'aigu' ? 'Aigu' : 
                 patient.status === 'suivi-chronique' ? 'Suivi chronique' : 'Terminé'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Allergies:</span>
              <div className="mt-1">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((allergy, index) => (
                    <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                      {allergy}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Aucune allergie connue</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Current Vital Signs */}
      {latestVitalSigns && (
        <Card title="Constantes vitales actuelles">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                getStatusColor(getVitalSignStatus(latestVitalSigns.temperature, 'temperature'))
              }`}>
                <Thermometer className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{latestVitalSigns.temperature}°C</p>
              <p className="text-sm text-gray-600">Température</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{latestVitalSigns.bloodPressure}</p>
              <p className="text-sm text-gray-600">Tension artérielle</p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                getStatusColor(getVitalSignStatus(latestVitalSigns.heartRate, 'heartRate'))
              }`}>
                <Heart className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{latestVitalSigns.heartRate} bpm</p>
              <p className="text-sm text-gray-600">Fréquence cardiaque</p>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                getStatusColor(getVitalSignStatus(latestVitalSigns.oxygenSaturation, 'oxygenSaturation'))
              }`}>
                <Droplets className="w-8 h-8" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{latestVitalSigns.oxygenSaturation}%</p>
              <p className="text-sm text-gray-600">SpO₂</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">État de conscience</span>
                </div>
                <p className="text-gray-700">{latestVitalSigns.consciousness}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Mobilité</span>
                </div>
                <p className="text-gray-700">{latestVitalSigns.mobility}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Droplets className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Nutrition</span>
                </div>
                <p className="text-gray-700">{latestVitalSigns.nutrition}</p>
              </div>
            </div>
          </div>

          {latestVitalSigns.anomalyDetected && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">Anomalie détectée</span>
              </div>
              <p className="text-red-700 mt-1">{latestVitalSigns.notes}</p>
            </div>
          )}

          <div className="mt-4 text-right">
            <p className="text-sm text-gray-500">
              Dernière mise à jour: {new Date(latestVitalSigns.date).toLocaleString('fr-FR')}
            </p>
          </div>
        </Card>
      )}

      {/* Medications and Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Medications */}
        <Card title="Médicaments administrés">
          {latestVitalSigns?.medicationsAdministered.length > 0 ? (
            <div className="space-y-3">
              {latestVitalSigns.medicationsAdministered.map((medication, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <Pill className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900">{medication}</span>
                  </div>
                  <span className="text-sm text-green-600">Administré</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun médicament administré aujourd'hui</p>
            </div>
          )}
        </Card>

        {/* Medical History */}
        <Card title="Antécédents médicaux">
          {patient.medicalHistory.length > 0 ? (
            <div className="space-y-3">
              {patient.medicalHistory.map((condition, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-gray-900">{condition}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun antécédent médical connu</p>
            </div>
          )}
        </Card>
      </div>

      {/* Vital Signs History */}
      <Card title="Historique des constantes vitales">
        {patientVitalSigns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Température</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tension</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Pouls</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">SpO₂</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Notes</th>
                </tr>
              </thead>
              <tbody>
                {patientVitalSigns.slice().reverse().map((vital) => (
                  <tr key={vital.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(vital.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        getStatusColor(getVitalSignStatus(vital.temperature, 'temperature'))
                      }`}>
                        {vital.temperature}°C
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{vital.bloodPressure}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        getStatusColor(getVitalSignStatus(vital.heartRate, 'heartRate'))
                      }`}>
                        {vital.heartRate} bpm
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        getStatusColor(getVitalSignStatus(vital.oxygenSaturation, 'oxygenSaturation'))
                      }`}>
                        {vital.oxygenSaturation}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 max-w-xs truncate">
                      {vital.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun historique de constantes vitales</p>
          </div>
        )}
      </Card>

      {/* Recent Consultations */}
      <Card title="Consultations récentes">
        {patientConsultations.length > 0 ? (
          <div className="space-y-4">
            {patientConsultations.slice().reverse().map((consultation) => (
              <div key={consultation.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {new Date(consultation.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <Button size="sm" variant="secondary" icon={Eye}>
                    Détails
                  </Button>
                </div>
                <p className="text-gray-700 mb-2"><strong>Diagnostic:</strong> {consultation.diagnosis}</p>
                <p className="text-gray-600 text-sm">{consultation.symptoms}</p>
                {consultation.treatment && (
                  <p className="text-gray-600 text-sm mt-2"><strong>Traitement:</strong> {consultation.treatment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune consultation récente</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientHealthView;