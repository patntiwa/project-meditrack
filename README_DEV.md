# 🔁 Prompt Copilot – Migration automatique de données mockées vers API Laravel

## 🎯 Objectif

Dans ce projet React + Laravel :

- L'authentification Sanctum est déjà en place.
- L'API est définie dans `resources/api.php`.
- Le frontend utilise des mockdata dans plusieurs composants.
- Les modules (patients, vital-signs, consultations, dashboard) sont exposés via des routes REST Laravel.

## ✅ Ce que tu dois faire

> Replace every usage of mock data in the React frontend with real API calls using Axios. Use the routes defined in `api.php` (Laravel REST API). For each module (patients, vital signs, consultations, etc.), generate a full CRUD system:
>
> - Fetch list via `GET /api/{resource}`
> - Add new entry via `POST /api/{resource}`
> - Edit via `PUT /api/{resource}/{id}`
> - Delete via `DELETE /api/{resource}/{id}`
>
> - Use Axios (already set up in `api.ts`)
> - Fetch data using `useEffect`
> - Store in `useState`
> - Show loader while loading
> - Show error if request fails
> - Replace existing mockdata logic
> - Use existing UI components (`Input`, `Card`, `Button`, etc.)

## 📂 Exemple de mapping

| Module        | Endpoint                    | Component à modifier         |
|---------------|-----------------------------|------------------------------|
| Patients      | /api/patients               | `PatientList.tsx`, `PatientForm.tsx` |
| Vital Signs   | /api/vital-signs            | `VitalSignsList.tsx`         |
| Consultations | /api/consultations          | `ConsultationList.tsx`       |
| Dashboard     | /api/dashboard/stats        | `DoctorDashboard.tsx`        |

## 📌 Astuce Copilot

```jsx
// Prompt dans le fichier React :
/* Replace mock patients with Axios call to /api/patients. Add loader, useEffect, and CRUD methods. Keep the table structure as-is. */
