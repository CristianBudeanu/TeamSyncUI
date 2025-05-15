import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProjectService } from '../../../core/services/project.service';
import { Member, Project } from '../../../core/models/project/project';
import { CommonModule } from '@angular/common';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { TasksTableComponent } from "./tasks-table/tasks-table.component";
import { TaskItemDto } from '../../../core/models/task';
import { UserContributionChartComponent } from "./user-contribution-chart/user-contribution-chart.component";

export interface ChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  labels: string[];
  legend: ApexLegend;
  colors: string[];
  responsive: ApexResponsive[];
}

@Component({
  selector: 'app-analytics',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    NgApexchartsModule,
    TasksTableComponent,
    UserContributionChartComponent
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
  tasks : TaskItemDto[] = []

  @ViewChild('tasks-chart') chart!: ChartComponent;
  // public chartOptions!: ChartOptions;

  public chartOptions: ChartOptions | any = this.getTasksChart();

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projectsResult) => {
      this.projects = projectsResult;
      console.log(projectsResult);
    });
  }

  getProjectDetails(projectId: string) {
    this.projectService.getProjectDetails(projectId).subscribe((result) => {
      this.projectDetails = result;
  
      // Verifică dacă members există
      if (result?.members) {
        this.tasks = this.getAllTasksFromMembers(result);
        console.log('TASKS:', this.tasks); // ✅ Aici trebuie să NU fie undefined
      } else {
        this.tasks = [];
        console.warn('projectDetails.members is undefined');
      }
  
      const taskCounts = this.countTasksByStatus(result.members ?? []);
      this.updateTasksChart(taskCounts);
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

  private getTasksChart(): ChartOptions {
    return {
      series: [],
      chart: {
        height: 280,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              show: true,
            },
            value: {
              show: true,
              formatter: (val: number) => `${val}%`,
            },
            total: {
              show: true,
              label: 'Total',
              formatter: () => {
                const total =
                  this.projectDetails?.members?.flatMap((m) => m.assignedTasks)
                    ?.length || 0;
                return `${total} Tasks`;
              },
            },
          },
        },
      },
      labels: ['In Work', 'Completed', 'Overdue'],
      legend: {
        show: true,
        position: 'bottom',
      },
      colors: ['#1ab7ea', '#00e396', '#ff4560'],
      responsive: [],
    };
  }

  getAllTasksFromMembers(project: Project | undefined): TaskItemDto[] {
    if (!project || !project.members) return [];
  
    return project.members.flatMap(member => {
      return (member.assignedTasks ?? []).map(task => ({
        ...task,
        assignedToName: member.username // presupunem că membrul are un `name` sau `fullName`
      }));
    });
  }

  private countTasksByStatus(members: Member[]): {
    inWork: number;
    completed: number;
    overdue: number;
  } {
    const tasks = members.flatMap((member) => member.assignedTasks);
    const now = new Date();

    const inWork = tasks.filter(
      (t) => t.status === 'Pending' || t.status === 'InWork'
    ).length;

    const completed = tasks.filter(
      (t) => t.status === 'Done' || t.status === 'Closed'
    ).length;

    const overdue = tasks.filter(
      (t) =>
        (t.status === 'Pending' || t.status === 'InWork') &&
        t.endDate &&
        new Date(t.endDate) < now
    ).length;

    return { inWork, completed, overdue };
  }

  private updateTasksChart(taskCounts: {
    inWork: number;
    completed: number;
    overdue: number;
  }) {
    const totalTasks =
      taskCounts.inWork + taskCounts.completed + taskCounts.overdue || 1;

    this.chartOptions = {
      ...this.getTasksChart(),
      series: [
        Math.round((taskCounts.inWork / totalTasks) * 100),
        Math.round((taskCounts.completed / totalTasks) * 100),
        Math.round((taskCounts.overdue / totalTasks) * 100),
      ],
    };
  }
}
