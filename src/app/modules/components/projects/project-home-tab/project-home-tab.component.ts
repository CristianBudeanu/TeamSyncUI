import { Component, Input, OnInit } from '@angular/core';
import { StatisticCardComponent } from '../../../shared/statistic-card/statistic-card.component';
import { ProjectStatistics } from '../../../../core/models/project/projectStatistics';
import { Project } from '../../../../core/models/project/project';
import { map, Observable, tap } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
    selector: 'app-project-home-tab',
    imports: [StatisticCardComponent, NgIf, AsyncPipe],
    templateUrl: './project-home-tab.component.html',
    styleUrl: './project-home-tab.component.scss'
})
export class ProjectHomeTabComponent implements OnInit {
  @Input() project$!: Observable<Project>;
  statistics$!: Observable<ProjectStatistics>;

  ngOnInit(): void {
    this.statistics$ = this.project$.pipe(
      map((project) => {
        const now = new Date();

        const tasks = project.userTasks ?? [];

        const todo = tasks.filter(
          (t) => t.status === 'Pending' || t.status === 'InWork'
        ).length;

        const done = tasks.filter(
          (t) => t.status === 'Done' || t.status === 'Closed'
        ).length;

        const overdue = tasks.filter(
          (t) =>
            (t.status === 'Pending' || t.status === 'InWork') &&
            t.status &&
            new Date(t.status) < now
        ).length;

        const commits = project.githubRepository?.githubCommits?.length ?? 0;

        return { todo, overdue, done, commits };
      })
    );

    this.statistics$.subscribe((r) => console.log(r));
  }
}
