import { Component, OnInit } from '@angular/core';
import { Tratamiento } from '../tratamiento/tratamiento.model';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tratamiento',
  templateUrl: './tratamiento.page.html',
  styleUrls: ['./tratamiento.page.scss'],
})
export class TratamientoPage implements OnInit {

  tratamientos: Tratamiento[] = [];

  constructor(private http: HttpService, private router: Router, private authService: AuthService) { }

  ngOnInit() {

    this.authService.obtenerRol().then((valor) => {
      console.log('El rol es:', valor);
      if (valor=="2") {
          this.http.get<Tratamiento>("/tratamiento")
          .subscribe(
            (respuesta) => {
              // Manejar la respuesta exitosa aquí
              this.tratamientos = respuesta;
            },
            (error) => {
              console.log("Error al obtener");
            }
          );
      }else if (valor=="3") {
          
        this.authService.obtenerId().then((valor) => {
          console.log('El valor de id_cliente es:', valor);
          this.authService.getClienteUser(valor).subscribe((clienteArray) => {
            if (Array.isArray(clienteArray) && clienteArray.length > 0) {
              const cliente = clienteArray[0];
              console.log('El valor de id_cliente es:', cliente.id_cliente);
              this.listarTratamientos(cliente.id_cliente);
            }else{
              console.log('no hay');
      
            }
        });
          
        });
      }
    });
  }

  listarTratamientos(id_cliente:string) {
    this.http.misTratamiento(id_cliente).subscribe(
      (tratamientos) => {

        console.log('Tratamiento', tratamientos);

        this.tratamientos = tratamientos;
      },
      (error) => {
        console.log(error);
      }
    );
  }


  verDetalle(id: number) {
    this.router.navigate(['tratamiento/detalle', id]);
  }

}
