import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.scss'],
  imports: [CommonModule, RouterModule, MatIconModule],
})
export class MenuCardComponent {
  @Input() icon?: string;       
  @Input() title!: string;

  @Input() route!: string;   // 👈 Cambiado de "routerLink" a "route"

  @Input() destacado: boolean = false;
}
