<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VitalSign;

class VitalSignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VitalSign::create([
            'patient_id' => 1,
            'nurse_id' => 2,
            'measurement_date' => '2024-01-21 08:00:00',
            'temperature' => 37.2,
            'blood_pressure' => '140/90',
            'heart_rate' => 85,
            'oxygen_saturation' => 98,
            'consciousness' => 'Alerte',
            'mobility' => 'Autonome',
            'nutrition' => 'Normale',
            'medications_administered' => ['Nitroglycérine 0.5mg'],
            'notes' => 'Patient stable, légère élévation tensionnelle',
            'anomaly_detected' => false,
        ]);

        VitalSign::create([
            'patient_id' => 2,
            'nurse_id' => 2,
            'measurement_date' => '2024-01-21 08:30:00',
            'temperature' => 36.8,
            'blood_pressure' => '120/80',
            'heart_rate' => 72,
            'oxygen_saturation' => 96,
            'consciousness' => 'Alerte',
            'mobility' => 'Autonome',
            'nutrition' => 'Réduite',
            'medications_administered' => ['Salbutamol 100µg'],
            'notes' => 'Amélioration respiratoire, SpO2 légèrement basse',
            'anomaly_detected' => true,
        ]);
    }
}