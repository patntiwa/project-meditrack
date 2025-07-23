import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getAll as getAllPatients
} from '../services/PatientService';
import {
  getAll as getAllConsultations
} from '../services/ConsultationService';
import {
  getAll as getAllAppointments
} from '../services/AppointmentService';
import {
  getAll as getAllPrescriptions
} from '../services/PrescriptionService';
import {
  getAll as getAllDocuments
} from '../services/DocumentService';
import {
  getAll as getAllVitalSigns
} from '../services/VitalSignsService';

import { DataContextType } from '../types';

import {
  Patient,
  Consultation,
  Appointment,
  Prescription,
  Document,
  VitalSigns
} from '../types';

import { useAuth } from '../hooks/useAuth';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);

  const fetchInitialData = async () => {
    try {
      const [
        patientsData,
        consultationsData,
        appointmentsData,
        prescriptionsData,
        documentsData,
        vitalSignsData
      ] = await Promise.all([
        getAllPatients(),
        getAllConsultations(),
        getAllAppointments(),
        getAllPrescriptions(),
        getAllDocuments(),
        getAllVitalSigns()
      ]);

      setPatients(patientsData);
      setConsultations(consultationsData);
      setAppointments(appointmentsData);
      setPrescriptions(prescriptionsData);
      setDocuments(documentsData);
      setVitalSigns(vitalSignsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchInitialData();
    }
  }, [user]);

  const refreshData = () => {
    if (user?.token) {
      fetchInitialData();
    }
  };

  return (
    <DataContext.Provider
      value={{
        patients,
        consultations,
        appointments,
        prescriptions,
        documents,
        vitalSigns,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
