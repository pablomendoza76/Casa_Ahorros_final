import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuReusableComponent } from '../../../shared/components/menu-reusable/menu-reusable.component';

import { SocioMapper } from '../../../mapping/socio.mapper';
import { AportesMapper } from '../../../mapping/aportes.mapper';

@Component({
  selector: 'app-inicio-socios',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuReusableComponent],
  templateUrl: './inicio-socios.component.html',
  styleUrls: ['./inicio-socios.component.scss']
})
export class InicioSociosComponent implements OnInit {
  menuOpciones = [
    { svg: '/svg/Socios/Estado.svg', etiqueta: 'Estado de Cuenta', ruta: '/inicio_socios' },
    { svg: '/svg/Socios/simulador.svg', etiqueta: 'Simulador', ruta: '/simulador' },
    { svg: '/svg/Socios/Deposito.svg', etiqueta: 'Movimientos', ruta: '/movimientos' },
    { svg: '/svg/Socios/prestamos.svg', etiqueta: 'Préstamos', ruta: '/prestamos' },
  ];

  socio: any = null;
  cuenta: any = null;
  movimientos: any[] = [];


  constructor(
    private socioMapper: SocioMapper,
    private aportesMapper: AportesMapper,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🔄 Iniciando carga de socio autenticado...');

    this.socioMapper.obtenerSocioAutenticado().subscribe({
      next: socio => {
        console.log('✅ Socio autenticado:', socio);
        this.socio = socio;

        const cedula = socio?.identificacion;
        if (!cedula) {
          console.warn('⚠️ El socio no tiene cédula definida.');
          return;
        }

        console.log('📥 Buscando número de cuenta por cédula:', cedula);
        this.aportesMapper.obtenerCuentaPorCedula(cedula).subscribe({
          next: numeroCuenta => {
            if (!numeroCuenta) {
              console.warn('⚠️ No se encontró número de cuenta para el socio.');
              return;
            }

            console.log('🏦 Número de cuenta obtenido:', numeroCuenta);
            this.cargarCuentaYMovimientos(numeroCuenta);
          },
          error: err => {
            console.error('❌ Error al obtener número de cuenta por cédula:', err);
          }
        });
      },
      error: err => {
        console.error('❌ Error al obtener socio autenticado:', err);
      }
    });
  }

  private cargarCuentaYMovimientos(numeroCuenta: string): void {
    console.log('🔍 Buscando cuenta y movimientos desde AportesMapper...');
    this.aportesMapper.obtenerCuentaConMovimientos(numeroCuenta).subscribe({
      next: ({ cuenta, movimientos }) => {
        console.log('✅ Cuenta obtenida:', cuenta);
        console.log('📌 Movimientos obtenidos:', movimientos);
        this.cuenta = cuenta;
        this.movimientos = movimientos;
      },
      error: err => {
        console.error('❌ Error al obtener cuenta y movimientos:', err);
      }
    });
  }

  onSalir() {
  this.router.navigate(['/login']);
}

}
