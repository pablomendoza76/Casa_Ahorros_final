import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TablaDinamicaComponent } from '../../../shared/components/tabla-dinamica/tabla-dinamica.component';
import { PrestamoService } from '../../../services/prestamos.service/prestamo.service';
import { PrestamosMapper } from '../../../mapping/prestamos.mapper';
import { ConfiguracionColumna } from '../../../shared/components/tabla-dinamica/ConfiguracionColumna.model';

@Component({
  selector: 'app-negados',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, MatIconModule],
  templateUrl: './negados.component.html',
  styleUrls: ['./negados.component.scss'],
})
export class NegadosComponent implements OnInit, AfterViewInit {
  prestamos: any[] = [];
  columnas: ConfiguracionColumna[] = [];

  @ViewChild('nombreTpl') nombreTpl!: TemplateRef<any>;
  @ViewChild('infoTpl') infoTpl!: TemplateRef<any>;
  @ViewChild('montoTpl') montoTpl!: TemplateRef<any>;
  @ViewChild('pendienteTpl') pendienteTpl!: TemplateRef<any>;
  @ViewChild('interesTpl') interesTpl!: TemplateRef<any>;
  @ViewChild('plazoTpl') plazoTpl!: TemplateRef<any>;
  @ViewChild('estadoTpl') estadoTpl!: TemplateRef<any>;
  @ViewChild('fechaTpl') fechaTpl!: TemplateRef<any>;

  constructor(
    private prestamoService: PrestamoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.prestamos = await PrestamosMapper.obtenerPrestamosPorEstado(this.prestamoService, 'rechazado');
    console.log('📤 Datos enviados a la tabla dinámica:', this.prestamos);
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.columnas = [
      { titulo: 'Nombre', tipo: 'texto', template: this.nombreTpl },
      { titulo: 'Información', tipo: 'texto', template: this.infoTpl },
      { titulo: 'Monto', tipo: 'texto', template: this.montoTpl },
      { titulo: 'Pendiente', tipo: 'texto', template: this.pendienteTpl },
      { titulo: 'Interés', tipo: 'texto', template: this.interesTpl },
      { titulo: 'Plazo', tipo: 'texto', template: this.plazoTpl },
      { titulo: 'Estado', tipo: 'texto', template: this.estadoTpl },
      { titulo: 'Rechazado el', tipo: 'texto', template: this.fechaTpl },
    ];
    this.cdr.detectChanges();
  }

  volver(): void {
    this.router.navigate(['prestamos/inicio']);
  }
}
