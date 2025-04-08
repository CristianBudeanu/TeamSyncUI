import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { StorageService } from './storage.service';
import { ChatMessage } from '../models/chat/chat.messages';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly chatController = environment.apiUrl + '/Chat';
  private readonly storageService = inject(StorageService);
  private chatConnection?: HubConnection;
  onlineUsers: string[] = [];
  messages: ChatMessage[] = [];

  constructor(private http: HttpClient) {}

  registerUser(username: string) {
    const body = { username };
    console.log(username);


    return this.http.post(`${this.chatController}/RegisterUser`, body, {
      responseType: 'text',
    });
  }

  createChatConnection() {
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/chat`)
      .withAutomaticReconnect()
      .build();

    this.chatConnection.start().catch((error) => {
      console.log(error);
    });

    this.chatConnection.on('UserConnected', () => {
      this.addUserConnectionId();
    });

    this.chatConnection.on('OnlineUsers', (onlineUsers) => {
      this.onlineUsers = [...onlineUsers];
    });

    this.chatConnection.on('NewMessage', (newMessage : ChatMessage) => {
        this.messages = [...this.messages, newMessage];
    })
  }

  stopChatConnection() {
    this.chatConnection?.stop().catch((error) => console.log(error));
  }

  async addUserConnectionId() {
    return this.chatConnection
      ?.invoke('AddUserConnectionId', this.storageService.getUsername())
      .catch((error) => console.log(error));
  }

  async sendMessage(messageToSend: string) {
    const message : ChatMessage = {
      from: this.storageService.getUsername() || '',
      message: messageToSend
    }

    return this.chatConnection
      ?.invoke('ReceiveMessage', message)
      .catch((error) => console.log(error));
  }
}
