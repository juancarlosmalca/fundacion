import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mascota } from '../../mascota/mascota-model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-detalle-mascota',
  templateUrl: './detalle-mascota.page.html',
  styleUrls: ['./detalle-mascota.page.scss'],
})
export class DetalleMascotaPage {
  mascota: Mascota = new Mascota();

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
  ) {
      //  this.mascota = new Mascota();
}

  ionViewWillEnter() {
    const mascotaId = this.route.snapshot.paramMap.get('id');
    if (mascotaId) {
      this.http.getMascota(mascotaId).subscribe((mascotaArray) => {
        if (Array.isArray(mascotaArray) && mascotaArray.length > 0) {
          const mascota = mascotaArray[0];
          this.mascota = new Mascota(
            mascota.id_mascota,
            mascota.nombre_mascota,
            mascota.especie_mascota,
            mascota.raza_mascota,
            mascota.sexo_mascota,
            mascota.peso_mascota,
            mascota.tamano_mascota,
            mascota.nacimiento_mascota,
            mascota.observaciones_mascota,
            mascota.id_cliente
          );
        }
    });
    }
  }
}
