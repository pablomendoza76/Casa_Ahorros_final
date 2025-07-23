import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BalanceMapper } from '../../../mapping/balance.mapper';
import { CommonModule } from '@angular/common';
import { GraficosComponent } from '../../../shared/components/grafico/graficos.component';

@Component({
  selector: 'app-indicadores-financieros',
  standalone: true,
  imports: [CommonModule, GraficosComponent],
  templateUrl: './indicadores-financieros.component.html',
  styleUrls: ['./indicadores-financieros.component.scss']
})
export class IndicadoresFinancierosComponent implements OnInit {
  datosGrafico: any[] = [];
  indicadores: { nombre: string; valor: number; sufijo?: string; clase?: string }[] = [];

  constructor(private balanceMapper: BalanceMapper, private router: Router) {}

  ngOnInit(): void {
    this.balanceMapper.obtenerIndicadoresFinancieros().subscribe({
      next: datos => {
        this.datosGrafico = [
          { name: 'Ingresos', value: datos.totalIngresos },
          { name: 'Egresos', value: datos.totalEgresos },
          { name: 'Saldo Actual', value: datos.saldoActual },
          { name: 'Cartera Total', value: datos.carteraTotal }
        ];

        this.indicadores = [
          { nombre: 'Ingresos', valor: datos.totalIngresos, sufijo: '$', clase: 'ganancia-total' },
          { nombre: 'Egresos', valor: datos.totalEgresos, sufijo: '$', clase: 'interes-total' },
          { nombre: 'Saldo Actual', valor: datos.saldoActual, sufijo: '$', clase: 'saldo' },
          { nombre: 'Préstamos Activos', valor: datos.prestamosActivos, clase: 'ganancia-total' },
          { nombre: 'Cartera Total', valor: datos.carteraTotal, sufijo: '$', clase: 'saldo' }
        ];
      },
      error: () => console.error('Error al obtener indicadores financieros')
    });
  }

  volver(): void {
    this.router.navigate(['/Inicio/Estados']);
  }
}
