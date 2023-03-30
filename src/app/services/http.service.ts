import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { environment } from 'src/environments/environment';
import { response_register, Usuario } from '../usuario/user.model';
import { Mascota } from '../mascota/mascota-model';
import { Horario } from '../horario/horario.model';
import { Personal } from '../personal/personal.model';
import { Cita, MyCita } from '../cita/cita.model';
import { Tratamiento } from '../tratamiento/tratamiento.model';

@Injectable()
export class HttpService {

  constructor(
    private readonly http: HttpClient,
    private readonly local_storage_service: LocalStorageService
  ) { }

  public post<response>(subroute: string, data: FormData): Observable<response> {
    return this.http.post<response>(`${environment.api}${subroute}`, data, {
      headers: this.headers()
    });
  }

  public get<response>(subroute: string): Observable<response[]> {

    return this.http.get<response[]>(`${environment.api}${subroute}`, {
      headers: this.headers()
    });
  }

  public put<response>(id: number, subroute: string, data: FormData): Observable<response> {
  const heade = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.put<response>(`${environment.api}/${subroute}?id=${id}&nameId=id_${subroute}`, data, {
      headers: heade
    });
  }

  public delete<response>(subroute: string, id: number): Observable<response> {
    return this.http.delete<response>(`${environment.api}/${subroute}?id=${id}&nameId=id_${subroute}`, {
      headers: this.headers()
    })
  };

  //Mascota



  getMascota(id: string): Observable<Mascota> {
    const url = `${environment.api}/mascota?select=*&linkTo=id_mascota&equalTo=${id}`;
    return this.http.get<Mascota>(url);
  }

  misMascotas(id_cliente: string): Observable<Mascota[]> {
    const url = `${environment.api}/mascota?select=*&linkTo=id_cliente&equalTo=${id_cliente}`;
    return this.http.get<Mascota[]>(url);
  }
  //Personal 
  getPersonal(id: string): Observable<Personal[]> {
    const url = `${environment.api}/personal?select=*&linkTo=id_usuario&equalTo=${id}`;
    return this.http.get<Personal[]>(url);
  }

  //Horarios


  crearHorario(data: any): Observable<any> {
    const url = `${environment.api}/horario`;
    return this.http.post(url, data);

  }
  actualizarHorario(id: string, data: any): Observable<any> {
    const url = `${environment.api}/horario`;
    return this.http.post(url, data);

  }
  getHorarios(): Observable<Horario[]> {
    const url = `${environment.api}/horario`;
    return this.http.get<Horario[]>(url);
  }

  getHorario(id: string): Observable<Horario[]> {
    const url = `${environment.api}/horario?select=*&linkTo=id_horario&equalTo=${id}`;
    return this.http.get<Horario[]>(url);
  }


  //Rol


  listarRol(): Observable<any> {
    const url = `${environment.api}/mascota`;
    return this.http.get(url);
  }
  buscarRol(data: any): Observable<any> {
    const url = `${environment.api}/rol`;
    console.log(data);
    return this.http.post(url, data);
  }

  //Tratamiento

  getTratamientos(): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(`${environment.api}/horario`);
  }

  getTratamiento(id: string): Observable<Tratamiento> {
    const url = `${environment.api}?select=*&linkTo=id_tratamientomiento&equalTo=${id}`;
    return this.http.get<Tratamiento>(url);
  }

  misTratamiento(id_cliente: string): Observable<Tratamiento[]> {
    const url = `${environment.api}/mascota?select=*&linkTo=id_cliente&equalTo=${id_cliente}`;
    return this.http.get<Tratamiento[]>(url);
  }

  private headers(): { [header: string]: string } | undefined {
    const token: response_register | null = this.local_storage_service.get_user();

    return token ? {
      "authorization": `Bearer ${token.jwt}`
    } : undefined
  }

  //Citas
  misCitas(id: string): Observable<MyCita[]> {
    const url = `${environment.api}/relations?rel=cita,mascota,horario&type=cita,mascota,horario&select=cita.*,nombre_mascota,hora_inicio,hora_fin&linkTo=id_mascota&equalTo=${id}`;
    return this.http.get<MyCita[]>(url);
  }
  getCitas(): Observable<MyCita[]> {
    const url = `${environment.api}/relations?select=*&rel=cita,horario,mascota&type=cita,horario,mascota&orderBy=fecha_cita&orderMode=asc`;
    return this.http.get<MyCita[]>(url);
  }
  //Citas por cliente usuario logeado
  getCita(id: string): Observable<Cita> {
    const url = `${environment.api}/cita?select=*&linkTo=id_cita&equalTo=${id}`;
    return this.http.get<Cita>(url);
  }

  registrarCita(form: any): Observable<any> {
    const url = `${environment.api}/cita`;
    return this.http.post(url, form);
  }

  //Cliente
  editarCliente(data: any): Observable<any> {
    const url = `${environment.api}/cliente`;
    console.log(data);
    return this.http.put(url, data);
  }

  buscarCliente(data: any): Observable<any> {
    const url = `${environment.api}/cliente`;
    console.log(data);
    return this.http.post(url, data);
  }
  getUsuario(id: number): Observable<Usuario> {
    const url = `${environment.api}/usuario?select=email_usuario,password_usuario,id_rol&linkTo=id_usuario&equalTo=${id}`;
    return this.http.get<Usuario>(url);
  }
  // Diagnostico 

  crearDiagnostico(data: FormData): Observable<any> {
    const url = `${environment.api}/diagnostico`;
    console.log(data);
    return this.http.post(url, data);
  }

  editarDiagnostico(data: any): Observable<any> {
    const url = `${environment.api}/diagnostico`;
    console.log(data);
    return this.http.put(url, data);
  }
  listarDiagnostico(): Observable<any> {
    const url = `${environment.api}/mascota`;
    return this.http.get(url);
  }
  buscarDiagnostico(data: any): Observable<any> {
    const url = `${environment.api}/diagnostico`;
    console.log(data);
    return this.http.post(url, data);
  }
  //Cliente

  crearUsuario(user: FormData): Observable<any> {
    const url = `${environment.api}/usuario?register=true&suffix=usuario`;
    return this.http.post(url, user);
  }
  crearPersonal(data: any): Observable<any> {
    const url = `${environment.api}/personal`;
    return this.http.post(url, data);
  }


  editarPersonal(data: any): Observable<any> {
    const url = `${environment.api}/personal`;
    return this.http.put(url, data);
  }
  listarPersonal(): Observable<any> {
    const url = `${environment.api}/mascota`;
    return this.http.get(url);
  }
  buscarPersonal(data: any): Observable<any> {
    const url = `${environment.api}/personal`;
    console.log(data);
    return this.http.post(url, data);
  }

}
