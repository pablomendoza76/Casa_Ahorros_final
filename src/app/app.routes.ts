import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'inicio', loadComponent: () => import('./pages/Inicio/inicio.component').then(m => m.InicioComponent) },
  { path: 'inicio_socios', loadComponent: () => import('./pages/Socio/inicio-socios/inicio-socios.component').then(m => m.InicioSociosComponent) },
  { path: 'perfil', loadComponent: () => import('./pages/Usuarios/perfil/perfil.component').then(m => m.PerfilComponent) },

  // Usuarios
  { path: 'usuarios/inicio', loadComponent: () => import('./pages/Usuarios/inicio-usuarios/inicio-usuarios.component').then(m => m.InicioUsuariosComponent) },
  { path: 'usuarios/crear', loadComponent: () => import('./pages/Usuarios/crear/crear.component').then(m => m.CrearComponent) },
  { path: 'usuarios/listar', loadComponent: () => import('./pages/Usuarios/listar-socios/listar-socios.component').then(m => m.ListarSociosComponent) },
  { path: 'usuarios/actualizar', loadComponent: () => import('./pages/Usuarios/actualizar/actualizar.component').then(m => m.ActualizarSocioComponent) },
  { path: 'usuarios/desactivar', loadComponent: () => import('./pages/Usuarios/desactivar/desactivar.component').then(m => m.DesactivarSocioComponent) },

  // Aportes
  { path: 'aportes', loadComponent: () => import('./pages/Aportes/gestion-aportes/gestion-aportes.component').then(m => m.GestionAportesComponent) },
  { path: 'aportes/crear', loadComponent: () => import('./pages/Aportes/creacion-aporte/creacion-aporte.component').then(m => m.CreacionAporteComponent) },
  { path: 'visualizar-aportes/:numeroCuenta', loadComponent: () => import('./pages/Aportes/vizulizar-aportes/vizulizar-aportes.component').then(m => m.VisualizarAportesComponent) },
  
  //Prestamos
  { path: 'prestamos/inicio', loadComponent: () => import('./pages/Prestamos/inicio-prestamos/inicio-prestamos.component').then(m => m.InicioPrestamosComponent) },
  { path: 'prestamos/Aprobados', loadComponent: () => import('./pages/Prestamos/aprobados/aprobados.component').then(m => m.AprobadosComponent) },
  { path: 'prestamos/Negados', loadComponent: () => import('./pages/Prestamos/negados/negados.component').then(m => m.NegadosComponent) },
  { path: 'prestamos/Espera', loadComponent: () => import('./pages/Prestamos/espera/espera.component').then(m => m.EsperaComponent) },

  //Retiros y Pagos
  { path: 'Retiros/Pagos', loadComponent: () => import('./pages/Pagos_retiros/pagos-retiros/pagos-retiros.component').then(m => m.PagosRetirosComponent) },

  //Estados Financieros
   { path: 'Inicio/Estados', loadComponent: () => import('./pages/Estados_Financieros/inicio-estados/inicio-estados.component').then(m => m.InicioEstadosComponent) },
   { path: 'Balance', loadComponent: () => import('./pages/Estados_Financieros/balance-general/balance-general.component').then(m => m.BalanceGeneralComponent) },
   { path: 'Ingresos', loadComponent: () => import('./pages/Estados_Financieros/ingresos-egresos/ingresos-egresos.component').then(m => m.IngresosEgresosComponent) },
   { path: 'flujo_caja', loadComponent: () => import('./pages/Estados_Financieros/flujo-caja/flujo-caja.component').then(m => m.FlujoCajaComponent) },
    { path: 'cartera_prestamos', loadComponent: () => import('./pages/Estados_Financieros/cartera-prestamos/cartera-prestamos.component').then(m => m.CarteraPrestamosComponent) },
    { path: 'indicadores', loadComponent: () => import('./pages/Estados_Financieros/indicadores-financieros/indicadores-financieros.component').then(m => m.IndicadoresFinancierosComponent) },


    //Socios
    { path: 'simulador', loadComponent: () => import('./pages/Socio/simular-prestamo/simular-prestamo.component').then(m => m.SimularPrestamoComponent) },
    { path: 'movimientos', loadComponent: () => import('./pages/Socio/movimientos/movimientos.component').then(m => m.MovimientosComponent) },
    { path: 'prestamos', loadComponent: () => import('./pages/Socio/prestamos-socio/prestamos-socio.component').then(m => m.PrestamosSocioComponent) },


  // Redirecciones
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
