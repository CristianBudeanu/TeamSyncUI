import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  visible = new BehaviorSubject<boolean>(false);

  show(): void {
    this.visible.next(true);
  }

  hide(): void {
    this.visible.next(false);
  }
}
