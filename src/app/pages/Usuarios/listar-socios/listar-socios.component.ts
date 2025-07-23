import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent } from '../../../shared/components/tabla-dinamica/tabla-dinamica.component';
import { SocioMapper } from '../../../mapping/socio.mapper';
import { MatIconModule } from '@angular/material/icon';
import { ConfiguracionColumna } from '../../../shared/components/tabla-dinamica/ConfiguracionColumna.model';

@Component({
  selector: 'app-listar-socios',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, MatIconModule],
  templateUrl: './listar-socios.component.html',
  styleUrls: ['./listar-socios.component.scss'],
  providers: [SocioMapper]
})
export class ListarSociosComponent implements OnInit {
  filas: any[] = [];
  configuracionColumnas: ConfiguracionColumna[] = [];

  @ViewChild('columnaFoto') columnaFoto!: TemplateRef<any>;
  @ViewChild('columnaNombre') columnaNombre!: TemplateRef<any>;
  @ViewChild('columnaContacto') columnaContacto!: TemplateRef<any>;
  @ViewChild('columnaAccion') columnaAccion!: TemplateRef<any>;

  constructor(
    private mapper: SocioMapper,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mapper.obtenerSocios().subscribe({
      next: socios => this.filas = socios,
      error: () => console.error('Error al obtener socios')
    });
  }

  ngAfterViewInit(): void {
    this.configuracionColumnas = [
      { tipo: 'imagen', template: this.columnaFoto },     // 🔑 Aquí se indica que es IMAGEN
      { tipo: 'texto', template: this.columnaNombre },
      { tipo: 'texto', template: this.columnaContacto },
      { tipo: 'icono', template: this.columnaAccion }
    ];
  }

  volver(): void {
    this.router.navigate(['/usuarios/inicio']);
  }
}
