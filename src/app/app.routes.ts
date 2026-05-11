import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { AhorcadoComponent } from './components/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './components/mayor-menor/mayor-menor.component';
import { ChatComponent } from './components/chat/chat.component';
import { JuegoDadosComponent } from './components/juego-dados/juego-dados.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'quien-soy', component: QuienSoyComponent },

  // Rutas protegidas por AuthGuard
  { path: 'ahorcado',     component: AhorcadoComponent,   canActivate: [authGuard] },
  { path: 'mayor-menor',  component: MayorMenorComponent, canActivate: [authGuard] },
  { path: 'chat',         component: ChatComponent,        canActivate: [authGuard] },
  { path: 'juego-dados',  component: JuegoDadosComponent,  canActivate: [authGuard] },

  { path: '**', redirectTo: 'home' }
];
