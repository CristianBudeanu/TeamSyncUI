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
  private projectMessages: { [projectId: string]: ChatMessage[] } = {};
  private currentProjectId: string = '';

  constructor(private http: HttpClient) {}

  registerUser(username: string) {
    const body = { username };
    console.log(username);

    return this.http.post(`${this.chatController}/RegisterUser`, body, {
      responseType: 'text',
    });
  }

  get messages(): ChatMessage[] {
    return this.projectMessages[this.currentProjectId] || [];
  }

  setMessagesForProject(projectId: string, messages: ChatMessage[]): void {
    this.projectMessages[projectId] = messages;
  }

  createChatConnection(projectId: string) {
    this.currentProjectId = projectId;

    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/chat`)
      .withAutomaticReconnect()
      .build();

    this.chatConnection
      .start()
      .then(() => {
        this.chatConnection!.invoke(
          'JoinProjectChat',
          this.storageService.getUsername(),
          projectId
        );
      })
      .catch((err) => console.error(err));

    this.chatConnection.on('UserConnectedToProject', () =>
      console.log('Joined project chat')
    );
    this.chatConnection.on(
      'OnlineUsers',
      (users: string[]) => (this.onlineUsers = users)
    );

    this.chatConnection.on('NewMessage', (msg: ChatMessage) => {
      if (!this.projectMessages[this.currentProjectId]) {
        this.projectMessages[this.currentProjectId] = [];
      }
      this.projectMessages[this.currentProjectId].push(msg);
    });
  }

  private async joinProjectChat() {
    return this.chatConnection
      ?.invoke(
        'JoinProjectChat',
        this.storageService.getUsername(),
        this.currentProjectId
      )
      .catch((error) => console.log(error));
  }

  stopChatConnection() {
    this.chatConnection?.stop();
  }

  sendMessage(content: string) {
    const message: ChatMessage = {
      fromUsername: this.storageService.getUsername() || '',
      message: content,
      // sentAt: 
    };

    return this.chatConnection
      ?.invoke('SendMessageToProject', this.currentProjectId, message)
      .catch((err) => console.error(err));
  }

  loadMessageHistory(projectId: string) {
    return this.http.get<ChatMessage[]>(
      `${this.chatController}/GetProjectMessages?projectId=${projectId}`
    );
  }
}
