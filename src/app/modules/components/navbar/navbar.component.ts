import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoadingService } from '../../../core/services/loading.service';
import { MatMenuModule } from '@angular/material/menu';
import { StorageService } from '../../../core/services/storage.service';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { ChatNotification } from '../../../core/models/chat/chat.notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    NgIf,
    AsyncPipe,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    NgFor
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() toggleSidenavEvent: EventEmitter<void> = new EventEmitter();
  storageService: StorageService = inject(StorageService);
  @Input() isMobile = false;
  private loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.visible;
  username: string = '';
  private router: Router = inject(Router);

  notifications$ !: Observable<ChatNotification[]>;
  notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.username = this.storageService.getUsername() || '';

    this.notificationService.startConnection(this.username);
    this.notifications$ = this.notificationService.notifications$;

    this.notificationService.loadUnseenNotifications(this.username);

  }

  toggleSidenav() {
    this.toggleSidenavEvent.emit();
  }

  ngOnDestroy(): void {
    this.notificationService.stopConnection();
  }

  onNotificationClick(notification : ChatNotification) {
    this.notificationService.deleteViewedNotification(notification);

    
    this.router.navigate(['/project', notification.projectId])
  }
}
