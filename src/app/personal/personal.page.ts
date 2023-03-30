import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MyCita } from '../cita/cita.model';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { Personal } from './personal.model';


@Component({
  selector: 'app-personal',
  templateUrl: './personal.page.html',
  styleUrls: ['./personal.page.scss'],
})
export class PersonalPage implements OnInit {
  personal: Personal = new Personal();
  citas: MyCita[] = [];

  constructor( private authService: AuthService, private navCtrl: NavController, private http:HttpService) { }

  ngOnInit() {
    this.authService.obtenerId().then((valor) => {
      console.log('El codigo del usuario es:', valor);
      this.burcarPersonal(valor);
    });
    this.listaCitas();
  }
  burcarPersonal(id_usuario:string) {
    this.http.getPersonal(id_usuario).subscribe((personalArray) => {
      if (Array.isArray(personalArray) && personalArray.length > 0) {
        const personal = personalArray[0];
        this.personal = new Personal(
          personal.id_personal,
          personal.nombre_personal,
          personal.apellido_personal,
          personal.telefono_personal,
          personal.id_usuario,
          personal.id_cargo        
        );
      }
  });
  }
  listaCitas() {
    const fechaActual = new Date();
        // Creamos una variable para almacenar las citas de todas las mascotas
          this.http.getCitas().subscribe((citaArray) => {
            //Hacer la comprobacion con la fecha actual
            // Obtener la fecha actual
            const fechaActual = new Date();

            // Iterar sobre todas las citas y determinar si están pendientes
            const citasPendientes = citaArray.filter(cita => {
              // Convertir la fecha de la cita a un objeto Date
              const fechaCita = new Date(cita.fecha_cita);

              // Comparar la fecha de la cita con la fecha actual
              if (fechaCita.getTime() >= fechaActual.getTime()) {
                // La cita está pendiente
                return true;
              } else {
                // La cita ya ha pasado y no está pendiente
                return false;
              }
            });
            // Agregamos las citas de la mascota actual a la variable de citas acumuladas
            this.citas = citasPendientes;

          });
        // Asignamos las citas acumuladas a la variable this.citas después de que se hayan obtenido todas las citas

  }
  goToMascota() {
    this.navCtrl.navigateForward('/mascota');

  }
  goToCita() {
    this.navCtrl.navigateForward('/listar-citas');

  }
  goToTratamiento() {
    this.navCtrl.navigateForward('/tratamiento');

  }
  goToPerfil() {
    this.navCtrl.navigateForward('/perfil');
  }
  logout() {
    this.authService.logout();
  }
}
