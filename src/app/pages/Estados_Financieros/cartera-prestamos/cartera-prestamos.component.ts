import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BalanceMapper } from '../../../mapping/balance.mapper';
import { CommonModule } from '@angular/common';
import { GraficosComponent } from '../../../shared/components/grafico/graficos.component';

@Component({
  selector: 'app-cartera-prestamos',
  standalone: true,
  imports: [CommonModule, GraficosComponent],
  templateUrl: './cartera-prestamos.component.html',
  styleUrls: ['./cartera-prestamos.component.scss']
})
export class CarteraPrestamosComponent implements OnInit {
  datosGrafico: any[] = [];
  indicadores: { nombre: string; valor: number; sufijo?: string; clase?: string }[] = [];

  constructor(private balanceMapper: BalanceMapper, private router: Router) {}

  ngOnInit(): void {
    this.balanceMapper.obtenerCarteraPrestamos().subscribe({
      next: datos => {
        // Datos para gráfico de barras
        this.datosGrafico = datos.map(d => ({
          name: d.estado,
          value: d.monto_total
        }));

        // Indicadores: total préstamos
        const totalPrestamos = datos.reduce((acc, d) => acc + d.total_prestamos, 0);
        const totalMonto = datos.reduce((acc, d) => acc + d.monto_total, 0);

        this.indicadores = [
          { nombre: 'Total Préstamos', valor: totalPrestamos, sufijo: '', clase: 'ganancia-total' },
          { nombre: 'Monto Total', valor: totalMonto, sufijo: '$', clase: 'saldo' }
        ];
      },
      error: () => console.error('Error al obtener cartera de préstamos')
    });
  }

  volver(): void {
    this.router.navigate(['/Inicio/Estados']);
  }
}
