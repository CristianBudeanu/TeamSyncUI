import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatBottomSheet,
  MatBottomSheetModule
} from '@angular/material/bottom-sheet';
import { CreateProjectFormComponent } from './create-project-form/create-project-form.component';

export interface Project {
  photo: string;
  teamName: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgFor, MatButtonModule, MatCardModule, MatButtonModule, MatBottomSheetModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  private _bottomSheet = inject(MatBottomSheet);

  teams: Project[] = [
    {
      photo: 'assets/noImage.jpg',
      teamName: 'Team Alpha'
    },
    {
      photo: 'assets/noImage.jpg',
      teamName: 'Team Beta'
    },
    {
      photo: 'assets/noImage.jpg',
      teamName: 'Team Gamma'
    },
    {
      photo: 'assets/noImage.jpg',
      teamName: 'Team Alpha'
    },
    {
      photo: 'assets/noImage.jpg',
      teamName: 'Team Beta'
    },
    {
      photo: 'assets/noImage.jpg',
      teamName: 'Team Gamma'
    }
  ];


  enterTeam(teamName: string){
    console.log("Enter Team: " + teamName);
  }

  newProject() {
    this._bottomSheet.open(CreateProjectFormComponent);
    const bottomSheetRef = this._bottomSheet.open(CreateProjectFormComponent);
  }
  
}
