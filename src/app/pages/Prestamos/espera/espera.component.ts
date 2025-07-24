import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TablaDinamicaComponent } from '../../../shared/components/tabla-dinamica/tabla-dinamica.component';
import { PrestamoService } from '../../../services/prestamos.service/prestamo.service';
import { PrestamosMapper } from '../../../mapping/prestamos.mapper';
import { ConfiguracionColumna } from '../../../shared/components/tabla-dinamica/ConfiguracionColumna.model';
import { FormularioReutilizableComponent } from '../../../shared/components/formulario-reutilizable/formulario-reutilizable.component';

@Component({
  selector: 'app-espera',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    MatIconModule,
    FormularioReutilizableComponent,
  ],
  templateUrl: './espera.component.html',
  styleUrl: './espera.component.scss'
})
export class EsperaComponent implements OnInit, AfterViewInit {
  prestamos: any[] = [];
  columnas: ConfiguracionColumna[] = [];

  // Modal
  modalAbierto: boolean = false;
  prestamoSeleccionado: any = null;
  camposFormulario: any[] = [];

  @ViewChild('nombreTpl') nombreTpl!: TemplateRef<any>;
  @ViewChild('infoTpl') infoTpl!: TemplateRef<any>;
  @ViewChild('montoTpl') montoTpl!: TemplateRef<any>;
  @ViewChild('pendienteTpl') pendienteTpl!: TemplateRef<any>;
  @ViewChild('interesTpl') interesTpl!: TemplateRef<any>;
  @ViewChild('plazoTpl') plazoTpl!: TemplateRef<any>;
  @ViewChild('estadoTpl') estadoTpl!: TemplateRef<any>;
  @ViewChild('fechaTpl') fechaTpl!: TemplateRef<any>;

  constructor(
    private prestamoService: PrestamoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarPrestamos();
  }

  ngAfterViewInit(): void {
    this.columnas = [
      { titulo: 'Nombre', tipo: 'texto', template: this.nombreTpl },
      { titulo: 'Información', tipo: 'texto', template: this.infoTpl },
      { titulo: 'Monto', tipo: 'texto', template: this.montoTpl },
      { titulo: 'Pendiente', tipo: 'texto', template: this.pendienteTpl },
      { titulo: 'Interés', tipo: 'texto', template: this.interesTpl },
      { titulo: 'Plazo', tipo: 'texto', template: this.plazoTpl },
      { titulo: 'Estado', tipo: 'texto', template: this.estadoTpl },
      { titulo: 'Solicitado el', tipo: 'texto', template: this.fechaTpl },
    ];
    this.cdr.detectChanges();
  }

  volver(): void {
    this.router.navigate(['prestamos/inicio']);
  }

  async cargarPrestamos(): Promise<void> {
    this.prestamos = await PrestamosMapper.obtenerPrestamosPorEstado(this.prestamoService, 'en_espera');
    this.cdr.detectChanges();
  }

  abrirModal(prestamo: any): void {
    this.prestamoSeleccionado = prestamo;
    this.camposFormulario = [
      { key: 'nombre_completo', label: 'Nombre Completo', tipo: 'texto', value: prestamo.nombre_completo, deshabilitado: true },
      { key: 'correo', label: 'Correo Electrónico', tipo: 'texto', value: prestamo.correo, deshabilitado: true },
      { key: 'telefono', label: 'Teléfono', tipo: 'texto', value: prestamo.telefono, deshabilitado: true },
      { key: 'monto', label: 'Monto Solicitado', tipo: 'numero', value: prestamo.monto, deshabilitado: true },
      { key: 'interes', label: 'Interés (%)', tipo: 'numero', value: prestamo.interes, deshabilitado: true },
      { key: 'plazo', label: 'Plazo (meses)', tipo: 'numero', value: prestamo.plazo, deshabilitado: true },
    ];
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.prestamoSeleccionado = null;
    this.camposFormulario = [];
  }

  async aprobarPrestamo(): Promise<void> {
    console.log('Aprobando préstamo:', this.prestamoSeleccionado);
    if (this.prestamoSeleccionado?.id) {
      await this.actualizarEstado(this.prestamoSeleccionado.id, 'aceptado');
      this.cerrarModal();
    }
  }

  async rechazarPrestamo(): Promise<void> {
    if (this.prestamoSeleccionado?.id) {
      await this.actualizarEstado(this.prestamoSeleccionado.id, 'rechazado');
      this.cerrarModal();
    }
  }

  private async actualizarEstado(id: number, nuevoEstado: string): Promise<void> {
    await this.prestamoService.cambiarEstadoPrestamo(id, nuevoEstado as any);
    await this.cargarPrestamos();
  }
}
