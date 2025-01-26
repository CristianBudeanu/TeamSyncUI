import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private tokenData : any;

  constructor() {
    this.initUser();
   }

   private initUser(){
    const token = this.getToken();
    if (token) {
      this.tokenData = this.decodeToken(token);
    }
   }

  setToken(token: string){
    localStorage.setItem('token', token);
    this.tokenData = this.decodeToken(token);
  }

  getToken(){
    return localStorage.getItem('token') || '';
  }

  private decodeToken(token: string){
    const jwtHelper = new JwtHelperService();
    return jwtHelper.decodeToken(token);
  }

}
