import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Cliente } from '../cliente/cliente-model';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'https://cars.fundacionkawsayta.org/api';

  constructor(private http: HttpClient, private storage: Storage, private router: Router, private navControl: NavController) { }

  private baseUrl = 'https://cars.fundacionkawsayta.org/api';
  login(formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/users?login=true&suffix=user`;
    return this.http.post(url, formData);
  }
  getClienteUser(id: string): Observable<Cliente> {
    const url = `${this.apiUrl}/cliente?select=*&linkTo=id_usuario&equalTo=${id}`;
    return this.http.get<Cliente>(url);
  }
  getUsuario(id: string): Observable<Cliente> {
    const url = `${this.apiUrl}/usuario?select=*&linkTo=id_usuario&equalTo=${id}`;
    return this.http.get<Cliente>(url);
  }

  async guardarToken(token: string) {
    await this.storage['set']('token', token);
  }
  
  async guardarId(id: string) {
    console.log("Guardando" +id);
    await this.storage['set']('id', id);
  }
  async guardarRol(rol: string) {
    await this.storage['set']('rol', rol);
  }
  async obtenerToken(): Promise<string> {
    return await this.storage['get']('token');
  }
  async obtenerRol(): Promise<string> {
    return await this.storage['get']('rol');
  }
  async obtenerId(): Promise<string> {
    try {
      const id = await this.storage.get('id');
      if (typeof id === 'string' && id.length > 0) {
        return id;
      } else {
        throw new Error('El ID no está disponible o es inválido.');
      }
    } catch (error) {
      console.error('Error al obtener el ID:', error);
      throw error;
    }
  }  
  
  async obtenerRolUsuario(): Promise<string> {
    const rol = await this.storage.get('rol');
    return rol;  
  }

  logout() {
    localStorage.removeItem('id');
    this.eliminarToken();
    this.eliminarRol();
    this.navControl.navigateRoot('/login');
  }
  


  async eliminarToken() {
    await this.storage['remove']('token');
  }
  async eliminarRol() {
    await this.storage['remove']('rol');
  }
  /*
  async isAuthenticated(): Promise<boolean> {
    const token = await this.obtenerToken();
    return token !== null;
  }
*/
 async isAuthenticated() {
    const token = await this.storage['get']('token');
    
    if (token) {
      //const payload = JSON.parse(atob(token.split('.')[1]));
     // return payload.exp > (Date.now() / 1000);
     return true;
    } else {
      return false;
    }
  }

  getToken() {
    const token = localStorage.getItem('token');
    return token;
  }

  getCurrentUser(): Observable<any> {
    // Obtener el token de autenticación del storage de Ionic
    const rol = this.obtenerRol();
    // Hacer la solicitud al servidor backend
    return this.http.get(`${this.apiUrl}/rol?linkTo=id_rol&equalTo=${rol}&select=*`);
  }
  
  registerUser(formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/usuario?register=true&suffix=usuario`;
    return this.http.post(url, formData);
  }



}
