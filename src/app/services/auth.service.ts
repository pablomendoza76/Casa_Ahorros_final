import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../env/environment';
import { firstValueFrom } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: 'admin' | 'cajero' | 'socio';
  contrasena: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.supabaseUrl}/rest/v1/usuarios`;

  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`,
    'Content-Type': 'application/json'
  });

  private usuarioActual: Usuario | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Intenta iniciar sesión con correo y contraseña.
   */
  async login(correo: string, contrasena: string): Promise<boolean> {
    const params = new HttpParams()
      .set('correo', `eq.${correo.trim()}`)
      .set('contrasena', `eq.${contrasena.trim()}`);

    const res$ = this.http.get<Usuario[]>(this.baseUrl, {
      headers: this.headers,
      params
    });

    try {
      const usuarios = await firstValueFrom(res$);
      const usuario = usuarios[0];

      if (usuario) {
        this.usuarioActual = usuario;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        return true;
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
    }

    return false;
  }

  logout(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  getUsuario(): Usuario | null {
    if (!this.usuarioActual) {
      const almacenado = localStorage.getItem('usuario');
      this.usuarioActual = almacenado ? JSON.parse(almacenado) : null;
    }
    return this.usuarioActual;
  }

  tieneRol(rol: string): boolean {
    return this.getUsuario()?.rol === rol;
  }

  estaAutenticado(): boolean {
    return !!this.getUsuario();
  }
}
