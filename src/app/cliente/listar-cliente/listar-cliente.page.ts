import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { RespuestaInsertar } from '../..//global/response';
import { HttpService } from '../../services/http.service';
import { Cliente } from '../cliente-model';
import { FormClienteComponent } from '../form-cliente/form-cliente.component';

@Component({
  selector: 'app-listar-cliente',
  templateUrl: './listar-cliente.page.html',
  styleUrls: ['./listar-cliente.page.scss'],
})
export class ListarClientePage implements OnInit {
  //Declaracion de variables
  clientes: Cliente[] = [];
  selectedCliente!: Cliente;
  visible = true; // Variable que indica si se está editando un usuario

  constructor(private http: HttpService,
    private readonly toastController: ToastController,
    private readonly modalController: ModalController,
    private alertControl: AlertController,
  ) { }
  //Funcion predefinida al iniciar
  public ngOnInit() {
    this.http.get<Cliente>("/cliente").subscribe((data) => {
      this.clientes = data;
    });
    
  }
  //Funcion definir modal para insertar nuevo
  async agregarCliente() {
    this.modal("Nuevo Cliente", null);
  }
  //Funcion definir modal para modificar
  async editarCliente(data: Cliente) {
    this.modal("Actualizar Cliente", data);
  }
  //Funcion para abrir el formulario en un modal  Recibe el titulo del modal y los datos en caso de editar

  private async modal(title: string, data: Cliente | null): Promise<void> {
    //Crea el modal
    const modal = await this.modalController.create({
      component: FormClienteComponent,
      componentProps: { title, data, visible: this.visible // Pasamos la variable 'editando' al componente del formulario

       }
    });
    //Cuando se cierra ejecuta la funcion inicial donde actualiza la lista 
    modal.onDidDismiss().then(() => {
      this.ngOnInit();
    });
    return await modal.present();
  }
  //Funcion abrir modal eliminar
  public async eliminarCliente(id: number): Promise<void> {
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
    this.http.delete<RespuestaInsertar>("cliente", id).subscribe(
      (respuesta) => {
        //Verifica la respuesta
         if (respuesta.results.comment == 'Eliminado') {
          //Muestra un mensaje satisfatorio
          this.toastMessage("Registro Eliminado", "success");
          //Ejecuta la funcion incial donde esta el listar
          this.ngOnInit();
        } else {
          //Muestra un mensaje en caso de no ser eliminado
          this.toastMessage("No se puede eliminar porque existen registros que dependen de este cliente", "danger");
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


