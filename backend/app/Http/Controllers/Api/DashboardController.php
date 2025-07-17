<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Consultation;
use App\Models\VitalSign;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Statistiques du tableau de bord
     */
    public function stats(Request $request)
    {
        $user = $request->user();
        $stats = [];

        switch ($user->role) {
            case 'medecin':
                $stats = $this->getDoctorStats($user);
                break;
            case 'infirmier':
                $stats = $this->getNurseStats($user);
                break;
            case 'admin':
                $stats = $this->getAdminStats();
                break;
        }

        return response()->json($stats);
    }

    /**
     * Statistiques pour médecin
     */
    private function getDoctorStats($user)
    {
        return [
            'total_patients' => Patient::byDoctor($user->id)->count(),
            'chronic_patients' => Patient::byDoctor($user->id)->byStatus('suivi-chronique')->count(),
            'consultations_this_month' => Consultation::byDoctor($user->id)->thisMonth()->count(),
            'today_appointments' => Appointment::byDoctor($user->id)->today()->count(),
            'critical_patients' => Patient::byDoctor($user->id)->byStatus('aigu')->count(),
        ];
    }

    /**
     * Statistiques pour infirmier
     */
    private function getNurseStats($user)
    {
        return [
            'assigned_patients' => Patient::byNurse($user->id)->count(),
            'today_vital_signs' => VitalSign::byNurse($user->id)->today()->count(),
            'active_alerts' => VitalSign::byNurse($user->id)->withAnomalies()->count(),
            'completed_tasks' => 0, // À implémenter selon vos besoins
        ];
    }

    /**
     * Statistiques pour admin
     */
    private function getAdminStats()
    {
        return [
            'total_patients' => Patient::count(),
            'active_doctors' => User::doctors()->active()->count(),
            'active_nurses' => User::nurses()->active()->count(),
            'total_consultations' => Consultation::count(),
            'today_appointments' => Appointment::today()->count(),
            'this_month_consultations' => Consultation::thisMonth()->count(),
        ];
    }

    /**
     * Activité récente
     */
    public function recentActivity(Request $request)
    {
        $user = $request->user();
        $activities = [];

        // Consultations récentes
        $consultations = Consultation::with(['patient', 'doctor'])
            ->when($user->role === 'medecin', function ($query) use ($user) {
                return $query->byDoctor($user->id);
            })
            ->orderBy('consultation_date', 'desc')
            ->limit(5)
            ->get();

        foreach ($consultations as $consultation) {
            $activities[] = [
                'type' => 'consultation',
                'message' => "Consultation - {$consultation->patient->full_name}",
                'date' => $consultation->consultation_date,
                'data' => $consultation,
            ];
        }

        // Signes vitaux récents (pour infirmiers)
        if ($user->role === 'infirmier') {
            $vitalSigns = VitalSign::with(['patient', 'nurse'])
                ->byNurse($user->id)
                ->orderBy('measurement_date', 'desc')
                ->limit(5)
                ->get();

            foreach ($vitalSigns as $vital) {
                $activities[] = [
                    'type' => 'vital_sign',
                    'message' => "Suivi - {$vital->patient->full_name}",
                    'date' => $vital->measurement_date,
                    'data' => $vital,
                ];
            }
        }

        // Trier par date
        usort($activities, function ($a, $b) {
            return $b['date'] <=> $a['date'];
        });

        return response()->json(array_slice($activities, 0, 10));
    }

    /**
     * Alertes actives
     */
    public function alerts(Request $request)
    {
        $user = $request->user();
        $alerts = [];

        // Alertes de signes vitaux
        $vitalSignAlerts = VitalSign::with(['patient', 'nurse'])
            ->withAnomalies()
            ->when($user->role === 'infirmier', function ($query) use ($user) {
                return $query->byNurse($user->id);
            })
            ->when($user->role === 'medecin', function ($query) use ($user) {
                return $query->whereHas('patient', function ($q) use ($user) {
                    $q->byDoctor($user->id);
                });
            })
            ->orderBy('measurement_date', 'desc')
            ->get();

        foreach ($vitalSignAlerts as $alert) {
            $alerts[] = [
                'type' => 'vital_sign_anomaly',
                'priority' => 'high',
                'message' => "Anomalie détectée - {$alert->patient->full_name}",
                'description' => $alert->notes,
                'date' => $alert->measurement_date,
                'data' => $alert,
            ];
        }

        // Patients critiques
        $criticalPatients = Patient::byStatus('aigu')
            ->when($user->role === 'medecin', function ($query) use ($user) {
                return $query->byDoctor($user->id);
            })
            ->when($user->role === 'infirmier', function ($query) use ($user) {
                return $query->byNurse($user->id);
            })
            ->get();

        foreach ($criticalPatients as $patient) {
            $alerts[] = [
                'type' => 'critical_patient',
                'priority' => 'high',
                'message' => "Patient en état critique - {$patient->full_name}",
                'description' => "Nécessite une attention immédiate",
                'date' => $patient->updated_at,
                'data' => $patient,
            ];
        }

        // Trier par priorité et date
        usort($alerts, function ($a, $b) {
            if ($a['priority'] === $b['priority']) {
                return $b['date'] <=> $a['date'];
            }
            return $a['priority'] === 'high' ? -1 : 1;
        });

        return response()->json($alerts);
    }
}