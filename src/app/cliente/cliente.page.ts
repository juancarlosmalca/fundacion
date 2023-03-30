import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MyCita } from '../cita/cita.model';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  citas: MyCita[] = [];
  id_cliente: any;

  constructor(
    private authService: AuthService,
    private http: HttpService,
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.authService.obtenerId().then((valor) => {
      this.authService.getClienteUser(valor).subscribe((clienteArray) => {
        if (Array.isArray(clienteArray) && clienteArray.length > 0) {
          const cliente = clienteArray[0];
          this.id_cliente = cliente.id_cliente;
          this.misCitas(cliente.id_cliente);
        } else {
          console.log('No Autenticado');
        }
      });
    });
  }
  misCitas(id_cliente: string) {
    const fechaActual = new Date();

    this.http.misMascotas(id_cliente).subscribe((mascotaArray) => {
      if (Array.isArray(mascotaArray) && mascotaArray.length > 0) {
        // Creamos una variable para almacenar las citas de todas las mascotas
        let citasAcumuladas: Array<MyCita> = [];
        mascotaArray.forEach(mascot => {
          this.http.misCitas(String(mascot.id_mascota)).subscribe((citaArray) => {
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
            citasAcumuladas = citasAcumuladas.concat(citasPendientes);

          });
        });
        // Asignamos las citas acumuladas a la variable this.citas después de que se hayan obtenido todas las citas
        setTimeout(() => {
          this.citas = citasAcumuladas;
        }, 1000); // Este timeout es para asegurarnos de que se hayan obtenido todas las citas antes de asignarlas a this.citas
      } else {
        console.log('no hay mascotas');
      }
    });

  }
  goToMascota() {
    this.navCtrl.navigateForward('/mascota');

  }
  goToCita() {
    this.navCtrl.navigateForward('/citas');

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
