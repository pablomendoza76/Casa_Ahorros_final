// src/app/pages/balance/balance-general.component.ts
import { Component, OnInit } from '@angular/core';
import { BalanceMapper } from '../../../mapping/balance.mapper';
import { GraficosComponent } from '../../../shared/components/grafico/graficos.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-balance-general',
  standalone: true,
  imports: [CommonModule, GraficosComponent],
  templateUrl: './balance-general.component.html',
  styleUrls: ['./balance-general.component.scss']
})
export class BalanceGeneralComponent implements OnInit {
  datos: any[] = [];
  indicadores: { nombre: string; valor: number; sufijo?: string; clase?: string }[] = [];

  constructor(private balanceMapper: BalanceMapper, private router: Router) {}

  ngOnInit(): void {
    this.balanceMapper.obtenerDatosBalance().subscribe({
      next: datos => {
        this.generarIndicadores(datos);

        // Solo Ingresos y Egresos para el gráfico
        this.datos = datos
          .filter(d => d.nombre.toLowerCase() !== 'balance')
          .map(d => ({
            tipo: d.nombre,
            monto: d.valor
          }));
      },
      error: () => console.error('Error al obtener datos de balance')
    });
  }

  /**
   * Genera los indicadores visuales para el panel lateral del gráfico
   */
  generarIndicadores(datos: any[]): void {
    this.indicadores = datos.map(dato => {
      const clase = this.asignarClase(dato.nombre);
      return {
        nombre: dato.nombre,
        valor: dato.valor,
        sufijo: '$',
        clase
      };
    });
  }

  /**
   * Asigna una clase CSS específica según el tipo de indicador
   */
  asignarClase(nombre: string): string {
    switch (nombre.toLowerCase()) {
      case 'ingresos': return 'ganancia-total';
      case 'egresos': return 'interes-total';
      case 'balance': return 'saldo';
      default: return '';
    }
  }

  volver(): void {
    this.router.navigate(['/Inicio/Estados']);
  }
}
