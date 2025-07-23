import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocioMapper } from '../../../mapping/socio.mapper';
import { FormularioReutilizableComponent } from '../../../shared/components/formulario-reutilizable/formulario-reutilizable.component';
import { PopupMensajeComponent } from '../../../shared/components/popup-mensaje/popup-mensaje.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormularioReutilizableComponent,
    PopupMensajeComponent,
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [SocioMapper]
})
export class PerfilComponent implements OnInit {
  socio: any = null;
  camposFormulario: any[] = [];
  modoEdicion = false;

  mensajeVisible = false;
  mensajeTexto = '';
  tipoMensaje: 'exito' | 'error' = 'exito';
 imagenValida: boolean | null = null;


  @ViewChild(FormularioReutilizableComponent)
  formularioComponent!: FormularioReutilizableComponent;

  constructor(
    private mapper: SocioMapper,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  /**  Carga los datos del socio (temporalmente con cédula fija) */
  cargarPerfil(): void {
    const cedulaUsuario = '1105662157'; // Reemplázalo por la cédula real del usuario

    this.mapper.buscarSocioPorCedula(cedulaUsuario).subscribe({
      next: (socio) => {
        if (socio) {
          this.socio = socio;
          this.camposFormulario = this.mapper.obtenerCamposFormularioEdicion(socio);
        } else {
          this.mostrarMensaje('No se encontró el perfil del socio.', 'error');
        }
      },
      error: () => {
        this.mostrarMensaje('Error al cargar el perfil.', 'error');
      }
    });
  }

  /**  Activa modo edición y deshabilita ciertos campos */
  activarEdicion(): void {
    this.modoEdicion = true;

    this.camposFormulario = this.camposFormulario.map(campo => ({
      ...campo,
      deshabilitado: ['nombres', 'apellidos', 'cedula', 'numeroCuenta', 'tipoCuenta'].includes(campo.key)
    }));
  }

  /**  Guarda los cambios y cierra el popup */
  guardarCambios(datos: any): void {
    if (!this.socio?.id) return;

    this.mapper.actualizarSocio(this.socio.id, datos).subscribe({
      next: () => {
        this.mostrarMensaje('Perfil actualizado correctamente.', 'exito');
        this.modoEdicion = false;
        this.cargarPerfil();
      },
      error: () => {
        this.mostrarMensaje('Error al actualizar el perfil.', 'error');
      }
    });
  }

  /**  Cancela la edición y vuelve al modo normal */
  cancelar(): void {
    this.modoEdicion = false;
    this.cargarPerfil();
  }

  /**  Muestra popup de mensaje */
  mostrarMensaje(texto: string, tipo: 'exito' | 'error') {
    this.mensajeTexto = texto;
    this.tipoMensaje = tipo;
    this.mensajeVisible = true;
    setTimeout(() => {
      this.mensajeVisible = false;
    }, 3000);
  }

  /**  Cierra el mensaje manualmente */
  cerrarMensaje(): void {
    this.mensajeVisible = false;
  }

  /**  Navega de vuelta al inicio */
  volver(): void {
    this.router.navigate(['/inicio']);
  }
}
