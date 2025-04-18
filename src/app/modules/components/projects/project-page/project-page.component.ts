import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  delay,
  EMPTY,
  filter,
  finalize,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { Project } from '../../../../core/models/project/project';
import { TaskService } from '../../../../core/services/task.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProjectService } from '../../../../core/services/project.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { InvitationService } from '../../../../core/services/invitation.service';
import { CustomIconComponent } from '../../../shared/custom-icon/custom-icon.component';
import { ProjectSettingsComponent } from '../project-settings/project-settings.component';
import { TaskCreateDialogComponent } from '../../tasks/task-create-dialog/task-create-dialog.component';
import { ProjectGithubSettingsComponent } from '../project-github-settings/project-github-settings.component';
import { ProjectHomeTabComponent } from '../project-home-tab/project-home-tab.component';
import { ProjectTasksTabComponent } from "./project-tasks-tab/project-tasks-tab.component";
import { TaskItemDto } from '../../../../core/models/task';
import { ProjectTeamTabComponent } from "./project-team-tab/project-team-tab.component";

@Component({
    selector: 'app-project-page',
    imports: [
    NgIf,
    CommonModule,
    CustomIconComponent,
    MatListModule,
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatTabsModule,
    ProjectHomeTabComponent,
    ProjectTasksTabComponent,
    ProjectTeamTabComponent
],
    templateUrl: './project-page.component.html',
    styleUrl: './project-page.component.scss'
})
export class ProjectPageComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private clipboard = inject(Clipboard);
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly invitationService = inject(InvitationService);
  private _snackBar = inject(MatSnackBar);
  private readonly loadingService = inject(LoadingService);
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  isLoggedIn = false;
  project$: Observable<Project> = EMPTY;

  ngOnInit(): void {
    this.loadProject();
  }


  openDialog(): void {
    this.dialog.open(ProjectSettingsComponent, {
      width: '250px',
    });
  }

  refreshProject(): void {
    this.refreshTrigger$.next();
  }

  checkRole(project: Project, role: string): boolean {
    return project.userRoles.includes(role);
  }

  async openTaskCreationDialog(project: Project) {
    this.dialog.open(TaskCreateDialogComponent, {
      width: '250px',
      data: project,
    });
  }

  getDaysLeft(endDate: string): number {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
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

  generateInvitationLinkAndCopy(id: string) {
    this.invitationService.getInvitationLink(id).subscribe({
      next: (invitationToken: string) => {
        this.clipboard.copy(
          `http://localhost:4200/accept-invitation/${invitationToken}`
        );
        this._snackBar.open('Invitation link copied!', 'Close');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to fetch invitation link:', error);
      },
    });
  }

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

  getCurrentTask(tasks: TaskItemDto[]): TaskItemDto | null {
    return tasks?.find(t => t.status === 'InWork') || null;
  }

  loadProject(): void {
    this.project$ = this.refreshTrigger$.pipe(
      tap(() => this.loadingService.show()),
      switchMap(() =>
        this.route.paramMap.pipe(
          map((params) => params.get('id') ?? ''),
          filter((id) => !!id),
          switchMap((id: string) =>
            this.projectService.getProjectDetails(id).pipe(
              tap((details) => console.log(details)),
              delay(1000),
              finalize(() => this.loadingService.hide())
            )
          )
        )
      )
    );
  }
}
