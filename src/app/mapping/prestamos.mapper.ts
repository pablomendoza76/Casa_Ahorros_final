import { PrestamoService } from '../services/prestamos.service/prestamo.service';

export const PrestamosMapper = {
  /**
   * Cargar préstamos filtrados por estado ('aceptado', 'rechazado', etc.)
   */
  async obtenerPrestamosPorEstado(
    prestamoService: PrestamoService,
    estado: string
  ): Promise<any[]> {
    const prestamos = await prestamoService.obtenerPrestamosPorEstado(estado);
    console.log(`📥 Préstamos recibidos (${estado}):`, prestamos);

    const resultadoFinal = prestamos.map((p) => {
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
      };
    });

    console.log('📤 Datos mapeados enviados al componente:', resultadoFinal);
    return resultadoFinal;
  },

  /**
   * Cargar préstamos de un socio a partir de su cédula
   */
  async obtenerPrestamosPorCedula(
    prestamoService: PrestamoService,
    cedula: string
  ): Promise<{ socio: any; prestamos: any[] }> {
    const { socio, prestamos } =
      await prestamoService.obtenerPrestamosPorCedula(cedula);
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
