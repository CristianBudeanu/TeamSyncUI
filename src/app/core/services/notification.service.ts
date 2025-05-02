import { inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ChatNotification } from '../models/chat/chat.notifications';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private hubConnection!: HubConnection;

  private notificationsSubject = new BehaviorSubject<ChatNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  public startConnection(username: string): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/notification`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ Notification hub connected');
        this.hubConnection.invoke('RegisterUser', username);
      })
      .catch((err) => console.error('❌ Notification hub error:', err));

    this.registerListeners();
  }

  private registerListeners(): void {
    this.hubConnection.on(
      'NewMessageNotification',
      (data: ChatNotification) => {
        console.log('🔔 New notification received:', data);

        // Optionally, parse/convert timestamp if needed
        const parsedData = {
          ...data,
        };

        const current = this.notificationsSubject.value;
        this.notificationsSubject.next([parsedData, ...current]);
      }
    );
  }

  public stopConnection(): void {
    this.hubConnection?.stop();
  }

  public clearNotifications(): void {
    this.notificationsSubject.next([]);
  }

  public loadUnseenNotifications(username: string) {
    return this.http
      .get<ChatNotification[]>(
        `${environment.apiUrl}/notification/GetUserNotifications?username=${username}`
      )
      .subscribe({
        next: (notifications) => {
          console.log('🔔 Unseen notifications loaded:', notifications);
          this.notificationsSubject.next(notifications);
        },
        error: (err) =>
          console.error('❌ Failed to load unseen notifications', err),
      });
  }

  public deleteViewedNotification(notif: ChatNotification): void {
    this.http
      .delete(
        `${environment.apiUrl}/notification/DeleteViewedNotification?notificationId=${notif.id}`
      )
      .subscribe({
        next: () => {
          const current = this.notificationsSubject.value;
          const updated = current.filter((n) => n.id !== notif.id);
          this.notificationsSubject.next(updated);
        },
        error: (err) => console.error('❌ Failed to delete notification', err),
      });
  }
}
