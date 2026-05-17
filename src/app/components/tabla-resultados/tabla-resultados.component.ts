import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColumnaTabla {
  key: string;
  label: string;
  type?: 'boolean' | 'date' | 'email';
}

@Component({
  selector: 'app-tabla-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-resultados.component.html',
  styleUrl: './tabla-resultados.component.css'
})
export class TablaResultadosComponent {
  @Input() titulo: string = '';
  @Input() icono: string = '';
  @Input() colorClass: string = 'primary';
  @Input() datos: any[] = [];
  @Input() columnas: ColumnaTabla[] = [];
}
