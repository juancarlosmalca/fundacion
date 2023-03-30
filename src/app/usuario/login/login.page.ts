import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AlertController, MenuController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  responseData: any;
  email: any;
  password: any;
  name: string='';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(private menu: MenuController, private router:Router, private toastController: ToastController, private authService: AuthService,private formBuilder: FormBuilder, private navCtrl: NavController, private alertController: AlertController) { }

  ngOnInit() {


  }


  login() {

        //Para poder insetar declaro un form-data
        const formData = new FormData();
        formData.append('email_user', this.email);
        formData.append('password_user', this.password);
        this.authService.login(formData).subscribe((response) => {
            console.log(response);

            if (response.comment=="Bienvenido") {
              this.menu.enable(true);

              this.toastMessage("Correcto",'success');
              console.log(response.results[0]);

              this.authService.guardarToken(response.results[0].token_usuario);
              this.authService.guardarId(response.results[0].id_usuario);
              console.log("vamos al home");
              console.log(response.results[0].id_rol);
              if(response.results[0].id_rol==1){
      

                //this.navCtrl.navigateRoot('/home');
                this.router.navigate(['/home']);

                this.navCtrl.pop();
              }else if (response.results[0].id_rol==2) {
                this.router.navigate(['/personal']);
                console.log("vamos al personal");

                this.navCtrl.pop();
              }else if (response.results[0].id_rol==3) {
                console.log("vamos al cliente");

                this.router.navigate(['/cliente']);
                this.navCtrl.pop();
              }
            }else{
              this.showAlert("Error", response.comment);
              this.router.navigate(['/login']);

            }

          },
          (error) => {
            console.error(error);
          }
        );
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }

  async toastMessage(text:string,color:string){
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

  

  async showAlert(title:string,message:string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }
}