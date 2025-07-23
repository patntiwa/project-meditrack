<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VitalSign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VitalSignController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $query = VitalSign::with(['patient', 'nurse']);

        // ✅ Filtrage par patient
        if ($request->filled('patient_id')) {
            $query->byPatient($request->input('patient_id'));
        }

        // ✅ Filtrage pour l'infirmier connecté
        if ($user->getAttribute('role') === 'infirmier') {
            $query->byNurse($user->getAttribute('id'));
        }

        // ✅ Filtrage par date
        if ($request->filled('date')) {
            $query->whereDate('measurement_date', $request->input('date'));
        }

        // ✅ Filtrage pour anomalies
        if ($request->filled('anomalies_only') && $request->boolean('anomalies_only')) {
            $query->withAnomalies();
        }

        $vitalSigns = $query->orderBy('measurement_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $vitalSigns,
            'message' => 'Liste des signes vitaux récupérée avec succès.'
        ], 200);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:users,id',
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

        $vital = VitalSign::create(array_merge($validated, [
            'nurse_id' => Auth::id(),
        ]));

        return response()->json([
            'success' => true,
            'data' => $vital,
            'message' => 'Signe vital enregistré avec succès.'
        ], 201);
    }

    public function show($id)
    {
        $vital = VitalSign::with(['patient', 'nurse'])->find($id);

        if (!$vital) {
            return response()->json(['message' => 'Non trouvé'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $vital
        ]);
    }

    public function update(Request $request, $id)
    {
        $vital = VitalSign::find($id);

        if (!$vital) {
            return response()->json(['message' => 'Non trouvé'], 404);
        }

        $validated = $request->validate([
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

        $vital->update($validated);

        return response()->json([
            'success' => true,
            'data' => $vital,
            'message' => 'Signe vital mis à jour.'
        ]);
    }

    public function destroy($id)
    {
        $vital = VitalSign::find($id);

        if (!$vital) {
            return response()->json(['message' => 'Non trouvé'], 404);
        }

        $vital->delete();

        return response()->json([
            'success' => true,
            'message' => 'Signe vital supprimé.'
        ]);
    }
}
