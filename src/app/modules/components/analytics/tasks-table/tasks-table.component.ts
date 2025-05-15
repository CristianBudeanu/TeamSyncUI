import { AfterViewInit, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskItemDto } from '../../../../core/models/task';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tasks-table',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    DatePipe
  ],
  templateUrl: './tasks-table.component.html',
  styleUrl: './tasks-table.component.scss',
})
export class TasksTableComponent implements AfterViewInit {
  @Input() tasks: TaskItemDto[] = [];
  displayedColumns: string[] = [
    'title',
    'priority',
    'assignedTo',
    'startDate',
    'endDate',
    'status',
  ];
  dataSource: MatTableDataSource<TaskItemDto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    console.log(this.tasks);

    this.dataSource = new MatTableDataSource(this.tasks);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      console.log('Tasks received in table:', this.tasks);
      this.dataSource.data = this.tasks ?? [];
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
