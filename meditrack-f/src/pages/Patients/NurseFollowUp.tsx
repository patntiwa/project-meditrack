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
import { useAuth } from '../../contexts/AuthContext';
import { usePatients } from "../../hooks/usePatients";
import { useVitalSigns } from "../../hooks/useVitalSigns";
import { VitalSign } from "../../types";

// Interface étendue pour inclure toutes les propriétés nécessaires
interface VitalSignWithDetails extends VitalSign {
  created_at: string;
  medications: string[];
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
  bloodPressure: string;
  heartRate: string;
  oxygenSaturation: string;
  mobility: string;
  consciousness: string;
  nutrition: string;
  medicationsAdministered: string[];
  comments: string;
  anomalyDetected: boolean;
}

const NurseFollowUp: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients } = usePatients();
  const { vitalSigns, addVitalSigns, updateVitalSigns } = useVitalSigns();

  const [formData, setFormData] = useState<FollowUpData>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    oxygenSaturation: '',
    mobility: 'Autonome',
    consciousness: 'Alerte',
    nutrition: 'Normale',
    medicationsAdministered: [],
    comments: '',
    anomalyDetected: false
  });

  const [newMedication, setNewMedication] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingFollowUpId, setEditingFollowUpId] = useState<string | null>(null);
  const [previousFollowUps, setPreviousFollowUps] = useState<VitalSignWithDetails[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  const patient = patients.find(p => p.id === parseInt(id || "0"));
  const patientVitalSigns = vitalSigns.filter(v => v.patient_id === parseInt(id || "0")) as VitalSignWithDetails[];

  useEffect(() => {
    if (id) {
      const todayFollowUps = patientVitalSigns.filter(vital => 
        new Date(vital.created_at).toDateString() === new Date().toDateString()
      );
      setPreviousFollowUps(todayFollowUps);
    }
  }, [id, patientVitalSigns]);

  const handleInputChange = (field: keyof FollowUpData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Vérifier automatiquement les anomalies
    if (field === 'temperature' || field === 'heartRate' || field === 'oxygenSaturation') {
      checkForAnomalies(field, value as string);
    }
  };

  const checkForAnomalies = (field: string, value: string) => {
    const numValue = parseFloat(value);
    let hasAnomaly = false;

    switch (field) {
      case 'temperature':
        hasAnomaly = numValue < 36.1 || numValue > 37.8;
        break;
      case 'heartRate':
        hasAnomaly = numValue < 60 || numValue > 100;
        break;
      case 'oxygenSaturation':
        hasAnomaly = numValue < 95;
        break;
    }

    if (hasAnomaly && !formData.anomalyDetected) {
      setFormData(prev => ({ ...prev, anomalyDetected: true }));
      setShowAlert(true);
    }
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setFormData(prev => ({
        ...prev,
        medicationsAdministered: [...prev.medicationsAdministered, newMedication.trim()]
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicationsAdministered: prev.medicationsAdministered.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    // Validation des champs obligatoires
    if (!formData.temperature || !formData.bloodPressure || !formData.heartRate || !formData.oxygenSaturation) {
      alert('Veuillez remplir tous les champs obligatoires (constantes vitales)');
      return;
    }

    try {
      // Créer l'objet de suivi
      const followUpData = {
        id: editingFollowUpId ? parseInt(editingFollowUpId) : undefined,
        patient_id: parseInt(id || "0"),
        nurse_id: user?.id,
        date: `${formData.date}T${formData.time}`,
        temperature: parseFloat(formData.temperature),
        blood_pressure: formData.bloodPressure,
        heart_rate: parseInt(formData.heartRate),
        oxygen_saturation: parseInt(formData.oxygenSaturation),
        consciousness: formData.consciousness,
        mobility: formData.mobility,
        nutrition: formData.nutrition,
        medications: formData.medicationsAdministered,
        notes: formData.comments,
        anomaly_detected: formData.anomalyDetected
      };

      // Enregistrer ou modifier le suivi
      if (isEditing && editingFollowUpId) {
        await updateVitalSigns(parseInt(editingFollowUpId), followUpData);
      } else {
        await addVitalSigns(followUpData);
      }

      // Si anomalie détectée, simuler l'alerte au médecin
      if (formData.anomalyDetected) {
        alert(`Alerte envoyée au médecin responsable du patient ${patient?.firstName} ${patient?.lastName}`);
      }

      alert(isEditing ? 'Suivi modifié avec succès!' : 'Suivi enregistré avec succès!');
      navigate('/infirmier/dashboard');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde :', error);
      alert('Une erreur est survenue lors de la sauvegarde du suivi');
    }

    // Si anomalie détectée, simuler l'alerte au médecin
    if (formData.anomalyDetected) {
      alert(`Alerte envoyée au médecin responsable du patient ${patient?.firstName} ${patient?.lastName}`);
    }

    alert(isEditing ? 'Suivi modifié avec succès!' : 'Suivi enregistré avec succès!');
    navigate('/infirmier/dashboard');
  };

  const loadPreviousFollowUp = (followUp: VitalSignWithDetails) => {
    setFormData({
      date: new Date(followUp.created_at).toISOString().split('T')[0],
      time: new Date(followUp.created_at).toTimeString().slice(0, 5),
      temperature: followUp.temperature.toString(),
      bloodPressure: followUp.blood_pressure,
      heartRate: followUp.heart_rate.toString(),
      oxygenSaturation: followUp.oxygen_saturation.toString(),
      mobility: followUp.mobility,
      consciousness: followUp.consciousness,
      nutrition: followUp.nutrition,
      medicationsAdministered: followUp.medications || [],
      comments: followUp.notes || '',
      anomalyDetected: followUp.anomaly_detected
    });
    setIsEditing(true);
    setEditingFollowUpId(followUp.id);
  };

  const markAsComplete = () => {
    if (window.confirm('Marquer ce suivi comme complet? Cette action ne peut pas être annulée.')) {
      console.log('Suivi marqué comme complet');
      alert('Suivi marqué comme complet!');
      navigate('/infirmier/dashboard');
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      oxygenSaturation: '',
      mobility: 'Autonome',
      consciousness: 'Alerte',
      nutrition: 'Normale',
      medicationsAdministered: [],
      comments: '',
      anomalyDetected: false
    });
    setIsEditing(false);
    setEditingFollowUpId(null);
    setShowAlert(false);
  };

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="secondary" 
            icon={ArrowLeft} 
            onClick={() => navigate('/infirmier/dashboard')}
          >
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Modifier le suivi' : 'Nouveau suivi'} - {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-gray-600 mt-1">
              Chambre {patient.room} • {patient.gender === 'M' ? 'Masculin' : 'Féminin'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {isEditing && (
            <Button variant="secondary" onClick={resetForm}>
              Nouveau suivi
            </Button>
          )}
          <Button variant="success" icon={CheckCircle} onClick={markAsComplete}>
            Marquer complet
          </Button>
        </div>
      </div>

      {/* Alert for anomalies */}
      {showAlert && formData.anomalyDetected && (
        <Card>
          <div className="flex items-center space-x-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="font-medium text-red-900">Anomalie détectée!</h3>
              <p className="text-red-700">
                Les constantes vitales indiquent une anomalie. Une alerte sera automatiquement envoyée au médecin responsable lors de l'enregistrement.
              </p>
            </div>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => setShowAlert(false)}
            >
              Fermer
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date et heure */}
          <Card title="Date et heure de passage">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
              <Input
                label="Heure"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
          </Card>

          {/* Constantes vitales */}
          <Card title="Constantes vitales">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Température (°C)"
                  type="number"
                  step="0.1"
                  min="35"
                  max="42"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  required
                  className="pl-10"
                />
                <Thermometer className="w-5 h-5 text-gray-400 absolute left-3 top-8" />
              </div>

              <div className="relative">
                <Input
                  label="Tension artérielle"
                  placeholder="120/80"
                  value={formData.bloodPressure}
                  onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                  required
                  className="pl-10"
                />
                <Activity className="w-5 h-5 text-gray-400 absolute left-3 top-8" />
              </div>

              <div className="relative">
                <Input
                  label="Fréquence cardiaque (bpm)"
                  type="number"
                  min="40"
                  max="200"
                  value={formData.heartRate}
                  onChange={(e) => handleInputChange('heartRate', e.target.value)}
                  required
                  className="pl-10"
                />
                <Heart className="w-5 h-5 text-gray-400 absolute left-3 top-8" />
              </div>

              <div className="relative">
                <Input
                  label="SpO₂ (%)"
                  type="number"
                  min="70"
                  max="100"
                  value={formData.oxygenSaturation}
                  onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                  required
                  className="pl-10"
                />
                <Droplets className="w-5 h-5 text-gray-400 absolute left-3 top-8" />
              </div>
            </div>
          </Card>

          {/* État général */}
          <Card title="État général">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobilité
                </label>
                <select
                  value={formData.mobility}
                  onChange={(e) => handleInputChange('mobility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Autonome">Autonome</option>
                  <option value="Aide partielle">Aide partielle</option>
                  <option value="Aide totale">Aide totale</option>
                  <option value="Alité">Alité</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  État de conscience
                </label>
                <select
                  value={formData.consciousness}
                  onChange={(e) => handleInputChange('consciousness', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Alerte">Alerte</option>
                  <option value="Somnolent">Somnolent</option>
                  <option value="Confus">Confus</option>
                  <option value="Inconscient">Inconscient</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nutrition
                </label>
                <select
                  value={formData.nutrition}
                  onChange={(e) => handleInputChange('nutrition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Normale">Normale</option>
                  <option value="Réduite">Réduite</option>
                  <option value="Refus">Refus</option>
                  <option value="Sonde">Sonde</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Médicaments administrés */}
          <Card title="Médicaments administrés">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Nom du médicament et dosage"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addMedication} icon={Pill}>
                  Ajouter
                </Button>
              </div>

              {formData.medicationsAdministered.length > 0 && (
                <div className="space-y-2">
                  {formData.medicationsAdministered.map((medication, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Pill className="w-4 h-4 text-green-600" />
                        <span className="text-gray-900">{medication}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="danger" 
                        onClick={() => removeMedication(index)}
                      >
                        Retirer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Commentaires */}
          <Card title="Commentaire libre">
            <textarea
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              placeholder="Observations, remarques particulières..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Card>

          {/* Anomalie détectée */}
          <Card title="Alerte médicale">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Anomalie détectée</p>
                  <p className="text-sm text-gray-600">
                    Cocher si une anomalie nécessite l'attention du médecin
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.anomalyDetected}
                  onChange={(e) => handleInputChange('anomalyDetected', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button 
              variant="primary" 
              icon={Save} 
              onClick={handleSave}
              className="flex-1"
            >
              {isEditing ? 'Modifier le suivi' : 'Enregistrer le suivi'}
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/infirmier/dashboard')}
            >
              Annuler
            </Button>
          </div>
        </div>

        {/* Sidebar - Suivis précédents */}
        <div className="space-y-6">
          <Card title="Suivis d'aujourd'hui">
            {previousFollowUps.length > 0 ? (
              <div className="space-y-3">
                {previousFollowUps.map((followUp) => (
                  <div key={followUp.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(followUp.created_at).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        icon={Edit}
                        onClick={() => loadPreviousFollowUp(followUp)}
                      >
                        Modifier
                      </Button>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>T°: {followUp.temperature}°C</p>
                      <p>TA: {followUp.blood_pressure}</p>
                      <p>FC: {followUp.heart_rate} bpm</p>
                      <p>SpO₂: {followUp.oxygen_saturation}%</p>
                      {followUp.anomaly_detected && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Anomalie</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucun suivi aujourd'hui</p>
              </div>
            )}
          </Card>

          {/* Informations patient */}
          <Card title="Informations patient">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Chambre {patient.room}</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Groupe sanguin:</span>
                  <span className="font-medium text-gray-900">{patient.bloodType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Statut:</span>
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

              {patient.allergies.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Allergies:</p>
                  <div className="space-y-1">
                    {patient.allergies.map((allergy, index) => (
                      <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-1">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NurseFollowUp;