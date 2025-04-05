import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import { DecodedToken } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private decodedToken !: DecodedToken;

  constructor() {
    this.initUser();
   }

   private initUser(){
    const token = this.getToken();
    if (token) {
      this.decodedToken = this.decodeToken(token);
    }
   }

  setToken(token: string){
    localStorage.setItem('token', token);
    this.decodedToken = this.decodeToken(token);
  }

  getToken(){
    return localStorage.getItem('token') || '';
  }

  private decodeToken(token: string){
    const jwtHelper = new JwtHelperService();
    return jwtHelper.decodeToken(token);
  }

  getUsername(): string | null {
    if (!this.decodedToken) {
      this.initUser();
    }
    return this.decodedToken?.Username || null;
  }

}
