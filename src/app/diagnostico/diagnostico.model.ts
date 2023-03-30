export class Diagnostico {
    constructor(
      public id_diagnostico : number = 0,
      public descripcion_diagnostico: string = '',
      public id_cita: number = 0,
      public id_personal: number = 0,

    ) {}
  }