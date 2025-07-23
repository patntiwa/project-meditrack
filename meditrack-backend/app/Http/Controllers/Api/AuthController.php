<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException; // Importer ceci pour une meilleure gestion des exceptions

class AuthController extends Controller
{
    /**
     * Enregistrement d’un nouvel utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            // 🔒 Validation des données entrantes
            $validatedData = $request->validate([ // Utilisation de $request->validate() qui lance une ValidationException
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed', // nécessite "password_confirmation"
                'role'     => 'sometimes|string|in:admin,medecin,infirmier', // Exemple: Si le rôle peut être défini à l'inscription
                'phone'    => 'sometimes|string|max:20', // Exemple: numéro de téléphone
            ]);

            // Création de l'utilisateur
            $user = User::create([
                'name'     => $validatedData['name'],
                'email'    => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role'     => $validatedData['role'] ?? 'patient', // Rôle par défaut si non spécifié
                'phone'    => $validatedData['phone'] ?? null,
                'is_active' => true, // Les nouveaux utilisateurs sont généralement actifs par défaut
            ]);

            // Génération du token (optionnel, si vous voulez connecter l'utilisateur directement après l'inscription)
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status'  => 'success',
                'message' => 'Utilisateur créé avec succès',
                'user'    => $user, // Retourne l'utilisateur créé
                'accessToken' => $token, // Retourne le token si connexion directe
                'tokenType'   => 'Bearer',
            ], 201); // 201 Created pour une création réussie

        } catch (ValidationException $e) {
            // Cette exception est automatiquement gérée par Laravel et retourne un 422.
            // Cependant, si vous voulez une réponse personnalisée, vous pouvez la capturer.
            return response()->json([
                'status'  => 'error',
                'message' => 'Les données fournies sont invalides.',
                'errors'  => $e->errors() // Les erreurs de validation
            ], 422);
        } catch (\Exception $e) {
            // Erreur serveur inattendue
            return response()->json([
                'status'  => 'error',
                'message' => 'Une erreur est survenue lors de l\'enregistrement de l\'utilisateur.',
                'error'   => $e->getMessage() // Message d'erreur pour le débogage
            ], 500);
        }
    }

    /**
     * Connexion d’un utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            // 🔒 Validation des données
            $validatedData = $request->validate([
                'email'    => 'required|string|email',
                'password' => 'required|string'
            ]);

            // Tentative d'authentification
            if (!Auth::attempt($validatedData)) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Email ou mot de passe incorrect.'
                ], 401); // 401 Unauthorized
            }

            /** @var \App\Models\User $user */
            // ✅ Authentification réussie
            $user = Auth::user(); // Récupère l'utilisateur authentifié directement

            // Si vous avez un champ 'is_active' pour bloquer des utilisateurs
            if (!$user->is_active) {
                // Déconnecter l'utilisateur si le compte est inactif
                Auth::logout(); // Ceci déconnecte la session si Laravel gère les sessions web en parallèle
                $user->tokens()->delete(); // Révoque tous les tokens Sanctum pour cet utilisateur

                return response()->json([
                    'status' => 'error',
                    'message' => 'Votre compte est inactif. Veuillez contacter l\'administrateur.'
                ], 403); // 403 Forbidden
            }

            // Révoquer les anciens tokens si nécessaire (bonne pratique de sécurité)
            // $user->tokens()->delete(); // Décommenter si vous voulez qu'un seul token soit valide à la fois

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status'      => 'success',
                'message'     => 'Connexion réussie.',
                'accessToken' => $token,
                'tokenType'   => 'Bearer',
                'user'        => $user // L'objet utilisateur complet
            ]); // 200 OK par défaut

        } catch (ValidationException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Les données de connexion fournies sont invalides.',
                'errors'  => $e->errors()
            ], 422); // 422 Unprocessable Entity
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Une erreur inattendue est survenue lors de la connexion.',
                'error'   => $e->getMessage()
            ], 500); // 500 Internal Server Error
        }
    }

    /**
     * Déconnexion (révocation du token)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        if (!$request->user()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Aucun utilisateur authentifié. Impossible de se déconnecter.'
            ], 401); // 401 Unauthorized
        }

        try {
            // Révoquer uniquement le token actuel
            $request->user()->currentAccessToken()?->delete();

            return response()->json([
                'status'  => 'success',
                'message' => 'Déconnexion réussie. Le token actuel a été révoqué.'
            ]); // 200 OK par défaut
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Une erreur est survenue lors de la déconnexion.',
                'error'   => $e->getMessage()
            ], 500); // 500 Internal Server Error
        }
    }

    /**
     * Récupérer l'utilisateur actuellement authentifié.
     * Cette méthode est gérée par la route api.php
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    // La méthode directement dans api.php est suffisante et correcte:
    // Route::get('/user', function (Request $request) {
    //     return response()->json([
    //         'status' => 'success',
    //         'user' => $request->user()
    //     ]);
    // });
}