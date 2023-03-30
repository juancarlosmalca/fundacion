import { Component, OnInit, Output } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { PickerController } from '@ionic/angular';
import { Mascota } from '../mascota-model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { RespuestaInsertar } from 'src/app/global/response';

@Component({
  selector: 'app-crear-mascota',
  templateUrl: './crear-mascota.page.html',
  styleUrls: ['./crear-mascota.page.scss'],
})

export class CrearMascotaPage implements OnInit {

  nombre: string = '';
  especie: string = '';
  raza: string = '';
  sexo: string = '';
  peso!: number;
  tamano!: number;
  fechaNacimiento: string = '';
  observaciones: string = '';
  id_cliente: any;
  fechaActual = new Date().toISOString();
  constructor(private http: HttpService, 
  private authService: AuthService, 
  private navControl: NavController, 
  private pickerCtrl: PickerController, 
  private alertController: AlertController) { 

  }
  ngOnInit() {
    this.authService.obtenerId().then((valor) => {
      this.authService.getClienteUser(valor).subscribe((clienteArray) => {
        if (Array.isArray(clienteArray) && clienteArray.length > 0) {
          const cliente = clienteArray[0];
          this.id_cliente = cliente.id_cliente;
        } else {
          console.log('no hay', this.id_cliente);
        }
      });
    });
  }

  async onSubmit() {
    const formData = new FormData();
    formData.append('nombre_mascota', this.nombre);
    formData.append('especie_mascota', this.especie);
    formData.append('raza_mascota', this.raza);
    formData.append('sexo_mascota', this.sexo);
    formData.append('peso_mascota', String(this.peso));
    formData.append('tamano_mascota', String(this.tamano));
    formData.append('nacimiento_mascota', this.fechaNacimiento);
    formData.append('observaciones_mascota', this.observaciones);
    formData.append('id_cliente', this.id_cliente);


    this.http.post<RespuestaInsertar>("/mascota", formData)
      .subscribe(
        (respuesta) => {
          // Manejar la respuesta exitosa aquí
          console.log('respuesta:', respuesta);
          const comment = respuesta.results.comment;
          console.log('comment:', comment);
          if (comment === 'Insertado') {
            this.showMessageExito();
            this.navControl.navigateRoot('/mascota');
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
  selectorAbierto = false;

  async abrirSelectorFecha() {
    if (this.selectorAbierto) {
      return;
    }
    this.selectorAbierto = true;
    const fechaActual = new Date();

    const picker = await this.pickerCtrl.create({
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.selectorAbierto = false;
          },
        },
        {
          text: 'Aceptar',
          handler: (value: any) => {
            const anio = value['anio'].text;
            const mes = value['mes'].text;
            const dia = value['dia'].text;
            this.fechaNacimiento = `${anio}/${mes}/${dia}`;
            this.selectorAbierto = false;
          },
        },
      ],
      columns: [
        {
          name: 'anio',
          options: this.opcionesAnio,
        },
        {
          name: 'mes',
          options: this.opcionesMes,
        },
        {
          name: 'dia',
          options: this.opcionesDia,
        },

      ],
    });
    picker.columns[0].selectedIndex = fechaActual.getFullYear() - 2000; // Establecer el año actual
    picker.columns[1].selectedIndex = fechaActual.getMonth(); // Establecer el mes actual
    picker.columns[2].selectedIndex = fechaActual.getDate() - 1; // Establecer el día actual

    await picker.present();
  }

  opcionesDia = this.crearOpciones(1, 31);
  opcionesMes = this.crearOpciones(1, 12);
  opcionesAnio = this.crearOpciones(2000, 2024);

  crearOpciones(inicio: number, fin: number) {
    const opciones = [];
    for (let i = inicio; i <= fin; i++) {
      opciones.push({ text: i.toString(), value: i });
    }
    return opciones;
  }




  async showMessageExito() {
    const alert = await this.alertController.create({
      header: 'Correcto',
      message: 'Animalito creado!',
      buttons: ['OK']
    });

    await alert.present();
  }
  async showMessageFallo() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'A ocurrido un error al registrar el animalito',
      buttons: ['OK']
    });

    await alert.present();
  }
}

