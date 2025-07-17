import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, AlertTriangle, Clock, Users, Activity, CheckCircle } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const NurseDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, vitalSigns } = useData();
  const [careSchedule, setCareSchedule] = useState([
    { id: 1, time: '08:00', task: 'Prise de constantes - Tous les patients', status: 'pending' },
    { id: 2, time: '12:00', task: 'Distribution médicaments', status: 'completed' },
    { id: 3, time: '16:00', task: 'Pansements - Chambre 205', status: 'pending' },
    { id: 4, time: '20:00', task: 'Contrôle nocturne', status: 'pending' }
  ]);

  const myPatients = patients.filter(patient => patient.assignedNurse === user?.id);
  const todayVitalSigns = vitalSigns.filter(vital => 
    new Date(vital.date).toDateString() === new Date().toDateString()
  );
  const alertPatients = vitalSigns.filter(vital => vital.anomalyDetected);

  const handleMarkCompleted = (taskId: number) => {
    setCareSchedule(prevSchedule => 
      prevSchedule.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed' }
          : task
      )
    );
  };

  const handleMarkPending = (taskId: number) => {
    setCareSchedule(prevSchedule => 
      prevSchedule.map(task => 
        task.id === taskId 
          ? { ...task, status: 'pending' }
          : task
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue, Jean Martin</p>
        </div>
        <Button icon={Heart} variant="primary">
          Nouveau suivi
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Patients assignés</p>
              <p className="text-2xl font-bold text-gray-900">{myPatients.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suivis aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{todayVitalSigns.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alertes actives</p>
              <p className="text-2xl font-bold text-red-600">{alertPatients.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tâches terminées</p>
              <p className="text-2xl font-bold text-green-600">
                {careSchedule.filter(task => task.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patients à surveiller */}
        <Card title="Patients à surveiller aujourd'hui">
          <div className="space-y-4">
            {myPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-gray-500">Chambre {patient.room}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    patient.status === 'aigu' ? 'bg-red-100 text-red-800' :
                    patient.status === 'suivi-chronique' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {patient.status}
                  </span>
                  <Button 
                    size="sm" 
                    variant="primary"
                    onClick={() => navigate(`/patients/${patient.id}/suivi`)}
                  >
                    Suivi
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alertes patients */}
        <Card title="Alertes patients">
          <div className="space-y-4">
            {alertPatients.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune alerte active</p>
              </div>
            ) : (
              alertPatients.map((vital) => {
                const patient = patients.find(p => p.id === vital.patientId);
                return (
                  <div key={vital.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {patient?.firstName} {patient?.lastName}
                        </p>
                        <p className="text-sm text-red-600">{vital.notes}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => navigate(`/patients/${vital.patientId}/health`)}
                    >
                      Consulter
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Planning des soins */}
      <Card title="Planning des soins">
        <div className="space-y-4">
          {careSchedule.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  task.status === 'completed' 
                    ? 'bg-gradient-to-br from-green-400 to-teal-500' 
                    : 'bg-gradient-to-br from-blue-400 to-purple-500'
                }`}>
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Clock className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{task.task}</p>
                  <p className="text-sm text-gray-500">{task.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {task.status === 'completed' ? 'Terminé' : 'En attente'}
                </span>
                {task.status === 'pending' && (
                  <Button 
                    size="sm" 
                    variant="success"
                    onClick={() => handleMarkCompleted(task.id)}
                  >
                    Marquer terminé
                  </Button>
                )}
                {task.status === 'completed' && (
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleMarkPending(task.id)}
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NurseDashboard;