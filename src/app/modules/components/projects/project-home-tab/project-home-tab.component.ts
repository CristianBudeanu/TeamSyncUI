import dayjs from 'dayjs';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

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
export class ProjectHomeTabComponent implements OnChanges, AfterViewInit {
  @Input() project!: Project;
  statistics!: ProjectStatistics;
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions: Partial<ColumnChartOptions> | any = this.getChartConfig();
  viewReady = false;
  readyToRenderChart = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryBuildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.project) return;

    console.log(changes);
    this.readyToRenderChart = false;

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

    // Allow rendering after stats are calculated
    this.readyToRenderChart = true;

    // Try build chart when data is ready and DOM is safe
    this.tryBuildChart();
  }

  tryBuildChart(): void {
    const weeklyData = this.getWeeklyCommitsByDay(this.project);
    this.chartOptions.series[0].data = weeklyData;
  }

  private getChartConfig() {
    return {
      series: [
        {
          name: 'Commits',
          type: 'line',
          data: [],
        },
      ],
      chart: {
        type: 'line',
        height: 350,
        width: '100%',
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      title: {
        text: 'Weekly Github Commits',
        align: 'left',
      },
      dataLabels: {
        enabled: true,
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
      tooltip: {
        y: {
          formatter: (val: number): string => `${val} commits`,
        },
      },
    };
  }

  getWeeklyCommitsByDay(project?: Project): number[] {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (!project?.githubRepository?.githubCommits) {
      return weekdays.map(() => 0);
    }

    const startOfWeek = dayjs().startOf('isoWeek'); // Monday
    const endOfWeek = dayjs().endOf('isoWeek'); // Sunday

    const countsByDay: { [key: string]: number } = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    for (const commit of project.githubRepository.githubCommits) {
      const commitDate = dayjs(commit.date);

      if (commitDate.isBefore(startOfWeek) || commitDate.isAfter(endOfWeek)) {
        continue; // Skip commits outside this week
      }

      const day = commitDate.format('ddd'); // e.g., "Mon"
      if (countsByDay[day] !== undefined) {
        countsByDay[day]++;
      }
    }

    return weekdays.map((day) => countsByDay[day]);
  }
}
