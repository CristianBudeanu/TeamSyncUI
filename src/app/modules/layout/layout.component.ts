import { Component, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import { SidenavBtnsComponent } from "./sidenav-btns/sidenav-btns.component";

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
    SidenavBtnsComponent
]
})
export class LayoutComponent implements OnInit {
navigateToTeams() {
throw new Error('Method not implemented.');
}

  isDarkTheme = false;
  isLoggedIn$ !: BehaviorSubject<boolean>;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private authService: AuthService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$
  }

  ngOnInit(): void {
  }


  signOut() {
    this.authService.signOut();
    // this.sidenav.close();
  }
}
