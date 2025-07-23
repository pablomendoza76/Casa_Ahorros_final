import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-usuarios',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './inicio-usuarios.component.html',
  styleUrls: ['./inicio-usuarios.component.scss']
})
export class InicioUsuariosComponent {
  constructor(private router: Router) {}

  irA(opcion: string): void {
    const rutas: { [key: string]: string } = {
      registrar: 'crear',
      actualizar: 'actualizar',
      eliminar: 'desactivar'
    };

    const ruta = rutas[opcion];
    if (ruta) {
      this.router.navigate([`/usuarios/${ruta}`]);
    }
  }

  volver(): void {
    this.router.navigate(['/inicio']);
  }
}
