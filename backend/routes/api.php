<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\VitalSignController;
use App\Http\Controllers\Api\DocumentController;

/*
|--------------------------------------------------------------------------
| Routes API publiques
|--------------------------------------------------------------------------
| Ces routes sont accessibles sans authentification.
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Routes protégées par Sanctum (auth:sanctum)
|--------------------------------------------------------------------------
| L'utilisateur doit être connecté avec un token pour accéder à ces routes.
*/

Route::middleware('auth:sanctum')->group(function () {

    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);

    // Vérifier le token
    Route::get('/user', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'user' => $request->user()
        ]);
    });

    // CRUD API pour chaque entité
    Route::apiResource('patients', PatientController::class);
    Route::apiResource('appointments', AppointmentController::class);
    Route::apiResource('prescriptions', PrescriptionController::class);
    Route::apiResource('consultations', ConsultationController::class);
    Route::apiResource('vital-signs', VitalSignController::class);
    Route::apiResource('documents', DocumentController::class);
});
