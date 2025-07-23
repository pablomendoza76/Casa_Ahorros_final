import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent } from '../../../shared/components/tabla-dinamica/tabla-dinamica.component';
import { ConfiguracionColumna } from '../../../shared/components/tabla-dinamica/ConfiguracionColumna.model';
import { AportesMapper } from '../../../mapping/aportes.mapper';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gestion-aportes',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, MatIconModule],
  templateUrl: './gestion-aportes.component.html',
  styleUrls: ['./gestion-aportes.component.scss'],
  providers: [AportesMapper]
})
export class GestionAportesComponent implements OnInit, AfterViewInit {
  filas: any[] = [];
  configuracionColumnas: ConfiguracionColumna[] = [];

  @ViewChild('columnaFoto') columnaFoto!: TemplateRef<any>;
  @ViewChild('columnaNombre') columnaNombre!: TemplateRef<any>;
  @ViewChild('columnaContacto') columnaContacto!: TemplateRef<any>;
  @ViewChild('columnaAccion') columnaAccion!: TemplateRef<any>;

  constructor(
    private mapper: AportesMapper,
    private router: Router,
    private cdr: ChangeDetectorRef   // ✅ Inyectas ChangeDetectorRef aquí
  ) {}

  ngOnInit(): void {
    this.cargarSocios();
  }

  ngAfterViewInit(): void {
    this.configuracionColumnas = [
      { tipo: 'imagen', template: this.columnaFoto },
      { tipo: 'texto', template: this.columnaNombre },
      { tipo: 'texto', template: this.columnaContacto },
      { tipo: 'otros', template: this.columnaAccion }
    ];

    this.cdr.detectChanges();  // ✅ Llamada para evitar ExpressionChangedAfterItHasBeenCheckedError
  }

  /**
   * Carga los socios desde el mapper
   */
  cargarSocios(): void {
    this.mapper.obtenerSocios().subscribe({
      next: socios => this.filas = socios,
      error: () => console.error('Error al cargar socios')
    });
  }

  /**
   * Navega a visualizar los aportes del socio
   */
  irAVisualizarAportes(cedula: string): void {
    this.mapper.obtenerCuentaPorCedula(cedula).subscribe({
      next: numeroCuenta => {
        if (numeroCuenta) {
          this.router.navigate(['/visualizar-aportes', numeroCuenta]);
        } else {
          console.error('No se encontró cuenta para el socio');
        }
      },
      error: () => console.error('Error al buscar cuenta del socio')
    });
  }

  /**
   * Botón de volver al menú principal
   */
  volver(): void {
    this.router.navigate(['/inicio']);
  }
}
