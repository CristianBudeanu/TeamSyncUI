import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltip } from '@angular/material/tooltip';
import { ProjectGithubSettingsComponent } from '../../project-github-settings/project-github-settings.component';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../../../core/services/storage.service';

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
    MatBadgeModule,
    MatTooltip,
  ],
  templateUrl: './project-tasks-tab.component.html',
  styleUrl: './project-tasks-tab.component.scss',
})
export class ProjectTasksTabComponent implements OnInit, OnChanges {
  @Input() project!: Project;

  readonly dialog = inject(MatDialog);
  private readonly taskService = inject(TaskService);
  private toastr = inject(ToastrService);
  private storageService = inject(StorageService);

  @Output() refreshProject = new EventEmitter<void>();

  highPriorityTasks: TaskItemDto[] = [];
  mediumPriorityTasks: TaskItemDto[] = [];
  lowPriorityTasks: TaskItemDto[] = [];
  tasks: TaskItemDto[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.project?.members) {
      const currentMember = this.project.members.find(
        (m) => m.username === this.storageService.getUsername()
      );

      this.tasks = currentMember?.assignedTasks ?? [];

      this.highPriorityTasks = this.tasks.filter(
        (t) => t.priority === TaskPriority.High
      );
      console.log(this.highPriorityTasks);
      this.mediumPriorityTasks = this.tasks.filter(
        (t) => t.priority === TaskPriority.Medium
      );
      this.lowPriorityTasks = this.tasks.filter(
        (t) => t.priority === TaskPriority.Low
      );
    }
  }

  ngOnInit(): void {
    console.log(this.project);
  }

  async openTaskCreationDialog(project: Project) {
    const dialogRef = this.dialog.open(TaskCreateDialogComponent, {
      width: '250px',
      data: project,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshProject.emit();
    });
  }

  updateTaskItemStatus(taskItemId: string, taskStatus: string) {
    this.taskService.updateTaskItemStatus(taskItemId, taskStatus).subscribe({
      next: () => {
        this.toastr.success('Task creat cu succes!', 'Success');
        this.refreshProject.emit();
      },
      error: (err) => {
        console.log(err.error);
        const errorMessage = err.error?.message || 'Registration failed.';

        
        this.toastr.error(errorMessage, 'Error');
      }
    });
  }

  getTaskCountByStatus(status: string): number {
    if (!this.tasks) return 0;
    return this.tasks.filter((task) => task.status === status).length;
  }
  checkRole(project: Project, role: string): boolean {
    return project.userRoles.includes(role);
  }

  openGithubSettings(project: Project) {
    this.dialog.open(ProjectGithubSettingsComponent, {
      width: '250px',
      data: {
        projectId: project.id,
        githubRepository: project.githubRepository,
      },
    });
  }
}
