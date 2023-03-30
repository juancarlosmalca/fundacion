import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MascotaPage } from './mascota.page';

const routes: Routes = [
  {
    path: '',
    component: MascotaPage
  },
  {
    path: 'crear-mascota',
    loadChildren: () => import('./crear-mascota/crear-mascota.module').then( m => m.CrearMascotaPageModule)
  },
  {
    path: 'detalle-mascota',
    loadChildren: () => import('./detalle-mascota/detalle-mascota.module').then( m => m.DetalleMascotaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MascotaPageRoutingModule {}
