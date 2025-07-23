import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AportesMapper } from '../../../mapping/aportes.mapper';
import { GraficosComponent } from '../../../shared/components/grafico/graficos.component';

@Component({
  selector: 'app-visualizar-aportes',
  standalone: true,
  imports: [CommonModule, GraficosComponent],
  templateUrl: './vizulizar-aportes.component.html',
  styleUrls: ['./vizulizar-aportes.component.scss'],
  providers: [AportesMapper]
})
export class VisualizarAportesComponent implements OnInit {
  movimientos: any[] = [];
  numeroCuenta!: string;
  socio: any = null;

  indicadores: { nombre: string; valor: string | number; sufijo?: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private mapper: AportesMapper,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.numeroCuenta = this.route.snapshot.paramMap.get('numeroCuenta')!;
    this.cargarMovimientos();
    this.cargarInformacionSocio();
  }

  cargarMovimientos(): void {
    this.mapper.obtenerMovimientosPorCuenta(this.numeroCuenta).subscribe({
      next: movimientos => {
        this.movimientos = movimientos;
        console.log("Movimientos:", movimientos);

        // Cálculo de indicadores
        const saldo = movimientos.reduce((acc, m) => acc + (m.monto || 0), 0);
        const interes = 5; // valor fijo por ahora
        const ganancia = saldo * (interes / 100);

        this.indicadores = [
          { nombre: 'Saldo', valor: saldo.toFixed(2), sufijo: '$' },
          { nombre: 'Interés', valor: interes, sufijo: '%' },
          { nombre: 'Ganancia', valor: ganancia.toFixed(2), sufijo: '$' }
        ];
      },
      error: () => console.error('Error al obtener movimientos')
    });
  }

  cargarInformacionSocio(): void {
    this.mapper.obtenerSocioPorCuenta(this.numeroCuenta).subscribe({
      next: socio => {
        this.socio = {
          ...socio,
          foto: socio.foto_perfil ?? socio.foto ?? socio.fotoUrl ?? null
        };
        console.log("Socio cargado:", this.socio);
      },
      error: () => console.error('Error al obtener información del socio')
    });
  }

  volver(): void {
    this.router.navigate(['/aportes']);
  }

  irACrearAporte(): void {
    this.router.navigate(['/aportes/crear'], {
      queryParams: { cuenta_id: this.numeroCuenta }
    });
  }
}
