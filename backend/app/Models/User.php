<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <-- Ajouté : Indispensable pour Sanctum

class User extends Authenticatable
{
    /**
     * @use HasApiTokens, HasFactory, Notifiable
     */
    use HasApiTokens, HasFactory, Notifiable; // <-- Ajouté : HasApiTokens ici aussi

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',      // <-- Ajouté
        'specialty', // <-- Ajouté
        'phone',     // <-- Ajouté
        'is_active', // <-- Ajouté
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean', // <-- Ajouté
        ];
    }

    /**
     * Relations : Liaison avec d'autres modèles via les clés étrangères
     */

    public function patientsAsDoctor()
    {
        return $this->hasMany(Patient::class, 'assigned_doctor_id');
    }

    public function patientsAsNurse()
    {
        return $this->hasMany(Patient::class, 'assigned_nurse_id');
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class, 'doctor_id');
    }

    public function vitalSigns()
    {
        return $this->hasMany(VitalSign::class, 'nurse_id');
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class, 'doctor_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function uploadedDocuments()
    {
        return $this->hasMany(Document::class, 'uploaded_by');
    }

    /**
     * Scopes : Méthodes d'aide pour les requêtes sur les rôles
     */

    public function scopeDoctors($query)
    {
        return $query->where('role', 'medecin');
    }

    public function scopeNurses($query)
    {
        return $query->where('role', 'infirmier');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }
}