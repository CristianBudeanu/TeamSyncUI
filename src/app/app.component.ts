import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout.component';
import { LoadingOverlayComponent } from "./modules/shared/loading/loading-overlay.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LayoutComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TeamSyncUI';
}
