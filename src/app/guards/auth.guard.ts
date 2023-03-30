import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    const promesa = this.Promesa();

    if (promesa) {
      console.log("promesa:" + promesa);
      return Promise.resolve(true);
    } else {
      // Si el usuario no tiene acceso a la ruta, redirigirlo a otra página
      this.router.navigate(['/login']);
      return Promise.resolve(false);
    }
  }

  async Promesa() {
    const promesa = await this.authService.isAuthenticated();

    if (promesa) {
      return Promise.resolve(true);
    } else {

      // Si el usuario no tiene acceso a la ruta, redirigirlo a otra página
      this.router.navigate(['/login']);
      return Promise.resolve(false);
    }
  }
  

}
