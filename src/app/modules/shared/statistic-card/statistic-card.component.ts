import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-statistic-card',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './statistic-card.component.html',
  styleUrl: './statistic-card.component.scss'
})
export class StatisticCardComponent {
  @Input() title = '';
  @Input() count = 0;
  @Input() label = '';
  @Input() color = '#5e88f5';
}
