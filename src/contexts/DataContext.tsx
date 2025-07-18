import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, Consultation, VitalSigns, Document, Prescription, Appointment } from '../types';
import { 
  mockPatients,
  mockConsultations,
  mockVitalSigns,
  mockDocuments,
  mockPrescriptions,
  mockAppointments
} from '../data/mockData';

interface DataContextType {
  // Patients
  patients: Patient[];
  patientsLoading: boolean;
  patientsError: string | null;
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  // Consultations
  consultations: Consultation[];
  consultationsLoading: boolean;
  consultationsError: string | null;
  addConsultation: (consultation: Consultation) => void;
  updateConsultation: (id: string, consultation: Partial<Consultation>) => void;
  deleteConsultation: (id: string) => void;
  
  // Vital Signs
  vitalSigns: VitalSigns[];
  vitalSignsLoading: boolean;
  vitalSignsError: string | null;
  addVitalSigns: (vitalSigns: VitalSigns) => void;
  updateVitalSigns: (id: string, vitalSigns: Partial<VitalSigns>) => void;
  deleteVitalSigns: (id: string) => void;
  
  // Documents
  documents: Document[];
  addDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  
  // Prescriptions
  prescriptions: Prescription[];
  addPrescription: (prescription: Prescription) => void;
  updatePrescription: (id: string, prescription: Partial<Prescription>) => void;
  deletePrescription: (id: string) => void;
  
  // Appointments
  appointments: Appointment[];
  appointmentsLoading: boolean;
  appointmentsError: string | null;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // États pour stocker toutes les données
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState<string | null>(null);

  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
  const [consultationsLoading, setConsultationsLoading] = useState(false);
  const [consultationsError, setConsultationsError] = useState<string | null>(null);

  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>(mockVitalSigns);
  const [vitalSignsLoading, setVitalSignsLoading] = useState(false);
  const [vitalSignsError, setVitalSignsError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);

  // Fonctions pour gérer les patients
  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const updatePatient = (id: string, updatedPatient: Partial<Patient>) => {
    setPatients(prev => prev.map(patient => 
      patient.id === id ? { ...patient, ...updatedPatient } : patient
    ));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
  };

  // Fonctions pour gérer les consultations
  const addConsultation = (consultation: Consultation) => {
    setConsultations(prev => [...prev, consultation]);
  };

  const updateConsultation = (id: string, updatedConsultation: Partial<Consultation>) => {
    setConsultations(prev => prev.map(consultation => 
      consultation.id === id ? { ...consultation, ...updatedConsultation } : consultation
    ));
  };

  const deleteConsultation = (id: string) => {
    setConsultations(prev => prev.filter(consultation => consultation.id !== id));
  };

  // Fonctions pour gérer les signes vitaux
  const addVitalSigns = (vitalSign: VitalSigns) => {
    setVitalSigns(prev => [...prev, vitalSign]);
  };

  const updateVitalSigns = (id: string, updatedVitalSigns: Partial<VitalSigns>) => {
    setVitalSigns(prev => prev.map(vital => 
      vital.id === id ? { ...vital, ...updatedVitalSigns } : vital
    ));
  };

  const deleteVitalSigns = (id: string) => {
    setVitalSigns(prev => prev.filter(vital => vital.id !== id));
  };

  // Fonctions pour gérer les documents
  const addDocument = (document: Document) => {
    setDocuments(prev => [...prev, document]);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(document => document.id !== id));
  };

  // Fonctions pour gérer les prescriptions
  const addPrescription = (prescription: Prescription) => {
    setPrescriptions(prev => [...prev, prescription]);
  };

  const updatePrescription = (id: string, updatedPrescription: Partial<Prescription>) => {
    setPrescriptions(prev => prev.map(prescription => 
      prescription.id === id ? { ...prescription, ...updatedPrescription } : prescription
    ));
  };

  const deletePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(prescription => prescription.id !== id));
  };

  // Fonctions pour gérer les rendez-vous
  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const updateAppointment = (id: string, updatedAppointment: Partial<Appointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id ? { ...appointment, ...updatedAppointment } : appointment
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  return (
    <DataContext.Provider value={{
      // Patients
      patients,
      patientsLoading,
      patientsError,
      addPatient,
      updatePatient,
      deletePatient,
      
      // Consultations
      consultations,
      consultationsLoading,
      consultationsError,
      addConsultation,
      updateConsultation,
      deleteConsultation,
      
      // Vital Signs
      vitalSigns,
      vitalSignsLoading,
      vitalSignsError,
      addVitalSigns,
      updateVitalSigns,
      deleteVitalSigns,
      
      // Documents
      documents,
      addDocument,
      deleteDocument,
      
      // Prescriptions
      prescriptions,
      addPrescription,
      updatePrescription,
      deletePrescription,
      
      // Appointments
      appointments,
      appointmentsLoading,
      appointmentsError,
      addAppointment,
      updateAppointment,
      deleteAppointment
      }}>
      {children}
    </DataContext.Provider>
  );
};