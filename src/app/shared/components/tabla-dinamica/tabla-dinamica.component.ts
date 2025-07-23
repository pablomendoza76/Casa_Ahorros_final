import { Component, Input, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {ConfiguracionColumna} from './ConfiguracionColumna.model'



@Component({
  selector: 'app-tabla-dinamica',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule,],
  templateUrl: './tabla-dinamica.component.html',
  styleUrls: ['./tabla-dinamica.component.scss']
})
export class TablaDinamicaComponent {
  @Input() filas: any[] = [];
  @Input() configuracionColumnas: ConfiguracionColumna[] = [];
  @Input() mostrarEncabezado: boolean = true;


  @ContentChildren(TemplateRef) columnasRenderizables!: QueryList<TemplateRef<any>>;

  textoBusqueda = '';
  

  get filasFiltradas(): any[] {
    if (!this.textoBusqueda.trim()) return this.filas;
    const termino = this.textoBusqueda.toLowerCase();
    return this.filas.filter(fila =>
      Object.values(fila).some(valor =>
        valor !== null && valor !== undefined &&
        String(valor).toLowerCase().includes(termino)
      )
    );
  }
}
