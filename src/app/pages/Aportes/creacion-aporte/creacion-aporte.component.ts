import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrestamoService } from '../../../services/prestamos.service/prestamo.service';
import { AportesService } from '../../../services/aportes/aportes.service';
import { firstValueFrom } from 'rxjs';
import { FormularioReutilizableComponent } from '../../../shared/components/formulario-reutilizable/formulario-reutilizable.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopupMensajeComponent } from '../../../shared/components/popup-mensaje/popup-mensaje.component';

@Component({
  selector: 'app-creacion-aporte',
  standalone: true,
  imports: [FormularioReutilizableComponent, CommonModule, FormsModule, PopupMensajeComponent],
  templateUrl: './creacion-aporte.component.html',
  styleUrls: ['./creacion-aporte.component.scss'],
})
export class CreacionAporteComponent implements OnInit {
  @ViewChild(FormularioReutilizableComponent)
  formularioComponent!: FormularioReutilizableComponent;

  tipoSeleccionado: 'deposito' | 'retiro' | 'pago_prestamo' = 'deposito';
  camposFormulario: any[] = [];
  tituloFormulario = 'Llena los campos del formulario';

  prestamosDisponibles: any[] = [];
  cuentaNumero = '';
  cuentaId = 0;
  formularioListo = false;

  saldoRestante = 0;
  montoPagado = 0;
  montoTotal = 0;
  prestamoSeleccionadoId: number | null = null;

  mensajeVisible = false;
  mensajeTexto = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  constructor(
    private prestamoService: PrestamoService,
    private aportesService: AportesService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    const cuentaParam = this.route.snapshot.queryParamMap.get('cuenta_id');

    if (!cuentaParam) {
      this.mostrarMensaje('Número de cuenta no especificado en la URL', 'error');
      return;
    }

    this.cuentaNumero = cuentaParam;

    try {
      const cuentas = await firstValueFrom(
        this.aportesService.obtenerCuentaPorNumero(this.cuentaNumero)
      );

      if (!cuentas.length) {
        this.mostrarMensaje('Cuenta no encontrada', 'error');
        return;
      }

      this.cuentaId = cuentas[0].id;

      await this.cargarPrestamos();
      this.generarCamposBase();
      this.actualizarVisibilidadCampos();
      this.formularioListo = true;
    } catch (error) {
      console.error('Error al buscar la cuenta:', error);
      this.mostrarMensaje('Ocurrió un error al buscar la cuenta', 'error');
    }
  }

  async cargarPrestamos(): Promise<void> {
    this.prestamosDisponibles = await this.prestamoService.obtenerPrestamosActivos();
  }

  generarCamposBase(): void {
    this.camposFormulario = [
      {
        key: 'numero_cuenta',
        label: 'Número de Cuenta',
        tipo: 'text',
        value: this.cuentaNumero,
        deshabilitado: true,
      },
      {
        key: 'cuenta_id',
        tipo: 'hidden',
        value: this.cuentaId,
      },
      {
        key: 'tipo',
        label: 'Tipo de Movimiento',
        tipo: 'select',
        value: this.tipoSeleccionado,
        opciones: [
          { label: 'Depósito', value: 'deposito' },
          { label: 'Retiro', value: 'retiro' },
          { label: 'Pago de Préstamo', value: 'pago_prestamo' },
        ],
        requerido: true,
        onChange: (value: any) => {
          this.tipoSeleccionado = value;
          this.actualizarVisibilidadCampos();
        },
      },
      {
        key: 'prestamo_id',
        label: 'Préstamo',
        tipo: 'select',
        opciones: this.prestamosDisponibles.map((p) => ({
          label: `Préstamo #${p.id} - $${p.monto}`,
          value: p.id,
        })),
        requerido: false,
        visible: false,
        onChange: (value: any) => this.onPrestamoSeleccionado(value),
      },
      {
        key: 'descripcion',
        label: 'Descripción',
        tipo: 'text',
        placeholder: 'Opcional',
        requerido: false,
        visible: true,
      },
      {
        key: 'monto',
        label: 'Monto',
        tipo: 'number',
        placeholder: 'Monto del movimiento',
        requerido: true,
        visible: true,
        onChange: (monto: any) => {
          this.actualizarSaldoDesdeMonto(Number(monto));
        },
      },
      {
        key: 'saldo_restante',
        label: 'Saldo Restante',
        tipo: 'text',
        value: '',
        deshabilitado: true,
        visible: false,
      },
    ];
  }

