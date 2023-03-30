export interface RespuestaInsertar {
    status: number;
    total:number;
    results: Results;
  }
  export interface Results {
    lastId: number,
    comment: string
  }
