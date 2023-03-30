import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/usuario/user.model';
import { Cliente } from '../cliente-model';
import { FormClienteComponent } from '../form-cliente/form-cliente.component';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  cliente: Cliente = new Cliente();
  usuario: Usuario = new Usuario();
  visible = true; // Variable que indica si se está editando un usuario


  id_cliente!: string;

  constructor(
    private authService: AuthService,
    private modalController:ModalController
  ) { }

  ngOnInit() {
    this.authService.obtenerId().then((idUsuario) => {
      console.log('El id_usuario es:', idUsuario);
      this.authService.getClienteUser(idUsuario).subscribe((clienteArray) => {
        if (Array.isArray(clienteArray) && clienteArray.length > 0) {
          const cliente = clienteArray[0];

          this.authService.getUsuario(cliente.id_cliente,).subscribe((usuarioArray) => {
            if (Array.isArray(usuarioArray) && usuarioArray.length > 0) {
              const usuario = usuarioArray[0];
              this.usuario = new Usuario(
                usuario.email_usuario
              );
            } else {
              console.log('No usuario', this.id_cliente);
            }
          });

          this.cliente = new Cliente(
            cliente.id_cliente,
            cliente.nombre_cliente,
            cliente.apellido_cliente,
            cliente.cedula_cliente,
            cliente.direccion_cliente,
            cliente.fecha_registro,
            cliente.telefono_cliente,
            cliente.id_usuario
          );
        } else {
          console.log('No cliente', this.id_cliente);
        }
      });
    });
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

}


