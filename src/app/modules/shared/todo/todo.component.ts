import { Component, inject, OnInit } from '@angular/core';
import { CdkDropListGroup, CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TaskService } from '../../../core/services/task.service';
import { TaskItemDto } from '../../../core/models/task';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    MatDialogModule,
    TodoItemComponent
  ],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  todo: TaskItemDto[] = [];
  doing: TaskItemDto[] = [];
  done: TaskItemDto[] = [];

  taskMap = new Map<string, TaskItemDto>();

  ngOnInit() {
    this.taskService.getAllUserTasks().subscribe((tasks: TaskItemDto[]) => {
      this.taskMap.clear();
      tasks.forEach(t => this.taskMap.set(t.title, t));
      this.categorizeTasks(tasks);
      console.log(tasks);
    });
  }

  categorizeTasks(tasks: TaskItemDto[]) {
    this.todo = tasks.filter(t => t.status === 'Pending');
    this.doing = tasks.filter(t => t.status === 'InWork');
    this.done = tasks.filter(t => t.status === 'Done');
  }

  getStatusFromId(id: string): string {
    if (id.includes('todo')) return 'Pending';
    if (id.includes('doing')) return 'InWork';
    if (id.includes('done')) return 'Done';
    return '';
  }

  drop(event: CdkDragDrop<TaskItemDto[]>) {
    const item = event.previousContainer.data[event.previousIndex];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: `Move "${item.title}" to ${this.getStatusFromId(event.container.id)}?`
        }
      }).afterClosed().subscribe(result => {
        if (result === true) {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );

          const task = this.taskMap.get(item.title);
          if (task) {
            const newStatus = this.getStatusFromId(event.container.id);
            this.taskService.updateTaskItemStatus(task.id, newStatus).subscribe(() => {
              task.status = newStatus;
            });
          }
        }
      });
    }
  }
}
