import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private menu: MenuController,private authService: AuthService, private router:Router) {}

    async ngOnInit() {
    const userId = await this.authService.obtenerRol();
    
    //console.log("userId:"+userId);
    if (userId!="0") {
      if (userId=="1") {
        this.router.navigateByUrl('/home');
      } else if(userId=="2") {
        this.router.navigateByUrl('/personal');
      }else if(userId=="3") {
        this.router.navigateByUrl('/cliente');
      }
    } else {
//      this.router.navigateByUrl('/login');
console.log("no hace nada");
    }
  }
  logout() {
    this.authService.logout();
    this.menu.enable(false);

  }
}
