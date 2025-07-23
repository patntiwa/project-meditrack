<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Médecin
        User::create([
            'name' => 'Dr. Ntiwa Patrick',
            'email' => 'medecin@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'medecin',
            'specialty' => 'Cardiologie',
            'phone' => '01 23 45 67 89',
            'is_active' => true,
        ]);

        // Infirmier
        User::create([
            'name' => 'Jean Essomba',
            'email' => 'infirmier@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'infirmier',
            'phone' => '01 23 45 67 90',
            'is_active' => true,
        ]);

        // Administrateur
        User::create([
            'name' => 'Mouda Linda',
            'email' => 'admin@hospital.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '01 23 45 67 91',
            'is_active' => true,
        ]);
    }
}