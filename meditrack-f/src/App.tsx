import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

import Login from './pages/Login';
import Layout from './components/Layout/Layout';
import PatientList from './pages/Patients/PatientList';
import PatientHealthView from './pages/Patients/PatientHealthView';
import NurseFollowUp from './pages/Patients/NurseFollowUp';
import Settings from './pages/Settings/Settings';

import AdminDashboard from './pages/Dashboard/AdminDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import NurseDashboard from './pages/Dashboard/NurseDashboard';

import ProtectedRoute from './components/ProtectedRoute';
import { AdminRoute, MedecinRoute, InfirmierRoute } from './components/RoleRoutes';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </AdminRoute>
            } />

            {/* Médecin routes */}
            <Route path="/medecin/dashboard" element={
              <MedecinRoute>
                <Layout>
                  <DoctorDashboard />
                </Layout>
              </MedecinRoute>
            } />
            <Route path="/medecin/patients" element={
              <MedecinRoute>
                <Layout>
                  <PatientList />
                </Layout>
              </MedecinRoute>
            } />
            <Route path="/medecin/statistiques" element={
              <MedecinRoute>
                <Layout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
                    <p className="text-gray-600 mt-1">Page en cours de développement</p>
                  </div>
                </Layout>
              </MedecinRoute>
            } />

            {/* Infirmier routes */}
            <Route path="/infirmier/dashboard" element={
              <InfirmierRoute>
                <Layout>
                  <NurseDashboard />
                </Layout>
              </InfirmierRoute>
            } />
            <Route path="/infirmier/patients" element={
              <InfirmierRoute>
                <Layout>
                  <PatientList />
                </Layout>
              </InfirmierRoute>
            } />
            <Route path="/infirmier/follow-up" element={
              <InfirmierRoute>
                <Layout>
                  <NurseFollowUp />
                </Layout>
              </InfirmierRoute>
            } />

            {/* Paramètres accessibles à tous rôles authentifiés */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
