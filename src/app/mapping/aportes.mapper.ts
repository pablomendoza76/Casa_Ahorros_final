import { Injectable } from '@angular/core';
import { SocioMapper } from './socio.mapper';
import { AportesService } from '../services/aportes/aportes.service';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AportesMapper {
  constructor(
    public socioMapper: SocioMapper,
    private aportesService: AportesService
  ) {}

  /**
   * Reutiliza el mapper de socios para obtener el listado de socios.
   */
  obtenerSocios(): Observable<any[]> {
    return this.socioMapper.obtenerSocios();
  }

  /**
   * Obtiene los movimientos de una cuenta por número de cuenta.
   */
  obtenerMovimientosPorCuenta(numeroCuenta: string): Observable<any[]> {
    return this.aportesService.obtenerMovimientosPorNumeroCuenta(numeroCuenta).pipe(
      map(movimientos => movimientos.map(mov => ({
        fecha: new Date(mov.fecha_movimiento).toLocaleDateString(),
        tipo: mov.tipo,
        monto: mov.monto,
        descripcion: mov.descripcion
      })))
    );
  }

  /**
   * Devuelve el número de cuenta de un socio dado su cédula.
   */
  obtenerCuentaPorCedula(cedula: string): Observable<string | null> {
    return this.socioMapper.obtenerCuentaPorCedula(cedula);
  }

  /**
   * obtener socio por numero de cuenta 
   */

  /**
 * Obtiene la información del socio a partir del número de cuenta.
 */
obtenerSocioPorCuenta(numeroCuenta: string): Observable<any> {
  return this.socioMapper.obtenerSocioPorCuenta(numeroCuenta);
}


/**
 * Obtiene todos los movimientos de tipo 'pago' y 'retiro' de todos los socios
 */
obtenerMovimientosPagoYRetiro(): Observable<any[]> {
  return this.aportesService.obtenerMovimientosPagoYRetiro().pipe(
    switchMap((movimientos) => {
      const consultasSocios = movimientos.map(m => 
        this.obtenerSocioPorCuenta(m.cuenta?.numero_cuenta ?? '').pipe(
          map(socio => ({
            id: m.id,
            tipo: m.tipo?.toUpperCase(),
            monto: `$${Number(m.monto).toFixed(2)}`,
            fecha: m.fecha_movimiento?.split('T')[0],
            descripcion: m.descripcion ?? 'N/A',
            numero_cuenta: m.cuenta?.numero_cuenta ?? 'N/D',
            socio: socio ? `${socio.nombre ?? ''} ${socio.apellido ?? ''}`.trim() : 'N/D'
          }))
        )
      );

      return forkJoin(consultasSocios);
    })
  );
}

obtenerCuentaConMovimientos(numeroCuenta: string): Observable<{ cuenta: any, movimientos: any[] }> {
  // Usa directamente el método que ya devuelve saldo y movimientos procesados
  return this.aportesService.obtenerCuentaConMovimientos(numeroCuenta);
}

}
