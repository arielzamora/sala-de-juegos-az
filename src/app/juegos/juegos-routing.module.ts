import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'ahorcado',
    loadComponent: () => import('../components/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent)
  },
  {
    path: 'mayor-menor',
    loadComponent: () => import('../components/mayor-menor/mayor-menor.component').then(m => m.MayorMenorComponent)
  },
  {
    path: 'juego-dados',
    loadComponent: () => import('../components/juego-dados/juego-dados.component').then(m => m.JuegoDadosComponent)
  },
  {
    path: 'preguntados',
    loadComponent: () => import('../components/preguntados/preguntados.component').then(m => m.PreguntadosComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
