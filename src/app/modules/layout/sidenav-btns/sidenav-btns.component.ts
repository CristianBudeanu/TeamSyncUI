import { Component, inject } from '@angular/core';
import { CustomIconComponent } from '../../shared/custom-icon/custom-icon.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidenav-btns',
  standalone: true,
  imports: [
    CustomIconComponent,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidenav-btns.component.html',
  styleUrl: './sidenav-btns.component.scss',
})
export class SidenavBtnsComponent {
  authService = inject(AuthService);

  signOut() {
    this.authService.signOut();
  }
}
