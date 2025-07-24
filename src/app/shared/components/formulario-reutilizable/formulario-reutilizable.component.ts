import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario-reutilizable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-reutilizable.component.html',
  styleUrls: ['./formulario-reutilizable.component.scss'],
})
export class FormularioReutilizableComponent implements OnInit {
  @Input() campos: any[] = [];
  @Input() textoBotonIzquierdo = '';
  @Input() textoBotonDerecho = 'Lista Usuarios';
  @Input() tituloFormulario = 'Formulario';
  @Input() textoBotonPrimario = '';


  @Output() onSubmit = new EventEmitter<any>();
  @Output() onSecundario = new EventEmitter<void>();
  @Output() onPrimario = new EventEmitter<void>();


  formulario!: FormGroup;

  columnaIzquierda: any[] = [];
  columnaDerecha: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const grupo: any = {};

    this.campos.forEach(campo => {
      const valorInicial = campo.value ?? '';

      if (campo.deshabilitado) {
        grupo[campo.key] = [{ value: valorInicial, disabled: true }];
      } else {
        grupo[campo.key] = [valorInicial];
      }

      if (campo.requerido) {
        grupo[campo.key].push(Validators.required);
      }
    });

    this.formulario = this.fb.group(grupo);
    this.repartirCamposEquitativamente();
  }

  enviar(): void {
    if (this.formulario.valid) {
      this.onSubmit.emit(this.formulario.getRawValue()); // ✅ incluye campos deshabilitados
    }
  }

  resetFormulario(): void {
    this.formulario.reset();
  }

  ejecutarOnChange(campo: any): void {
    const valor = this.formulario.get(campo.key)?.value;
    if (campo.onChange) {
      campo.onChange(valor);
    }
  }

  actualizarCampo(key: string, valor: any): void {
    if (this.formulario?.controls[key]) {
      this.formulario.controls[key].setValue(valor);
    }
  }

  /**
   * Reparte los campos visibles equitativamente entre dos columnas
   */
  repartirCamposEquitativamente(): void {
    const visibles = this.campos.filter(c => c.visible !== false && c.tipo !== 'hidden');
    this.columnaIzquierda = [];
    this.columnaDerecha = [];

    visibles.forEach((campo, index) => {
      if (this.columnaIzquierda.length <= this.columnaDerecha.length) {
        this.columnaIzquierda.push(campo);
      } else {
        this.columnaDerecha.push(campo);
      }
    });
  }


  onArchivoSeleccionado(event: Event, campo: any): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const archivo = input.files[0];
    this.formulario.get(campo.key)?.setValue(archivo);
    this.ejecutarOnChange(campo); // si necesitas reaccionar al cambio
  }
}

}
