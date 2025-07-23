import { Injectable } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { IconProps } from '../interfaces/icon.interface'

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  registerIcons(icons: IconProps[]) {
    icons.forEach((icon) => {
      const iconPath = `public/icons/${!!icon.path ? icon.path : icon.name}.svg`
      this.matIconRegistry.addSvgIcon(icon.name || 'Err!', this.domSanitizer.bypassSecurityTrustResourceUrl(iconPath))
    })
  }
}
