import { TemplateRef } from "@angular/core";

export interface ConfiguracionColumna {
  tipo: 'imagen' | 'texto' | 'icono' | 'otros';
  template: TemplateRef<any>;
  titulo?: string;
}