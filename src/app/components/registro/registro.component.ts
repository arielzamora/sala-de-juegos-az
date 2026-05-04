import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

// Validador custom para contraseñas
function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('pass')?.value;
  const confirmPass = control.get('confirmPass')?.value;
  if (pass && confirmPass && pass !== confirmPass) {
    return { passwordsMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  registroForm: FormGroup;
  isLoading: boolean = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      edad: ['', [Validators.required, Validators.min(18)]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      confirmPass: ['', [Validators.required]]
    }, { validators: passwordsMatchValidator });
  }

  async onRegister() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      Swal.fire({
        background: '#1e1e1e', color: '#fff',
        title: 'Error', text: 'Revisa los campos en rojo.', icon: 'warning'
      });
      return;
    }

    this.isLoading = true;
    const { email, pass, nombre, apellido, edad } = this.registroForm.value;

    try {
      await this.authService.registeruser(email, pass, nombre, apellido, edad);
      Swal.fire({
        background: '#1e1e1e', color: '#fff',
        icon: 'success', title: '¡Registro Exitoso!', text: 'Tu cuenta ha sido creada.',
        timer: 2000, showConfirmButton: false
      });
      this.router.navigate(['/home']);
    } catch (error: any) {
      let msg = error.message || 'No se pudo crear la cuenta';
      if (msg.includes('already registered')) {
        msg = 'Este correo electrónico ya está registrado.';
      }
      Swal.fire({
        background: '#1e1e1e', color: '#fff',
        title: 'Error de Registro', text: msg, icon: 'error'
      });
    } finally {
      this.isLoading = false;
    }
  }
}
