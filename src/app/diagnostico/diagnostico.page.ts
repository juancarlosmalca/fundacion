import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { RespuestaInsertar } from '../global/response';
import { HttpService } from '../services/http.service';
import { Diagnostico } from './diagnostico.model';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.page.html',
  styleUrls: ['./diagnostico.page.scss'],
})
export class DiagnosticoPage implements OnInit {

  diagnosticos: Diagnostico[] = [];
  selectedDiagnostico!: Diagnostico;

  constructor(private http: HttpService, 
    private readonly toastController: ToastController,
    private readonly modalControler: ModalController,
    private alertControl:AlertController,
    ) { }

  public ngOnInit() {
    this.http.get<Diagnostico>("/diagnostico").subscribe((data) => {
        this.diagnosticos = data;
      });
  }
  async agregarDiagnostico() {
    //this.modal("Nuevo",null);
  }
  async editarDiagnostico(data:Diagnostico) {
    //this.modal("Actualizar",data);
  }
  public async eliminarDiagnosticos(diagnostico:number):Promise<void>{
    const alert=await this.alertControl.create({
      header: "Aviso",
      message: "¿Esta seguro que desea eliminar?",
      buttons: [{text: "Cancelar", role: "cancelar"},{text: "Aceptar", role: "aceptar"}]
    });
}

public async eliminarDiagnostico(id:number):Promise<void>{
  const alert=await this.alertControl.create({
    header: "Aviso",
    message: "¿Esta seguro que desea eliminar?",
    buttons: [{text: "Cancelar", role: "cancelar"},{text: "Aceptar", role: "aceptar"}]
  });

  alert.present();
  const {role}=await alert.onDidDismiss();

  if(role==="aceptar"){
    this.delete(id);
  }
}

delete(id:number) {

  this.http.delete<RespuestaInsertar>("diagnostico", id).subscribe(
    (respuesta) => {
      // Manejar la respuesta exitosa aquí
      console.log("recibe");
      console.log(respuesta);

      if (respuesta.results.comment == 'Eliminado') {

        this.toastMessage("Registro Eliminado","success");
        this.ngOnInit();

      } else {
        this.toastMessage("No se puede eliminar porque existen registros que dependen de este diagnostico","danger");
      }
    },
    (error) => {
      this.toastMessage("Error","danger");
      console.log("Error: "+error);

    }
  );

}

async toastMessage(text:string,color:string){
  const overlay = await this.toastController.getTop();
  if (overlay) {
    overlay.dismiss();
  }
  const toast = await this.toastController.create({
    message: text,
    position: "top",
    duration: 3000,
    color: color
  });
  toast.present();
}
/*
private async modal(title:string, data:Diagnostico | null):Promise<void>{
  (await this.modalControler.create({
    component: FormDiagnosticoComponent,
    componentProps: {title, data}
  })).present();
}*/
}

