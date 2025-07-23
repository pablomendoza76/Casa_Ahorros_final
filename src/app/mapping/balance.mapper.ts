// src/app/mapping/balance.mapper.ts
import { Injectable } from '@angular/core';
import { IndicadoresService } from '../services/indicadores/indicadores.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BalanceMapper {
  constructor(private indicadoresService: IndicadoresService) {}

  obtenerDatosBalance(): Observable<any[]> {
    return this.indicadoresService.obtenerBalanceGeneral().pipe(
      map(([balance]) => [
        { nombre: 'Ingresos', valor: balance.total_ingresos },
        { nombre: 'Egresos', valor: balance.total_egresos },
        { nombre: 'Balance', valor: balance.balance_total }
      ])
    );
  }

  obtenerFlujoCajaDiario(): Observable<any[]> {
  return this.indicadoresService.obtenerFlujoCaja(); // NO necesita map
}

obtenerCarteraPrestamos(): Observable<any[]> {
  return this.indicadoresService.obtenerCarteraPrestamos();
}

obtenerIndicadoresFinancieros(): Observable<any> {
  return this.indicadoresService.obtenerIndicadoresFinancieros().pipe(
    map(([res]) => ({
      totalIngresos: res.total_ingresos,
      totalEgresos: res.total_egresos,
      saldoActual: res.saldo_actual,
      prestamosActivos: res.prestamos_activos,
      carteraTotal: res.cartera_total
    }))
  );
}


}
