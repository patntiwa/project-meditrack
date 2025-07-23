import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  Activity,
  ClipboardList,
  BarChart3,
  UserPlus,
  Stethoscope,
  Shield
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'medecin':
        return [
          { path: '/medecin/dashboard', label: 'Tableau de bord', icon: Home },
          { path: '/medecin/patients', label: 'Mes patients', icon: Users },
          { path: '/consultations', label: 'Consultations', icon: Stethoscope },
          { path: '/consultations/create', label: 'Nouvelle consultation', icon: ClipboardList },
          { path: '/ordonnances', label: 'Ordonnances', icon: FileText },
          { path: '/medecin/statistiques', label: 'Statistiques', icon: BarChart3 },
        ];
      case 'infirmier':
        return [
          { path: '/infirmier/dashboard', label: 'Tableau de bord', icon: Home },
          { path: '/infirmier/patients', label: 'Mes patients', icon: Users },
          { path: '/parametres', label: 'Paramètres', icon: Settings },
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Tableau de bord', icon: Home },
          { path: '/admin/patients', label: 'Gestion patients', icon: Users },
          { path: '/admin/medecins', label: 'Gestion médecins', icon: Stethoscope },
          { path: '/admin/utilisateurs', label: 'Gestion utilisateurs', icon: UserPlus },
          { path: '/consultations', label: 'Toutes les consultations', icon: ClipboardList },
          { path: '/rendez-vous', label: 'Rendez-vous', icon: Calendar },
          { path: '/admin/statistiques', label: 'Statistiques', icon: BarChart3 },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-white h-screen w-64 shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">MediTrack</h1>
            <p className="text-sm text-gray-600">Suivi des patients</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0) || '?'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 border-l-4 border-teal-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <NavLink
          to="/parametres"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
              isActive
                ? 'bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Paramètres</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;