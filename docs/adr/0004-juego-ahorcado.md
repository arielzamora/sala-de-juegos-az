# 0004 - Juego: Ahorcado (Estado Local)

**Fecha:** 2026-05-17  
**Estado:** Aceptado

## 1. Contexto y Problema
Se requería implementar el clásico juego del Ahorcado, gestionando el progreso de los aciertos, los errores, y la representación visual de la figura ahorcándose progresivamente. También se debía implementar un sistema de puntuación para rankings.

## 2. Decisión Tomada
- **Fuente de palabras:** Se optó por una constante local estática en lugar de consumir una API externa de diccionarios, para asegurar una velocidad de respuesta inmediata y garantizar que las palabras sean adecuadas para el juego.
- **Estado Local:** El estado se mantiene en el controlador mediante arrays (`letrasUsadas`, `palabra`).
- **Sistema de Puntuación:** El jugador inicia con un puntaje base alto (60 puntos). Por cada error cometido (letra equivocada), se le descuentan 10 puntos de la base final, premiando así a quienes adivinan la palabra con menos fallos.

## 3. Consecuencias (Pros y Contras)
- **Positivas:** 
  - Implementación sin latencia y 100% confiable al no depender de internet.
  - Lógica de penalización clara y justa para el ranking.
- **Negativas / Riesgos:** 
  - El listado de palabras es finito. Si el usuario juega intensivamente, notará repeticiones. (Posible mejora futura: conectar con Supabase para traer diccionarios dinámicos).
