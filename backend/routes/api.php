<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\VitalSignController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\AppointmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Routes publiques
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/recent-activity', [DashboardController::class, 'recentActivity']);
    Route::get('/dashboard/alerts', [DashboardController::class, 'alerts']);

    // Patients
    Route::apiResource('patients', PatientController::class);

    // Signes vitaux
    Route::apiResource('vital-signs', VitalSignController::class);
    Route::get('/patients/{patient}/vital-signs/today', [VitalSignController::class, 'todayByPatient']);
    Route::get('/vital-signs-alerts', [VitalSignController::class, 'alerts']);

    // Consultations
    Route::apiResource('consultations', ConsultationController::class);
    Route::get('/consultations-today', [ConsultationController::class, 'today']);
    Route::get('/consultations-month', [ConsultationController::class, 'thisMonth']);

    // Documents
    Route::apiResource('documents', DocumentController::class);

    // Prescriptions
    Route::apiResource('prescriptions', PrescriptionController::class);

    // Appointments
    Route::apiResource('appointments', AppointmentController::class);

    // Routes spécifiques par rôle
    Route::middleware('role:medecin')->group(function () {
        // Routes réservées aux médecins
    });

    Route::middleware('role:infirmier')->group(function () {
        // Routes réservées aux infirmiers
    });

    Route::middleware('role:admin')->group(function () {
        // Routes réservées aux administrateurs
    });
});