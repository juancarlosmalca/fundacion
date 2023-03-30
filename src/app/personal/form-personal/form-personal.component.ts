import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { RespuestaInsertar } from 'src/app/global/response';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { Personal } from '../personal.model';


@Component({
  selector: 'app-form-personal',
  templateUrl: './form-personal.component.html',
  styleUrls: ['./form-personal.component.scss'],
})
export class FormPersonalComponent implements OnInit {


  public formPersonal: FormGroup;
  public formUsuario: FormGroup;

  formGroup = new FormGroup({
    id_personal: new FormControl(''), // <-- campo "id"
    nombre_personal: new FormControl(''),
    apellido_personal: new FormControl(''),
    telefono_personal: new FormControl(''),
    id_cargo: new FormControl(''),
    fecha_registro: new FormControl(''),
    id_usuario: new FormControl(''),
    email_usuario: new FormControl(''),
    password_usuario: new FormControl('')

  });

  constructor(
    private readonly toastController: ToastController,
    private readonly modalController: ModalController,
    private readonly fromBuilder: FormBuilder,
    private http: HttpService,
    private authService: AuthService
  ) {

    this.formPersonal = this.fromBuilder.group({
      id_personal: [""],
      nombre_personal: [""],
      apellido_personal: [""],
      telefono_personal: [""],
      id_cargo: [""],
      fecha_registro: [""],
      id_usuario: [""]
    });
    this.formUsuario = this.fromBuilder.group({
      email_usuario: [""],
      password_usuario: [""],
      id_rol: ["2"]
    });
  }


  //Declacion de variables
  personal: any = {};
  id!: number;
  id_usuario!: number;
  @Input() public title!: string;
  @Input() public data!: Personal | null;
  @Input() public visible!: boolean; // Variable que indica si se está editando un usuario

  //Funcion predefinida al iniciar
  ngOnInit() {

    if (this.data) {
      this.id = this.data.id_personal;
      this.formPersonal.setValue(this.data);
      this.id_usuario = this.data.id_usuario;
      if (this.id_usuario != null) {
        this.http.getUsuario(this.id_usuario).subscribe((userArray) => {
          if (Array.isArray(userArray) && userArray.length > 0) {
            this.formUsuario.setValue(userArray[0]);
            this.visible=false;
            console.log(this.visible);
          }
        });
      }
      
    }
  }
  //Funcion para cerrar el modal
  cancel() {
    this.modalController.dismiss();
  }
  //Funcion para Guardar. Insertar/Modificar
  public async save() {
    const formDataUsuario = new FormData();
    const formDataPersonal = new FormData();
    //Asignacion de datos en el form-data para insertar

    Object.keys(this.formUsuario.value).forEach(key => {
      formDataUsuario.append(key, this.formUsuario.value[key]);
    });
    //Asignacion de datos en el form-data para modificar
    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const bodyPersonal = new URLSearchParams();
    Object.keys(this.formPersonal.value).forEach(key => {
      bodyPersonal.set(key, this.formPersonal.value[key]);
    }, header);
    const bodyUsuario = new URLSearchParams();
    Object.keys(this.formUsuario.value).forEach(key => {
      bodyUsuario.set(key, this.formUsuario.value[key]);
    }, header);
    //verifica que exista un id
    if (this.id == null) {
      console.log('Registrando?');
      //Si el id es nulo realiza una peticion post en services
      this.authService.registerUser(formDataUsuario).subscribe(
        (response) => {
          if (response.results.comment === "Insertado") {
            Object.keys(this.formPersonal.value).forEach(key => {
              console.log(key, this.formPersonal.value[key]);
              if (key == "id_usuario") {
                formDataPersonal.append(key, response.results.lastId);
              } else {
                formDataPersonal.append(key, this.formPersonal.value[key]);
              }
            });
            this.http.post<RespuestaInsertar>("/personal", formDataPersonal)
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
      this.http.put<RespuestaInsertar>(this.id_usuario, "usuario", bodyUsuario)
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
      this.http.put<RespuestaInsertar>(this.id, "personal", bodyPersonal)
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
