import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitaPage } from './cita.page';

const routes: Routes = [
  {
    path: '',
    component: CitaPage
  },
  {
    path: 'listar-citas',
    loadChildren: () => import('./listar-citas/listar-citas.module').then( m => m.ListarCitasPageModule)
  },
  {
    path: 'crear-cita',
    loadChildren: () => import('./crear-cita/crear-cita.module').then( m => m.CrearCitaPageModule)
  },
  {
    path: 'detalle-cita',
    loadChildren: () => import('./detalle-cita/detalle-cita.module').then( m => m.DetalleCitaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitaPageRoutingModule {}
