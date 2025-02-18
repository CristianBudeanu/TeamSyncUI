import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NewProjectRequest } from '../models/project/new-project-request';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  http = inject(HttpClient);
  private projectController = environment.apiUrl + '/project';

  constructor() { }

    newProject(newProjectData: FormData) {      
      return this.http.post<string>(`${this.projectController}/CreateProject`, newProjectData).pipe(
        catchError(this.handleError)
    );
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
