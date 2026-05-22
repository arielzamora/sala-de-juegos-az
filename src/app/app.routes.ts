import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { ChatComponent } from './components/chat/chat.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  { path: 'resultados', component: ResultadosComponent },

  // Rutas protegidas por AuthGuard
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
  // Módulo de juegos con Lazy Loading
  {
    path: 'juegos',
    canActivate: [authGuard],
    loadChildren: () => import('./juegos/juegos.module').then(m => m.JuegosModule)
  },

  { path: '**', redirectTo: 'home' }
];
