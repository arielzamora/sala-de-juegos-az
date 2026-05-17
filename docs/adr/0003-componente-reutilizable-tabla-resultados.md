# 0003 - Componente Genérico para Tablas de Resultados

**Fecha:** 2026-05-17  
**Estado:** Aceptado

## 1. Contexto y Problema
Originalmente, la vista global de `/resultados` contenía cuatro tablas HTML codificadas manualmente (una por cada juego), lo cual generaba una masiva repetición de código (más de 150 líneas) y dificultades de mantenimiento. Además, surgió el requerimiento de poder visualizar el ranking específico desde dentro de cada juego mediante un Popup/Modal.

## 2. Decisión Tomada
Se creó el componente **`TablaResultadosComponent`** (`app-tabla-resultados`), diseñado con el patrón de *Dumb Component* (Componente de presentación puro).
- Recibe a través de `@Input()` los datos (`datos`), el título, icono, color temático y la definición dinámica de columnas (`columnas: ColumnaTabla[]`).
- Contiene su propia lógica de renderizado según el tipo de columna (fechas, booleanos para ganó/perdió, emails truncados).

## 3. Consecuencias (Pros y Contras)
- **Positivas:** 
  - El archivo HTML de `resultados.component.html` redujo su complejidad en un 70%.
  - Permitió la integración de popups de "Ranking" modales dentro de la interfaz de todos los juegos (`ahorcado`, `mayor-menor`, `dados`, `preguntados`) reutilizando exactamente el mismo componente sin duplicar lógica ni CSS.
  - Cualquier cambio visual en las tablas ahora se hace en un único lugar.
- **Negativas / Riesgos:** 
  - El componente debe ser lo suficientemente flexible para soportar futuros juegos con estructuras de datos anómalas (por ahora mitigado mediante la interfaz `ColumnaTabla`).
