import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import NurseDashboard from './pages/Dashboard/NurseDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import PatientList from './pages/Patients/PatientList';
import PatientHealthView from './pages/Patients/PatientHealthView';
import NurseFollowUp from './pages/Patients/NurseFollowUp';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Doctor Routes */}
              <Route path="/medecin/dashboard" element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/medecin/patients" element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <PatientList />
                </ProtectedRoute>
              } />
              <Route path="/medecin/statistiques" element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
                    <p className="text-gray-600 mt-1">Page en cours de développement</p>
                  </div>
                </ProtectedRoute>
              } />

              {/* Nurse Routes */}
              <Route path="/infirmier/dashboard" element={
                <ProtectedRoute allowedRoles={['infirmier']}>
                  <NurseDashboard />
                </ProtectedRoute>
              } />
              <Route path="/infirmier/patients" element={
                <ProtectedRoute allowedRoles={['infirmier']}>
                  <PatientList />
                </ProtectedRoute>
              } />
              <Route path="/patients/:id/health" element={
                <ProtectedRoute allowedRoles={['infirmier', 'medecin', 'admin']}>
                  <PatientHealthView />
                </ProtectedRoute>
              } />
              <Route path="/patients/:id/suivi" element={
                <ProtectedRoute allowedRoles={['infirmier']}>
                  <NurseFollowUp />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/patients" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PatientList />
                </ProtectedRoute>
              } />
              <Route path="/admin/medecins" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des médecins</h1>
                    <p className="text-gray-600 mt-1">Page en cours de développement</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/admin/utilisateurs" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
                    <p className="text-gray-600 mt-1">Page en cours de développement</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/admin/statistiques" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Statistiques globales</h1>
                    <p className="text-gray-600 mt-1">Page en cours de développement</p>
                  </div>
                </ProtectedRoute>
              } />

              {/* Shared Routes */}
              <Route path="/consultations" element={
                <ProtectedRoute allowedRoles={['medecin', 'admin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
                    <p className="text-gray-600 mt-1">Page en cours de développement</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/consultations/create" element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Nouvelle consultation</h1>
                    <p className="text-gray-600 mt-1">Page en cours de développement</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/ordonnances" element={
                <ProtectedRoute allowedRoles={['medecin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Ordonnances</h1>
                    <p className="text-gray-600 mt-1">Page en cours de développement</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/rendez-vous" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des rendez-vous</h1>
                    <p className="text-gray-600 mt-1">Page en cours de développement</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/parametres" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;