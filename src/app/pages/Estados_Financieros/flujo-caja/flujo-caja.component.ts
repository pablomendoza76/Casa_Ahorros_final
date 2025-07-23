import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GraficosComponent } from '../../../shared/components/grafico/graficos.component';
import { BalanceMapper } from '../../../mapping/balance.mapper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flujo-caja',
  imports: [CommonModule, GraficosComponent],
  templateUrl: './flujo-caja.component.html',
  styleUrl: './flujo-caja.component.scss'
})
export class FlujoCajaComponent {
datosGrafico: any[] = [];
  indicadores: { nombre: string; valor: number; sufijo?: string; clase?: string }[] = [];

  constructor(private balanceMapper: BalanceMapper, private router: Router) {}

  ngOnInit(): void {
  this.balanceMapper.obtenerFlujoCajaDiario().subscribe({
    next: datos => {
      this.datosGrafico = [
        {
          name: 'Saldo Diario',
          series: datos.map(d => ({
            name: d.fecha,
            value: d.saldo_dia
          }))
        }
      ];

      this.indicadores = [
        {
          nombre: 'Total días',
          valor: datos.length,
          clase: 'ganancia-total'
        }
      ];
    },
    error: () => console.error('Error al obtener flujo de caja')
  });
}


  volver(): void {
    this.router.navigate(['/Inicio/Estados']);
  }
}
