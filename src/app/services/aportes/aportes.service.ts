import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { Observable, switchMap, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AportesService {
  private baseUrl = `${environment.supabaseUrl}/rest/v1/movimientos`;

  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`
  });

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los movimientos de una cuenta por su número de cuenta (FK en tabla cuentas),
   * y calcula el saldo acumulado de cada movimiento.
   */
  obtenerMovimientosPorNumeroCuenta(numeroCuenta: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.supabaseUrl}/rest/v1/cuentas`, {
      headers: this.headers,
      params: {
        select: 'id',
        numero_cuenta: `eq.${numeroCuenta}`
      }
    }).pipe(
      switchMap(cuentas => {
        if (cuentas.length === 0) {
          return throwError(() => new Error('Cuenta no encontrada'));
        }
        const cuentaId = cuentas[0].id;

        return this.http.get<any[]>(this.baseUrl, {
          headers: this.headers,
          params: {
            select: '*',
            cuenta_id: `eq.${cuentaId}`,
            order: 'fecha_movimiento.asc,id.asc'  
          }
        }).pipe(
          map(movimientos => {
            let saldo = 0;
            return movimientos.map(m => {
              if (m.tipo === 'deposito') {
                saldo += m.monto;
              } else if (m.tipo === 'retiro') {
                saldo -= m.monto;
              }
              return {
                ...m,
                saldo 
              };
            });
          })
        );
      })
    );
  }


  /**
 * Crea un nuevo aporte (movimiento: depósito, retiro o pago de préstamo)
 */
crearAporte(payload: any): Observable<any> {
  return this.http.post(this.baseUrl, payload, {
    headers: this.headers
  });
}
/**
 * extrae el id mediante el nuemro de cuenta 
 */
obtenerCuentaPorNumero(numeroCuenta: string) {
  return this.http.get<any[]>(`${environment.supabaseUrl}/rest/v1/cuentas`, {
    headers: this.headers,
    params: {
      select: 'id,numero_cuenta',
      numero_cuenta: `eq.${numeroCuenta}`
    }
  });
}

/**
 * Obtener movimientos de tipo 'pago' y 'retiro' de todos los socios
 */
obtenerMovimientosPagoYRetiro(): Observable<any[]> {
  return this.http.get<any[]>(this.baseUrl, {
    headers: this.headers,
    params: {
      select: 'id,tipo,monto,fecha_movimiento,descripcion,cuenta:cuenta_id(numero_cuenta,socio_id)',
      tipo: 'in.(pago_prestamo,retiro)',
      order: 'fecha_movimiento.desc'
    }
  });
}

/**
 * Devuelve la cuenta completa y sus movimientos con saldo calculado.
 */
obtenerCuentaConMovimientos(numeroCuenta: string): Observable<{ cuenta: any, movimientos: any[] }> {
  return this.http.get<any[]>(`${environment.supabaseUrl}/rest/v1/cuentas`, {
    headers: this.headers,
    params: {
      select: '*',
      numero_cuenta: `eq.${numeroCuenta}`
    }
  }).pipe(
    switchMap(cuentas => {
      if (!cuentas || cuentas.length === 0) {
        return throwError(() => new Error('Cuenta no encontrada'));
      }
      const cuenta = cuentas[0];

      // Obtener todos los movimientos para calcular correctamente el saldo
      return this.http.get<any[]>(this.baseUrl, {
        headers: this.headers,
        params: {
          select: '*',
          cuenta_id: `eq.${cuenta.id}`,
          order: 'fecha_movimiento.asc,id.asc'
        }
      }).pipe(
        map(movimientos => {
          let saldo = 0;

          // Calcular saldo acumulado de todos los movimientos
          const movimientosConSaldo = movimientos.map(mov => {
            saldo += mov.tipo === 'deposito' ? mov.monto : (mov.tipo === 'retiro' ? -mov.monto : 0);
            return { ...mov, saldo };
          });

          // Obtener los últimos 5 movimientos con saldo (ordenados del más reciente al más antiguo)
          const ultimosCinco = movimientosConSaldo.slice(-5).reverse();

          return { cuenta, movimientos: ultimosCinco };
        })
      );
    })
  );
}



}
