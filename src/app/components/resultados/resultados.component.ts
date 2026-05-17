import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { JuegosService } from '../../services/juegos.service';

import { TablaResultadosComponent, ColumnaTabla } from '../tabla-resultados/tabla-resultados.component';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, TablaResultadosComponent],
  providers: [DatePipe],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})
export class ResultadosComponent implements OnInit {
  private juegosService = inject(JuegosService);

  resultadosAhorcado: any[] = [];
  resultadosMayorMenor: any[] = [];
  resultadosDados: any[] = [];
  resultadosPreguntados: any[] = [];

  cargando: boolean = true;
  error: string | null = null;

  colsAhorcado: ColumnaTabla[] = [
    { key: 'user_email', label: 'Jugador', type: 'email' },
    { key: 'gano', label: 'Resultado', type: 'boolean' },
    { key: 'tiempo_segundos', label: 'Tiempo (s)' },
    { key: 'puntaje', label: 'Puntaje' },
    { key: 'created_at', label: 'Fecha', type: 'date' }
  ];

  colsMayorMenor: ColumnaTabla[] = [
    { key: 'user_email', label: 'Jugador', type: 'email' },
    { key: 'cartas_acertadas', label: 'Acertadas' },
    { key: 'total_cartas', label: 'Total' },
    { key: 'puntaje', label: 'Puntaje' },
    { key: 'created_at', label: 'Fecha', type: 'date' }
  ];

  colsDados: ColumnaTabla[] = [
    { key: 'user_email', label: 'Jugador', type: 'email' },
    { key: 'gano', label: 'Resultado', type: 'boolean' },
    { key: 'intentos_usados', label: 'Intentos' },
    { key: 'puntaje', label: 'Puntaje' },
    { key: 'created_at', label: 'Fecha', type: 'date' }
  ];

  colsPreguntados: ColumnaTabla[] = [
    { key: 'user_email', label: 'Jugador', type: 'email' },
    { key: 'preguntas_acertadas', label: 'Acertadas' },
    { key: 'total_preguntas', label: 'Total' },
    { key: 'puntaje', label: 'Puntaje' },
    { key: 'created_at', label: 'Fecha', type: 'date' }
  ];

  async ngOnInit() {
    this.cargando = true;
    try {
      const [ahorcado, mayorMenor, dados, preguntados] = await Promise.all([
        this.juegosService.getResultadosAhorcado(),
        this.juegosService.getResultadosMayorMenor(),
        this.juegosService.getResultadosDados(),
        this.juegosService.getResultadosPreguntados()
      ]);

      this.resultadosAhorcado = ahorcado || [];
      this.resultadosMayorMenor = mayorMenor || [];
      this.resultadosDados = dados || [];
      this.resultadosPreguntados = preguntados || [];
    } catch (e: any) {
      this.error = e.message || 'Error al cargar los resultados';
      console.error(e);
    } finally {
      this.cargando = false;
    }
  }
}
