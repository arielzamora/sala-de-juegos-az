import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JuegosService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // ============================================================
  // AHORCADO
  // ============================================================
  async guardarPartidaAhorcado(data: {
    user_id: string;
    user_email: string;
    palabra: string;
    letras_usadas: string[];
    gano: boolean;
    tiempo_segundos: number;
    puntaje: number;
  }) {
    const { error } = await this.supabase
      .from('partidas_ahorcado')
      .insert(data);
    if (error) throw error;
  }

  // ============================================================
  // MAYOR O MENOR
  // ============================================================
  async guardarPartidaMayorMenor(data: {
    user_id: string;
    user_email: string;
    cartas_acertadas: number;
    total_cartas: number;
    puntaje: number;
  }) {
    const { error } = await this.supabase
      .from('partidas_mayor_menor')
      .insert(data);
    if (error) throw error;
  }

  // ============================================================
  // DADOS
  // ============================================================
  async guardarPartidaDados(data: {
    user_id: string;
    user_email: string;
    gano: boolean;
    intentos_usados: number;
    puntaje: number;
    resultados: { dado1: number; dado2: number; suma: number }[];
  }) {
    const { error } = await this.supabase
      .from('partidas_dados')
      .insert(data);
    if (error) throw error;
  }

  // ============================================================
  // CHAT - Cargar mensajes iniciales
  // ============================================================
  async getMensajes() {
    const { data, error } = await this.supabase
      .from('mensajes_chat')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);
    if (error) throw error;
    return data;
  }

  // CHAT - Enviar mensaje
  async enviarMensaje(data: {
    user_id: string;
    user_email: string;
    mensaje: string;
  }) {
    const { error } = await this.supabase
      .from('mensajes_chat')
      .insert(data);
    if (error) throw error;
  }

  // CHAT - Suscripción realtime
  suscribirseAlChat(callback: (mensaje: any) => void) {
    return this.supabase
      .channel('chat-global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes_chat' },
        (payload) => callback(payload.new)
      )
      .subscribe();
  }

  // ============================================================
  // PREGUNTADOS
  // ============================================================
  async guardarPartidaPreguntados(data: {
    user_id: string;
    user_email: string;
    preguntas_acertadas: number;
    total_preguntas: number;
    puntaje: number;
  }) {
    const { error } = await this.supabase
      .from('partidas_preguntados')
      .insert(data);
    if (error) throw error;
  }

  // ============================================================
  // RESULTADOS (RANKINGS)
  // ============================================================
  async getResultadosAhorcado() {
    const { data, error } = await this.supabase
      .from('partidas_ahorcado')
      .select('*')
      .order('puntaje', { ascending: false })
      .order('gano', { ascending: false })
      .order('tiempo_segundos', { ascending: true })
      .limit(20);
    if (error) throw error;
    return data;
  }

  async getResultadosMayorMenor() {
    const { data, error } = await this.supabase
      .from('partidas_mayor_menor')
      .select('*')
      .order('puntaje', { ascending: false })
      .limit(20);
    if (error) throw error;
    return data;
  }

  async getResultadosDados() {
    const { data, error } = await this.supabase
      .from('partidas_dados')
      .select('*')
      .order('puntaje', { ascending: false })
      .order('gano', { ascending: false })
      .limit(20);
    if (error) throw error;
    return data;
  }

  async getResultadosPreguntados() {
    const { data, error } = await this.supabase
      .from('partidas_preguntados')
      .select('*')
      .order('puntaje', { ascending: false })
      .limit(20);
    if (error) throw error;
    return data;
  }
}
