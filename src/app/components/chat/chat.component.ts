import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JuegosService } from '../../services/juegos.service';
import { RealtimeChannel } from '@supabase/supabase-js';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('mensajesContainer') mensajesContainer!: ElementRef;

  private authService = inject(AuthService);
  private juegosService = inject(JuegosService);

  mensajes: any[] = [];
  nuevoMensaje: string = '';
  enviando: boolean = false;
  private canal!: RealtimeChannel;
  private debeScrollear = false;

  get usuario() {
    return this.authService.currentUser();
  }

  async ngOnInit() {
    await this.cargarMensajes();
    this.suscribirseAlRealtime();
  }

  ngAfterViewChecked() {
    if (this.debeScrollear) {
      this.scrollAlFinal();
      this.debeScrollear = false;
    }
  }

  ngOnDestroy() {
    if (this.canal) {
      this.canal.unsubscribe();
    }
  }

  private async cargarMensajes() {
    try {
      this.mensajes = await this.juegosService.getMensajes() ?? [];
      this.debeScrollear = true;
    } catch (e) {
      console.error('Error cargando mensajes', e);
    }
  }

  private suscribirseAlRealtime() {
    this.canal = this.juegosService.suscribirseAlChat((mensaje) => {
      // Evitar duplicados si ya lo recibimos vía insert local
      const existe = this.mensajes.some(m => m.id === mensaje.id);
      if (!existe) {
        this.mensajes.push(mensaje);
        this.debeScrollear = true;
      }
    });
  }

  async enviar() {
    const texto = this.nuevoMensaje.trim();
    if (!texto || !this.usuario || this.enviando) return;

    this.enviando = true;
    const mensajeTemporal = {
      id: 'temp-' + Date.now(),
      user_id: this.usuario.id,
      user_email: this.usuario.email,
      mensaje: texto,
      created_at: new Date().toISOString()
    };

    // Mostrar inmediatamente (optimistic update)
    this.mensajes.push(mensajeTemporal);
    this.nuevoMensaje = '';
    this.debeScrollear = true;

    try {
      await this.juegosService.enviarMensaje({
        user_id: this.usuario.id,
        user_email: this.usuario.email || '',
        mensaje: texto
      });
    } catch (e) {
      // Revertir si falla
      this.mensajes = this.mensajes.filter(m => m.id !== mensajeTemporal.id);
      console.error('Error enviando mensaje', e);
    } finally {
      this.enviando = false;
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }

  private scrollAlFinal() {
    try {
      const el = this.mensajesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }

  esMio(msg: any): boolean {
    return msg.user_id === this.usuario?.id;
  }

  getUsernameFrom(email: string): string {
    return email?.split('@')?.[0] ?? email;
  }
}
