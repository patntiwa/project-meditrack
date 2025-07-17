<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Models\Patient;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    /**
     * Liste des consultations
     */
    public function index(Request $request)
    {
        $query = Consultation::with(['patient', 'doctor']);

        // Filtrage par médecin
        $user = $request->user();
        if ($user->role === 'medecin') {
            $query->byDoctor($user->id);
        }

        // Filtrage par patient
        if ($request->filled('patient_id')) {
            $query->byPatient($request->patient_id);
        }

        // Filtrage par date
        if ($request->filled('date')) {
            $query->whereDate('consultation_date', $request->date);
        }

        $consultations = $query->orderBy('consultation_date', 'desc')->get();

        return response()->json($consultations);
    }

    /**
     * Détails d'une consultation
     */
    public function show(Consultation $consultation)
    {
        $consultation->load(['patient', 'doctor']);

        return response()->json($consultation);
    }

    /**
     * Créer une nouvelle consultation
     */
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'consultation_date' => 'required|date',
            'symptoms' => 'required|string',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'recommendations' => 'nullable|string',
            'prescription' => 'nullable|string',
            'follow_up' => 'nullable|string',
            'documents' => 'nullable|array',
        ]);

        $consultation = Consultation::create([
            ...$request->all(),
            'doctor_id' => $request->user()->id,
        ]);

        // Mettre à jour la date de dernière consultation du patient
        $patient = Patient::find($request->patient_id);
        $patient->update(['last_consultation' => $request->consultation_date]);

        return response()->json($consultation->load(['patient', 'doctor']), 201);
    }

    /**
     * Mettre à jour une consultation
     */
    public function update(Request $request, Consultation $consultation)
    {
        $request->validate([
            'consultation_date' => 'required|date',
            'symptoms' => 'required|string',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'recommendations' => 'nullable|string',
            'prescription' => 'nullable|string',
            'follow_up' => 'nullable|string',
            'documents' => 'nullable|array',
        ]);

        $consultation->update($request->all());

        return response()->json($consultation->load(['patient', 'doctor']));
    }

    /**
     * Supprimer une consultation
     */
    public function destroy(Consultation $consultation)
    {
        $consultation->delete();

        return response()->json([
            'message' => 'Consultation supprimée avec succès'
        ]);
    }

    /**
     * Consultations d'aujourd'hui
     */
    public function today(Request $request)
    {
        $query = Consultation::with(['patient', 'doctor'])->today();

        $user = $request->user();
        if ($user->role === 'medecin') {
            $query->byDoctor($user->id);
        }

        $consultations = $query->orderBy('consultation_date')->get();

        return response()->json($consultations);
    }

    /**
     * Consultations du mois
     */
    public function thisMonth(Request $request)
    {
        $query = Consultation::with(['patient', 'doctor'])->thisMonth();

        $user = $request->user();
        if ($user->role === 'medecin') {
            $query->byDoctor($user->id);
        }

        $consultations = $query->orderBy('consultation_date', 'desc')->get();

        return response()->json($consultations);
    }
}