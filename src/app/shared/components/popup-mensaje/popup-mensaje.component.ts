import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-mensaje',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-mensaje.component.html',
  styleUrls: ['./popup-mensaje.component.scss']
})
export class PopupMensajeComponent {
  @Input() tipo: 'exito' | 'error' = 'exito';
  @Input() mensaje: string = '';
  @Output() cerrar = new EventEmitter<void>();

  onCerrar(): void {
    this.cerrar.emit();
  }
}
