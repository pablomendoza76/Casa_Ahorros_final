import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioReutilizableComponent } from '../../../shared/components/formulario-reutilizable/formulario-reutilizable.component';
import { SocioMapper } from '../../../mapping/socio.mapper';
import { PopupMensajeComponent } from '../../../shared/components/popup-mensaje/popup-mensaje.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actualizar-socio',
  standalone: true,
  imports: [
    CommonModule,
    FormularioReutilizableComponent,
    PopupMensajeComponent
  ],
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.scss'],
  providers: [SocioMapper]
})
export class ActualizarSocioComponent implements OnInit {
  camposBusqueda: any[] = [];
  camposFormularioEdicion: any[] = [];
  socioEncontrado: any = null;

  mensajeVisible = false;
  mensajeTexto = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  @ViewChild(FormularioReutilizableComponent)
  formularioComponent!: FormularioReutilizableComponent;

  constructor(private mapper: SocioMapper, private router: Router,) {}

  ngOnInit(): void {
    this.camposBusqueda = this.mapper.camposBusquedaCedula;
  }

  buscarSocio(datos: any): void {
    const cedula = datos.cedula;

    this.mapper.buscarSocioPorCedula(cedula).subscribe({
      next: (socio) => {
        if (socio) {
          this.socioEncontrado = socio;
          this.camposFormularioEdicion = this.mapper.obtenerCamposFormularioEdicion(socio);
        } else {
          this.mostrarMensaje('No se encontró socio con esa cédula', 'error');
        }
      },
      error: () => {
        this.mostrarMensaje('Error al buscar socio', 'error');
      }
    });
  }

  actualizar(datos: any): void {
    if (!this.socioEncontrado) return;

    this.mapper.actualizarSocio(this.socioEncontrado.id, datos).subscribe({
      next: () => {
        this.mostrarMensaje('Socio actualizado correctamente', 'exito');
      },
      error: () => {
        this.mostrarMensaje('Error al actualizar socio', 'error');
      }
    });
  }

  cancelarEdicion(): void {
    this.socioEncontrado = null;
    this.camposFormularioEdicion = [];
  }

  mostrarMensaje(texto: string, tipo: 'exito' | 'error') {
    this.mensajeTexto = texto;
    this.tipoMensaje = tipo;
    this.mensajeVisible = true;

    setTimeout(() => {
      this.mensajeVisible = false;
    }, 3000);
  }

  cerrarMensaje() {
    this.mensajeVisible = false;
  }

  volver(): void {
  // Ejemplo: volver al menú principal de usuarios
  this.router.navigate(['/usuarios/inicio']);
}

}
