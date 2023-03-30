export class Tratamiento {
  constructor(
    public id_tratamiento: number = 0,
    public descripcion_tratamiento: string = '',
    public duracion_tratamiento: number = 0,
    public id_diagnostico: number = 0,

  ) {}
}
