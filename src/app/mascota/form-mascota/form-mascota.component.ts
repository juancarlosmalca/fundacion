import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController, PickerController, ToastController } from '@ionic/angular';
import { RespuestaInsertar } from 'src/app/global/response';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { Mascota } from '../mascota-model';

@Component({
  selector: 'app-form-mascota',
  templateUrl: './form-mascota.component.html',
  styleUrls: ['./form-mascota.component.scss'],
})
export class FormMascotaComponent {
  //Declacion de variables
  mascota: any = {};
  id!: number;
  selectorAbierto = false;
  maxDate!: string;

  @Input() public title!: string;
  @Input() public data!: Mascota | null;
  @Input() public id_cliente!: string;


  public formMascota: FormGroup;

  constructor(
    private readonly toastController: ToastController,
    private readonly fromBuilder: FormBuilder,
    private pickerCtrl: PickerController,
    private http: HttpService,
    private authService: AuthService,
    private readonly modalController: ModalController,

    private router: Router
  ) {
    // Inicializar la fecha de nacimiento con la fecha actual
    //this.fechaNacimiento = new Date().toISOString();

    // Inicializar las listas de años, meses y días

    this.formMascota = this.fromBuilder.group({
      id_mascota: [""],
      nombre_mascota: [""],
      especie_mascota: [""],
      raza_mascota: [""],
      sexo_mascota: [""],
      peso_mascota: [""],
      tamano_mascota: [""],
      nacimiento_mascota: [""],
      observaciones_mascota: [""],
      id_cliente: [""]
    });
  }
  //Funcion predefinida al iniciar
  ngOnInit() {
    const today = new Date().toISOString();
    this.maxDate = today;

    if (this.data) {
      this.id = this.data.id_mascota;
      this.formMascota.setValue(this.data);
    }

    this.authService.obtenerRol().then((valor) => {
      console.log('El rol es:', valor);
      if (valor=="3") {
        this.formMascota.patchValue({ id_cliente: this.id_cliente });
        console.log("valor id_cliente: "+ this.id_cliente );
      }
    });


  }
  //Funcion para cerrar el modal
  cancel() {
    this.modalController.dismiss();
  }
  //Funcion para Guardar. Insertar/Modificar
  public async save() {
    const formData = new FormData();
    //Asignacion de datos en el form-data para insertar
    Object.keys(this.formMascota.value).forEach(key => {
      formData.append(key, this.formMascota.value[key]);
    });
    //Asignacion de datos en el form-data para modificar
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new URLSearchParams();
    Object.keys(this.formMascota.value).forEach(key => {
      body.set(key, this.formMascota.value[key]);
    }, header);
    //verifica que exista un id
    if (this.id == null) {
      console.log('Registrando?');
      //Si el id es nulo realiza una peticion post en services
      this.http.post<RespuestaInsertar>("/mascota", formData)
        .subscribe(
          (respuesta) => {
            console.log('respuesta?'+respuesta.results);

            //Verifica que el comment de la respuesta sea exitoso
            if (respuesta.results.comment === 'Insertado') {
              //Muestra un mensaje satisfactorio
              this.toastMessage("Registro Insertado", "success");
            } else {
              //Muestra un mensaje de error
              this.toastMessage("Error al registrar", "danger");
            }
          },
          (error) => {
            //Muestra un mensaje de error
            this.toastMessage("Error", "danger");
            console.log('Error:' + error);
          }
        );
    } else if (this.id != null) {
      //Si el id no es nulo realiza una peticion PUT: Envia el id, el nombre de la tabla y los datos a modificar
      this.http.put<RespuestaInsertar>(this.id, "mascota", body)
        .subscribe(
          (respuesta) => {
            //Verifica que el comment de la respuesta sea exitoso
            if (respuesta.results.comment === 'Modificado') {
              //Muestra un mensaje satisfactorio
              this.toastMessage("Registro Modificado", "success");
            } else {
              //Muestra un mensaje de error
              this.toastMessage("Error al modificar", "danger");
            }
          },
          (error) => {
            //Muestra un mensaje de error 
            this.toastMessage("Error", "danger");
            console.log('Error:' + error);
          }
        );
    }
  }
  //Funcion para mostrar mensajes de aviso temporales: Recibe el texto del mensaje y el color
  public async toastMessage(text: string, color: string) {
    (await this.toastController.create({
      message: text,
      position: "top",
      duration: 3000,
      color: color
    })).present();
    this.modalController.dismiss();
  }
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
            this.formMascota.patchValue({ nacimiento_mascota: `${anio}/${mes}/${dia}` });
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

}
