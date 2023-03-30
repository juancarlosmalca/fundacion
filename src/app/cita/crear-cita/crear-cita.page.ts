import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { RespuestaInsertar } from 'src/app/global/response';
import { Horario } from 'src/app/horario/horario.model';
import { Mascota } from 'src/app/mascota/mascota-model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-crear-cita',
  templateUrl: './crear-cita.page.html',
  styleUrls: ['./crear-cita.page.scss'],
})
export class CrearCitaPage implements OnInit {
  horarios: Horario[] = [];
  mascotas: Mascota[] = [];

  motivo: string = '';
  fecha: string = '';
  estado: string = 'reservado';
  horarioSeleccionado: string = "";
  mascotaSeleccionada: string = "";
  id_cliente: any;

  constructor(private authService: AuthService,
    private http: HttpService,
    private navControl: NavController,
    private alertController: AlertController) { }

  ngOnInit() {

    this.authService.obtenerId().then((valor) => {
      console.log('El valor de id_cliente es:', valor);

      this.authService.getClienteUser(valor).subscribe((clienteArray) => {
        if (Array.isArray(clienteArray) && clienteArray.length > 0) {
          const cliente = clienteArray[0];
          this.id_cliente = cliente.id_cliente;
          console.log('El valor de id_cliente es:', this.id_cliente);
          this.listarMascotas(this.id_cliente);

        } else {
          console.log('no hay', this.id_cliente);

        }
      });
    });
    this.obtenerHorarios();

  }

  obtenerHorarios() {
    this.http.getHorarios().subscribe(
      (horarios) => {
        console.log(horarios);

        this.horarios = horarios;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  listarMascotas(id_cliente: string) {
    this.http.misMascotas(id_cliente).subscribe(
      (mascotas) => {
        console.log(mascotas);

        this.mascotas = mascotas;
      },
      (error) => {
        console.log(error);
      }
    );
  }


  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    /**
     * Date will be enabled if it is not
     * Sunday or Saturday
     */
    return utcDay !== 0 && utcDay !== 6;
  };
  onSubmit() {

    const formData = new FormData();
    formData.append('motivo_cita', this.motivo);
    formData.append('fecha_cita', this.fecha);
    formData.append('estado_cita', this.estado);
    formData.append('id_horario', String(this.horarioSeleccionado));
    formData.append('id_mascota', String(this.mascotaSeleccionada));

    this.http.post<RespuestaInsertar>("/cita", formData)
      .subscribe(
        (respuesta) => {
          // Manejar la respuesta exitosa aquí
          console.log('respuesta:', respuesta);
          const comment = respuesta.results.comment;
          console.log('comment:', comment);
          if (comment === 'Insertado') {
            this.showMessageExito();
            this.navControl.navigateForward('/citas');
            this.navControl.pop();
          } else {
            this.showMessageFallo();
            console.log("Fallo");
          }

        },
        (error) => {
          this.showMessageFallo();
        }
      );
  }
  async showMessageExito() {
    const alert = await this.alertController.create({
      header: 'Correcto',
      message: 'Cita Adendada!',
      buttons: ['OK']
    });

    await alert.present();
  }
  async showMessageFallo() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'A ocurrido un error al agendar la cita',
      buttons: ['OK']
    });

    await alert.present();
  }
}
