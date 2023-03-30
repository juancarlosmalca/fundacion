import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CondicionPageRoutingModule } from './condicion-routing.module';

import { CondicionPage } from './condicion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CondicionPageRoutingModule
  ],
  declarations: [CondicionPage]
})
export class CondicionPageModule {}
