import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JuegosService } from '../../services/juegos.service';
import Swal from 'sweetalert2';

interface Carta {
  palo: string;    // coins, cups, swords, clubs
  valor: number;   // 1-7, 10-12
  imagen: string;  // URL del SVG
  nombre: string;  // Para mostrar en pantalla
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css'
})
export class MayorMenorComponent implements OnInit {
  private authService = inject(AuthService);
  private juegosService = inject(JuegosService);

  readonly BASE_URL = 'https://raw.githubusercontent.com/gjenkins20/spanish-playing-cards-svg/main/';
  readonly BACK_URL = `${this.BASE_URL}card_back.svg`;
  readonly PALOS = [
    { key: 'coins', nombre: 'Oros' },
    { key: 'cups', nombre: 'Copas' },
    { key: 'swords', nombre: 'Espadas' },
    { key: 'clubs', nombre: 'Bastos' }
  ];
  readonly VALORES = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  readonly TOTAL_RONDAS = 10;

  baraja: Carta[] = [];
  cartaActual: Carta | null = null;
  cartaSiguiente: Carta | null = null;
  mostrarSiguiente: boolean = false;
  resultado: 'correcto' | 'incorrecto' | null = null;

  aciertos: number = 0;
  rondaActual: number = 0;
  juegoTerminado: boolean = false;

  ngOnInit() {
    this.nuevaPartida();
  }

  private generarBaraja(): Carta[] {
    const cartas: Carta[] = [];
    for (const palo of this.PALOS) {
      for (const valor of this.VALORES) {
        const num = valor.toString().padStart(2, '0');
        cartas.push({
          palo: palo.key,
          valor: valor,
          imagen: `${this.BASE_URL}card_${palo.key}_${num}.svg`,
          nombre: `${valor} de ${palo.nombre}`
        });
      }
    }
    // Mezclar Fisher-Yates
    for (let i = cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
    }
    return cartas;
  }

  nuevaPartida() {
    this.baraja = this.generarBaraja();
    this.aciertos = 0;
    this.rondaActual = 0;
    this.juegoTerminado = false;
    this.resultado = null;
    this.mostrarSiguiente = false;
    this.cartaActual = this.baraja[this.rondaActual];
    this.cartaSiguiente = this.baraja[this.rondaActual + 1];
  }

  async adivinar(eleccion: 'mayor' | 'menor') {
    if (this.juegoTerminado || this.mostrarSiguiente || !this.cartaActual || !this.cartaSiguiente) return;

    const esmayor = this.cartaSiguiente.valor > this.cartaActual.valor;
    const esmenor = this.cartaSiguiente.valor < this.cartaActual.valor;
    const empate = this.cartaSiguiente.valor === this.cartaActual.valor;

    let acerto = false;
    if (!empate) {
      acerto = (eleccion === 'mayor' && esmayor) || (eleccion === 'menor' && esmenor);
    }

    this.resultado = acerto ? 'correcto' : 'incorrecto';
    if (acerto) this.aciertos++;
    this.mostrarSiguiente = true;
    this.rondaActual++;

    if (this.rondaActual >= this.TOTAL_RONDAS || this.rondaActual >= this.baraja.length - 1) {
      setTimeout(() => this.finalizarPartida(), 1500);
    } else {
      setTimeout(() => {
        this.cartaActual = this.cartaSiguiente;
        this.cartaSiguiente = this.baraja[this.rondaActual + 1];
        this.mostrarSiguiente = false;
        this.resultado = null;
      }, 1500);
    }
  }

  private async finalizarPartida() {
    this.juegoTerminado = true;
    const user = this.authService.currentUser();

    if (user) {
      try {
        await this.juegosService.guardarPartidaMayorMenor({
          user_id: user.id,
          user_email: user.email || '',
          cartas_acertadas: this.aciertos,
          total_cartas: this.TOTAL_RONDAS
        });
      } catch (e) {
        console.error('Error guardando partida', e);
      }
    }

    Swal.fire({
      background: '#1e1e1e', color: '#fff',
      icon: this.aciertos >= 7 ? 'success' : 'info',
      title: `¡Juego terminado! ${this.aciertos >= 7 ? '🏆' : '🎴'}`,
      html: `Acertaste <b>${this.aciertos} de ${this.TOTAL_RONDAS}</b> cartas`,
      confirmButtonText: 'Jugar de nuevo',
      confirmButtonColor: '#007bff',
    }).then(() => this.nuevaPartida());
  }
}
