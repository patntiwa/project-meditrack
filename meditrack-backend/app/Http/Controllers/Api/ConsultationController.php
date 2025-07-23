<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Consultation;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ConsultationController extends Controller
{
    public function index()
    {
        $consultations = Consultation::with(['patient', 'doctor'])->get();

        return response()->json([
            'success' => true,
            'data' => $consultations,
            'message' => 'Liste des consultations récupérée avec succès.'
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:users,id',
            'consultation_date' => 'required|date',
            'symptoms' => 'required|string',
            'diagnosis' => 'required|string',
            'treatment' => 'required|string',
            'recommendations' => 'nullable|string',
            'prescription' => 'nullable|string',
            'follow_up' => 'nullable|string',
            'documents' => 'nullable|json'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Erreur de validation.'
            ], 422);
        }

        $consultation = Consultation::create($request->only([
            'patient_id', 'doctor_id', 'consultation_date', 'symptoms', 'diagnosis', 
            'treatment', 'recommendations', 'prescription', 'follow_up', 'documents'
        ]));

        return response()->json([
            'success' => true,
            'data' => $consultation,
            'message' => 'Consultation créée avec succès.'
        ], 201);
    }

    public function show($id)
    {
        $consultation = Consultation::with(['patient', 'doctor'])->find($id);

        if (!$consultation) {
            return response()->json([
                'success' => false,
                'message' => 'Consultation introuvable.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $consultation,
            'message' => 'Consultation trouvée.'
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $consultation = Consultation::find($id);

        if (!$consultation) {
            return response()->json([
                'success' => false,
                'message' => 'Consultation introuvable.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'patient_id' => 'sometimes|required|exists:patients,id',
            'doctor_id' => 'sometimes|required|exists:users,id',
            'consultation_date' => 'sometimes|required|date',
            'symptoms' => 'sometimes|required|string',
            'diagnosis' => 'sometimes|required|string',
            'treatment' => 'sometimes|required|string',
            'recommendations' => 'nullable|string',
            'prescription' => 'nullable|string',
            'follow_up' => 'nullable|string',
            'documents' => 'nullable|json'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Erreur de validation.'
            ], 422);
        }

        $consultation->update($request->only([
            'patient_id', 'doctor_id', 'consultation_date', 'symptoms', 'diagnosis', 
            'treatment', 'recommendations', 'prescription', 'follow_up', 'documents'
        ]));

        return response()->json([
            'success' => true,
            'data' => $consultation,
            'message' => 'Consultation mise à jour avec succès.'
        ], 200);
    }

    public function destroy($id)
    {
        $consultation = Consultation::find($id);

        if (!$consultation) {
            return response()->json([
                'success' => false,
                'message' => 'Consultation introuvable.'
            ], 404);
        }

        $consultation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Consultation supprimée avec succès.'
        ], 204);
    }

    public function today()
    {
        $today = Carbon::today();
        $consultations = Consultation::whereDate('consultation_date', $today)->with(['patient', 'doctor'])->get();

        return response()->json([
            'success' => true,
            'data' => $consultations,
            'message' => "Consultations du jour récupérées avec succès."
        ], 200);
    }

    public function thisMonth()
    {
        $now = Carbon::now();
        $consultations = Consultation::whereMonth('consultation_date', $now->month)
            ->whereYear('consultation_date', $now->year)
            ->with(['patient', 'doctor'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $consultations,
            'message' => "Consultations du mois récupérées avec succès."
        ], 200);
    }
}
