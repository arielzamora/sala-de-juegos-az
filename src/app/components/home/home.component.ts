import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface GameCard {
  titulo: string;
  descripcion: string;
  emoji: string;
  imagen: string;
  ruta: string;
  color: string;
  deshabilitado?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  authService = inject(AuthService);
  router = inject(Router);

  readonly juegos: GameCard[] = [
    {
      titulo: 'Ahorcado',
      descripcion: 'Adiviná la palabra oculta letra por letra antes de que se complete la figura. ¡Tenés 6 intentos!',
      emoji: '💀',
      imagen: 'assets/games/ahorcado.png',
      ruta: '/ahorcado',
      color: '#007bff'
    },
    {
      titulo: 'Mayor o Menor',
      descripcion: 'Predecí si la siguiente carta de la baraja española será mayor o menor que la actual. 10 rondas.',
      emoji: '🃏',
      imagen: 'assets/games/mayor-menor.png',
      ruta: '/mayor-menor',
      color: '#17a2b8'
    },
    {
      titulo: 'Juego de Dados',
      descripcion: 'Tirá 2 dados e intentá obtener una suma de 7. Solo tenés 3 intentos para lograrlo.',
      emoji: '🎲',
      imagen: 'assets/games/dados.png',
      ruta: '/juego-dados',
      color: '#28a745'
    },
    {
      titulo: 'Preguntados',
      descripcion: 'Poné a prueba tu conocimiento respondiendo preguntas de múltiples categorías. ¡Próximamente!',
      emoji: '❓',
      imagen: 'assets/games/preguntados.png',
      ruta: '',
      color: '#fd7e14',
      deshabilitado: true
    },
    {
      titulo: 'Sala de Chat',
      descripcion: 'Chateá en tiempo real con todos los jugadores conectados. Los mensajes se actualizan instantáneamente.',
      emoji: '💬',
      imagen: 'assets/games/chat.png',
      ruta: '/chat',
      color: '#6f42c1'
    }
  ];

  navegar(ruta: string) {
    if (this.authService.currentUser()) {
      this.router.navigate([ruta]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (err) {
      console.error(err);
    }
  }
}
