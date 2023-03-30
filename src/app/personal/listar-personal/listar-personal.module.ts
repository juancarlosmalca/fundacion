import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarPersonalPageRoutingModule } from './listar-personal-routing.module';

import { ListarPersonalPage } from './listar-personal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarPersonalPageRoutingModule
  ],
  declarations: [ListarPersonalPage]
})
export class ListarPersonalPageModule {}
