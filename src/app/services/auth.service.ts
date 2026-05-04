import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  public currentUser = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    // Check initial session
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.currentUser.set(session?.user ?? null);
    });

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.set(session?.user ?? null);
    });
  }

  // Lógica doble: Registro en Auth + Inserción en DB 'usuarios'
  async registeruser(email: string, pass: string, nombre: string, apellido: string, edad: number) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: pass,
    });
    
    if (error) throw error;
    
    if (data.user) {
      const { error: dbError } = await this.supabase.from('usuarios').insert({
        id: data.user.id,
        nombre: nombre,
        apellido: apellido,
        edad: edad
      });
      
      if (dbError) {
        console.error("Error guardando datos adicionales", dbError);
        throw new Error("Usuario creado en auth pero falló al guardar datos extra.");
      }
    }

    return data;
  }

  async login(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });

    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async updateProfile(newName: string, photoURL: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      data: {
        displayName: newName,
        photoURL: photoURL
      }
    });

    if (error) throw error;
    return data;
  }
}
