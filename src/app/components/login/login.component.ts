import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  pass: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    if (!this.email || !this.pass) {
      Swal.fire('Error', 'Por favor complete todos los campos', 'error');
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.login(this.email, this.pass);
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Has iniciado sesión correctamente.',
        timer: 1500,
        showConfirmButton: false
      });
      this.router.navigate(['/home']);
    } catch (error: any) {
      Swal.fire('Error de Autenticación', error.message || 'Credenciales inválidas', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  fillAdmin() {
    this.email = 'admin@admin.com';
    this.pass = '111111';
  }
}
