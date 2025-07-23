import { Component } from '@angular/core'; 
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  mostrarContrasena: boolean = false;

  mostrarModal: boolean = false;
  mensajeModal: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Inicia sesión usando AuthService y redirige según el rol.
   * Si falla, muestra un modal explicando el problema.
   */
  async onIniciarSesion(): Promise<void> {
    const exito = await this.authService.login(this.correo, this.contrasena);

    if (exito) {
      const usuario = this.authService.getUsuario();
      console.log('ROL:', usuario?.rol);

      if (usuario?.rol === 'admin') {
        this.router.navigate(['/inicio']).catch(() => {
          this.mostrarModal = true;
          this.mensajeModal = 'No se pudo redirigir a /usuarios/inicio. Verifica la ruta.';
        });
      } else if (usuario?.rol === 'cajero') {
        this.router.navigate(['/inicio']).catch(() => {
          this.mostrarModal = true;
          this.mensajeModal = 'No se pudo redirigir a /inicio. Verifica la ruta.';
        });
      } else if (usuario?.rol === 'socio') {
        this.router.navigate(['/inicio_socios']).catch(() => {
          this.mostrarModal = true;
          this.mensajeModal = 'No se pudo redirigir a /inicio_socios. Verifica la ruta.';
        });
      } else {
        this.mostrarModal = true;
        this.mensajeModal = 'Tu rol no tiene acceso a esta plataforma.';
      }
    } else {
      this.mostrarModal = true;
      this.mensajeModal = 'Credenciales incorrectas. Intenta nuevamente.';
    }
  }

  toggleContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }
}
