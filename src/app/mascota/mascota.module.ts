import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MascotaPageRoutingModule } from './mascota-routing.module';

import { MascotaPage } from './mascota.page';
import { HttpService } from '../services/http.service';
import { LocalStorageService } from '../services/local-storage.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MascotaPageRoutingModule
  ],
  declarations: [MascotaPage],
  providers: [Storage, HttpService, LocalStorageService],

})
export class MascotaPageModule {}



