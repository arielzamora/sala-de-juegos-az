import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JuegosService } from '../../services/juegos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private juegosService = inject(JuegosService);

  readonly PALABRAS = [
    'ANGULAR', 'SUPABASE', 'COMPONENTE', 'TYPESCRIPT',
    'ENRUTADOR', 'SERVICIO', 'INTERFAZ', 'ABECEDARIO',
    'PROGRAMAR', 'FIREBASE'
  ];

  readonly ABECEDARIO = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  readonly MAX_INTENTOS = 6;

  palabra: string = '';
  letrasUsadas: string[] = [];
  intentosRestantes: number = this.MAX_INTENTOS;
  juegoTerminado: boolean = false;
  tiempoInicio!: Date;

  get palabraMostrada(): string[] {
    return this.palabra.split('').map(l => this.letrasUsadas.includes(l) ? l : '_');
  }

  get errores(): number {
    return this.MAX_INTENTOS - this.intentosRestantes;
  }

  get gano(): boolean {
    return this.palabraMostrada.every(l => l !== '_');
  }

  ngOnInit() {
    this.nuevaPartida();
  }

  ngOnDestroy() {}

  nuevaPartida() {
    this.palabra = this.PALABRAS[Math.floor(Math.random() * this.PALABRAS.length)];
    this.letrasUsadas = [];
    this.intentosRestantes = this.MAX_INTENTOS;
    this.juegoTerminado = false;
    this.tiempoInicio = new Date();
  }

  async seleccionarLetra(letra: string) {
    if (this.juegoTerminado || this.letrasUsadas.includes(letra)) return;

    this.letrasUsadas = [...this.letrasUsadas, letra];

    if (!this.palabra.includes(letra)) {
      this.intentosRestantes--;
    }

    if (this.gano || this.intentosRestantes === 0) {
      this.juegoTerminado = true;
      await this.finalizarPartida();
    }
  }

  private async finalizarPartida() {
    const tiempoSegundos = Math.floor((new Date().getTime() - this.tiempoInicio.getTime()) / 1000);
    const user = this.authService.currentUser();

    if (user) {
      try {
        await this.juegosService.guardarPartidaAhorcado({
          user_id: user.id,
          user_email: user.email || '',
          palabra: this.palabra,
          letras_usadas: this.letrasUsadas,
          gano: this.gano,
          tiempo_segundos: tiempoSegundos
        });
      } catch (e) {
        console.error('Error guardando partida', e);
      }
    }

    if (this.gano) {
      Swal.fire({
        background: '#1e1e1e', color: '#fff',
        icon: 'success',
        title: '¡Ganaste! 🎉',
        html: `Adivinaste la palabra <b>${this.palabra}</b><br>Tiempo: ${tiempoSegundos}s · Letras usadas: ${this.letrasUsadas.length}`,
        confirmButtonText: 'Jugar de nuevo',
        confirmButtonColor: '#00ff88',
      }).then(() => this.nuevaPartida());
    } else {
      Swal.fire({
        background: '#1e1e1e', color: '#fff',
        icon: 'error',
        title: 'Perdiste 💀',
        html: `La palabra era <b>${this.palabra}</b>`,
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#007bff',
      }).then(() => this.nuevaPartida());
    }
  }
}
