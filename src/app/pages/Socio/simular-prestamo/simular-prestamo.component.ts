import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormularioReutilizableComponent } from '../../../shared/components/formulario-reutilizable/formulario-reutilizable.component';
import { PopupMensajeComponent } from '../../../shared/components/popup-mensaje/popup-mensaje.component';
import { MenuReusableComponent } from '../../../shared/components/menu-reusable/menu-reusable.component';

@Component({
  selector: 'app-simular-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule, FormularioReutilizableComponent, PopupMensajeComponent, MenuReusableComponent],
  templateUrl: './simular-prestamo.component.html',
  styleUrls: ['./simular-prestamo.component.scss'],
})
export class SimularPrestamoComponent implements OnInit {

  menuOpciones = [
    { svg: '/svg/Socios/Estado.svg', etiqueta: 'Estado de Cuenta', ruta: '/inicio_socios' },
    { svg: '/svg/Socios/simulador.svg', etiqueta: 'Simulador', ruta: '/simulador' },
    { svg: '/svg/Socios/prestamos.svg', etiqueta: 'Movimientos', ruta: '/movimientos' },
    { svg: '/svg/Socios/Deposito.svg', etiqueta: 'Préstamos', ruta: '/prestamos' },
  ];

  @ViewChild(FormularioReutilizableComponent)
  formularioComponent!: FormularioReutilizableComponent;

  formularioListo = false;
  tipoSimulacion: 'aporte' | 'prestamo' = 'aporte';
  camposFormulario: any[] = [];

  mensajeVisible = false;
  mensajeTexto = '';
  tipoMensaje: 'exito' | 'error' = 'exito';

  resultadoSimulacion: any = null;

  ngOnInit(): void {
    this.generarFormulario();
    this.formularioListo = true;
  }

  generarFormulario(): void {
    this.camposFormulario = [
      {
        key: 'tipo_simulacion',
        label: 'Tipo de Simulación',
        tipo: 'select',
        value: this.tipoSimulacion,
        opciones: [
          { label: 'Intereses por Aporte', value: 'aporte' },
          { label: 'Crédito', value: 'prestamo' },
        ],
        requerido: true,
        onChange: (value: any) => {
          this.tipoSimulacion = value;
          this.generarFormulario(); // Regenerar los campos según tipo
        },
      },
      {
        key: 'monto',
        label: 'Monto del ' + (this.tipoSimulacion === 'aporte' ? 'Aporte' : 'Crédito'),
        tipo: 'number',
        placeholder: 'Ej: 1000.00',
        requerido: true,
      },
      {
        key: 'plazo',
        label: 'Plazo (meses)',
        tipo: 'number',
        placeholder: 'Ej: 12',
        requerido: true,
      },
      {
        key: 'tasa',
        label: 'Tasa de Interés (%)',
        tipo: 'number',
        placeholder: 'Ej: 12',
        requerido: true,
      },
      {
        key: 'frecuencia',
        label: 'Frecuencia de Pago',
        tipo: 'select',
        value: 'mensual',
        opciones: [
          { label: 'Mensual', value: 'mensual' },
          { label: 'Quincenal', value: 'quincenal' },
          { label: 'Semanal', value: 'semanal' },
        ],
        requerido: true,
      },
      {
        key: 'fecha_inicio',
        label: 'Fecha de Inicio',
        tipo: 'date',
        requerido: true,
      },
    ];
  }

  onFormularioSubmit(valores: any): void {
    const { monto, plazo, tasa, frecuencia } = valores;
    const tasaDecimal = tasa / 100;

    if (this.tipoSimulacion === 'aporte') {
      // Interés simple por aporte
      const interes = (monto * tasaDecimal * plazo) / 12;
      this.resultadoSimulacion = {
        tipo: 'Aporte',
        mensaje: `Interés ganado: $${interes.toFixed(2)} por ${plazo} meses.`,
      };
    } else {
      // Cálculo de cuota según frecuencia
      let nPagos = plazo; // por defecto mensual
      let tasaPeriodo = tasaDecimal / 12;

      if (frecuencia === 'quincenal') {
        nPagos = plazo * 2;
        tasaPeriodo = tasaDecimal / 24;
      } else if (frecuencia === 'semanal') {
        nPagos = plazo * 4;
        tasaPeriodo = tasaDecimal / 48;
      }

      const cuota = (monto * tasaPeriodo) / (1 - Math.pow(1 + tasaPeriodo, -nPagos));
      const total = cuota * nPagos;
      const interesTotal = total - monto;

      this.resultadoSimulacion = {
        tipo: 'Crédito',
        mensaje:
          `Cuota ${frecuencia}: $${cuota.toFixed(2)}\n` +
          `Total pagado: $${total.toFixed(2)}\n` +
          `Intereses: $${interesTotal.toFixed(2)}`,
      };
    }

    this.mostrarMensaje(this.resultadoSimulacion.mensaje, 'exito');
  }

  mostrarMensaje(texto: string, tipo: 'exito' | 'error') {
    this.mensajeTexto = texto;
    this.tipoMensaje = tipo;
    this.mensajeVisible = true;
  }

  cerrarMensaje() {
    this.mensajeVisible = false;
  }

  volver(): void {
    history.back();
  }
}
