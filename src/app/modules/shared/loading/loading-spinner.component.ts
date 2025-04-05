import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="flex-center" [style.width.px]="dimension" [style.height.px]="dimension">
      <mat-spinner></mat-spinner>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() dimension = 12;
}
