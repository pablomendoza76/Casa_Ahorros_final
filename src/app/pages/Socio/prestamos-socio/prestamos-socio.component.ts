import { Component, OnInit } from '@angular/core';
import { PrestamoService } from '../../../services/prestamos.service/prestamo.service';
import { PrestamosMapper } from '../../../mapping/prestamos.mapper';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormularioReutilizableComponent } from '../../../shared/components/formulario-reutilizable/formulario-reutilizable.component';
import { MenuReusableComponent } from '../../../shared/components/menu-reusable/menu-reusable.component';

@Component({
  selector: 'app-prestamos-socio',
  imports: [CommonModule, FormsModule, FormularioReutilizableComponent, MenuReusableComponent],
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

  constructor(private prestamoService: PrestamoService) {}

  ngOnInit(): void {
    this.cargarPrestamosSocio();
    this.generarFormularioPrestamo();
  }

  /**
   * Cargar préstamos del socio actual por su cédula (almacenada en local/session)
   */
  async cargarPrestamosSocio(): Promise<void> {
    try {
      const cedula = localStorage.getItem('cedula') ?? sessionStorage.getItem('cedula');
      if (!cedula) throw new Error('No se encontró la cédula del socio.');

      const { socio, prestamos } = await PrestamosMapper.obtenerPrestamosPorCedula(this.prestamoService, cedula);
      this.socio = socio;
      this.prestamos = prestamos;
    } catch (error) {
      console.error('❌ Error al cargar préstamos del socio:', error);
      this.prestamos = [];
    }
  }

  /**
   * Generar campos para el formulario reutilizable de préstamo
   */
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

  /**
   * Abrir modal de creación
   */
  abrirModal(): void {
    this.modalVisible = true;
  }

  /**
   * Cerrar modal
   */
  cerrarModal(): void {
    this.modalVisible = false;
  }

  /**
   * Guardar nuevo préstamo
   */
  async onGuardarPrestamo(data: any): Promise<void> {
    try {
      const socioId = this.socio?.id;
      if (!socioId) throw new Error('Socio no identificado.');

      const nuevoPrestamo = {
        ...data,
        socio_id: socioId,
        estado: 'en_espera',
        saldo_restante: Number(data.monto)
      };

      await this.prestamoService.crearPrestamo(nuevoPrestamo);
      this.cerrarModal();
      await this.cargarPrestamosSocio();
    } catch (error) {
      console.error('❌ Error al guardar el préstamo:', error);
    }
  }
}
