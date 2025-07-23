import { Injectable } from '@angular/core';
import { SocioService } from '../services/socios/socios.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocioMapper {
  constructor(private socioService: SocioService) {}

  camposFormulario = [
    { key: 'nombres', label: 'Nombres', tipo: 'text', placeholder: 'Ingrese sus nombres' },
    { key: 'apellidos', label: 'Apellidos', tipo: 'text', placeholder: 'Ingrese sus apellidos' },
    { key: 'correo', label: 'Correo', tipo: 'email', placeholder: 'info@xyz.com' },
    { key: 'numero', label: 'Número', tipo: 'text', placeholder: '+593 - 98596 58000' },
    { key: 'direccion', label: 'Dirección', tipo: 'text', placeholder: 'Dirección' },
    { key: 'cedula', label: 'Cédula', tipo: 'text', placeholder: 'Ingresar Cédula' },
    { key: 'tipoCuenta', label: 'Tipo de cuenta', tipo: 'text', placeholder: 'Ahorros o corriente' },
  ];

  registrarSocio(datos: any): Observable<any> {
    const socioTransformado = this.transformarDatos(datos);
    return this.socioService.crearSocio(socioTransformado);
  }

  obtenerSocios(): Observable<any[]> {
    return this.socioService.getSocios().pipe(
      map(socios => socios.map(s => ({
        nombre: `${s.nombre} ${s.apellido}`,
        cedula: s.identificacion,
        correo: s.correo,
        telefono: s.telefono,
        foto: s.foto_perfil,
        facultad: s.facultad
      })))
    );
  }

  buscarSocioPorCedula(cedula: string): Observable<any | null> {
    return this.socioService.buscarSocioPorCedula(cedula).pipe(
      map(socios => socios.length > 0 ? socios[0] : null)
    );
  }

  obtenerCuentaPorCedula(cedula: string): Observable<string | null> {
    return this.buscarSocioPorCedula(cedula).pipe(
      map(socio => socio?.cuentas?.[0]?.numero_cuenta || null)
    );
  }

  obtenerSocioPorCuenta(numeroCuenta: string): Observable<any> {
  return this.socioService.obtenerSocioPorNumeroCuenta(numeroCuenta).pipe(
    map(socio => {
      if (!socio) throw new Error('No se encontró el socio asociado a la cuenta');
      return socio; // ← aquí no se transforma nada, lo devuelves tal como viene
    })
  );
}


  obtenerCamposFormularioEdicion(socio: any): any[] {
    const cuenta = socio.cuentas?.[0];
    return [
      { key: 'nombres', label: 'Nombres', tipo: 'text', value: socio.nombre, deshabilitado: true },
      { key: 'apellidos', label: 'Apellidos', tipo: 'text', value: socio.apellido, deshabilitado: true },
      { key: 'cedula', label: 'Cédula', tipo: 'text', value: socio.identificacion, deshabilitado: true },
      { key: 'numero', label: 'Teléfono', tipo: 'text', value: socio.telefono },
      { key: 'correo', label: 'Correo', tipo: 'email', value: socio.correo },
      { key: 'direccion', label: 'Dirección', tipo: 'text', value: socio.direccion },
      { key: 'numeroCuenta', label: 'Número de cuenta', tipo: 'text', value: cuenta?.numero_cuenta, deshabilitado: true },
      { key: 'tipoCuenta', label: 'Tipo de cuenta', tipo: 'text', value: socio.tipo_cuenta }
    ];
  }

  obtenerCamposFormularioEliminar(socio: any): any[] {
    const cuenta = socio.cuentas?.[0];
    return [
      { key: 'nombres', label: 'Nombres', tipo: 'text', value: socio.nombre, deshabilitado: true },
      { key: 'apellidos', label: 'Apellidos', tipo: 'text', value: socio.apellido, deshabilitado: true },
      { key: 'cedula', label: 'Cédula', tipo: 'text', value: socio.identificacion, deshabilitado: true },
      { key: 'numeroCuenta', label: 'Número de cuenta', tipo: 'text', value: cuenta?.numero_cuenta, deshabilitado: true },
      { key: 'tipoCuenta', label: 'Tipo de cuenta', tipo: 'text', value: socio.tipo_cuenta, deshabilitado: true }
    ];
  }

  actualizarSocio(id: number, datos: any): Observable<any> {
    const socioActualizado = {
      telefono: datos.numero,
      correo: datos.correo,
      direccion: datos.direccion,
      tipo_cuenta: datos.tipoCuenta
    };
    return this.socioService.actualizarSocio(id, socioActualizado);
  }

  desactivarSocio(id: number): Observable<any> {
    return this.socioService.desactivarSocio(id);
  }

  private transformarDatos(datos: any): any {
    return {
      nombre: datos.nombres,
      apellido: datos.apellidos,
      correo: datos.correo,
      telefono: datos.numero,
      direccion: datos.direccion,
      identificacion: datos.cedula,
      tipo_cuenta: datos.tipoCuenta,
      estado: true,
      fecha_creacion: new Date().toISOString()
    };
  }

  camposBusquedaCedula = [
    { key: 'cedula', label: 'Ingrese número de cédula', tipo: 'text', placeholder: 'Ejemplo: ##########' }
  ];


  obtenerSocioAutenticado(): Observable<any> {
  const usuarioRaw = localStorage.getItem('usuario');
  if (!usuarioRaw) throw new Error('No hay usuario autenticado');

  const usuario = JSON.parse(usuarioRaw);
  const usuarioId = usuario.id;

  return this.socioService.obtenerSocioPorUsuarioId(usuarioId).pipe(
    map(socio => {
      if (!socio) throw new Error('No se encontró socio para este usuario');
      return socio;
    })
  );
}

}
