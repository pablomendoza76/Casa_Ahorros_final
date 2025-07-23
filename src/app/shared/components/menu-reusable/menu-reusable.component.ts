import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'menu-reusable',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-reusable.component.html',
  styleUrls: ['./menu-reusable.component.scss']
})
export class MenuReusableComponent {
  /**
   * Lista de opciones del menú.
   * Si una opción contiene `svg`, se usará como ícono en lugar de `icono`.
   * `centro` indica si la opción es el botón central destacado.
   * `activo` indica cuál ítem debe destacarse visualmente como activo (solo uno debe tenerlo en true).
   */
  @Input() opciones: {
    icono?: string;
    svg?: string;
    etiqueta: string;
    ruta: string;
    centro?: boolean;
    activo?: boolean;
  }[] = [];

  /**
   * Calcula la posición horizontal (en %) del ítem activo dentro del menú inferior.
   * Se usa para mover el hueco blanco dinámico debajo del ítem activo.
   */
  calcularPosicionHueco(): number {
    const total = this.opciones.length;
    const indice = this.opciones.findIndex(o => o.activo === true && !o.centro);
    if (indice === -1 || total <= 1) return 50; // fallback al centro
    return (indice / (total - 1)) * 100;
  }
}
