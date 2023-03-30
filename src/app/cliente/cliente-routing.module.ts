import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientePage } from './cliente.page';

const routes: Routes = [
  {
    path: '',
    component: ClientePage
  },
  {
    path: 'crear-cliente',
    loadChildren: () => import('./crear-cliente/crear-cliente.module').then( m => m.CrearClientePageModule)
  },
  {
    path: 'editar',
    loadChildren: () => import('./editar/editar.module').then( m => m.EditarPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'listar-cliente',
    loadChildren: () => import('./listar-cliente/listar-cliente.module').then( m => m.ListarClientePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientePageRoutingModule {}
