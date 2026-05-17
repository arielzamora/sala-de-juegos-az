# 0005 - Juego: Mayor o Menor (Generación In-Memory)

**Fecha:** 2026-05-17  
**Estado:** Aceptado

## 1. Contexto y Problema
El requerimiento implicaba adivinar si una carta de la baraja española era mayor o menor a la anterior. Era vital garantizar que una carta no saliera dos veces en la misma partida y que las rondas abarcaran el mazo entero.

## 2. Decisión Tomada
- **Mazo y Mezclado:** En el método `generarBaraja()`, se generan matemáticamente las 40 cartas posibles cruzando arreglos de palos y valores en tiempo real. 
- Inmediatamente después, se aplica el algoritmo clásico de **Fisher-Yates** para "barajar" el arreglo resultante.
- **Gestión de Rondas:** En lugar de limitar a 10 rondas, se configuró el juego para durar exactamente `39` rondas (la longitud total del mazo menos uno, ya que se comparan en pares). 
- **Recursos visuales:** Los SVG de las cartas se consumen mediante rutas absolutas desde un repositorio open-source en GitHub, y se les inyectó `background-color: white` vía CSS para evitar glitches de transparencia en el Modo Oscuro.

## 3. Consecuencias (Pros y Contras)
- **Positivas:** 
  - Matemáticamente imposible que se repita una carta, garantizando una experiencia "justa".
  - El uso total del mazo crea una partida más larga e interesante.
- **Negativas / Riesgos:** 
  - Los recursos gráficos dependen de un repositorio externo (GitHub Raw URLs). Si el dueño elimina o privatiza ese repositorio, las cartas dejarán de renderizarse.
