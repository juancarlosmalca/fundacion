import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargoPage } from './cargo.page';

const routes: Routes = [
  {
    path: '',
    component: CargoPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CargoPageRoutingModule {}
