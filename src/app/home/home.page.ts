import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor( private authService: AuthService, private navCtrl: NavController) { }

  ngOnInit() {

  }
  goToCargos() {
    this.navCtrl.navigateForward('/cargo');
  }
  goToCitas() {
    this.navCtrl.navigateForward('/listar-citas');
  }
  goToClientes() {
    this.navCtrl.navigateForward('/listar-cliente');
  }
  goToCondicion() {
    this.navCtrl.navigateForward('/condicion');
  }
  goToDiagnosticos() {
    this.navCtrl.navigateForward('/diagnostico');
  }
  goToHorarios() {
    this.navCtrl.navigateForward('/horario');
  }
  goToMascotas() {
    this.navCtrl.navigateForward('/mascota');
  }
  goToPersonal() {
    this.navCtrl.navigateForward('/personal/listar-personal');
  }
  goToTratamientos() {
    this.navCtrl.navigateForward('/tratamiento');
  }

  goToMessage(id:number) {
    this.navCtrl.navigateForward('/message/1');
  }


  logout() {
    this.authService.logout();
  }
}
