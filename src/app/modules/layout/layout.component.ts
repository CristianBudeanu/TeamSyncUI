import { Component, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDrawerMode,
  MatSidenav,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { BehaviorSubject, combineLatest, map, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidenavBtnsComponent } from './sidenav-btns/sidenav-btns.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LoadingService } from '../../core/services/loading.service';
import { NotificationService } from '../../core/services/notification.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    imports: [
        MatTooltipModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        AsyncPipe,
        CommonModule,
        NavbarComponent,
        RouterModule,
        SidenavBtnsComponent,
    ]
})
export class LayoutComponent implements OnInit {
  private loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.visible;
  isMobile = false;
  authService = inject(AuthService);
  sidenavMode: MatDrawerMode = 'side';
  private destroy$ = new Subject<void>();
  @ViewChild('sidenav') sidenav!: MatSidenav;
  breakpointObserver = inject(BreakpointObserver);
  isLoggedIn$: BehaviorSubject<boolean> = this.authService.isLoggedIn$;
  private notificationService = inject(NotificationService);
  private storageService = inject(StorageService);

  ngOnInit(): void {
    const breakpoint$ = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .pipe(map((result) => result.matches));

    combineLatest([breakpoint$, this.isLoggedIn$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isMobile, isLoggedIn]) => {
        this.isMobile = isMobile;

        if (isMobile || !isLoggedIn) {
          console.log('mobile');

          this.sidenavMode = 'over';
          this.sidenav.close();
        } else {
          this.sidenavMode = 'side';
          this.sidenav.open();
        }
      });
  }

  toggleSidenav(){
    if(this.isMobile){
      this.sidenav.close();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToTeams() {
    throw new Error('Method not implemented.');
  }
}
