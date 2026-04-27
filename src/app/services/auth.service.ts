import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Replaces createUserWithEmailAndPassword
  async registeruser(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: pass,
    });
    
    if (error) throw error;
    return data;
  }

  // Replaces signInWithEmailAndPassword
  async login(email: string, pass: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });

    if (error) throw error;
    return data;
  }

  // Replaces signOut
  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // Obtains user data if logged in
  async getAuth() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }
  
  // Realtime subscription to auth state changes (optional, similar to authState observable)
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  // Replaces updateProfile
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
