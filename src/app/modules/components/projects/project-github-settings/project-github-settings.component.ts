import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  GithubRepository,
  GithubRepositoryUpdate,
} from '../../../../core/models/github';
import { ProjectService } from '../../../../core/services/project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-project-github-settings',
    imports: [
        MatButtonModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogTitle,
        MatDialogContent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: './project-github-settings.component.html',
    styleUrl: './project-github-settings.component.scss'
})
export class ProjectGithubSettingsComponent implements OnInit {
  fb = inject(FormBuilder);
  projectService = inject(ProjectService);
  toastr = inject(ToastrService);
  data = inject(MAT_DIALOG_DATA) as {
    projectId: string;
    githubRepository: GithubRepositoryUpdate;
  };

  ngOnInit(): void {
    if (this.data != null) {
      this.githubForm.controls['username'].setValue(
        this.data.githubRepository.username || ''
      );
      this.githubForm.controls['repositoryName'].setValue(
        this.data.githubRepository.repositoryName || ''
      );
      this.githubForm.controls['token'].setValue(
        this.data.githubRepository.token || ''
      );
    }
  }

  githubForm = this.fb.group({
    username: ['', Validators.required],
    repositoryName: ['', Validators.required],
    token: ['', Validators.required],
  });

  updateProjectGithubRepository() {
    if (this.githubForm.invalid) {
      this.githubForm.markAllAsTouched();
      return;
    }

    const repositoryUpdateDto: GithubRepositoryUpdate = {
      username: this.githubForm.value.username!,
      repositoryName: this.githubForm.value.repositoryName!,
      token: this.githubForm.value.token!,
    };

    this.projectService
      .updateProjectGithubRepository(this.data.projectId, repositoryUpdateDto)
      .subscribe({
        next: (result) => {
          // console.log('GitHub settings updated:', result);
          this.toastr.success('GitHub settings updated successfully!');
        },
        error: (err) => {
          // console.error('Failed to update GitHub settings:', err);
          this.toastr.error(err.error.message || 'Failed to update GitHub settings!');
        },
      });
  }
}
