import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../env/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrestamoService {
  private baseUrl = `${environment.supabaseUrl}/rest/v1/prestamos`;
  private movimientosUrl = `${environment.supabaseUrl}/rest/v1/movimientos`;
  private documentosUrl = `${environment.supabaseUrl}/rest/v1/documentos`;
  private bucket = 'documentosprestamos';

  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`,
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  private getFechaActual(): string {
    return new Date().toISOString();
  }

  async obtenerPrestamos(): Promise<any[]> {
    const res$ = this.http.get<any[]>(this.baseUrl, { headers: this.headers });
    return await firstValueFrom(res$);
  }

  async obtenerPrestamoPorId(id: number): Promise<any> {
    const params = new HttpParams().set('id', `eq.${id}`);
    const res$ = this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params,
    });
    const datos = await firstValueFrom(res$);
    return datos[0] ?? null;
  }

  async crearPrestamo(prestamo: any): Promise<any> {
    const payload = {
      ...prestamo,
      saldo_restante: Number(prestamo.monto) || 0,
      estado: 'en_espera',
      fecha_solicitud: this.getFechaActual()
    };

    const res$ = this.http.post(this.baseUrl, payload, {
      headers: this.headers.set('Prefer', 'return=representation'),
    });

    const resultado = await firstValueFrom(res$);
    console.log("✅ Préstamo creado:", resultado);
    return Array.isArray(resultado) ? resultado[0] : resultado;
  }

  async editarPrestamo(id: number, prestamo: any): Promise<any> {
    const url = `${this.baseUrl}?id=eq.${id}`;
    const res$ = this.http.patch(url, prestamo, { headers: this.headers });
    return await firstValueFrom(res$);
  }

  async eliminarPrestamo(id: number): Promise<any> {
    const url = `${this.baseUrl}?id=eq.${id}`;
    const res$ = this.http.delete(url, { headers: this.headers });
    return await firstValueFrom(res$);
  }

  async obtenerPrestamosActivos(): Promise<any[]> {
    const params = new HttpParams().set('estado', 'eq.aceptado');
    const res$ = this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params,
    });
    return await firstValueFrom(res$);
  }

  async obtenerResumenPago(
    prestamoId: number
  ): Promise<{ monto_total: number; monto_pagado: number }> {
    const prestamo = await this.obtenerPrestamoPorId(prestamoId);

    const params = new HttpParams()
      .set('prestamo_id', `eq.${prestamoId}`)
      .set('tipo', 'eq.pago_prestamo')
      .set('select', 'monto');

    const pagos$ = this.http.get<any[]>(this.movimientosUrl, {
      headers: this.headers,
      params,
    });

    const pagos = await firstValueFrom(pagos$);
    const montoPagado = pagos.reduce(
      (suma, pago) => suma + Number(pago.monto),
      0
    );

    return {
      monto_total: Number(prestamo?.monto ?? 0),
      monto_pagado: montoPagado,
    };
  }

  async actualizarSaldoRestante(data: {
    id: number;
    saldo_restante: number;
  }): Promise<any> {
    const url = `${this.baseUrl}?id=eq.${data.id}`;
    const body = { saldo_restante: data.saldo_restante };
    const res$ = this.http.patch(url, body, { headers: this.headers });
    return await firstValueFrom(res$);
  }

  async obtenerPrestamosPorEstado(estado: string): Promise<any[]> {
    const params = new HttpParams().set('estado', `eq.${estado}`).set(
      'select',
      `
        id, monto, interes, plazo_meses, estado, fecha_aprobacion, fecha_solicitud, fecha_rechazo, saldo_restante,
        socio:socio_id(nombre, apellido, correo, telefono)
      `.replace(/\s+/g, '')
    );

    const res$ = this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params,
    });

    return await firstValueFrom(res$);
  }

  async cambiarEstadoPrestamo(
    id: number,
    nuevoEstado: 'aceptado' | 'rechazado' | 'en_espera' | 'generado'
  ): Promise<any> {
    const url = `${this.baseUrl}?id=eq.${id}`;
    const fechaCampo =
      nuevoEstado === 'aceptado'
        ? { fecha_aprobacion: this.getFechaActual() }
        : nuevoEstado === 'rechazado'
        ? { fecha_rechazo: this.getFechaActual() }
        : {};

    const body = { estado: nuevoEstado, ...fechaCampo };
    const res$ = this.http.patch(url, body, { headers: this.headers });
    return await firstValueFrom(res$);
  }

  async obtenerPrestamosPorCedula(
    cedula: string
  ): Promise<{ socio: any; prestamos: any[] }> {
    const socioUrl = `${environment.supabaseUrl}/rest/v1/socios`;
    const socioParams = new HttpParams().set('identificacion', `eq.${cedula}`);
    const socioRes$ = this.http.get<any[]>(socioUrl, {
      headers: this.headers,
      params: socioParams,
    });

    const socioArray = await firstValueFrom(socioRes$);
    const socio = socioArray[0];

    if (!socio) {
      throw new Error('Socio no encontrado');
    }

    const prestamosParams = new HttpParams()
      .set('socio_id', `eq.${socio.id}`)
      .set('select', '*');

    const prestamosRes$ = this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params: prestamosParams,
    });

    const prestamos = await firstValueFrom(prestamosRes$);

    return { socio, prestamos };
  }
}
