import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

export interface Team {
  photo: string;
  teamName: string;
}

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [NgFor, MatButtonModule, MatCardModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {

  teams: Team[] = [
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

}
