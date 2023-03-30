import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import { CommonModule } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage-angular';
import { AuthService } from './services/auth.service';
import { Storage } from '@ionic/storage-angular'; // Importa Storage
import { HttpService } from './services/http.service';
import { LocalStorageService } from './services/local-storage.service';
import { FormCargoComponent } from './cargo/form-cargo/form-cargo.component';
import { FormClienteComponent } from './cliente/form-cliente/form-cliente.component';
import { FormCondicionComponent } from './condicion/form-condicion/form-condicion.component';
import { FormHorarioComponent } from './horario/form-horario/form-horario.component';
import { FormPersonalComponent } from './personal/form-personal/form-personal.component';
import { FormMascotaComponent } from './mascota/form-mascota/form-mascota.component';
import { FormCitaComponent } from './cita/form-cita/form-cita.component';

@NgModule({
  declarations: [AppComponent,FormCargoComponent, FormClienteComponent, FormCondicionComponent, FormHorarioComponent, FormPersonalComponent, FormMascotaComponent, FormCitaComponent],
  imports: [IonicStorageModule.forRoot(), CommonModule , FormsModule, ReactiveFormsModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule, ReactiveFormsModule, FormsModule  // Agregar HttpClientModule a la sección de imports
],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AuthService, Storage, HttpService, LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private storage: Storage) {
    this.storage.create(); // llamar al método create() aquí
  }
}



