import { Component, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidenavBtnsComponent } from './sidenav-btns/sidenav-btns.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
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
  ],
})
export class LayoutComponent implements OnInit {
  isMobile = false;
  authService = inject(AuthService);
  sidenavMode: MatDrawerMode = 'side'
  private destroy$ = new Subject<void>();
  @ViewChild('sidenav') sidenav!: MatSidenav;
  breakpointObserver = inject(BreakpointObserver);
  isLoggedIn$: BehaviorSubject<boolean> = this.authService.isLoggedIn$;

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        this.isMobile = result.matches;
        this.isLoggedIn$
          .pipe(takeUntil(this.destroy$))
          .subscribe((isLoggedIn) => {
            if (this.isMobile || !isLoggedIn) {
              this.sidenav?.close();
              this.sidenavMode = 'over';
            } else {
              this.sidenavMode = 'side';
              this.sidenav?.open();
            }
          });
      });
  }

  navigateToTeams() {
    throw new Error('Method not implemented.');
  }
}
