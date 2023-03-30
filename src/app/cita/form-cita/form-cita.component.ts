import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { RespuestaInsertar } from 'src/app/global/response';
import { Horario } from 'src/app/horario/horario.model';
import { Mascota } from 'src/app/mascota/mascota-model';
import { HttpService } from 'src/app/services/http.service';
import { Cita, MyCita } from '../cita.model';

@Component({
  selector: 'app-form-cita',
  templateUrl: './form-cita.component.html',
  styleUrls: ['./form-cita.component.scss'],
})
export class FormCitaComponent {
  //Declacion de variables locales
  cita: any = {};
  mascotas: Mascota[] = [];
  horarios: Horario[] = [];
  id!: number;
  currentDate!: number;

  //Variables que vienen desde la lista

  @Input() public title!: string;
  @Input() public data!: MyCita | null;
  @Input() public id_cliente!: string;
  //Formulario que recibe toda la informacion de cita (sirve para recibir datos para el editar)
  public formCita: FormGroup;
  //Formulario que guardara los datos a ser enviados 
  public formTemporal: FormGroup;

  constructor(
    private readonly toastController: ToastController,
    private readonly fromBuilder: FormBuilder,
    private http: HttpService,
    private readonly modalController: ModalController,

  ) {
//Declaro las variables que voy a usar en la interfaz 
    this.formCita = this.fromBuilder.group({
      id_cita: [""],
      motivo_cita: [""],
      fecha_cita: [""],
      estado_cita: [""],
      id_mascota: [""],
      id_horario: [""],
      nombre_mascota: [""],
      hora_inicio: [""],
      hora_fin: [""]

    });

    this.formTemporal = this.fromBuilder.group({
      id_cita: [""],
      motivo_cita: [""],
      fecha_cita: [""],
      estado_cita: [""],
      id_mascota: [""],
      id_horario: [""]
    });
  }
  //Funcion predefinida al iniciar
  ngOnInit() {
    //Asigno los datos recibidos al formulario 
    if (this.data) {
      this.id = this.data.id_cita;
      this.formCita.setValue(this.data);
    }
    //Llamo a las funciones para que se liste en los selects
    this.listarMascotas(this.id_cliente);
    this.obtenerHorarios();
    //
    this.currentDate = new Date().getTime();

  }
  //Funcion para obtener todos los horarios
  obtenerHorarios() {
    this.http.getHorarios().subscribe(
      (horarios) => {

        this.horarios = horarios;
      },
      (error) => {
        console.log(error);
      }
    );
  }
    //Funcion para obtener las mascotas del cliente 

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

//Funcion para bloquear las fechas en el calendario de citas
/*
  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    console.log(date.getUTCDay());
    return utcDay !== 0 && utcDay !== 6;
  };

*/
isWeekday = (dateString: string) => {
  const date = new Date(dateString);
  const selectedDate = date.getTime();
  const isDisabled = selectedDate <= this.currentDate;
  const utcDay = date.getUTCDay();
  console.log("dia" +this.currentDate);
  /**
   * Date will be enabled if it is not
   * Sunday or Saturday and not disabled
   */
  return utcDay !== 0 && utcDay !== 6 && !isDisabled;
};
getDisabledDates(): string[] {
  // Aquí puedes generar dinámicamente el arreglo de fechas a bloquear
  // Por ejemplo, bloquear los fines de semana y el día de hoy
  const today = new Date().toISOString().substr(0, 10);
  console.log(today);
  
  const weekends = [6, 1]; // Sábado = 6, Domingo = 0

  const disabledDates = [];
  for (let i = 0; i < 365; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    if (weekends.includes(date.getDay()) || date.toISOString().substr(0, 10) === today) {
      disabledDates.push(date.toISOString().substr(0, 10));
    }
  }
  console.log(disabledDates);

  return disabledDates;
}

  //Funcion para cerrar el modal
  cancel() {
    this.modalController.dismiss();
  }
  //Funcion para Guardar. Insertar/Modificar
  public async save() {
    //En el FormTemporal asigno los datos especificos de la tabla citas
    this.formTemporal.setValue({
      id_cita: this.formCita.value.id_cita,
      motivo_cita: this.formCita.value.motivo_cita,
      fecha_cita: this.formCita.value.fecha_cita,
      estado_cita: this.formCita.value.estado_cita,
      id_mascota: this.formCita.value.id_mascota,
      id_horario: this.formCita.value.id_horario
    });
    const formData = new FormData();
    //Asignacion de datos en el form-data para insertar
    Object.keys(this.formTemporal.value).forEach(key => {
      formData.append(key, this.formTemporal.value[key]);
    });
    //Asignacion de datos en el form-data para modificar
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new URLSearchParams();
    Object.keys(this.formTemporal.value).forEach(key => {
      body.set(key, this.formTemporal.value[key]);
    }, header);

    //verifica que exista un id
    if (this.id == null) {
      console.log('Registrando?');
      //Si el id es nulo realiza una peticion post en services
      this.http.post<RespuestaInsertar>("/cita", formData)
        .subscribe(
          (respuesta) => {
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
      console.log('Modificando?');
      //Si el id no es nulo realiza una peticion PUT: Envia el id, el nombre de la tabla y los datos a modificar
      this.http.put<RespuestaInsertar>(this.id, "cita", body)
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

}
