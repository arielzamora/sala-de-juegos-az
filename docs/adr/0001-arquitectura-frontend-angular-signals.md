# 0001 - Arquitectura Frontend: Angular 19, Standalone Components y Lazy Loading

**Fecha:** 2026-05-17  
**Estado:** Aceptado

## 1. Contexto y Problema
El proyecto requiere desarrollar una "Sala de Juegos" interactiva, rápida y modular. Era necesario decidir el framework y los patrones de arquitectura base para asegurar que la carga inicial sea ligera, teniendo en cuenta que cada juego puede contener distintos recursos, APIs o lógicas pesadas que no deben bloquear el ingreso del usuario a la pantalla principal (Home).

## 2. Decisión Tomada
Se eligió utilizar **Angular 19** bajo las siguientes características arquitectónicas:
1. **Standalone Components:** Se prescinde de la estructura clásica basada en `NgModules` en favor de componentes independientes, simplificando el árbol de dependencias.
2. **Control Flow (`@if`, `@for`):** Utilización de la sintaxis moderna de plantillas introducida en las últimas versiones de Angular para mejorar la legibilidad del código (reemplazando `*ngIf` y `*ngFor` en la mayoría de los casos).
3. **Lazy Loading y Módulo de Juegos:** Se creó un sistema de enrutamiento diferido (`JuegosModule`/`JuegosRoutingModule`) donde cada juego solo se descarga al navegador cuando el usuario hace clic en entrar.

## 3. Consecuencias (Pros y Contras)
- **Positivas:** 
  - Bundle inicial significativamente más liviano.
  - El código de cada juego está aislado; un error en Preguntados no rompe la página principal.
  - Sintaxis de plantillas moderna y limpia que reduce errores.
- **Negativas / Riesgos:** 
  - La migración o integración de librerías antiguas (como SweetAlert2 en formato CommonJS) puede requerir configuración adicional en el `angular.json` para evitar advertencias de "Optimization bailouts".
