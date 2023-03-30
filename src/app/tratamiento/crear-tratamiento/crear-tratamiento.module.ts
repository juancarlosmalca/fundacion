import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearTratamientoPageRoutingModule } from './crear-tratamiento-routing.module';

import { CrearTratamientoPage } from './crear-tratamiento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearTratamientoPageRoutingModule
  ],
  declarations: [CrearTratamientoPage]
})
export class CrearTratamientoPageModule {}
