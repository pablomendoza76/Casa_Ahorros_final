import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BalanceMapper } from '../../../mapping/balance.mapper';
import { CommonModule } from '@angular/common';
import { GraficosComponent } from '../../../shared/components/grafico/graficos.component';

@Component({
  selector: 'app-ingresos-egresos',
  standalone: true,
  imports: [CommonModule, GraficosComponent],
  templateUrl: './ingresos-egresos.component.html',
  styleUrls: ['./ingresos-egresos.component.scss']
})
export class IngresosEgresosComponent implements OnInit {
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
