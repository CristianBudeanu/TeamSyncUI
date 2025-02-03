import { Component } from '@angular/core';
import { CustomIconComponent } from '../../shared/custom-icon/custom-icon.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidenav-btns',
  standalone: true,
  imports: [
    CustomIconComponent,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './sidenav-btns.component.html',
  styleUrl: './sidenav-btns.component.scss',
})
export class SidenavBtnsComponent {
  signOut() {
    throw new Error('Method not implemented.');
  }
}
