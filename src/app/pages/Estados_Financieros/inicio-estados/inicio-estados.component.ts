import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuCardComponent } from '../../../shared/components/menu-card/menu-card.component'; // ajusta si cambia

@Component({
  standalone: true,
  selector: 'app-inicio-estados',
  templateUrl: './inicio-estados.component.html',
  styleUrls: ['./inicio-estados.component.scss'],
  imports: [CommonModule, RouterModule, MenuCardComponent]
})
export class InicioEstadosComponent {
  constructor(
     private router: Router,
  ) {}
  cards = [
    {
      icon: 'svg/estados_financieros/balance.svg',
      title: 'Balance General',
      route: '/Balance'
    },
    {
      icon: 'svg/estados_financieros/Egresos.svg',
      title: 'Ingresos vs\nEgresos',
      route: '/Ingresos'
    },
    {
      icon: 'svg/estados_financieros/flujo_caja.svg',
      title: 'Flujo de Caja',
      route: '/flujo_caja'
    },
    {
      icon: 'svg/estados_financieros/cartera.svg',
      title: 'Cartera \nPréstamos',
      route: '/cartera_prestamos'
    },
    {
      icon: 'svg/estados_financieros/indicadores.svg',
      title: 'Indicadores\nFinancieros',
      route: '/indicadores'
    }
  ];

  volver(): void {
    this.router.navigate(['inicio']);
  }
}