  actualizarVisibilidadCampos(): void {
    for (const campo of this.camposFormulario) {
      if (campo.key === 'prestamo_id' || campo.key === 'saldo_restante') {
        campo.visible = this.tipoSeleccionado === 'pago_prestamo';
      }
      if (campo.key === 'descripcion') {
        campo.visible = this.tipoSeleccionado !== 'pago_prestamo';
      }
    }

    this.camposFormulario = [...this.camposFormulario];
  }

  async onPrestamoSeleccionado(prestamoId: number): Promise<void> {
    this.prestamoSeleccionadoId = prestamoId;
    const resumen = await this.prestamoService.obtenerResumenPago(prestamoId);
    this.montoTotal = resumen.monto_total;
    this.montoPagado = resumen.monto_pagado;
    this.saldoRestante = this.montoTotal - this.montoPagado;

    if (this.formularioComponent) {
      this.formularioComponent.actualizarCampo('saldo_restante', this.saldoRestante.toFixed(2));
    }
  }

  actualizarSaldoDesdeMonto(monto: number): void {
    if (this.tipoSeleccionado === 'pago_prestamo' && this.saldoRestante > 0) {
      const nuevoSaldo = this.saldoRestante - monto;
      if (this.formularioComponent) {
        this.formularioComponent.actualizarCampo('saldo_restante', nuevoSaldo.toFixed(2));
      }
    }
  }

  async onFormularioSubmit(datos: any): Promise<void> {
    const montoPago = Number(datos.monto);
    const tipoMovimiento = datos.tipo;
    const prestamoId = datos.prestamo_id ? Number(datos.prestamo_id) : null;

    const payload = {
      cuenta_id: this.cuentaId,
      monto: montoPago,
      descripcion: datos.descripcion,
      tipo: tipoMovimiento,
      prestamo_id: tipoMovimiento === 'pago_prestamo' ? prestamoId : null,
      usuario_id: 1,
    };

    try {
      await firstValueFrom(this.aportesService.crearAporte(payload));

      if (tipoMovimiento === 'pago_prestamo' && prestamoId) {
        const nuevoSaldo = this.saldoRestante - montoPago;
        await this.prestamoService.actualizarSaldoRestante({
          id: prestamoId,
          saldo_restante: nuevoSaldo,
        });
      }

      this.mostrarMensaje('Movimiento registrado correctamente.', 'exito');
    } catch (error) {
      console.error('Error al registrar el movimiento:', error);
      this.mostrarMensaje('Hubo un error al guardar el movimiento.', 'error');
    }
  }

  mostrarMensaje(texto: string, tipo: 'exito' | 'error') {
    this.mensajeTexto = texto;
    this.tipoMensaje = tipo;
    this.mensajeVisible = true;

    if (tipo === 'exito') {
      this.formularioComponent?.resetFormulario();
      this.restablecerCamposFijos();
    }
  }

  cerrarMensaje() {
    this.mensajeVisible = false;
    if (this.tipoMensaje === 'exito') {
      this.formularioComponent?.resetFormulario();
      this.restablecerCamposFijos();
    }
  }

  private restablecerCamposFijos(): void {
    if (this.formularioComponent) {
      this.formularioComponent.actualizarCampo('numero_cuenta', this.cuentaNumero);
      this.formularioComponent.actualizarCampo('cuenta_id', this.cuentaId);
    }
  }

  irALista(): void {
    console.log('Ir a la lista de aportes');
  }

  volver(): void {
    history.back();
  }
}
