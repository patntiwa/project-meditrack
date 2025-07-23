import React, { useState } from 'react';
import { Save, User, Lock, Bell, Globe } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../services/UserService';

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
        setErrorMessage("Le nom et l'email sont obligatoires");
        return;
      }

      // Appel API pour mise à jour
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.newPassword || undefined
      });

      setSuccessMessage('Profil mis à jour avec succès');

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage("Format d'email invalide");
      }
    } catch (error) {
      setErrorMessage("Une erreur s'est produite lors de la mise à jour.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>

      <Card title="Informations personnelles" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nom complet"
            name="name"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
          />
          <Input
            label="Adresse email"
            name="email"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
          />
          <Input
            label="Téléphone"
            name="phone"
            value={formData.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
          />
        </div>
      </Card>

      <Card title="Sécurité" icon={Lock}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mot de passe actuel"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={e => handleInputChange('currentPassword', e.target.value)}
          />
          <Input
            label="Nouveau mot de passe"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={e => handleInputChange('newPassword', e.target.value)}
          />
          <Input
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={e => handleInputChange('confirmPassword', e.target.value)}
          />
        </div>
      </Card>

      <Card title="Préférences" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Langue</label>
            <select
              value={formData.language}
              onChange={e => handleInputChange('language', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Déconnexion automatique</label>
            <select
              value={formData.autoLogout}
              onChange={e => handleInputChange('autoLogout', e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 heure</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title="Notifications" icon={Bell}>
        <div className="space-y-2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={e => handleInputChange('emailNotifications', e.target.checked)}
            />
            <span>Notifications par email</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.smsNotifications}
              onChange={e => handleInputChange('smsNotifications', e.target.checked)}
            />
            <span>Notifications par SMS</span>
          </label>
        </div>
      </Card>

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      <div className="flex justify-end">
        <Button icon={Save} variant="primary" onClick={handleSave} loading={isLoading}>
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default Settings;
