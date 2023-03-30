import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearDiagnosticoPage } from './crear-diagnostico.page';

const routes: Routes = [
  {
    path: '',
    component: CrearDiagnosticoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearDiagnosticoPageRoutingModule {}
