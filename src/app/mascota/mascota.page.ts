import { Component, OnInit } from '@angular/core';
import { Mascota } from '../mascota/mascota-model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { RespuestaInsertar } from '../global/response';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { FormMascotaComponent } from './form-mascota/form-mascota.component';

@Component({
  selector: 'app-mascota',
  templateUrl: './mascota.page.html',
  styleUrls: ['./mascota.page.scss'],
})
export class MascotaPage implements OnInit {

  mascotas: Mascota[] = [];
  id_cliente: any;


  constructor(
    private authService: AuthService, 
    private http: HttpService, 
    private readonly modalController: ModalController,
    private router: Router,
    private toastController:ToastController,
    private alertControl: AlertController
    ) { }

  ngOnInit() {

    this.authService.obtenerRol().then((valor) => {
      console.log('El rol es:', valor);
      if (valor=="2" || valor=="1") {
          this.http.get<Mascota>("/mascota")
          .subscribe(
            (respuesta) => {
              this.mascotas = respuesta;
            },
            (error) => {
              console.log("Error: "+ error);

            }
          );
      }else if (valor=="3") {
          
        this.authService.obtenerId().then((valor) => {
          console.log('El id_usuario es:', valor);
          this.authService.getClienteUser(valor).subscribe((clienteArray) => {
            if (Array.isArray(clienteArray) && clienteArray.length > 0) {
              const cliente = clienteArray[0];
              console.log('cliente', clienteArray[0])
              this.id_cliente = cliente.id_cliente;
              this.listarMascotas(this.id_cliente);
              console.log('El id_cliente es:', this.id_cliente);

            }else{
              console.log('No cliente', this.id_cliente)
            }
        });
          
        });
      }
    });
  }

  listarMascotas(id_cliente:string) {
    this.http.misMascotas(id_cliente).subscribe(
      (mascotas) => {
        this.mascotas = mascotas;
      },
      (error) => {
        console.log(error);
      }
    );
  }



  verDetalle(id: number) {
    this.router.navigate(['mascota/detalle', id]);
  }
/*
  nuevoAnimalito() {
    this.router.navigate(['/crear-mascota']);
  }
  */
  async agregarMascota() {
    this.modal("Nuevo Mascota", null, this.id_cliente);
  }
  //Funcion definir modal para modificar

  async editarMascota(data: Mascota) {
    this.modal("Actualizar Mascota", data, this.id_cliente);
  }

  
  //Funcion para abrir el formulario en un modal  Recibe el titulo del modal y los datos en caso de editar

  private async modal(title: string, data: Mascota | null, id_cliente:string): Promise<void> {
    //Crea el modal
    const modal = await this.modalController.create({
      component: FormMascotaComponent,
      componentProps: { title, data, id_cliente }
    });
    //Cuando se cierra ejecuta la funcion inicial donde actualiza la lista 
    modal.onDidDismiss().then(() => {
      this.ngOnInit();
    });
    return await modal.present();
  }
  public async eliminarMascota(id: number): Promise<void> {
    const alert = await this.alertControl.create({
      header: "Aviso",
      message: "¿Esta seguro que desea eliminar?",
      buttons: [{ text: "Cancelar", role: "cancelar" }, { text: "Aceptar", role: "aceptar" }]
    });
    alert.present();
    const { role } = await alert.onDidDismiss();
    if (role === "aceptar") {
      this.delete(id);
    }
  }
  //Funcion para elimnar 
  delete(id: number) {
    //Realiza la peticion delete
    this.http.delete<RespuestaInsertar>("mascota", id).subscribe(
      (respuesta) => {
        //Verifica la respuesta
         if (respuesta.results.comment == 'Eliminado') {
          //Muestra un mensaje satisfatorio
          this.toastMessage("Registro Eliminado", "success");
          //Ejecuta la funcion incial donde esta el listar
          this.ngOnInit();
        } else {
          //Muestra un mensaje en caso de no ser eliminado
          this.toastMessage("No se puede eliminar porque hay citas registradas con este animalito", "danger");
        }
      },
      (error) => {
        //Muestra un mensaje de error
        this.toastMessage("Error al Eliminar", "danger");
        console.log("Error: " + error);
      }
    );

  }

  //Funcion para mostrar mensajes de aviso temporales: Recibe el texto del mensaje y el color
  async toastMessage(text: string, color: string) {
    const overlay = await this.toastController.getTop();
    if (overlay) {
      overlay.dismiss();
    }
    const toast = await this.toastController.create({
      message: text,
      position: "top",
      duration: 3000,
      color: color
    });
    toast.present();
  }

}
