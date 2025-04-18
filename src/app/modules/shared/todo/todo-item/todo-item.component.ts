import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { TaskItemDto } from '../../../../core/models/task';
import { CommonModule } from '@angular/common';
import { CustomIconComponent } from '../../custom-icon/custom-icon.component';

@Component({
    selector: 'app-todo-item',
    imports: [MatCardModule, CommonModule, CustomIconComponent],
    templateUrl: './todo-item.component.html',
    styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {

  @Input() task !: TaskItemDto;

  getProjectImage(imagePath: string | null): string {
    if (!imagePath) {
      return 'assets/noImage.jpg';
    }

    return 'https://localhost:7263/Projects/' + imagePath;
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/noImage.jpg';
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Low':
        return '#86be75'; // green
      case 'Medium':
        return '#6e83e6'; // amber
      case 'High':
        return 'red'; // orange
      default:
        return '#9e9e9e'; // grey (unknown)
    }
  }
}
