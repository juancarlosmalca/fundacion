import { MyCita } from '../cita/cita.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { RespuestaInsertar } from '../global/response';
import { HttpService } from '../services/http.service';
import { Cita } from './cita.model';
import { FormCitaComponent } from './form-cita/form-cita.component';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.page.html',
  styleUrls: ['./cita.page.scss'],
})
export class CitaPage implements OnInit {
  citas: MyCita[] = [];
  id_cliente: any;

  constructor(
    private authService: AuthService, 
    private http: HttpService, 
    private router: Router,
    private toastController:ToastController,
    private modalController: ModalController,
    private alertControl:AlertController
    ) { }
  ngOnInit() {
    this.authService.obtenerId().then((valor) => {
      this.authService.getClienteUser(valor).subscribe((clienteArray) => {
        if (Array.isArray(clienteArray) && clienteArray.length > 0) {
          const cliente = clienteArray[0];
          this.id_cliente=cliente.id_cliente;
          this.misCitas(cliente.id_cliente);
        }else{
          console.log('No Autenticado');
        }
    });
    });
  }
  misCitas(id_cliente:string) {
    this.http.misMascotas(id_cliente).subscribe((mascotaArray) => {
      if (Array.isArray(mascotaArray) && mascotaArray.length > 0) {
        // Creamos una variable para almacenar las citas de todas las mascotas
        let citasAcumuladas: Array<MyCita> = [];
        mascotaArray.forEach(mascot => {
          this.http.misCitas(String(mascot.id_mascota)).subscribe((citaArray) => {
            // Agregamos las citas de la mascota actual a la variable de citas acumuladas
            citasAcumuladas = citasAcumuladas.concat(citaArray);
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

  verDetalle(id: number) {
    this.router.navigate(['cita/detalle', id]);
  }
  //Funcion definir modal para insertar nuevo
  async agregarCita() {
    this.modal("Agendar Cita", null, this.id_cliente);
  }
  //Funcion definir modal para modificar
  async editarCita(data: MyCita) {
    this.modal("Modificar Cita", data, this.id_cliente);
  }
  //Funcion para abrir el formulario en un modal  Recibe el titulo del modal y los datos en caso de editar

  private async modal(title: string, data: MyCita | null, id_cliente:string): Promise<void> {
    //Crea el modal
    const modal = await this.modalController.create({
      component: FormCitaComponent,
      componentProps: { title, data, id_cliente }
    });
    //Cuando se cierra ejecuta la funcion inicial donde actualiza la lista 
    modal.onDidDismiss().then(() => {
      this.ngOnInit();
    });
    return await modal.present();
  }
  //Funcion abrir modal eliminar
  public async eliminarCita(id: number): Promise<void> {
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
    this.http.delete<RespuestaInsertar>("cita", id).subscribe(
      (respuesta) => {
        //Verifica la respuesta
         if (respuesta.results.comment == 'Eliminado') {
          //Muestra un mensaje satisfatorio
          this.toastMessage("Registro Eliminado", "success");
          //Ejecuta la funcion incial donde esta el listar
          this.ngOnInit();
        } else {
          //Muestra un mensaje en caso de no ser eliminado
          this.toastMessage("No se puede eliminar porque existen registros que dependen de este cita", "danger");
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
  




