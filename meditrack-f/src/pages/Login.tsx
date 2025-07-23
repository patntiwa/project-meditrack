import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      console.log('Utilisateur reçu après login :', user);

      if (!user || typeof user.role !== 'string') {
        setError('Email ou mot de passe invalide.');
        return;
      }

      console.log('Redirection prévue pour le rôle :', user.role);

      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'medecin':
          navigate('/medecin/dashboard');
          break;
        case 'infirmier':
          navigate('/infirmier/dashboard');
          break;
        default:
          setError("Rôle non reconnu.");
          return;
      }

    } catch (err) {
      console.error('Erreur de connexion :', err);
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">MediTrack</h1>
            <p className="text-gray-600 mt-2">Connexion au système de suivi des patients</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-12 pr-12"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              Mot de passe oublié ?
            </a>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Comptes de démonstration :</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Médecin: medecin@hospital.com</li>
              <li>• Infirmier: infirmier@hospital.com</li>
              <li>• Admin: admin@hospital.com</li>
              <li>• Mot de passe: password</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
