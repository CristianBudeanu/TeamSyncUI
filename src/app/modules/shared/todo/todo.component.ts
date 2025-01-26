import {Component} from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { todoItem } from '../../../core/models/todoItem';
import { TodoItemComponent } from './todo-item/todo-item.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, TodoItemComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {

  todo : todoItem[] = [
    { title: 'Get to work', subtitle: 'Priority: High', image: 'https://material.angular.io/assets/img/examples/shiba2.jpg', description: 'Complete the initial project tasks.' },
    { title: 'Pick up groceries', subtitle: 'Priority: Medium', image: 'https://material.angular.io/assets/img/examples/shiba2.jpg', description: 'Get vegetables, fruits, and essentials.' }
  ];

  doing : todoItem[] = [
    { title: 'Code review', subtitle: 'Priority: Medium', image: 'https://material.angular.io/assets/img/examples/shiba2.jpg', description: 'Review code for pending merge requests.' }
  ];

  done : todoItem[] = [
    { title: 'Team meeting', subtitle: 'Priority: Low', image: 'https://material.angular.io/assets/img/examples/shiba2.jpg', description: 'Weekly sync with team.' }
  ];

  drop(event: CdkDragDrop<todoItem[]>) {
    const itemMoved = event.previousContainer.data[event.previousIndex]; // Item that was moved
    const previousArray = event.previousContainer.id; // ID of the original container
    const newArray = event.container.id; // ID of the new container
    const previousIndex = event.previousIndex; // Original index of the item
    const currentIndex = event.currentIndex; // New index of the item

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    if(previousArray !== newArray){
    console.log(itemMoved.title + " | " + previousArray + " | " + newArray + " | " + previousIndex + " | " + currentIndex);
    }
  }

}
