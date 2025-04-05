import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
    selector: 'app-todo-item',
    imports: [MatCardModule],
    templateUrl: './todo-item.component.html',
    styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {

  @Input() title = '';
  @Input() subtitle = '';
  @Input() image = '';
  @Input() description = ''; 
}
