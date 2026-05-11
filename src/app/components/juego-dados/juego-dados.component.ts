import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JuegosService } from '../../services/juegos.service';
import Swal from 'sweetalert2';

interface Tirada {
  dado1: number;
  dado2: number;
  suma: number;
}

@Component({
  selector: 'app-juego-dados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './juego-dados.component.html',
  styleUrl: './juego-dados.component.css'
})
export class JuegoDadosComponent {
  private authService = inject(AuthService);
  private juegosService = inject(JuegosService);

  readonly MAX_INTENTOS = 3;
  readonly NUMERO_GANADOR = 7;

  dado1: number = 0;
  dado2: number = 0;
  animando: boolean = false;
  intentos: Tirada[] = [];
  juegoTerminado: boolean = false;
  gano: boolean = false;

  // Distribución de 9 celdas (grid 3x3) para cada cara del dado
  private readonly DOT_LAYOUTS: boolean[][] = [
    [],
    [false, false, false,  false, true,  false,  false, false, false], // 1
    [false, false, true,   false, false, false,   true,  false, false], // 2
    [false, false, true,   false, true,  false,   true,  false, false], // 3
    [true,  false, true,   false, false, false,   true,  false, true],  // 4
    [true,  false, true,   false, true,  false,   true,  false, true],  // 5
    [true,  false, true,   true,  false, true,    true,  false, true],  // 6
  ];

  getDots(valor: number): boolean[] {
    return this.DOT_LAYOUTS[valor] || this.DOT_LAYOUTS[1];
  }

  get intentosRestantes(): number {
    return this.MAX_INTENTOS - this.intentos.length;
  }

  async tirar() {
    if (this.animando || this.juegoTerminado) return;

    this.animando = true;

    // Animación de sacudida por 900ms
    await this.delay(900);

    const d1 = this.randomDado();
    const d2 = this.randomDado();
    const suma = d1 + d2;

    this.dado1 = d1;
    this.dado2 = d2;
    this.animando = false;

    const tirada: Tirada = { dado1: d1, dado2: d2, suma };
    this.intentos.push(tirada);

    if (suma === this.NUMERO_GANADOR) {
      this.gano = true;
      this.juegoTerminado = true;
      await this.finalizarPartida();
    } else if (this.intentos.length >= this.MAX_INTENTOS) {
      this.gano = false;
      this.juegoTerminado = true;
      await this.finalizarPartida();
    }
  }

  private async finalizarPartida() {
    const user = this.authService.currentUser();
    if (user) {
      try {
        await this.juegosService.guardarPartidaDados({
          user_id: user.id,
          user_email: user.email || '',
          gano: this.gano,
          intentos_usados: this.intentos.length,
          resultados: this.intentos
        });
      } catch (e) {
        console.error('Error guardando partida', e);
      }
    }

    if (this.gano) {
      Swal.fire({
        background: '#1e1e1e', color: '#fff',
        icon: 'success',
        title: '¡Ganaste! 🎲',
        html: `¡Sacaste <b>7</b> en el intento <b>#${this.intentos.length}</b>!`,
        confirmButtonText: 'Jugar de nuevo',
        confirmButtonColor: '#00ff88',
      }).then(() => this.nuevaPartida());
    } else {
      Swal.fire({
        background: '#1e1e1e', color: '#fff',
        icon: 'error',
        title: 'Perdiste 😔',
        html: `No lograste sacar <b>7</b> en ${this.MAX_INTENTOS} intentos.`,
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#007bff',
      }).then(() => this.nuevaPartida());
    }
  }

  nuevaPartida() {
    this.dado1 = 0;
    this.dado2 = 0;
    this.intentos = [];
    this.juegoTerminado = false;
    this.gano = false;
    this.animando = false;
  }

  private randomDado(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
