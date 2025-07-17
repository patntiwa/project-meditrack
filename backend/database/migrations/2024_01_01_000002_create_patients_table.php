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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth');
            $table->enum('gender', ['M', 'F']);
            $table->string('phone');
            $table->string('email')->unique();
            $table->text('address');
            $table->string('blood_type');
            $table->json('allergies')->nullable(); // Stockage JSON pour les allergies
            $table->json('medical_history')->nullable(); // Stockage JSON pour les antécédents
            $table->foreignId('assigned_doctor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('assigned_nurse_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('status', ['suivi-chronique', 'aigu', 'termine'])->default('suivi-chronique');
            $table->string('room')->nullable();
            $table->timestamp('last_consultation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};