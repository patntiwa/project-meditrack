<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if (!$request->expectsJson()) {
            return route('login'); // tu peux le laisser si tu veux une route web
        }

        return null; // Ne pas rediriger, Sanctum renverra une erreur JSON automatiquement
    }

    /**
     * Override handle unauthenticated attempts to return JSON.
     */
    protected function unauthenticated($request, array $guards)
    {
        abort(response()->json([
            'message' => 'Unauthenticated.'
        ], 401));
    }
}
