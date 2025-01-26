import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CalendarModule, CalendarView } from 'angular-calendar';


@Component({
  selector: 'app-calendar-nav',
  standalone: true,
  imports: [CalendarModule, MatButtonModule],
  templateUrl: './calendar-nav.component.html',
  styleUrl:'./calendar-nav.component.scss'
})
export class CalendarNavComponent {
  @Input() view!: CalendarView;

  @Input() viewDate!: Date;

  @Input() locale: string = 'en';

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;
}
