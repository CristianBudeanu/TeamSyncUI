import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  const storageService = inject(StorageService);
  const authService = inject(AuthService);

  const token = storageService.getToken();

  if(token && (!req.url.includes('Auth/Login') || !req.url.includes('Auth/Register'))){
    req = req.clone({
      headers: req.headers.set(
        'Authorization', `Bearer ${token}`
      )
    });
  }

  return next(req).pipe(
    catchError((err : any) => {
      if(err instanceof HttpErrorResponse) {
        if(err.status === 401 && (!req.url.includes('Auth/Login') || !req.url.includes('Auth/Register'))){
          authService.signOut();
        }
      }
      return throwError(() => err)
    })
  );
};
