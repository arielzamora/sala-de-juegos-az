# 0007 - Juego: Preguntados (Integración Open Trivia DB)

**Fecha:** 2026-05-17  
**Estado:** Aceptado

## 1. Contexto y Problema
El sprint requería consumir una API externa para proveer información dinámica. Se decidió armar un Trivia/Preguntados consumiendo preguntas generadas al azar, con opciones múltiples. Adicionalmente, el juego debía contar con un sistema de vidas (al perder 3 vidas, el juego termina inmediatamente).

## 2. Decisión Tomada
- **API Externa:** Se seleccionó **Open Trivia Database** (`opentdb.com`), ya que expone un endpoint público, gratuito y sin necesidad de tokens CORS.
- **Cliente HTTP:** Se optó por usar la API moderna nativa de JavaScript `fetch()` con `async/await` en lugar del `HttpClient` de Angular. Esto se hizo para mantener la función autocontenida y evitar la inyección de la dependencia de HttpClient a nivel aplicación que hubiera incrementado ligeramente el tamaño del bundle.
- **Sanitización:** Debido a que la API devuelve los textos con codificación HTML (ej: `&quot;`), se implementó la función `decodeHtml` (usando un textarea fantasma en memoria) para decodificar los strings antes de presentarlos al usuario.
- **Feedback UI:** Se integró *SweetAlert2* en formato `toast` (esquina superior derecha) para mostrar retroalimentación inmediata sin bloquear el flujo automático entre preguntas.

## 3. Consecuencias (Pros y Contras)
- **Positivas:** 
  - El juego es virtualmente infinito. Siempre habrá preguntas nuevas.
  - El sistema de feedback Toast mejora masivamente la experiencia de usuario.
- **Negativas / Riesgos:** 
  - La API de OpenTDB a veces devuelve preguntas mal formateadas o tiene caídas esporádicas. (Manejado parcialmente con bloques `try/catch` y estados de Error visuales).
