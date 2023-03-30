export class Cita {
    constructor(
      public id_cita : number = 0,
      public fecha_cita: string = '',
      public motivo_cita: string = '',
      public estado_cita: string = '',
      public id_horario: number = 0,
      public id_mascota: number = 0
    ) {}
  }
  export class MyCita {
    constructor(
      public id_cita : number = 0,
      public fecha_cita: string = '',
      public motivo_cita: string = '',
      public estado_cita: string="",
      public id_mascota : number = 0,
      public id_horario : number = 0,
      public hora_inicio: string = '',
      public hora_fin: string = '',
      public nombre_mascota: string="",
      ) {}
  }
  