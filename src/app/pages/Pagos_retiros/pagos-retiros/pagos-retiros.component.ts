  import {
    Component,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef,
    ViewChild,
    TemplateRef
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { AportesMapper } from '../../../mapping/aportes.mapper';
  import { TablaDinamicaComponent } from '../../../shared/components/tabla-dinamica/tabla-dinamica.component';
  import { ConfiguracionColumna } from '../../../shared/components/tabla-dinamica/ConfiguracionColumna.model';
  import { MatIconModule } from '@angular/material/icon';
  import { Router } from '@angular/router';

  @Component({
    selector: 'app-pagos-retiros',
    standalone: true,
    imports: [CommonModule, TablaDinamicaComponent, MatIconModule],
    templateUrl: './pagos-retiros.component.html',
    styleUrls: ['./pagos-retiros.component.scss'],
  })
  export class PagosRetirosComponent implements OnInit, AfterViewInit {
    movimientos: any[] = [];
    columnas: ConfiguracionColumna[] = [];

    @ViewChild('tipoTpl') tipoTpl!: TemplateRef<any>;
    @ViewChild('socioTpl') socioTpl!: TemplateRef<any>;
    @ViewChild('cuentaTpl') cuentaTpl!: TemplateRef<any>;
    @ViewChild('montoTpl') montoTpl!: TemplateRef<any>;
    @ViewChild('fechaTpl') fechaTpl!: TemplateRef<any>;
    @ViewChild('descTpl') descTpl!: TemplateRef<any>;

    constructor(
      private aportesMapper: AportesMapper,
      private cdr: ChangeDetectorRef,
      private router: Router,
    ) {}

    ngOnInit(): void {
      this.aportesMapper.obtenerMovimientosPagoYRetiro().subscribe(data => {
        this.movimientos = data;
        this.cdr.detectChanges();
      });
    }

    ngAfterViewInit(): void {
      this.columnas = [
        { titulo: 'Socio', tipo: 'texto', template: this.socioTpl },
        { titulo: 'N. Cuenta', tipo: 'texto', template: this.cuentaTpl },
        { titulo: 'Tipo', tipo: 'texto', template: this.tipoTpl },
        { titulo: 'Monto', tipo: 'texto', template: this.montoTpl },
        { titulo: 'Fecha', tipo: 'texto', template: this.fechaTpl },
        { titulo: 'Descripción', tipo: 'texto', template: this.descTpl }
      ];
      this.cdr.detectChanges();
    }

    volver(): void {
      this.router.navigate(['inicio']);
    }
  }
