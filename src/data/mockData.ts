import { Patient, Consultation, VitalSigns, Document, Prescription, Appointment } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    dateOfBirth: '1965-03-15',
    gender: 'M',
    phone: '01 23 45 67 89',
    email: 'jean.dupont@email.com',
    address: '123 Rue de la Paix, 75001 Paris',
    bloodType: 'A+',
    allergies: ['Pénicilline', 'Fruits à coque'],
    medicalHistory: ['Hypertension', 'Diabète type 2'],
    assignedDoctor: '1',
    assignedNurse: '2',
    status: 'suivi-chronique',
    room: '205',
    lastConsultation: '2024-01-15'
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Martin',
    dateOfBirth: '1978-08-22',
    gender: 'F',
    phone: '01 23 45 67 90',
    email: 'marie.martin@email.com',
    address: '456 Avenue des Champs, 75008 Paris',
    bloodType: 'O-',
    allergies: ['Aspirine'],
    medicalHistory: ['Asthme'],
    assignedDoctor: '1',
    assignedNurse: '2',
    status: 'aigu',
    room: '312',
    lastConsultation: '2024-01-20'
  },
  {
    id: '3',
    firstName: 'Pierre',
    lastName: 'Durand',
    dateOfBirth: '1990-12-05',
    gender: 'M',
    phone: '01 23 45 67 91',
    email: 'pierre.durand@email.com',
    address: '789 Boulevard Saint-Germain, 75007 Paris',
    bloodType: 'B+',
    allergies: [],
    medicalHistory: [],
    assignedDoctor: '1',
    assignedNurse: '2',
    status: 'termine',
    lastConsultation: '2024-01-10'
  }
];

export const mockConsultations: Consultation[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2024-01-15',
    symptoms: 'Douleur thoracique, essoufflement',
    diagnosis: 'Angine de poitrine',
    treatment: 'Repos, médicaments anti-angineux',
    recommendations: 'Éviter les efforts intenses, surveillance ECG',
    prescription: 'Nitroglycérine 0.5mg, 3x/jour',
    followUp: 'Contrôle dans 2 semaines'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '1',
    date: '2024-01-20',
    symptoms: 'Crise d\'asthme sévère',
    diagnosis: 'Exacerbation asthmatique',
    treatment: 'Bronchodilatateurs, corticoïdes',
    recommendations: 'Éviter les allergènes, plan d\'action asthme',
    prescription: 'Salbutamol 100µg, 2 bouffées 4x/jour',
    followUp: 'Contrôle dans 1 semaine'
  }
];

export const mockVitalSigns: VitalSigns[] = [
  {
    id: '1',
    patientId: '1',
    nurseId: '2',
    date: '2024-01-21',
    temperature: 37.2,
    bloodPressure: '140/90',
    heartRate: 85,
    oxygenSaturation: 98,
    consciousness: 'Alerte',
    mobility: 'Autonome',
    nutrition: 'Normale',
    medicationsAdministered: ['Nitroglycérine 0.5mg'],
    notes: 'Patient stable, légère élévation tensionnelle',
    anomalyDetected: false
  },
  {
    id: '2',
    patientId: '2',
    nurseId: '2',
    date: '2024-01-21',
    temperature: 36.8,
    bloodPressure: '120/80',
    heartRate: 72,
    oxygenSaturation: 96,
    consciousness: 'Alerte',
    mobility: 'Autonome',
    nutrition: 'Réduite',
    medicationsAdministered: ['Salbutamol 100µg'],
    notes: 'Amélioration respiratoire, SpO2 légèrement basse',
    anomalyDetected: true
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    patientId: '1',
    name: 'ECG_Dupont_20240115.pdf',
    type: 'analysis',
    url: '/documents/ecg_dupont.pdf',
    uploadDate: '2024-01-15',
    uploadedBy: '1'
  },
  {
    id: '2',
    patientId: '2',
    name: 'Radio_Thorax_Martin_20240120.pdf',
    type: 'radiology',
    url: '/documents/radio_martin.pdf',
    uploadDate: '2024-01-20',
    uploadedBy: '1'
  }
];

export const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2024-01-15',
    medications: [
      {
        name: 'Nitroglycérine',
        dosage: '0.5mg',
        frequency: '3 fois par jour',
        duration: '1 mois',
        instructions: 'Sous la langue en cas de douleur'
      }
    ],
    instructions: 'Prendre au besoin, maximum 3 comprimés par jour'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2024-01-25',
    time: '14:00',
    reason: 'Contrôle cardiologique',
    status: 'confirme',
    notes: 'Apporter les résultats ECG'
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '1',
    date: '2024-01-27',
    time: '10:30',
    reason: 'Suivi asthme',
    status: 'confirme',
    notes: 'Contrôle après traitement'
  }
];