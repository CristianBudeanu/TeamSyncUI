import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginModel } from '../models/authModels/login.model';
import { RegisterModel } from '../models/authModels/register.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authController = environment.apiUrl + '/Auth';
  isLoggedIn$ : BehaviorSubject<boolean> = new BehaviorSubject(this.isLoggedIn());

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(userData: LoginModel) {
    return this.http.post<string>(`${this.authController}/Login`, userData, {
      responseType: 'text' as 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }

  register(userData: RegisterModel) {
    return this.http.post<string>(`${this.authController}/Register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  signOut(){
    this.isLoggedIn$.next(false);
    this.router.navigate(['auth']);
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    }
    else{
      console.error(`Backend returned code ${error.status}, body was : `, error.error);
    }
    return throwError(() => new Error('Please try again later.'))
  }

}
