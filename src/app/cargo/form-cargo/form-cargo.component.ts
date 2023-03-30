import { HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { RespuestaInsertar } from 'src/app/global/response';
import { HttpService } from 'src/app/services/http.service';
import { Cargo } from '../cargo.model';

@Component({
  selector: 'app-form-cargo',
  templateUrl: './form-cargo.component.html',
  styleUrls: ['./form-cargo.component.scss'],
})
export class FormCargoComponent {
  //Declacion de variables
  cargo: any = {};
  id!: number;
  @Input() public title!: string;
  @Input() public data!: Cargo | null;


  public formCargo: FormGroup;

  constructor(
    private readonly toastController: ToastController,
    private readonly fromBuilder: FormBuilder,
    private http: HttpService,
    private readonly modalController: ModalController,

    private router: Router
  ) {

    this.formCargo = this.fromBuilder.group({
      id_cargo: [""],
      nombre_cargo: [""],
      funciones_cargo: [""]
    });
  }
  //Funcion predefinida al iniciar
  ngOnInit() {
    if (this.data) {
      this.id = this.data.id_cargo;
      this.formCargo.setValue(this.data);
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
    Object.keys(this.formCargo.value).forEach(key => {
      formData.append(key, this.formCargo.value[key]);
    });
    //Asignacion de datos en el form-data para modificar
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new URLSearchParams();
    Object.keys(this.formCargo.value).forEach(key => {
      body.set(key, this.formCargo.value[key]);
    }, header);
    //verifica que exista un id
    if (this.id == null) {
      console.log('Registrando?');
      //Si el id es nulo realiza una peticion post en services
      this.http.post<RespuestaInsertar>("/cargo", formData)
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
      this.http.put<RespuestaInsertar>(this.id, "cargo", body)
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
