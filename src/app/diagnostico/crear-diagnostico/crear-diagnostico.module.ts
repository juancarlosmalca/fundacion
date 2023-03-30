import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearDiagnosticoPageRoutingModule } from './crear-diagnostico-routing.module';

import { CrearDiagnosticoPage } from './crear-diagnostico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearDiagnosticoPageRoutingModule
  ],
  declarations: [CrearDiagnosticoPage]
})
export class CrearDiagnosticoPageModule {}
