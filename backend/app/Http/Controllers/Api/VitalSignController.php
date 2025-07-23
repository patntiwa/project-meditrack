<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VitalSign;
use App\Models\Patient;
use Illuminate\Http\Request;

class VitalSignController extends Controller
{
    /**
     * Liste des signes vitaux
     */
    public function index(Request $request)
    {
        $query = VitalSign::with(['patient', 'nurse']);

        // Filtrage par patient
        if ($request->filled('patient_id')) {
            $query->byPatient($request->patient_id);
        }

        // Filtrage par infirmier
        $user = $request->user();
        if ($user->role === 'infirmier') {
            $query->byNurse($user->id);
        }

        // Filtrage par date
        if ($request->filled('date')) {
            $query->whereDate('measurement_date', $request->date);
        }

        // Filtrage par anomalies
        if ($request->filled('anomalies_only') && $request->anomalies_only) {
            $query->withAnomalies();
        }

        $vitalSigns = $query->orderBy('measurement_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $vitalSigns,
            'message' => 'Liste des signes vitaux récupérée avec succès.'
        ], 200);
    }

    /**
     * Détails d'un signe vital
     */
    public function show(VitalSign $vitalSign)
    {
        $vitalSign->load(['patient', 'nurse']);

        return response()->json($vitalSign);
    }

    /**
     * Créer un nouveau signe vital
     */
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'measurement_date' => 'required|date',
            'temperature' => 'required|numeric|between:30,45',
            'blood_pressure' => 'required|string',
            'heart_rate' => 'required|integer|between:30,200',
            'oxygen_saturation' => 'required|integer|between:70,100',
            'consciousness' => 'required|string',
            'mobility' => 'required|string',
            'nutrition' => 'required|string',
            'medications_administered' => 'nullable|array',
            'notes' => 'nullable|string',
            'anomaly_detected' => 'boolean',
        ]);

        $vitalSign = VitalSign::create([
            ...$request->all(),
            'nurse_id' => $request->user()->id,
        ]);

        // Mettre à jour la date de dernière consultation du patient
        $patient = Patient::find($request->patient_id);
        $patient->update(['last_consultation' => now()]);

        return response()->json($vitalSign->load(['patient', 'nurse']), 201);
    }

    /**
     * Mettre à jour un signe vital
     */
    public function update(Request $request, VitalSign $vitalSign)
    {
        $request->validate([
            'measurement_date' => 'required|date',
            'temperature' => 'required|numeric|between:30,45',
            'blood_pressure' => 'required|string',
            'heart_rate' => 'required|integer|between:30,200',
            'oxygen_saturation' => 'required|integer|between:70,100',
            'consciousness' => 'required|string',
            'mobility' => 'required|string',
            'nutrition' => 'required|string',
            'medications_administered' => 'nullable|array',
            'notes' => 'nullable|string',
            'anomaly_detected' => 'boolean',
        ]);

        $vitalSign->update($request->all());

        return response()->json($vitalSign->load(['patient', 'nurse']));
    }

    /**
     * Supprimer un signe vital
     */
    public function destroy(VitalSign $vitalSign)
    {
        $vitalSign->delete();

        return response()->json([
            'message' => 'Signe vital supprimé avec succès'
        ]);
    }

    /**
     * Signes vitaux d'aujourd'hui pour un patient
     */
    public function todayByPatient(Patient $patient)
    {
        $vitalSigns = $patient->vitalSigns()
            ->with('nurse')
            ->today()
            ->orderBy('measurement_date', 'desc')
            ->get();

        return response()->json($vitalSigns);
    }

    /**
     * Alertes (anomalies détectées)
     */
    public function alerts(Request $request)
    {
        $query = VitalSign::with(['patient', 'nurse'])
            ->withAnomalies();

        // Filtrage par infirmier si c'est un infirmier
        $user = $request->user();
        if ($user->role === 'infirmier') {
            $query->byNurse($user->id);
        }

        $alerts = $query->orderBy('measurement_date', 'desc')->get();

        return response()->json($alerts);
    }
}