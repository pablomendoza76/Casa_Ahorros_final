
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';



@Component({
  selector: 'app-inicio-prestamos',
   standalone: true,
  imports: [MatIconModule],
  templateUrl: './inicio-prestamos.component.html',
  styleUrl: './inicio-prestamos.component.scss'
})

export class InicioPrestamosComponent {
  constructor(private router: Router) {}

  irA(opcion: string): void {
    const rutas: { [key: string]: string } = {
      Aporbados: 'Aprobados',
      Negados: 'Negados',
      Espera: 'Espera'
    };

    const ruta = rutas[opcion];
    if (ruta) {
      this.router.navigate([`/prestamos/${ruta}`]);
    }
  }

  volver(): void {
    this.router.navigate(['/inicio']);
  }
}
