<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Patient;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    // Affiche la liste des patients (GET /api/patients)
    public function index()
    {
        $patients = Patient::all();

        return response()->json([
            'success' => true,
            'data' => $patients,
            'message' => 'Liste des patients récupérée avec succès.'
        ], 200);
    }

    // Crée un nouveau patient (POST /api/patients)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'sexe' => 'required|in:homme,femme',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email|unique:patients,email',
            'groupe_sanguin' => 'nullable|string|max:10',
            'profession' => 'nullable|string|max:255',
            'situation_matrimoniale' => 'nullable|string|max:100',
            'assurance' => 'nullable|string|max:255',
            'numero_assurance' => 'nullable|string|max:50',
            'contact_urgence' => 'required|string|max:255',
            'relation_contact' => 'required|string|max:100',
            'numero_contact_urgence' => 'required|string|max:20',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Erreur de validation.'
            ], 422);
        }

        $patient = Patient::create($request->only([
            'nom', 'prenom', 'sexe', 'date_naissance', 'lieu_naissance', 'adresse', 'telephone', 'email',
            'groupe_sanguin', 'profession', 'situation_matrimoniale', 'assurance', 'numero_assurance',
            'contact_urgence', 'relation_contact', 'numero_contact_urgence', 'note'
        ]));

        return response()->json([
            'success' => true,
            'data' => $patient,
            'message' => 'Patient créé avec succès.'
        ], 201);
    }

    // Affiche un patient spécifique (GET /api/patients/{id})
    public function show($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient introuvable.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $patient,
            'message' => 'Patient trouvé.'
        ], 200);
    }

    // Met à jour un patient existant (PUT/PATCH /api/patients/{id})
    public function update(Request $request, $id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient introuvable.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|required|string|max:255',
            'prenom' => 'sometimes|required|string|max:255',
            'sexe' => 'sometimes|required|in:homme,femme',
            'date_naissance' => 'sometimes|required|date',
            'lieu_naissance' => 'sometimes|required|string|max:255',
            'adresse' => 'sometimes|required|string|max:255',
            'telephone' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|unique:patients,email,' . $id,
            'groupe_sanguin' => 'nullable|string|max:10',
            'profession' => 'nullable|string|max:255',
            'situation_matrimoniale' => 'nullable|string|max:100',
            'assurance' => 'nullable|string|max:255',
            'numero_assurance' => 'nullable|string|max:50',
            'contact_urgence' => 'sometimes|required|string|max:255',
            'relation_contact' => 'sometimes|required|string|max:100',
            'numero_contact_urgence' => 'sometimes|required|string|max:20',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Erreur de validation.'
            ], 422);
        }

        $patient->update($request->only([
            'nom', 'prenom', 'sexe', 'date_naissance', 'lieu_naissance', 'adresse', 'telephone', 'email',
            'groupe_sanguin', 'profession', 'situation_matrimoniale', 'assurance', 'numero_assurance',
            'contact_urgence', 'relation_contact', 'numero_contact_urgence', 'note'
        ]));

        return response()->json([
            'success' => true,
            'data' => $patient,
            'message' => 'Patient mis à jour avec succès.'
        ], 200);
    }

    // Supprime un patient (DELETE /api/patients/{id})
    public function destroy($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient introuvable.'
            ], 404);
        }

        $patient->delete();

        return response()->json([
            'success' => true,
            'message' => 'Patient supprimé avec succès.'
        ], 204);
    }
}
