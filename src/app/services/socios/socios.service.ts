import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../env/environment';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocioService {
  private baseUrl = `${environment.supabaseUrl}/rest/v1/socios`;

  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`,
  });

  constructor(private http: HttpClient) {}

  /**
   * Crear un nuevo socio
   * @param socio Objeto con los datos del socio a crear
   */
  crearSocio(socio: any): Observable<any> {
    return this.http.post(this.baseUrl, socio, { headers: this.headers });
  }

  /**
   * Obtener todos los socios activos
   * Solo devuelve socios cuyo estado sea true (activos)
   */
  getSocios(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params: {
        select: '*',
        estado: 'eq.true'  // Filtrar solo activos
      }
    });
  }

  /**
   * Buscar socio por cédula
   * Solo busca dentro de socios cuyo estado sea true
   * Incluye datos de cuenta asociada (numero_cuenta y saldo)
   * @param cedula Número de cédula del socio
   */
  buscarSocioPorCedula(cedula: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params: {
        select: '*,cuentas(numero_cuenta,saldo)',
        identificacion: `eq.${cedula}`,
        estado: 'eq.true'  // Filtrar solo activos
      }
    });
  }

  /**
   * Actualizar datos de un socio por su ID
   * @param id ID numérico del socio
   * @param datos Campos a actualizar
   */
  actualizarSocio(id: number, datos: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}?id=eq.${id}`, datos, {
      headers: this.headers
    });
  }

  /**
   * Desactivar socio (eliminar lógico)
   * Cambia el campo estado a false
   * @param id ID numérico del socio
   */
  desactivarSocio(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}?id=eq.${id}`, { estado: false }, {
      headers: this.headers
    });
  }

/**
 * Obtiene los datos del socio a partir del número de cuenta
 */
obtenerSocioPorNumeroCuenta(numeroCuenta: string): Observable<any> {
  const url = `${environment.supabaseUrl}/rest/v1/cuentas`;

  return this.http.get<any[]>(url, {
    headers: this.headers,
    params: {
      select: 'id,numero_cuenta,socios(id,nombre,apellido,correo,telefono,foto_perfil)',
      numero_cuenta: `eq.${numeroCuenta}`
    }
  }).pipe(
    map(respuesta => {
      if (respuesta.length > 0 && respuesta[0].socios) {
        return respuesta[0].socios;
      }
      throw new Error('Socio no encontrado para la cuenta');
    })
  );
}

/**
 * Obtiene los datos del socio asociado al ID de usuario
 * @param usuarioId ID del usuario vinculado al socio
 */
obtenerSocioPorUsuarioId(usuarioId: number): Observable<any> {
  return this.http.get<any[]>(this.baseUrl, {
    headers: this.headers,
    params: {
      select: '*',
      usuario_id: `eq.${usuarioId}`,
      estado: 'eq.true'
    }
  }).pipe(
    map(socios => {
      if (socios.length > 0) {
        return socios[0];
      } else {
        throw new Error('No se encontró un socio con ese usuario_id');
      }
    })
  );
}

}
