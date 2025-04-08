import { Component, inject, Input, OnInit } from '@angular/core';
import { Project } from '../../../../../core/models/project/project';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { CustomIconComponent } from '../../../../shared/custom-icon/custom-icon.component';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { TaskCreateDialogComponent } from '../../../tasks/task-create-dialog/task-create-dialog.component';
import { TaskService } from '../../../../../core/services/task.service';
import { TaskItemDto } from '../../../../../core/models/task';
import { TaskPriority } from '../../../../../core/enums/task.priority';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-project-tasks-tab',
  imports: [
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatButtonToggleModule,
    CommonModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    CustomIconComponent,
    NgIf,
    DatePipe,
    MatBadgeModule
  ],
  templateUrl: './project-tasks-tab.component.html',
  styleUrl: './project-tasks-tab.component.scss',
})
export class ProjectTasksTabComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private readonly taskService = inject(TaskService);
  highPriorityTasks: TaskItemDto[] = [];
  mediumPriorityTasks: TaskItemDto[] = [];
  lowPriorityTasks: TaskItemDto[] = [];
  
  ngOnChanges(): void {
    if (this.project?.userTasks?.length) {
      this.highPriorityTasks = this.project.userTasks.filter(t => t.priority === TaskPriority.High);
      this.mediumPriorityTasks = this.project.userTasks.filter(t => t.priority === TaskPriority.Medium);
      this.lowPriorityTasks = this.project.userTasks.filter(t => t.priority === TaskPriority.Low);
    }
  }

  @Input() project!: Project;

  ngOnInit(): void {
    console.log(this.project);
  }

  async openTaskCreationDialog(project: Project) {
    this.dialog.open(TaskCreateDialogComponent, {
      width: '250px',
      data: project,
    });
  }

  updateTaskItemStatus(taskItemId: string, taskStatus: string) {
    this.taskService.updateTaskItemStatus(taskItemId, taskStatus).subscribe({
      next: () => {
        console.log(`Task ${taskItemId} status updated to ${status}`);
        // Optional: refresh the task list or update UI
      },
      error: (err) => {
        console.error('Error updating task status:', err);
      },
    });
  }

  getTaskCountByStatus(status: string): number {
    if (!this.project?.userTasks) return 0;
    return this.project.userTasks.filter(task => task.status === status).length;
  }
}
