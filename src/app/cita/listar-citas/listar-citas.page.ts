import { Component, OnInit } from '@angular/core';
import { Cita, MyCita } from '../../cita/cita.model';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-listar-citas',
  templateUrl: './listar-citas.page.html',
  styleUrls: ['./listar-citas.page.scss'],
})

export class ListarCitasPage implements OnInit {

  citas: MyCita[] = [];
  estado!:string;
  constructor(private http: HttpService, private router: Router) { }

  ngOnInit() {
    this.http.getCitas()
      .subscribe((data) => {
        this.citas = data;
        console.log(data);
/*
if(data.fecha_cita>fechaacutal())
{ 
  estado=


}
*/ 

      });
  }

  goToDiagnostico(id: number) {
    this.router.navigate(['diagnostico/crear-diagnostico', id]);
  }
  filtrar() {
//Acciones para filtrar
  }

}
