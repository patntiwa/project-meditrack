<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    /**
     * Liste des patients
     */
    public function index(Request $request)
    {
        $query = Patient::with(['assignedDoctor', 'assignedNurse']);

        // Filtrage par rôle
        $user = $request->user();
        if ($user->role === 'medecin') {
            $query->byDoctor($user->id);
        } elseif ($user->role === 'infirmier') {
            $query->byNurse($user->id);
        }

        // Filtres
        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $patients = $query->orderBy('last_name')->get();

        return response()->json($patients);
    }

    /**
     * Détails d'un patient
     */
    public function show(Patient $patient)
    {
        $patient->load([
            'assignedDoctor',
            'assignedNurse',
            'consultations.doctor',
            'vitalSigns.nurse',
            'documents.uploadedBy',
            'prescriptions.doctor',
            'appointments.doctor'
        ]);

        return response()->json($patient);
    }

    /**
     * Créer un nouveau patient
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:M,F',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:patients',
            'address' => 'required|string',
            'blood_type' => 'required|string|max:5',
            'allergies' => 'nullable|array',
            'medical_history' => 'nullable|array',
            'assigned_doctor_id' => 'nullable|exists:users,id',
            'assigned_nurse_id' => 'nullable|exists:users,id',
            'status' => 'required|in:suivi-chronique,aigu,termine',
            'room' => 'nullable|string|max:10',
        ]);

        $patient = Patient::create($request->all());

        return response()->json($patient, 201);
    }

    /**
     * Mettre à jour un patient
     */
    public function update(Request $request, Patient $patient)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:M,F',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:patients,email,' . $patient->id,
            'address' => 'required|string',
            'blood_type' => 'required|string|max:5',
            'allergies' => 'nullable|array',
            'medical_history' => 'nullable|array',
            'assigned_doctor_id' => 'nullable|exists:users,id',
            'assigned_nurse_id' => 'nullable|exists:users,id',
            'status' => 'required|in:suivi-chronique,aigu,termine',
            'room' => 'nullable|string|max:10',
        ]);

        $patient->update($request->all());

        return response()->json($patient);
    }

    /**
     * Supprimer un patient
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();

        return response()->json([
            'message' => 'Patient supprimé avec succès'
        ]);
    }
}