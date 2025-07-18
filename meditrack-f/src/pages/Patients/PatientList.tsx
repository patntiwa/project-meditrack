import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit, User } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';



const PatientList: React.FC = () => {
  const { user } = useAuth();
  const { 
    patients = [],
    patientsLoading: isLoading,
    patientsError: error
  } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Ajouter un log pour déboguer
  console.log('Données brutes reçues:', patients);

  const filteredPatients = Array.isArray(patients) ? patients.filter(patient => {
    const matchesSearch = patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    
    // Filter by role - doctors see their patients, nurses see assigned patients
    const matchesRole = user?.role === 'admin' || 
                       (user?.role === 'medecin' && patient.assignedDoctor === user.id) ||
                       (user?.role === 'infirmier' && patient.assignedNurse === user.id);
    
    return matchesSearch && matchesStatus && matchesRole;
  }) : [];

  console.log('Données filtrées:', filteredPatients);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'suivi-chronique':
        return 'bg-blue-100 text-blue-800';
      case 'aigu':
        return 'bg-red-100 text-red-800';
      case 'termine':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'suivi-chronique':
        return 'Suivi chronique';
      case 'aigu':
        return 'Aigu';
      case 'termine':
        return 'Terminé';
      default:
        return status;
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'Gestion des patients' : 'Mes patients'}
          </h1>
                    <p className="text-gray-600 mt-1">
            {isLoading ? (
              'Chargement...'
            ) : error ? (
              <span className="text-red-600">Erreur: {error}</span>
            ) : (
              `${filteredPatients.length} patient(s) trouvé(s)`
            )}
          </p>
        </div>
        {user?.role === 'admin' && (
          <Button icon={Plus} variant="primary" disabled={isLoading}>
            Ajouter un patient
          </Button>
        )}
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="suivi-chronique">Suivi chronique</option>
              <option value="aigu">Aigu</option>
              <option value="termine">Terminé</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Âge</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Sexe</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                {user?.role === 'infirmier' && (
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Chambre</th>
                )}
                <th className="text-left py-3 px-4 font-medium text-gray-900">Dernière consultation</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {calculateAge(patient.dateOfBirth)} ans
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {patient.gender === 'M' ? 'Masculin' : 'Féminin'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {getStatusLabel(patient.status)}
                    </span>
                  </td>
                  {user?.role === 'infirmier' && (
                    <td className="py-4 px-4 text-gray-900">
                      {patient.room || 'Non assigné'}
                    </td>
                  )}
                  <td className="py-4 px-4 text-gray-500">
                    {patient.lastConsultation 
                      ? new Date(patient.lastConsultation).toLocaleDateString('fr-FR')
                      : 'Aucune'
                    }
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary" icon={Eye}>
                        Voir
                      </Button>
                      {user?.role === 'medecin' && (
                        <Button size="sm" variant="primary">
                          Consultation
                        </Button>
                      )}
                      {user?.role === 'infirmier' && (
                        <Button 
                          size="sm" 
                          variant="primary"
                          onClick={() => navigate(`/patients/${patient.id}/suivi`)}
                        >
                          Suivi
                        </Button>
                      )}
                      {user?.role === 'admin' && (
                        <Button size="sm" variant="secondary" icon={Edit}>
                          Modifier
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun patient trouvé</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientList;