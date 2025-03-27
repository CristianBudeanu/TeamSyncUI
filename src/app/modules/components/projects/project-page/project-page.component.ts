import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { Project } from '../../../../core/models/project/project';
import { ProjectService } from '../../../../core/services/project.service';
import { CommonModule, NgIf } from '@angular/common';
import { CustomIconComponent } from '../../../shared/custom-icon/custom-icon.component';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { ProjectSettingsComponent } from '../project-settings/project-settings.component';
import { ProjectGithubSettingsComponent } from '../project-github-settings/project-github-settings.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TaskCreateDialogComponent } from '../../tasks/task-create-dialog/task-create-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../../../core/services/task.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Clipboard} from '@angular/cdk/clipboard';
import { InvitationService } from '../../../../core/services/invitation.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    CustomIconComponent,
    MatListModule,
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
})
export class ProjectPageComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private clipboard = inject(Clipboard);
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);
  private readonly invitationService = inject(InvitationService);
  private _snackBar = inject(MatSnackBar);

  projectId!: string;
  isLoggedIn = false;
  project$!: Observable<Project>;

  ngOnInit() {
    this.project$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.projectId = String(params.get('id'));
        return this.projectService.getProjectDetails(this.projectId);
      })
    );

    this.project$.subscribe((result) => {
      console.log(result);

      console.log(result.githubRepository.githubCommits);
    });
  }

  openDialog(): void {
    this.dialog.open(ProjectSettingsComponent, {
      width: '250px',
    });
  }

  checkRole(project: Project, role: string): boolean {
    return project.userRoles.includes(role);
  }

  openGithubSettings() {
    this.project$.subscribe((project) => {
      this.dialog.open(ProjectGithubSettingsComponent, {
        width: '250px',
        data: {
          projectId: project.id,
          githubRepository: project.githubRepository,
        },
      });
    });
  }

  async openTaskCreationDialog() {
    const project = await firstValueFrom(this.project$);

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

  generateInvitationLinkAndCopy() {
    this.invitationService.getInvitationLink(this.projectId).subscribe({
      next: (invitationToken: string) => {
        this.clipboard.copy(`http://localhost:4200/accept-invitation/${invitationToken}`);
        this._snackBar.open("Invitation link copied!", "Close");
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to fetch invitation link:', error);
      },
    });
  }
}
