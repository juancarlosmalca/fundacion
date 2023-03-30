import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonalPage } from './personal.page';

const routes: Routes = [
  {
    path: '',
    component: PersonalPage
  },
  {
    path: 'listar-personal',
    loadChildren: () => import('./listar-personal/listar-personal.module').then( m => m.ListarPersonalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalPageRoutingModule {}
