import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarCitasPage } from './listar-citas.page';

const routes: Routes = [
  {
    path: '',
    component: ListarCitasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarCitasPageRoutingModule {}
