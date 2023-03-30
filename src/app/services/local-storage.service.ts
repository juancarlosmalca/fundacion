import { Injectable } from '@angular/core';
import { response_register } from '../usuario/user.model';


export class LocalStorageService {

  constructor() { }

  public get_user():response_register | null{
    const data:string | null=localStorage.getItem("user");
    return data?JSON.parse(data):data;
  }

  public set_user(response:response_register):void{
    localStorage.setItem("user",JSON.stringify(response));
  }
}
