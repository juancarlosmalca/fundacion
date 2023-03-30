import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearMascotaPageRoutingModule } from './crear-mascota-routing.module';

import { CrearMascotaPage } from './crear-mascota.page';
import { HttpService } from 'src/app/services/http.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearMascotaPageRoutingModule
  ],
  providers: [Storage, HttpService, LocalStorageService],
  
  declarations: [CrearMascotaPage]
})
export class CrearMascotaPageModule {


  
}
