import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { PersonalGuard } from './guards/personal.guard';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'message/:id',
    loadChildren: () => import('./view-message/view-message.module').then( m => m.ViewMessagePageModule), canActivate: [AuthGuard]
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'mascota',
    loadChildren: () => import('./mascota/mascota.module').then( m => m.MascotaPageModule), canActivate: [AuthGuard],
  },
  {
    path: 'cliente',
    loadChildren: () => import('./cliente/cliente.module').then( m => m.ClientePageModule)
  },

  {
    path: 'listar-cliente',
    loadChildren: () => import('./cliente/listar-cliente/listar-cliente.module').then( m => m.ListarClientePageModule),canActivate: [AuthGuard],
  },

  {
    path: 'perfil',
    loadChildren: () => import('./cliente/perfil/perfil.module').then( m => m.PerfilPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'citas',
    loadChildren: () => import('./cita/cita.module').then( m => m.CitaPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'crear-cita',
    loadChildren: () => import('./cita/crear-cita/crear-cita.module').then( m => m.CrearCitaPageModule), canActivate: [AuthGuard]
  },

  {
    path: 'listar-citas',
    loadChildren: () => import('./cita/listar-citas/listar-citas.module').then( m => m.ListarCitasPageModule), canActivate: [AuthGuard]
  },

  {
    path: 'diagnostico',
    loadChildren: () => import('./diagnostico/diagnostico.module').then( m => m.DiagnosticoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'crear-mascota',
    loadChildren: () => import('./mascota/crear-mascota/crear-mascota.module').then( m => m.CrearMascotaPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./usuario/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./usuario/login/login.module').then( m => m.LoginPageModule), canActivate: [AuthGuard],
  },
  {
    path: 'cliente/crear-cliente/:id',
    loadChildren: () => import('./cliente/crear-cliente/crear-cliente.module').then( m => m.CrearClientePageModule)
  },
  {
    path: 'tratamiento/detalle/:id',
    loadChildren: () => import('./tratamiento/detalle-tratamiento/detalle-tratamiento.module').then( m => m.DetalleTratamientoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'mascota/detalle/:id',
    loadChildren: () => import('./mascota/detalle-mascota/detalle-mascota.module').then( m => m.DetalleMascotaPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'cita/detalle/:id',
    loadChildren: () => import('./cita/detalle-cita/detalle-cita.module').then( m => m.DetalleCitaPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'diagnostico/crear-diagnostico/:id',
    loadChildren: () => import('./diagnostico/crear-diagnostico/crear-diagnostico.module').then( m => m.CrearDiagnosticoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'tratamiento',
    loadChildren: () => import('./tratamiento/tratamiento.module').then( m => m.TratamientoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'horario',
    loadChildren: () => import('./horario/horario.module').then( m => m.HorarioPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'personal',
    loadChildren: () => import('./personal/personal.module').then( m => m.PersonalPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'cargo',
    loadChildren: () => import('./cargo/cargo.module').then( m => m.CargoPageModule)
  },
  {
    path: 'condicion',
    loadChildren: () => import('./condicion/condicion.module').then( m => m.CondicionPageModule)
  },
  {
    path: 'hola',
    loadChildren: () => import('./hola/hola.module').then( m => m.HolaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
