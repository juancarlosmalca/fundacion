import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { RespuestaInsertar } from 'src/app/global/response';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.page.html',
  styleUrls: ['./crear-cliente.page.scss']
})
export class CrearClientePage {

  name: string='';
  surname: string='';
  cedula: string='';
  address: string='';
  phone: string='';
  id_usuario!: string;
  constructor(
    private http: HttpService, 
    private route: ActivatedRoute, 
    private router: Router,
    private toastController : ToastController
    ) { }
  ionViewWillEnter() {
    const rolId = this.route.snapshot.paramMap.get('id');
    if (rolId) {
      this.id_usuario=rolId;
      console.log(this.id_usuario);

    }
  }
  onSubmit() {
    //Para poder insetar declaro un form-data
    const formData = new FormData();
    formData.append('nombre_cliente', this.name);
    formData.append('apellido_cliente', this.surname);
    formData.append('cedula_cliente', this.cedula);
    formData.append('direccion_cliente', this.address);
    formData.append('telefono_cliente', this.phone);
    formData.append('id_usuario', this.id_usuario);
    //Realizo la llamada a la funcion registrar que esta en el servicio Register
    this.http.post<RespuestaInsertar>("/cliente", formData)
    .subscribe(
      (respuesta) => {
        // Manejar la respuesta exitosa aquí
        if (respuesta.results.comment == 'Insertado') {
          this.toastMessage("Usuario Creador","Success");
          this.router.navigate(['/login']);
        } else {
          this.toastMessage("Fallo al crear Usuario","Danger");
          console.log("Fallo");
        }

      },
      (error) => {
        console.error(error);
        this.toastMessage("Error","Danger");
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

