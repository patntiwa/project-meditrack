<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Consultation;

class ConsultationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Consultation::create([
            'patient_id' => 1,
            'doctor_id' => 1,
            'consultation_date' => '2024-01-15 14:30:00',
            'symptoms' => 'Douleur thoracique, essoufflement',
            'diagnosis' => 'Angine de poitrine',
            'treatment' => 'Repos, médicaments anti-angineux',
            'recommendations' => 'Éviter les efforts intenses, surveillance ECG',
            'prescription' => 'Nitroglycérine 0.5mg, 3x/jour',
            'follow_up' => 'Contrôle dans 2 semaines',
        ]);

        Consultation::create([
            'patient_id' => 2,
            'doctor_id' => 1,
            'consultation_date' => '2024-01-20 10:15:00',
            'symptoms' => 'Crise d\'asthme sévère',
            'diagnosis' => 'Exacerbation asthmatique',
            'treatment' => 'Bronchodilatateurs, corticoïdes',
            'recommendations' => 'Éviter les allergènes, plan d\'action asthme',
            'prescription' => 'Salbutamol 100µg, 2 bouffées 4x/jour',
            'follow_up' => 'Contrôle dans 1 semaine',
        ]);
    }
}