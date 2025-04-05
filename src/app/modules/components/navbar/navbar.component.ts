import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
    selector: 'app-navbar',
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule,
        NgIf, AsyncPipe
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidenavEvent: EventEmitter<void> = new EventEmitter();
  @Input() isMobile = false;
    private loadingService = inject(LoadingService);
    isLoading$ = this.loadingService.visible;

  ngOnInit(): void {

  }

  toggleSidenav(){
    this.toggleSidenavEvent.emit()
  }
}
