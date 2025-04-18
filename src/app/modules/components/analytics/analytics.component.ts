import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project/project';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        subscriptSizing: 0,
      },
    },
  ],
})
export class AnalyticsComponent implements OnInit {
  private projectService = inject(ProjectService);
  projects!: Project[];
  projectDetails!: Project;
  projectId: string = '';

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projectsResult) => {
      this.projects = projectsResult;
    });
  }

  getProjectDetails(projectId: string) {
    this.projectService.getProjectDetails(projectId).subscribe((result) => {
      console.log(result);
      
      this.projectDetails = result;
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
}
