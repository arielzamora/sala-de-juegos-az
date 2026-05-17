# 0002 - Separación de Backend: Firebase Auth y Supabase

**Fecha:** 2026-05-17  
**Estado:** Aceptado

## 1. Contexto y Problema
La aplicación requiere dos funciones backend críticas:
1. Autenticación robusta de usuarios (login, registro).
2. Persistencia de datos relacionales y de tiempo real (tablas de puntajes para rankings y sala de chat global).

## 2. Decisión Tomada
En lugar de depender de un único proveedor de *Backend as a Service* (BaaS), se implementó un modelo híbrido:
- **Firebase:** Exclusivamente dedicado a la **Autenticación** (`@angular/fire`). Se delega la seguridad, gestión de tokens y sesiones a esta plataforma por su fiabilidad en la capa de identidad.
- **Supabase:** Utilizado como base de datos PostgreSQL. Supabase es responsable de:
  - Guardar el historial de partidas y puntajes de cada usuario (`partidas_ahorcado`, `partidas_mayor_menor`, etc.).
  - Sincronizar la "Sala de Chat" mediante las suscripciones de **Supabase Realtime**.

## 3. Consecuencias (Pros y Contras)
- **Positivas:** 
  - Supabase ofrece potentes capacidades SQL relacionales que facilitan la extracción y ordenamiento de rankings, algo complejo de lograr eficientemente en bases de datos NoSQL como Firestore.
  - El Realtime de Supabase por WebSockets es óptimo para el chat.
- **Negativas / Riesgos:** 
  - El sistema depende de dos proveedores (Vendor Lock-in parcial a dos ecosistemas).
  - El identificador del usuario que viaja a Supabase es el correo (o ID) de Firebase, requiriendo confiar en que el Auth Service de Angular maneja correctamente la sincronización del token.
