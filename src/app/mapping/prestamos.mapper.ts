import { PrestamoService } from '../services/prestamos.service/prestamo.service';
import { SubidaDocumentosFrontendService } from '../services/prestamos.service/subida-documentos.service';

export const PrestamosMapper = {
  /**
   * Crear un nuevo préstamo y subir documentos desde el navegador.
   * Luego actualiza el préstamo con las URLs subidas.
   */
  async crearPrestamo(
    prestamoService: PrestamoService,
    subidaDocsService: SubidaDocumentosFrontendService,
    datos: {
      socio_id: number;
      monto: number;
      interes: number;
      plazo_meses: number;
      archivos: { file: File; tipo: string }[];
      observaciones?: string;
    }
  ): Promise<any> {
    const fechaSolicitud = new Date().toISOString();

    const prestamoBase = {
      socio_id: datos.socio_id,
      monto: datos.monto,
      interes: datos.interes,
      plazo_meses: datos.plazo_meses,
      observaciones: datos.observaciones ?? '',
      estado: 'generado',
      fecha_solicitud: fechaSolicitud,
      saldo_restante: datos.monto,
    };

    console.log('📤 Enviando datos base del préstamo:', prestamoBase);

    try {
      const prestamoCreado = await prestamoService.crearPrestamo(prestamoBase);
      const prestamoId = prestamoCreado.id;

      console.log('✅ Préstamo creado con ID:', prestamoId);

      if (datos.archivos?.length > 0) {
        console.log('📂 Subiendo archivos:', datos.archivos);
        const urls = await subidaDocsService.subirMultiplesArchivos(datos.archivos, prestamoId);

        if (urls.length > 0) {
          const payload = { urls_documentos: JSON.stringify(urls) };
          console.log(`✏️ Actualizando préstamo ${prestamoId} con URLs subidas`);
          await prestamoService.editarPrestamo(prestamoId, payload);

          return {
            ...prestamoCreado,
            urls_documentos: urls,
          };
        } else {
          console.warn('⚠️ No se subieron documentos');
        }
      }

      return prestamoCreado;
    } catch (error) {
      console.error('❌ Error al crear el préstamo:', error);
      throw error;
    }
  },

  async obtenerPrestamosPorEstado(
    prestamoService: PrestamoService,
    estado: string
  ): Promise<any[]> {
    const prestamos = await prestamoService.obtenerPrestamosPorEstado(estado);
    console.log(`📥 Préstamos recibidos (${estado}):`, prestamos);

    return prestamos.map((p) => {
      const socio = p.socio ?? {};

      return {
        id: p.id,
        nombre_completo: `${socio.nombre ?? ''} ${socio.apellido ?? ''}`.trim(),
        correo: socio.correo ?? 'No disponible',
        telefono: socio.telefono ?? 'No disponible',
        monto: `$${Number(p.monto).toFixed(2)}`,
        monto_pendiente: `$${Number(p.saldo_restante).toFixed(2)}`,
        interes: `${p.interes}%`,
        plazo: `${p.plazo_meses} meses`,
        estado: p.estado?.toUpperCase() ?? '',
        fecha_aprobacion: p.fecha_aprobacion?.split('T')[0] ?? 'N/A',
        fecha_rechazo: p.fecha_rechazo?.split('T')[0] ?? 'N/A',
        fecha_solicitud: p.fecha_solicitud?.split('T')[0] ?? 'N/A',
      };
    });
  },

  async obtenerPrestamosPorCedula(
    prestamoService: PrestamoService,
    cedula: string
  ): Promise<{ socio: any; prestamos: any[] }> {
    const { socio, prestamos } = await prestamoService.obtenerPrestamosPorCedula(cedula);
    console.log(`👤 Socio encontrado:`, socio);
    console.log(`📥 Préstamos del socio:`, prestamos);

    const prestamosMapeados = prestamos.map((p) => ({
      id: p.id,
      monto: `$${Number(p.monto).toFixed(2)}`,
      saldo_restante: `$${Number(p.saldo_restante).toFixed(2)}`,
      interes: `${p.interes}%`,
      plazo: `${p.plazo_meses} meses`,
      estado: p.estado?.toUpperCase() ?? 'N/A',
      fecha_aprobacion: p.fecha_aprobacion?.split('T')[0] ?? 'Pendiente',
    }));

    return {
      socio: {
        id: socio.id,
        nombre: socio.nombre,
        apellido: socio.apellido,
        correo: socio.correo,
        telefono: socio.telefono,
      },
      prestamos: prestamosMapeados,
    };
  },
};
