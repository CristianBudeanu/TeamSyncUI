import dayjs from 'dayjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../../../core/models/project/project';
import { ProjectStatistics } from '../../../../core/models/project/projectStatistics';
import { StatisticCardComponent } from '../../../shared/statistic-card/statistic-card.component';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ColumnChartOptions } from '../../../../core/models/chart/ColumnChartOptions';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-project-home-tab',
  imports: [StatisticCardComponent, NgIf, NgApexchartsModule],
  templateUrl: './project-home-tab.component.html',
  styleUrl: './project-home-tab.component.scss',
})
export class ProjectHomeTabComponent implements OnChanges {
  @Input() project!: Project;
  statistics!: ProjectStatistics;
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ColumnChartOptions> | any;

  ngOnChanges(): void {
    if (!this.project) return;

    const now = new Date();
    const tasks = this.project.userTasks ?? [];

    const todo = tasks.filter(
      (t) => t.status === 'Pending' || t.status === 'InWork'
    ).length;

    const done = tasks.filter(
      (t) => t.status === 'Done' || t.status === 'Closed'
    ).length;

    const overdue = tasks.filter(
      (t) =>
        (t.status === 'Pending' || t.status === 'InWork') &&
        t.endDate &&
        new Date(t.endDate) < now
    ).length;

    const commits = this.project.githubRepository?.githubCommits?.length ?? 0;

    this.statistics = { todo, overdue, done, commits };
  }

  constructor() {
    const weeklyData = this.getWeeklyCommitsByDay(this.project);
    this.chartOptions = {
      series: [
        {
          name: 'Commits',
          type: 'line',
          data: weeklyData,
        },
      ],
      chart: {
        type: 'line',
        height: 350,
        width: '100%',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      title: {
        text: "Weekly Github Commits",
        align: "left"
      },
      dataLabels: {
        enabled: true, // shows numbers on top of points like in the image
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: ['#495057'],
        },
        background: {
          enabled: true,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#ccc',
          opacity: 0.9,
        },
      },
      stroke: {
        curve: 'straight',
        width: 3,
        colors: ['gray'],
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      markers: {
        size: 6,
        colors: ['#4e73df'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 8,
        },
      },
      tooltip: {
        y: {
          formatter: (val: number): string => `${val} commits`,
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
            },
            xaxis: {
              labels: {
                rotate: -45,
              },
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 250,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  getWeeklyCommitsByDay(project: Project): number[] {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (!project || !project.githubRepository || !project.githubRepository.githubCommits) {
      return weekdays.map(() => 0); // Return zeroes if data is not ready
    }

    const commits = project.githubRepository.githubCommits;

    console.log(commits);
    
  
    // Initialize weekday counter
    const countsByDay: { [key: string]: number } = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0
    };
  
    for (const commit of commits) {
      const date = dayjs(commit.date);
      const dayName = date.format('ddd'); // Returns Mon, Tue, etc.
      if (countsByDay[dayName] !== undefined) {
        countsByDay[dayName]++;
      }
    }
  
    // Convert to array in proper order
    return weekdays.map(day => countsByDay[day]);
  }
}
