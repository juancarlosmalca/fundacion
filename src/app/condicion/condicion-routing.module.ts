import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CondicionPage } from './condicion.page';

const routes: Routes = [
  {
    path: '',
    component: CondicionPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CondicionPageRoutingModule {}
