import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private http = inject(HttpClient);
  private invitationController = environment.apiUrl + '/invitation';

  
    getInvitationLink(projectId: string){
      return this.http.get(`${this.invitationController}/CreateInvitationLink?projectId=${projectId}`, { responseType: 'text' });
    }

    acceptInvitationLink(invitationToken: string){
      return this.http.get(`${this.invitationController}/AcceptInvitationLink?invitationToken=${invitationToken}`);
    }
}
