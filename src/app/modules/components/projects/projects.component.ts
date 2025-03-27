import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { CreateProjectFormComponent } from './create-project-form/create-project-form.component';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project/project';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    NgFor,
    MatButtonModule,
    MatCardModule,
    MatButtonModule,
    MatBottomSheetModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  private _bottomSheet = inject(MatBottomSheet);
  private projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  projects: Project[] = [];

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projectsResult) => {
      this.projects = projectsResult;
      console.log(this.projects);
    });
  }

  enterProject(project: Project) {
    const projectId = project ? project.id : null;

    console.log(projectId);
    
    if (projectId) {
      this.router.navigate(['/project', projectId]);
    } else {
      console.warn('No project selected');
    }
  }

  newProject() {
    this._bottomSheet.open(CreateProjectFormComponent);
    const bottomSheetRef = this._bottomSheet.open(CreateProjectFormComponent);
  }
}
