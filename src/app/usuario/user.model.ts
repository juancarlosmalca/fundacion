export interface response_register{
    jwt: string;
    user: response_user;
}

export interface response_user{
    id:number;
    username:string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
}

export class Personal {
    constructor(
    public id_personal: number=0,
    public nombre_personal: string='',
    public apellido_personal: string='',
    public telefono_personal: string='',
    public id_usuario: number=0,
    public id_cargo:number=0
    
    ) {}

  }
  
export class Usuario {
    constructor(
        public email_usuario: string='',
        public password_usuario: string='',
        public id_rol: number=0,

    ) {}

  }
  