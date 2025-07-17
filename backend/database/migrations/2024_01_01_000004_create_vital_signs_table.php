<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vital_signs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('nurse_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('measurement_date');
            $table->decimal('temperature', 4, 1); // 37.5°C
            $table->string('blood_pressure'); // 120/80
            $table->integer('heart_rate'); // bpm
            $table->integer('oxygen_saturation'); // %
            $table->string('consciousness');
            $table->string('mobility');
            $table->string('nutrition');
            $table->json('medications_administered')->nullable(); // Liste des médicaments
            $table->text('notes')->nullable();
            $table->boolean('anomaly_detected')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vital_signs');
    }
};