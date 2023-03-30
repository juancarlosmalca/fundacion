import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagnosticoPage } from './diagnostico.page';

const routes: Routes = [
  {
    path: '',
    component: DiagnosticoPage
  },
  {
    path: 'crear-diagnostico',
    loadChildren: () => import('./crear-diagnostico/crear-diagnostico.module').then( m => m.CrearDiagnosticoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnosticoPageRoutingModule {}
