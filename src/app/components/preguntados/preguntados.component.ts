import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JuegosService } from '../../services/juegos.service';
import Swal from 'sweetalert2';
import { TablaResultadosComponent, ColumnaTabla } from '../tabla-resultados/tabla-resultados.component';

interface Question {
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  options: string[];
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, RouterLink, TablaResultadosComponent],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent implements OnInit {
  private authService = inject(AuthService);
  private juegosService = inject(JuegosService);

  preguntas: Question[] = [];
  preguntaActualIndex: number = 0;
  preguntasAcertadas: number = 0;
  juegoTerminado: boolean = false;
  cargando: boolean = true;
  error: string | null = null;
  respondido: boolean = false;
  opcionSeleccionada: string | null = null;
  vidas: number = 3;
  puntaje: number = 0;

  mostrarResultados: boolean = false;
  resultados: any[] = [];
  columnas: ColumnaTabla[] = [
    { key: 'user_email', label: 'Jugador', type: 'email' },
    { key: 'preguntas_acertadas', label: 'Acertadas' },
    { key: 'total_preguntas', label: 'Total' },
    { key: 'puntaje', label: 'Puntaje' },
    { key: 'created_at', label: 'Fecha', type: 'date' }
  ];

  ngOnInit() {
    this.cargarPreguntas();
  }

  async abrirResultados() {
    try {
      this.resultados = await this.juegosService.getResultadosPreguntados();
      this.mostrarResultados = true;
    } catch (e) {
      console.error('Error cargando ranking', e);
    }
  }

  async cargarPreguntas() {
    this.cargando = true;
    this.error = null;
    try {
      // Usamos la API de Open Trivia DB
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
      if (!response.ok) {
        throw new Error('Error al obtener las preguntas');
      }
      const data = await response.json();
      if (data.response_code !== 0) {
        throw new Error('No se pudieron cargar preguntas de la API');
      }

      this.preguntas = data.results.map((q: any) => {
        const options = [...q.incorrect_answers, q.correct_answer];
        // Mezclar las opciones
        options.sort(() => Math.random() - 0.5);
        return {
          ...q,
          question: this.decodeHtml(q.question),
          correct_answer: this.decodeHtml(q.correct_answer),
          options: options.map(opt => this.decodeHtml(opt))
        };
      });

      this.iniciarJuego();
    } catch (e: any) {
      this.error = e.message || 'Error desconocido';
    } finally {
      this.cargando = false;
    }
  }

  decodeHtml(html: string) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  iniciarJuego() {
    this.preguntaActualIndex = 0;
    this.preguntasAcertadas = 0;
    this.juegoTerminado = false;
    this.respondido = false;
    this.opcionSeleccionada = null;
    this.vidas = 3;
    this.puntaje = 0;
  }

  get preguntaActual(): Question {
    return this.preguntas[this.preguntaActualIndex];
  }

  async seleccionarOpcion(opcion: string) {
    if (this.respondido || this.juegoTerminado) return;

    this.respondido = true;
    this.opcionSeleccionada = opcion;

    const esCorrecta = opcion === this.preguntaActual.correct_answer;
    if (esCorrecta) {
      this.preguntasAcertadas++;
      Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: '¡Correcto! +10 pts',
        showConfirmButton: false, timer: 1200,
        background: '#1e1e1e', color: '#fff'
      });
    } else {
      Swal.fire({
        toast: true, position: 'top-end', icon: 'error',
        title: '¡Incorrecto! Pierdes 1 vida',
        showConfirmButton: false, timer: 1200,
        background: '#1e1e1e', color: '#fff'
      });
    }
    
    this.sumarPuntos(esCorrecta);

    // Esperar un momento para que el usuario vea si acertó
    setTimeout(async () => {
      if (this.vidas <= 0) {
        await this.finalizarJuego();
      } else if (this.preguntaActualIndex < this.preguntas.length - 1) {
        this.preguntaActualIndex++;
        this.respondido = false;
        this.opcionSeleccionada = null;
      } else {
        await this.finalizarJuego();
      }
    }, 1500);
  }

  sumarPuntos(acerto: boolean) {
    if (acerto) {
      this.puntaje += 10;
    } else {
      this.vidas--;
    }
  }

  async finalizarJuego() {
    this.juegoTerminado = true;
    const user = this.authService.currentUser();
    
    if (user) {
      try {
        await this.juegosService.guardarPartidaPreguntados({
          user_id: user.id,
          user_email: user.email || '',
          preguntas_acertadas: this.preguntasAcertadas,
          total_preguntas: this.preguntas.length,
          puntaje: this.puntaje
        });
      } catch (e) {
        console.error('Error guardando la partida:', e);
      }
    }

    Swal.fire({
      background: '#1e1e1e', color: '#fff',
      icon: this.preguntasAcertadas >= 5 ? 'success' : 'info',
      title: '¡Juego Terminado!',
      html: `Has acertado <b>${this.preguntasAcertadas}</b> de <b>${this.preguntas.length}</b> preguntas.`,
      confirmButtonText: 'Jugar de nuevo',
      confirmButtonColor: '#00ff88',
      showCancelButton: true,
      cancelButtonText: 'Volver',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargarPreguntas();
      }
    });
  }
}
