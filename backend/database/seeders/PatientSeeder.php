<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Patient::create([
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'date_of_birth' => '1965-03-15',
            'gender' => 'M',
            'phone' => '01 23 45 67 89',
            'email' => 'jean.dupont@email.com',
            'address' => '123 Rue de la Paix, 75001 Paris',
            'blood_type' => 'A+',
            'allergies' => ['Pénicilline', 'Fruits à coque'],
            'medical_history' => ['Hypertension', 'Diabète type 2'],
            'assigned_doctor_id' => 1,
            'assigned_nurse_id' => 2,
            'status' => 'suivi-chronique',
            'room' => '205',
            'last_consultation' => '2024-01-15',
        ]);

        Patient::create([
            'first_name' => 'Marie',
            'last_name' => 'Martin',
            'date_of_birth' => '1978-08-22',
            'gender' => 'F',
            'phone' => '01 23 45 67 90',
            'email' => 'marie.martin@email.com',
            'address' => '456 Avenue des Champs, 75008 Paris',
            'blood_type' => 'O-',
            'allergies' => ['Aspirine'],
            'medical_history' => ['Asthme'],
            'assigned_doctor_id' => 1,
            'assigned_nurse_id' => 2,
            'status' => 'aigu',
            'room' => '312',
            'last_consultation' => '2024-01-20',
        ]);

        Patient::create([
            'first_name' => 'Pierre',
            'last_name' => 'Durand',
            'date_of_birth' => '1990-12-05',
            'gender' => 'M',
            'phone' => '01 23 45 67 91',
            'email' => 'pierre.durand@email.com',
            'address' => '789 Boulevard Saint-Germain, 75007 Paris',
            'blood_type' => 'B+',
            'allergies' => [],
            'medical_history' => [],
            'assigned_doctor_id' => 1,
            'assigned_nurse_id' => 2,
            'status' => 'termine',
            'last_consultation' => '2024-01-10',
        ]);
    }
}