import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required]]
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      Swal.fire({
        background: '#1e1e1e', color: '#fff',
        title: 'Error', text: 'Por favor, complete los campos correctamente.', icon: 'error'
      });
      return;
    }

    this.isLoading = true;
    const { email, pass } = this.loginForm.value;

    try {
      await this.authService.login(email, pass);
      Swal.fire({
        background: '#1e1e1e', color: '#fff',
        icon: 'success', title: '¡Bienvenido!', text: 'Has iniciado sesión correctamente.',
        timer: 1500, showConfirmButton: false
      });
      this.router.navigate(['/home']);
    } catch (error: any) {
      Swal.fire({
        background: '#1e1e1e', color: '#fff',
        title: 'Error de Autenticación', text: error.message || 'Credenciales inválidas', icon: 'error'
      });
    } finally {
      this.isLoading = false;
    }
  }

  fastLogin(type: string) {
    if (type === 'admin') {
      this.loginForm.setValue({ email: 'admin@admin.com', pass: '111111' });
    } else if (type === 'invitado') {
      this.loginForm.setValue({ email: 'invitado@invitado.com', pass: '222222' });
    } else if (type === 'tester') {
      this.loginForm.setValue({ email: 'tester@tester.com', pass: '333333' });
    }
  }
}
