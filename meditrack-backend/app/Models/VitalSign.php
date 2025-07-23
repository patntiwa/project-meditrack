<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VitalSign extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'patient_id',
        'nurse_id',
        'measurement_date',
        'temperature',
        'blood_pressure',
        'heart_rate',
        'oxygen_saturation',
        'consciousness',
        'mobility',
        'nutrition',
        'medications_administered',
        'notes',
        'anomaly_detected',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'measurement_date' => 'datetime',
        'temperature' => 'decimal:1',
        'heart_rate' => 'integer',
        'oxygen_saturation' => 'integer',
        'medications_administered' => 'array',
        'anomaly_detected' => 'boolean',
    ];

    /**
     * Relations
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function nurse()
    {
        return $this->belongsTo(User::class, 'nurse_id');
    }

    /**
     * Scopes
     */
    public function scopeByPatient($query, $patientId)
    {
        return $query->where('patient_id', $patientId);
    }

    public function scopeByNurse($query, $nurseId)
    {
        return $query->where('nurse_id', $nurseId);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('measurement_date', today());
    }

    public function scopeWithAnomalies($query)
    {
        return $query->where('anomaly_detected', true);
    }

    /**
     * Accessors
     */
    public function getIsTemperatureNormalAttribute()
    {
        return $this->temperature >= 36.1 && $this->temperature <= 37.8;
    }

    public function getIsHeartRateNormalAttribute()
    {
        return $this->heart_rate >= 60 && $this->heart_rate <= 100;
    }

    public function getIsOxygenSaturationNormalAttribute()
    {
        return $this->oxygen_saturation >= 95;
    }
}