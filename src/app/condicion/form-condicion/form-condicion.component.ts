import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { RespuestaInsertar } from 'src/app/global/response';
import { HttpService } from 'src/app/services/http.service';
import { Condicion } from '../condicion.model';

@Component({
  selector: 'app-form-condicion',
  templateUrl: './form-condicion.component.html',
  styleUrls: ['./form-condicion.component.scss'],
})
export class FormCondicionComponent {
  //Declacion de variables
  condicion: any = {};
  id!: number;
  @Input() public title!: string;
  @Input() public data!: Condicion | null;


  public formCondicion: FormGroup;

  constructor(
    private readonly toastController: ToastController,
    private readonly fromBuilder: FormBuilder,
    private http: HttpService,
    private readonly modalController: ModalController,
  ) {

    this.formCondicion = this.fromBuilder.group({
      id_condicion: [""],
      fecha_condicion: [""],
      estado_condicion: [""]
    });
  }
  //Funcion predefinida al iniciar
  ngOnInit() {
    if (this.data) {
      this.id = this.data.id_condicion;
      this.formCondicion.setValue(this.data);
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
    Object.keys(this.formCondicion.value).forEach(key => {
      formData.append(key, this.formCondicion.value[key]);
    });
    //Asignacion de datos en el form-data para modificar
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new URLSearchParams();
    Object.keys(this.formCondicion.value).forEach(key => {
      body.set(key, this.formCondicion.value[key]);
    }, header);
    //verifica que exista un id
    if (this.id == null) {
      console.log('Registrando?');
      //Si el id es nulo realiza una peticion post en services
      this.http.post<RespuestaInsertar>("/condicion", formData)
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
      //Si el id no es nulo realiza una peticion PUT: Envia el id, el nombre de la tabla y los datos a modificar
      this.http.put<RespuestaInsertar>(this.id, "condicion", body)
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
