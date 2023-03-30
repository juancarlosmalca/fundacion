import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {

  email: string='';
  password: string='';

  constructor(
    private router: Router,
    private authService: AuthService, 
    private toastController : ToastController
    ) { }

  onSubmit() {
    //Para poder insetar declaro un form-data
    const formData = new FormData();
    formData.append('email_user', this.email);
    formData.append('password_user', this.password);
    //Realizo la llamada a la funcion registrar que esta en el servicio Register
    this.authService.registerUser(formData).subscribe(
      (response) => {
        if (response.results.comment==="Insertado") {
          this.toastMessage("Usuario Creado: Completa el registro","success");
          console.log(response.results.lastId);
          this.router.navigate(['login', response.results.lastId]);

        }else{

        }
      },
      (error) => {
        console.error(error);
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
      duration: 4000,
      color: color
    });
    toast.present();
  }
}

