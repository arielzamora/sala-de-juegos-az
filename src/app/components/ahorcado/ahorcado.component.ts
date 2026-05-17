import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JuegosService } from '../../services/juegos.service';
import Swal from 'sweetalert2';
import { TablaResultadosComponent, ColumnaTabla } from '../tabla-resultados/tabla-resultados.component';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, RouterLink, TablaResultadosComponent],
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
  puntaje: number = 60;

  // Modal Resultados
  mostrarResultados: boolean = false;
  resultados: any[] = [];
  columnas: ColumnaTabla[] = [
    { key: 'user_email', label: 'Jugador', type: 'email' },
    { key: 'gano', label: 'Resultado', type: 'boolean' },
    { key: 'tiempo_segundos', label: 'Tiempo (s)' },
    { key: 'puntaje', label: 'Puntaje' },
    { key: 'created_at', label: 'Fecha', type: 'date' }
  ];

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

  async abrirResultados() {
    try {
      this.resultados = await this.juegosService.getResultadosAhorcado();
      this.mostrarResultados = true;
    } catch (e) {
      console.error('Error cargando ranking', e);
    }
  }

  nuevaPartida() {
    this.palabra = this.PALABRAS[Math.floor(Math.random() * this.PALABRAS.length)];
    this.letrasUsadas = [];
    this.intentosRestantes = this.MAX_INTENTOS;
    this.juegoTerminado = false;
    this.tiempoInicio = new Date();
    this.puntaje = 60;
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

  sumarPuntos() {
    this.puntaje = 60 - (this.errores * 10);
    // Asegurarse de que no baje de 0
    if (this.puntaje < 0) this.puntaje = 0;
  }

  private async finalizarPartida() {
    this.sumarPuntos();

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
          tiempo_segundos: tiempoSegundos,
          puntaje: this.puntaje
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
