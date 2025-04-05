import { Component, OnInit, inject } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { todoItem } from '../../../core/models/todoItem';
import { ProjectService } from '../../../core/services/project.service'; // Adjust path
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { TaskItemDto } from '../../../core/models/task';

@Component({
    selector: 'app-todo',
    imports: [CdkDropListGroup, CdkDropList, CdkDrag, TodoItemComponent],
    templateUrl: './todo.component.html',
    styleUrl: './todo.component.scss'
})
export class TodoComponent implements OnInit {

  private taskService = inject(TaskService);

  todo: todoItem[] = [];
  doing: todoItem[] = [];
  done: todoItem[] = [];

  ngOnInit() {
    this.taskService.getAllUserTasks().subscribe((tasks: TaskItemDto[]) => {
      console.log(tasks);
      
      this.categorizeTasks(tasks);
    });
  }

  categorizeTasks(tasks: TaskItemDto[]) {
    this.todo = tasks.filter(t => t.status === 'Pending').map(this.mapToTodoItem);
    this.doing = tasks.filter(t => t.status === 'InWork').map(this.mapToTodoItem);
    this.done = tasks.filter(t => t.status === 'Done').map(this.mapToTodoItem);
    this.done = tasks.filter(t => t.status === '').map(this.mapToTodoItem);
  }

  mapToTodoItem(task: TaskItemDto): todoItem {
    return {
      title: task.title,
      subtitle: 'Project Task',
      image: '', // Optional
      description: task.description,
    };
  }

  drop(event: CdkDragDrop<todoItem[]>) {
    const itemMoved = event.previousContainer.data[event.previousIndex];
    const previousArray = event.previousContainer.id;
    const newArray = event.container.id;
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, previousIndex, currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        previousIndex,
        currentIndex
      );

      console.log(itemMoved.title + ' | ' + previousArray + ' → ' + newArray);

      // Optional: persist status change via backend
    }
  }
}
