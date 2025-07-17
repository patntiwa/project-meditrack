import React, { useState } from 'react';
import { Save, User, Lock, Bell, Globe } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useAuth } from '../../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: 'fr',
    emailNotifications: true,
    smsNotifications: false,
    autoLogout: '30'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Validation des champs obligatoires
      if (!formData.name.trim() || !formData.email.trim()) {
        setErrorMessage('Le nom et l\'email sont obligatoires');
        return;
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage('Format d\'email invalide');
        return;
      }

      // Validation du mot de passe si fourni
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setErrorMessage('Le mot de passe actuel est requis pour changer le mot de passe');
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setErrorMessage('Les nouveaux mots de passe ne correspondent pas');
          return;
        }
        if (formData.newPassword.length < 6) {
          setErrorMessage('Le nouveau mot de passe doit contenir au moins 6 caractères');
          return;
        }
      }

      // Simuler un délai de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mettre à jour les informations utilisateur
      updateUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      });

      // Réinitialiser les champs de mot de passe
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setSuccessMessage('Informations mises à jour avec succès!');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      setErrorMessage('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Gérez vos préférences et votre compte</p>
        </div>
        <Button icon={Save} variant="primary" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>

      {/* Messages de succès et d'erreur */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Save className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 text-red-600">⚠️</span>
            <p className="text-red-800 font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card title="Informations personnelles">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <Input
              label="Nom complet"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />

            <Input
              label="Téléphone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
        </Card>

        {/* Sécurité */}
        <Card title="Sécurité">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Lock className="w-5 h-5 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700">Changer le mot de passe</h3>
            </div>

            <Input
              label="Mot de passe actuel"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            />

            <Input
              label="Nouveau mot de passe"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
            />

            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            />

            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Déconnexion automatique
              </label>
              <select
                value={formData.autoLogout}
                onChange={(e) => handleInputChange('autoLogout', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 heure</option>
                <option value="120">2 heures</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Préférences */}
        <Card title="Préférences">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700">Langue et région</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue de l'interface
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card title="Notifications">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700">Préférences de notification</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Notifications email</p>
                  <p className="text-xs text-gray-500">Recevoir les alertes par email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Notifications SMS</p>
                  <p className="text-xs text-gray-500">Recevoir les alertes par SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.smsNotifications}
                    onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;