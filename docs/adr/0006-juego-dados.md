# 0006 - Juego: Dados (Simulación y UI)

**Fecha:** 2026-05-17  
**Estado:** Aceptado

## 1. Contexto y Problema
Había que crear un juego donde el usuario debe tirar 2 dados y conseguir que la suma sea exactamente 7. El juego debía contar con un límite de intentos, animaciones y penalizaciones de puntaje por fallo.

## 2. Decisión Tomada
- **Lógica Numérica:** Se utiliza `Math.random()` nativo del navegador para simular dados independientes de 6 caras.
- **Renderizado Visual (CSS Grid):** En lugar de cargar imágenes `PNG` estáticas para las caras del dado, se desarrolló una estructura de **CSS Grid de 3x3** que pinta los "puntos" (dots) dinámicamente mapeando un array de booleanos (`DOT_LAYOUTS`).
- **Sistema de Puntuación:** Se arranca con 30 puntos base y 3 "Vidas" (corazones visuales). Por cada tiro fallido, se resta una vida y se descuentan 10 puntos.

## 3. Consecuencias (Pros y Contras)
- **Positivas:** 
  - Interfaz extremadamente liviana: dibujar el dado con CSS reduce solicitudes de red a cero y permite aplicar animaciones fluidas de css (`@keyframes shake/roll`).
  - Lógica de vidas (`❤️`) intuitiva compartida visualmente con el juego Preguntados.
- **Negativas / Riesgos:** 
  - Ninguno significativo. Es una implementación autocontenida y muy robusta.
