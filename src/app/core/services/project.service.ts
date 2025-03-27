import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../models/project/project';
import { GithubRepositoryUpdate } from '../models/github';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private projectController = environment.apiUrl + '/project';

  constructor() {}

  newProject(newProjectData: FormData) {
    return this.http
      .post<string>(`${this.projectController}/CreateProject`, newProjectData)
      .pipe(catchError(this.handleError));
  }

  getProjects() {
    return this.http.get<Project[]>(
      `${this.projectController}/GetUserProjects`
    );
  }

  getProjectDetails(projectId: string) {
    return this.http.get<Project>(
      `${this.projectController}/GetProjectDetails?projectId=${projectId}`
    );
  }

  updateProjectGithubRepository(projectId: string, dto: GithubRepositoryUpdate){
    return this.http.put(`${this.projectController}/UpdateProjectGithubRepository/${projectId}/github`, dto);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was : `,
        error.error
      );
    }
    return throwError(() => new Error('Please try again later.'));
  }
}
