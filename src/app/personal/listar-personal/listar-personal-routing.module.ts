import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarPersonalPage } from './listar-personal.page';

const routes: Routes = [
  {
    path: '',
    component: ListarPersonalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarPersonalPageRoutingModule {}
