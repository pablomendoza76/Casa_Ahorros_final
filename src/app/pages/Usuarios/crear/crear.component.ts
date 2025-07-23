import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormularioReutilizableComponent } from '../../../shared/components/formulario-reutilizable/formulario-reutilizable.component';
import { SocioMapper } from '../../../mapping/socio.mapper';
import { PopupMensajeComponent } from '../../../shared/components/popup-mensaje/popup-mensaje.component';

@Component({
  selector: 'app-crear-socio',
  standalone: true,
  imports: [
    FormularioReutilizableComponent,
    CommonModule, PopupMensajeComponent
  ],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss'],
  providers: [SocioMapper]
})
export class CrearComponent {
  campos: any[] = [];

  // Referencia al formulario reutilizable
  @ViewChild(FormularioReutilizableComponent)
  formularioComponent!: FormularioReutilizableComponent;

  // Popup personalizado
  mensajeVisible = false;
  mensajeTexto = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  constructor(
    private router: Router,
    private mapper: SocioMapper
  ) {
    this.campos = this.mapper.camposFormulario;
  }

  registrarUsuario(datos: any): void {
    this.mapper.registrarSocio(datos).subscribe({
      next: () => {
        this.mostrarMensaje('Cliente creado exitosamente', 'exito');
      },
      error: () => {
        this.mostrarMensaje('Error al crear cliente', 'error');
      }
    });
  }

  mostrarMensaje(texto: string, tipo: 'exito' | 'error') {
    this.mensajeTexto = texto;
    this.tipoMensaje = tipo;
    this.mensajeVisible = true;

    setTimeout(() => {
      this.mensajeVisible = false;

      if (tipo === 'exito') {
        this.formularioComponent?.resetFormulario();
      }
    }, 3000);
  }

  cerrarMensaje() {
    this.mensajeVisible = false;

    if (this.tipoMensaje === 'exito') {
      this.formularioComponent?.resetFormulario();
    }
  }

  irALista(): void {
    this.router.navigate(['/usuarios/listar']);
  }

  volver(): void {
    this.router.navigate(['/usuarios/inicio']);
  }
}
