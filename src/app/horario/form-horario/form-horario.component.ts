import { HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { RespuestaInsertar } from 'src/app/global/response';
import { HttpService } from 'src/app/services/http.service';
import { Horario } from '../horario.model';

@Component({
  selector: 'app-form-horario',
  templateUrl: './form-horario.component.html',
  styleUrls: ['./form-horario.component.scss'],
})
export class FormHorarioComponent {
  //Declacion de variables
  horario: any = {};
  id!: number;
  @Input() public title!: string;
  @Input() public data!: Horario | null;


  public formHorario: FormGroup;

  constructor(
    private readonly toastController: ToastController,
    private readonly fromBuilder: FormBuilder,
    private http: HttpService,
    private readonly modalController: ModalController,
  ) {

    this.formHorario = this.fromBuilder.group({
      id_horario: [""],
      hora_inicio: [""],
      hora_fin: [""]
    });
  }
  //Funcion predefinida al iniciar
  ngOnInit() {
    if (this.data) {
      this.id = this.data.id_horario;
      this.formHorario.setValue(this.data);
    }
  }
  //Funcion para cerrar el modal
  cancel() {
    this.modalController.dismiss();
  }
  //Funcion para Guardar. Insertar/Modificar
  public async save() {
    const formData = new FormData();
    //Asignacion de datos en el form-data para insertar
    Object.keys(this.formHorario.value).forEach(key => {
      formData.append(key, this.formHorario.value[key]);
    });
    //Asignacion de datos en el form-data para modificar
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new URLSearchParams();
    Object.keys(this.formHorario.value).forEach(key => {
      body.set(key, this.formHorario.value[key]);
    }, header);
    //verifica que exista un id
    if (this.id == null) {
      console.log('Registrando?');
      //Si el id es nulo realiza una peticion post en services
      this.http.post<RespuestaInsertar>("/horario", formData)
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
      this.http.put<RespuestaInsertar>(this.id, "horario", body)
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
