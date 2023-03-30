import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TratamientoPage } from './tratamiento.page';

const routes: Routes = [
  {
    path: '',
    component: TratamientoPage
  },
  {
    path: 'crear-tratamiento',
    loadChildren: () => import('./crear-tratamiento/crear-tratamiento.module').then( m => m.CrearTratamientoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TratamientoPageRoutingModule {}
