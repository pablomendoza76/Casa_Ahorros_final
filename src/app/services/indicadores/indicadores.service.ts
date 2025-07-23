// src/app/services/indicadores.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`
  });

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los totales globales de ingresos, egresos y balance desde la vista "vista_balance_general"
   */
  obtenerBalanceGeneral(): Observable<any> {
    return this.http.get<any[]>(`${environment.supabaseUrl}/rest/v1/vista_balance_general`, {
      headers: this.headers,
      params: {
        select: '*'
      }
    });
  }

  /**
   * Obtiene el flujo de caja diario desde la vista "vista_flujo_caja_diario"
   */
  obtenerFlujoCaja(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.supabaseUrl}/rest/v1/vista_flujo_caja_diario`, {
      headers: this.headers,
      params: {
        select: '*',
        order: 'fecha.desc' // si quieres los más recientes primero
      }
    });
  }

  obtenerCarteraPrestamos(): Observable<any[]> {
  return this.http.get<any[]>(`${environment.supabaseUrl}/rest/v1/vista_cartera_prestamos`, {
    headers: this.headers,
    params: {
      select: '*'
    }
  });
}

obtenerIndicadoresFinancieros(): Observable<any[]> {
  return this.http.get<any[]>(`${environment.supabaseUrl}/rest/v1/vista_indicadores_financieros`, {
    headers: this.headers,
    params: {
      select: '*'
    }
  });
}


}
