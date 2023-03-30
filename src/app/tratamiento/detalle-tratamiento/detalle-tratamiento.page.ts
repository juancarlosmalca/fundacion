import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { Tratamiento } from '../../tratamiento/tratamiento.model';

@Component({
  selector: 'app-detalle-tratamiento',
  templateUrl: './detalle-tratamiento.page.html',
  styleUrls: ['./detalle-tratamiento.page.scss'],
})
export class DetalleTratamientoPage {
  tratamiento: Tratamiento = new Tratamiento();

  constructor(
    private route: ActivatedRoute,
    private http: HttpService
  ) {
        this.tratamiento = new Tratamiento();
}

  ionViewWillEnter() {
    const tratamientoId = this.route.snapshot.paramMap.get('id');
    if (tratamientoId) {
      this.http.getTratamiento(tratamientoId).subscribe((tratamientoArray) => {
        if (Array.isArray(tratamientoArray) && tratamientoArray.length > 0) {
          const tratamiento = tratamientoArray[0];
          this.tratamiento = new Tratamiento(
            tratamiento.id_tratamiento,
            tratamiento.nombre_tratamiento,
            tratamiento.id_diagnostico,
            tratamiento.descripcion_tratamiento,
          );
        }
    });
    }
  }
}
