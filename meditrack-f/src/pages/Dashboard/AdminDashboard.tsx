import React from 'react';
import { Users, Activity, Calendar, TrendingUp, UserPlus, Stethoscope, Shield, AlertTriangle } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { useData } from '../../contexts/DataContext';

const AdminDashboard: React.FC = () => {
  const { patients = [], consultations = [], appointments = [] } = useData();
  
  const globalStats = {
    totalPatients: patients.length,
    activeDoctors: 3,
    totalConsultations: consultations.length,
    todayAppointments: appointments.filter(apt => 
      new Date(apt.date).toDateString() === new Date().toDateString()
    ).length
  };

  const recentActivity = [
    { type: 'patient', message: 'Nouveau patient ajouté: Marie Martin', time: '2h' },
    { type: 'consultation', message: 'Consultation terminée: Jean Dupont', time: '4h' },
    { type: 'appointment', message: 'Rendez-vous programmé: Pierre Durand', time: '6h' },
    { type: 'user', message: 'Nouveau médecin ajouté: Dr. Paul Bernard', time: '1j' }
  ];

  const systemAlerts = [
    { type: 'warning', message: 'Serveur de sauvegarde nécessite une maintenance', priority: 'medium' },
    { type: 'info', message: '2 nouveaux utilisateurs en attente de validation', priority: 'low' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
          <p className="text-gray-600 mt-1">Bienvenue, Sophie Lambert</p>
        </div>
        <Button icon={UserPlus} variant="primary">
          Nouvel utilisateur
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total patients</p>
              <p className="text-2xl font-bold text-gray-900">{globalStats.totalPatients}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Médecins actifs</p>
              <p className="text-2xl font-bold text-gray-900">{globalStats.activeDoctors}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consultations totales</p>
              <p className="text-2xl font-bold text-gray-900">{globalStats.totalConsultations}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">RDV aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{globalStats.todayAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Activité mensuelle">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Graphique des consultations</p>
              <p className="text-sm text-gray-400">Implémentation future</p>
            </div>
          </div>
        </Card>

        <Card title="Répartition des spécialités">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Répartition par spécialité</p>
              <p className="text-sm text-gray-400">Implémentation future</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes système */}
        <Card title="Alertes système">
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                alert.priority === 'high' ? 'bg-red-50 border-red-200' :
                alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    alert.priority === 'high' ? 'bg-red-500' :
                    alert.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}>
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-500">Priorité: {alert.priority}</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary">
                  Traiter
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Activité récente */}
        <Card title="Activité récente">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'patient' ? 'bg-teal-500' :
                    activity.type === 'consultation' ? 'bg-blue-500' :
                    activity.type === 'appointment' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`}>
                    {activity.type === 'patient' && <Users className="w-5 h-5 text-white" />}
                    {activity.type === 'consultation' && <Activity className="w-5 h-5 text-white" />}
                    {activity.type === 'appointment' && <Calendar className="w-5 h-5 text-white" />}
                    {activity.type === 'user' && <UserPlus className="w-5 h-5 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500">Il y a {activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;