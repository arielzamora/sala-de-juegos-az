import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  email: string = '';
  pass: string = '';
  confirmPass: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  async onRegister() {
    if (!this.email || !this.pass || !this.confirmPass) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'warning');
      return;
    }

    if (this.pass !== this.confirmPass) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.registeruser(this.email, this.pass);
      Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: 'Tu cuenta ha sido creada.',
        timer: 2000,
        showConfirmButton: false
      });
      this.router.navigate(['/home']);
    } catch (error: any) {
      Swal.fire('Error de Registro', error.message || 'No se pudo crear la cuenta', 'error');
    } finally {
      this.isLoading = false;
    }
  }
}
