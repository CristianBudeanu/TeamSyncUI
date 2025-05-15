import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { Project } from '../../../../core/models/project/project';


export interface ChartOptionsLinear {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels; // ✅ adăugat aici
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
}

@Component({
  selector: 'app-user-contribution-chart',
  imports: [NgApexchartsModule],
  templateUrl: './user-contribution-chart.component.html',
  styleUrl: './user-contribution-chart.component.scss',
})
export class UserContributionChartComponent implements OnChanges {

  @ViewChild('chart') chart!: ChartComponent;
  @Input() project!: Project;

  public chartOptions!: ChartOptionsLinear;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.project) {
      this.chartOptions = this.getTasksChart();
    }
  }

  // private getTasksChart(): ChartOptionsLinear {
  //   return {
  //     series: [
  //       {
  //         name: 'Product Trends',
  //         data: [4, 2, 3, 5, 1, 2, 3, 4, 5, 2] // ✅ corect
  //       }
  //     ],
  //     chart: {
  //       height: 350,
  //       type: 'line',
  //       zoom: {
  //         enabled: false,
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     stroke: {
  //       curve: 'straight',
  //     },
  //     title: {
  //       text: 'Product Trends by Month',
  //       align: 'left',
  //     },
  //     grid: {
  //       row: {
  //         colors: ['#f3f3f3', 'transparent'],
  //         opacity: 0.5,
  //       },
  //     },
  //     xaxis: {
  //       categories: [
  //         'Jan',
  //         'Feb',
  //         'Mar',
  //         'Apr',
  //         'May',
  //         'Jun',
  //         'Jul',
  //         'Aug',
  //         'Sep',
  //       ],
  //     },
  //   };
  // }

  private getTasksChart(): ChartOptionsLinear {
    if (!this.project || !this.project.members) {
      console.log(this.project);
      
      return {
        series: [{ name: 'Contribuție', data: [] }],
        chart: {
          height: 350,
          type: 'bar',
          zoom: { enabled: false },
        },
        dataLabels: { enabled: true },
        stroke: { curve: 'smooth' },
        title: { text: 'Contribuția utilizatorilor (taskuri finalizate)', align: 'center' },
        grid: {
          row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
        },
        xaxis: { categories: [] },
      };
    }
  
    const categories = this.project.members.map(member => member.username);
    const data = this.project.members.map(member =>
      member.assignedTasks?.filter(task => task.status === 'Done').length ?? 0
    );
  
    return {
      series: [
        {
          name: 'Task-uri finalizate',
          data: data,
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: { enabled: false },
      },
      dataLabels: { enabled: true },
      stroke: { curve: 'smooth' },
      title: {
        text: 'Contribuția utilizatorilor (taskuri finalizate)',
        align: 'center',
      },
      grid: {
        row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
      },
      xaxis: {
        categories: categories,
      },
    };
  }
}
