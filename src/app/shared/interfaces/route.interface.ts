import { Route } from '@angular/router'
import { IconProps } from '../../icons/interfaces/icon.interface'

export interface INavRoute {
  icon: IconProps
  path: string
  name: string
  link: string
  comp: Route['loadComponent']
  alias: string
  group: string
  children: NavRoute[]
  pathMatch: Route['pathMatch']
  redirectTo: Route['redirectTo']
  dropdown: { isOpen: boolean }
  floating: { L1: boolean; L2: boolean }
}

export interface NavRoute extends Partial<INavRoute> {}
