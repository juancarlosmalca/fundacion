import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarCitasPageRoutingModule } from './listar-citas-routing.module';

import { ListarCitasPage } from './listar-citas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarCitasPageRoutingModule
  ],
  declarations: [ListarCitasPage]
})
export class ListarCitasPageModule {}
