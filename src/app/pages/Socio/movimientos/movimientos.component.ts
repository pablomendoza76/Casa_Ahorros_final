import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent } from '../../../shared/components/tabla-dinamica/tabla-dinamica.component';
import { ConfiguracionColumna } from '../../../shared/components/tabla-dinamica/ConfiguracionColumna.model';
import { SocioMapper } from '../../../mapping/socio.mapper';
import { AportesMapper } from '../../../mapping/aportes.mapper';
import { Router } from '@angular/router';
import { MenuReusableComponent } from '../../../shared/components/menu-reusable/menu-reusable.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    MenuReusableComponent,
    MatIconModule
  ],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})
export class MovimientosComponent implements OnInit, AfterViewInit {
  movimientos: any[] = [];
  columnas: ConfiguracionColumna[] = [];

  @ViewChild('tipoTpl') tipoTpl!: TemplateRef<any>;
  @ViewChild('cuentaTpl') cuentaTpl!: TemplateRef<any>;
  @ViewChild('montoTpl') montoTpl!: TemplateRef<any>;
  @ViewChild('fechaTpl') fechaTpl!: TemplateRef<any>;
  @ViewChild('descTpl') descTpl!: TemplateRef<any>;

  datosSocio: {
    nombre: string;
    apellido: string;
    saldo: number;
    numeroCuenta: string;
  } | null = null;

  menuOpciones = [
    { svg: '/svg/Socios/Estado.svg', etiqueta: 'Estado de Cuenta', ruta: '/inicio_socios' },
    { svg: '/svg/Socios/simulador.svg', etiqueta: 'Simulador', ruta: '/simulador' },
    { svg: '/svg/Socios/prestamos.svg', etiqueta: 'Movimientos', ruta: '/movimientos' },
    { svg: '/svg/Socios/Deposito.svg', etiqueta: 'Préstamos', ruta: '/prestamos' },
  ];

  constructor(
    private socioMapper: SocioMapper,
    private aportesMapper: AportesMapper,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.socioMapper.obtenerSocioAutenticado().subscribe({
      next: socio => {
        const cedula = socio?.identificacion;
        if (!cedula) {
          console.warn('⚠️ El socio no tiene cédula definida.');
          return;
        }

        this.aportesMapper.obtenerCuentaPorCedula(cedula).subscribe({
          next: numeroCuenta => {
            if (!numeroCuenta) {
              console.warn('⚠️ No se encontró número de cuenta para el socio.');
              return;
            }

            // Obtener datos de la cuenta (incluye saldo)
            this.aportesMapper.obtenerCuentaConMovimientos(numeroCuenta).subscribe({
              next: cuentaConMov => {
                const cuenta = cuentaConMov.cuenta;
                this.datosSocio = {
                  nombre: socio?.nombre ?? '',
                  apellido: socio?.apellido ?? '',
                  saldo: cuenta?.saldo ?? 0,
                  numeroCuenta: cuenta?.numero_cuenta ?? numeroCuenta
                };

                this.movimientos = cuentaConMov.movimientos.map(m => ({
                  ...m,
                  numero_cuenta: cuenta?.numero_cuenta ?? numeroCuenta
                }));

                this.cdr.detectChanges();
              },
              error: err => console.error('❌ Error al obtener cuenta con movimientos:', err)
            });
          },
          error: err => console.error('❌ Error al obtener cuenta:', err)
        });
      },
      error: err => console.error('❌ Error al obtener socio autenticado:', err)
    });
  }

  ngAfterViewInit(): void {
    this.columnas = [
      { titulo: 'Tipo', tipo: 'texto', template: this.tipoTpl },
      { titulo: 'Monto', tipo: 'texto', template: this.montoTpl },
      { titulo: 'Fecha', tipo: 'texto', template: this.fechaTpl },
      { titulo: 'Info', tipo: 'texto', template: this.descTpl }
    ];
    this.cdr.detectChanges();
  }

}
