export class Cliente {
    constructor(
        public id_cliente: number = 0,
        public nombre_cliente: string = '',
        public apellido_cliente: string = '',
        public cedula_cliente: string = '',
        public direccion_cliente: string = '',
        public fecha_registro: string = '',
        public telefono_cliente: string = '',
        public id_usuario: number=0,
      ) {}

  }
  