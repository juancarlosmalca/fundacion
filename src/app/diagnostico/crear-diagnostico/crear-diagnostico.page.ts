import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Cita, MyCita } from 'src/app/cita/cita.model';
import { AuthService } from 'src/app/services/auth.service';
import { Mascota } from 'src/app/mascota/mascota-model';
import { HttpService } from 'src/app/services/http.service';
import { Personal } from 'src/app/usuario/user.model';
import { RespuestaInsertar } from 'src/app/global/response';

@Component({
  selector: 'app-crear-diagnostico',
  templateUrl: './crear-diagnostico.page.html',
  styleUrls: ['./crear-diagnostico.page.scss']
})
export class CrearDiagnosticoPage implements OnInit {
  cita: MyCita = new MyCita();
  mascota: Mascota = new Mascota();
  personal: Personal = new Personal();

  diagnostico: string='';
  tratamiento: string='';
  duracion!: number;

  id_personal!: number;
  id_cita!: string;
  id_diagnostico!: string;

  constructor(private authService: 
    AuthService, private http: HttpService,
    private route: ActivatedRoute, 
    private toastController: ToastController,
    private navControl: NavController, private alertController : AlertController) { 
    this.cita = new MyCita();
    this.mascota = new Mascota();
    this.personal = new Personal();

  }
  ngOnInit() {

    this.authService.obtenerId().then((valor) => {
      console.log('El codigo del usuario es:', valor);
      this.burcarPersonal(valor);
    });
  }
  burcarPersonal(id_usuario:string) {
    this.http.getPersonal(id_usuario).subscribe((personalArray) => {
      if (Array.isArray(personalArray) && personalArray.length > 0) {
        const personal = personalArray[0];
        console.log(personal);

        this.id_personal=personal.id_personal;
        this.personal = new Personal(
          personal.id_personal,
          personal.nombre_personal,
          personal.apellido_personal,
          personal.telefono_personal,
          personal.id_usuario,
          personal.id_cargo        
        );
      }
  });
  }
 
  
  ionViewWillEnter() {
    const citaId = this.route.snapshot.paramMap.get('id');
    if (citaId) {
      this.mostrarCita(citaId);
    }
  }

mostrarCita(citaId:string){
    this.http.getCita(citaId).subscribe((citaArray) => {
      if (Array.isArray(citaArray) && citaArray.length > 0) {
        console.log(citaArray);

        const cita = citaArray[0];
        this.id_cita=cita.id_cita,
        this.mostrarMascota(cita.id_mascota);

        this.cita = new MyCita(
          cita.id_cita,
          cita.fecha_cita,
          cita.motivo_cita,
          cita.hora_inicio,
          cita.hora_fin,
          cita.nombre_mascota,
          cita.estado_cita,
          cita.apellido_cliente,
          cita.id_mascota
          );
      }
  });
  

}
mostrarMascota(mascotaId:string){
  this.http.getMascota(mascotaId).subscribe((mascotaArray) => {
    if (Array.isArray(mascotaArray) && mascotaArray.length > 0) {
      console.log(mascotaArray);
      const mascota = mascotaArray[0];
      this.mascota = new Mascota(
        mascota.id_mascota,
        mascota.nombre_mascota,
        mascota.especie_mascota,
        mascota.raza_mascota,
        mascota.sexo_mascota,
        mascota.peso_mascota,
        mascota.tamano_mascota,
        mascota.nacimiento_mascota,//Calcular edad
        mascota.observaciones_mascota,
        mascota.id_cliente
        );
    }
});

  
}

  onSubmit() {

    if (!this.diagnostico || !this.tratamiento || !this.duracion) {
      console.log('Uno o más campos están vacíos.');
      this.showMessageValidar();
    } else {
//Para poder insetar declaro un form-data
const formDiagnostico = new FormData();
formDiagnostico.append('descripcion_diagnostico', this.diagnostico);
formDiagnostico.append('id_cita', this.id_cita);
formDiagnostico.append('id_personal', String(this.id_personal));
console.log(this.diagnostico);
console.log(this.id_cita);
console.log(this.id_personal);

    //Para poder insetar declaro un form-data
const fromTratamiento = new FormData();
fromTratamiento.append('descripcion_tratamiento', this.tratamiento);
fromTratamiento.append('duracion_tratamiento', String(this.duracion));
fromTratamiento.append('id_diagnostico', this.id_diagnostico);

//Realizo la llamada a la funcion registrar que esta en el servicio Register
this.http.crearDiagnostico(formDiagnostico).subscribe(
  (response) => {
    console.log(response);
    if (response.results.comment==="Insertado") {
      const fromTratamiento = new FormData();
fromTratamiento.append('descripcion_tratamiento', this.tratamiento);
fromTratamiento.append('duracion_tratamiento', String(this.duracion));
fromTratamiento.append('id_diagnostico', response.results.lastId);
this.http.post<RespuestaInsertar>("/tratamiento", fromTratamiento)
.subscribe(
  (respuest) => {
    //Verifica que el comment de la respuesta sea exitoso
    if (respuest.results.comment === 'Insertado') {
      //Muestra un mensaje satisfactorio
      this.toastMessage("Registro Insertado", "success");
    } else {
      //Muestra un mensaje de error
      this.toastMessage("Error al registrar", "danger");
    }
  },
  (error) => {
    //Muestra un mensaje de error
    this.toastMessage("Error", "danger");
    console.log('Error:' + error);
  }
);

    }else{
      this.showMessageError();
    }
  },
  (error) => {
    console.error(error);
  }
);    
}
    
  }
  async showMessageValidar() {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: 'Llene todos los campos!',
      buttons: ['OK']
    });
  
    await alert.present();
  }
  async showMessageExito() {
    const alert = await this.alertController.create({
      header: 'Correcto',
      message: 'Usuario creado!',
      buttons: ['OK']
    });
  
    await alert.present();
  }
  async showMessageError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Error al crear usuario',
      buttons: ['OK']
    });
  
    await alert.present();
  }
    //Funcion para mostrar mensajes de aviso temporales: Recibe el texto del mensaje y el color
    public async toastMessage(text: string, color: string) {
      (await this.toastController.create({
        message: text,
        position: "top",
        duration: 3000,
        color: color
      })).present();
    }
  
}

