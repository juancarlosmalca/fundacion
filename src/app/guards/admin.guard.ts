import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const currentUser = this.authService.getCurrentUser(); 
    // obtener información del usuario actual desde el servicio AuthService

    if (Array.isArray(currentUser) && currentUser.length > 0) {
      const rol = currentUser[0];
      if (rol.nombre_rol === 'Administrador'&& this.router.url === '/dashboard-admin') { // verificar si el usuario tiene el rol 'admin'
        return true;
      } else if(rol.nombre_rol === 'cliente' && this.router.url === '/dashboard-cliente') {
        return true;
      }else {
      this.router.navigate(['/unauthorized']); // Redirigir a página de error de permisos
        return false;
    }
  }else{

      this.router.navigate(['/login']);
      return false;
    }


  }
}
