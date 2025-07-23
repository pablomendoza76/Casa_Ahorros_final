import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuCardComponent } from '../../shared/components/menu-card/menu-card.component'; // ajusta esta ruta

@Component({
  standalone: true,
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  imports: [
    CommonModule,       // Para *ngFor, *ngIf
    RouterModule,       // Para router
    MenuCardComponent,  // Componente que estás usando
  ],
})
export class InicioComponent {
  mostrarModalAyuda = false;
  cards = [
  { icon: '/svg/inicio/opciones/management.svg', title: 'Gestión de usuarios', route: '/usuarios/inicio' },
  { icon: '/svg/inicio/opciones/save-money.svg', title: 'Gestión de aportes', route: '/aportes' },
  { icon: '/svg/inicio/opciones/payment-method.svg', title: 'Gestión de préstamos', route: '/prestamos/inicio' },
  { icon: '/svg/inicio/opciones/money-transfer.svg', title: 'Pagos y retiros', route: '/Retiros/Pagos' },
  { icon: '/svg/inicio/opciones/budget.svg', title: 'Estados financieros', route: '/Inicio/Estados' },
];
}
