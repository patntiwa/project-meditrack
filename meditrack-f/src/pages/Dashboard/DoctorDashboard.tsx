import React from 'react';
import { Calendar, AlertTriangle, Users, TrendingUp, Clock, Activity } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { usePatients } from '../../hooks/usePatients';
import { useConsultations } from '../../hooks/useConsultations';
import { useAppointments } from '../../hooks/useAppointments';
import { useAuth } from '../../hooks/useAuth';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { patients = [] } = usePatients();
  const { consultations = [] } = useConsultations();
  const { appointments = [] } = useAppointments();

  const todayAppointments = appointments.filter(apt =>
    new Date(apt.appointment_date).toDateString() === new Date().toDateString()
  );

  const criticalPatients = patients.filter(patient =>
    patient.status === 'aigu'
  );

  const monthly_stats = {
    consultations: consultations.length,
    chronic_patients: patients.filter(p => p.status === 'suivi-chronique').length,
    total_patients: patients.length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue, {user?.name ?? 'Docteur'}</p>
        </div>
        <Button icon={Activity} variant="primary">
          Nouvelle consultation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consultations ce mois</p>
              <p className="text-2xl font-bold text-gray-900">{monthly_stats.consultations}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Patients en suivi</p>
              <p className="text-2xl font-bold text-gray-900">{monthly_stats.chronic_patients}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total patients</p>
              <p className="text-2xl font-bold text-gray-900">{monthly_stats.total_patients}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rendez-vous à venir */}
        <Card title="Rendez-vous à venir">
          <div className="space-y-4">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun rendez-vous aujourd'hui</p>
              </div>
            ) : (
              todayAppointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patient_id);
                return (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {patient?.first_name.charAt(0)}{patient?.last_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {patient?.first_name} {patient?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{appointment.appointment_time}</p>
                      <p className="text-sm text-gray-500">{appointment.status}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Alertes cliniques */}
        <Card title="Alertes cliniques">
          <div className="space-y-4">
            {criticalPatients.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune alerte critique</p>
              </div>
            ) : (
              criticalPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {patient.first_name} {patient.last_name}
                      </p>
                      <p className="text-sm text-red-600">Patient en état critique</p>
                    </div>
                  </div>
                  <Button size="sm" variant="danger">
                    Consulter
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Activité récente */}
      <Card title="Activité récente">
        <div className="space-y-4">
          {consultations.slice(0, 3).map((consultation) => {
            const patient = patients.find(p => p.id === consultation.patient_id);
            return (
              <div key={consultation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Consultation - {patient?.first_name} {patient?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{consultation.diagnosis}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{consultation.consultation_date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
