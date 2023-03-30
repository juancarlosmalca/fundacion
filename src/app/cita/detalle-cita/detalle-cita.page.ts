import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cita } from '../../cita/cita.model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-detalle-cita',
  templateUrl: './detalle-cita.page.html',
  styleUrls: ['./detalle-cita.page.scss'],
})
export class DetalleCitaPage {
  cita: Cita = new Cita();

  constructor(
    private route: ActivatedRoute,
    private http: HttpService
  ) {
        this.cita = new Cita();
}

  ionViewWillEnter() {
    const citaId = this.route.snapshot.paramMap.get('id');
    if (citaId) {
      this.http.getCita(citaId).subscribe((citaArray) => {
        if (Array.isArray(citaArray) && citaArray.length > 0) {
          const cita = citaArray[0];
          this.cita = new Cita(
            cita.id_cita,
            cita.nombre_cita,
            cita.id_diagnostico,
            cita.descripcion_cita,
          );
        }
    });
    }
  }
}
