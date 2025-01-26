import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly chatController = environment.apiUrl + "/Chat";

  constructor(private http: HttpClient) { }

  registerUser(username: string) {
    return this.http.post(`${this.chatController}/RegisterUser`, username, {responseType: 'text'});
  }
}
 