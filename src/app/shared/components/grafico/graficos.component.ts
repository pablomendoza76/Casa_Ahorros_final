import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent } from '../tabla-dinamica/tabla-dinamica.component';
import { ConfiguracionColumna } from '../tabla-dinamica/ConfiguracionColumna.model';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [NgxChartsModule, CommonModule, TablaDinamicaComponent],
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss'],
})
export class GraficosComponent implements AfterViewInit, OnChanges {
  @Input() tipo: 'barra' | 'pastel' | 'linea' = 'barra';
  @Input() datos: any[] = [];
  @Input() identificador: string = '';
  @Input() mostrarBotonDetalle: boolean = false;

  /**
   * Lista de indicadores a mostrar en el panel derecho
   * - nombre: etiqueta del indicador
   * - valor: monto numérico o texto
   * - sufijo: texto adicional (%, $, etc.)
   * - clase: clase CSS opcional para estilo visual
   */
  @Input() indicadores: {
    nombre: string;
    valor: number | string;
    sufijo?: string;
    clase?: string;
  }[] = [];

  verDetalle: boolean = false;
  filasTabla: any[] = [];
  configuracionColumnas: ConfiguracionColumna[] = [];

  dataGrafico: any[] = [];

  @ViewChild('columnaTipo') columnaTipo!: TemplateRef<any>;
  @ViewChild('columnaFecha') columnaFecha!: TemplateRef<any>;
  @ViewChild('columnaInteres') columnaInteres!: TemplateRef<any>;
  @ViewChild('columnaMonto') columnaMonto!: TemplateRef<any>;
  @ViewChild('columnaSaldo') columnaSaldo!: TemplateRef<any>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.configuracionColumnas = [
      { tipo: 'texto', titulo: 'Tipo', template: this.columnaTipo },
      { tipo: 'texto', titulo: 'Fecha', template: this.columnaFecha },
      { tipo: 'texto', titulo: 'Intereses', template: this.columnaInteres },
      { tipo: 'texto', titulo: 'Monto', template: this.columnaMonto },
      { tipo: 'texto', titulo: 'Saldo', template: this.columnaSaldo },
    ];
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos'] && this.datos) {
      this.prepararDataGrafico();
    }
  }

  /**
   * Agrupa los datos por tipo y calcula el total por cada uno para el gráfico
   */
  prepararDataGrafico(): void {
    // Si ya tiene 'name' y 'value', se asume que está listo
    const datosYaFormateados = this.datos.every(
      (d) => 'name' in d && 'value' in d
    );

    if (this.tipo === 'linea') {
      this.dataGrafico = this.datos;
      return;
    }

    if (datosYaFormateados) {
      this.dataGrafico = this.datos;
      return;
    }

    // Caso alternativo: procesar tipo + monto (legacy)
    const agrupadoPorTipo: { [key: string]: number } = {};
    this.datos.forEach((mov) => {
      if (mov.tipo && typeof mov.monto === 'number') {
        agrupadoPorTipo[mov.tipo] =
          (agrupadoPorTipo[mov.tipo] || 0) + mov.monto;
      }
    });

    this.dataGrafico = Object.keys(agrupadoPorTipo).map((tipo) => ({
      name: tipo,
      value: agrupadoPorTipo[tipo],
    }));
  }

  /**
   * Activa la vista de tabla detallada
   */
  mostrarTabla(): void {
    this.verDetalle = true;
    this.prepararFilasTabla();
  }

  /**
   * Prepara las filas para la tabla detallada con saldo acumulado
   */
  prepararFilasTabla(): void {
    let saldoAcumulado = 0;

    this.filasTabla = this.datos.map((m) => {
      const monto = m.monto || 0;
      saldoAcumulado += monto;

      return {
        tipo: m.tipo,
        fecha: new Date(m.fecha).toLocaleDateString('es-EC', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        interes: '$0.00',
        monto: `$${monto.toFixed(2)}`,
        saldo: `$${saldoAcumulado.toFixed(2)}`,
      };
    });
  }
  /**
   * Formatea las etiquetas del gráfico pastel con porcentaje
   */
  formatearEtiquetaConPorcentaje(nombre: string): string {
    const total = this.dataGrafico.reduce((acc, val) => acc + val.value, 0);
    const segmento = this.dataGrafico.find((d) => d.name === nombre);
    if (!segmento || total === 0) return nombre;

    const porcentaje = (segmento.value / total) * 100;
    return `${nombre} (${porcentaje.toFixed(1)}%)`;
  }
}
