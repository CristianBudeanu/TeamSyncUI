import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
    selector: 'app-loading-overlay',
    imports: [MatProgressSpinnerModule, NgIf, AsyncPipe],
    template: `
    <div *ngIf="isLoading$ | async" class="overlay flex-column flex-center gap-1">
      <mat-spinner diameter="64" strokeWidth="4"></mat-spinner>
      <h5>Loading...</h5>
    </div>
  `,
    styles: [
        `
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.7);
        z-index: 9999;
      }
    `,
    ]
})
export class LoadingOverlayComponent {
  private loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.visible;
}
