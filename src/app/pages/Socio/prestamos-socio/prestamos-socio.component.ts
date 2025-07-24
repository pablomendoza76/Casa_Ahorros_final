// prestamos-socio.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuReusableComponent } from '../../../shared/components/menu-reusable/menu-reusable.component';
import { FormularioReutilizableComponent } from '../../../shared/components/formulario-reutilizable/formulario-reutilizable.component';

import { PrestamoService } from '../../../services/prestamos.service/prestamo.service';
import { SubidaDocumentosFrontendService } from '../../../services/prestamos.service/subida-documentos.service';
import { SocioMapper } from '../../../mapping/socio.mapper';

@Component({
  selector: 'app-prestamos-socio',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuReusableComponent, FormularioReutilizableComponent],
  templateUrl: './prestamos-socio.component.html',
  styleUrls: ['./prestamos-socio.component.scss']
})
export class PrestamosSocioComponent implements OnInit {
  prestamos: any[] = [];
  socio: any = null;

  modalVisible = false;
  camposFormulario: any[] = [];

  menuOpciones = [
    { svg: '/svg/Socios/Estado.svg', etiqueta: 'Estado de Cuenta', ruta: '/inicio_socios' },
    { svg: '/svg/Socios/simulador.svg', etiqueta: 'Simulador', ruta: '/simulador' },
    { svg: '/svg/Socios/Deposito.svg', etiqueta: 'Movimientos', ruta: '/movimientos' },
    { svg: '/svg/Socios/prestamos.svg', etiqueta: 'Préstamos', ruta: '/prestamos' },
  ];

  constructor(
    private prestamoService: PrestamoService,
    private subidaDocsService: SubidaDocumentosFrontendService,
    private socioMapper: SocioMapper
  ) {}

  ngOnInit(): void {
    this.generarFormularioPrestamo();
    this.cargarPrestamosSocio();
  }

  cargarPrestamosSocio(): void {
    this.socioMapper.obtenerSocioAutenticado().subscribe({
      next: async socio => {
        if (!socio?.identificacion) {
          console.warn('⚠️ Socio no autenticado o sin cédula.');
          return;
        }

        this.socio = socio;
        const cedula = socio.identificacion;

        try {
          const response = await this.prestamoService.obtenerPrestamosPorCedula(cedula);
          this.prestamos = response?.prestamos || [];
        } catch (err) {
          console.error('❌ Error al obtener préstamos:', err);
          this.prestamos = [];
        }
      },
      error: err => console.error('❌ Error al obtener socio autenticado:', err)
    });
  }

  generarFormularioPrestamo(): void {
    this.camposFormulario = [
      { tipo: 'input', label: 'Monto', key: 'monto', tipoInput: 'number', requerido: true },
      { tipo: 'input', label: 'Plazo (meses)', key: 'plazo_meses', tipoInput: 'number', requerido: true },
      {
        tipo: 'select', label: 'Tipo de Préstamo', key: 'tipo', requerido: true, opciones: [
          { label: 'Hipotecario', valor: 'Hipotecario' },
          { label: 'Educativo', valor: 'Educativo' },
          { label: 'Consumo', valor: 'Consumo' }
        ]
      }
    ];
  }

  abrirModal(): void {
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  async onGuardarPrestamo(data: any): Promise<void> {
    try {
      const socioId = this.socio?.id;
      if (!socioId) throw new Error('Socio no identificado.');

      const archivos: { file: File; tipo: string }[] = [];
      if (data.cedula) archivos.push({ file: data.cedula, tipo: 'cedula' });
      if (data.votacion) archivos.push({ file: data.votacion, tipo: 'certificado_votacion' });
      if (data.pagare) archivos.push({ file: data.pagare, tipo: 'pagare' });
      if (data.otros) archivos.push({ file: data.otros, tipo: 'otros' });

      const prestamoBase = {
        socio_id: socioId,
        monto: Number(data.monto),
        interes: 10,
        plazo_meses: Number(data.plazo_meses),
        observaciones: `Tipo: ${data.tipo}`
      };

      const prestamoCreado = await this.prestamoService.crearPrestamo(prestamoBase);
      const prestamoId = prestamoCreado?.id || prestamoCreado?.datos?.id;

      if (!prestamoId) throw new Error('No se pudo obtener el ID del préstamo creado.');

      // Cierra el modal inmediatamente después de crear el préstamo
      this.cerrarModal();
      this.cargarPrestamosSocio();

      // Sube documentos sin bloquear el cierre del modal
      if (archivos.length > 0) {
        this.subidaDocsService.subirMultiplesArchivos(archivos, prestamoId)
          .then(() => console.log('✅ Archivos subidos correctamente'))
          .catch(err => console.error('❌ Error al subir documentos:', err));
      }

    } catch (error) {
      console.error('❌ Error al guardar el préstamo:', error);
    }
  }

}
