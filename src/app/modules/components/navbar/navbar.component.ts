import { AsyncPipe, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
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
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidenavEvent: EventEmitter<void> = new EventEmitter();
  storageService: StorageService = inject(StorageService);
  @Input() isMobile = false;
  private loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.visible;
  username: string = '';

  ngOnInit(): void {
    this.username = this.storageService.getUsername() || '';
  }

  toggleSidenav() {
    this.toggleSidenavEvent.emit();
  }
}
