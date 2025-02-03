import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-custom-icon',
  standalone: true,
  imports: [MatIconModule, NgStyle],
  templateUrl: './custom-icon.component.html',
  styleUrl: './custom-icon.component.scss'
})
export class CustomIconComponent {

  @Input() iconName = '';
  @Input() iconSize = 16;
  @Input() iconColor = 'white';

  get initializeIconContainer(){
    return {
      'border-radius': '100%',
      'width': `${this.iconSize}px`,
      'heigth': `${this.iconSize}px`,
    }
  }

  get initializeIcon(){
    return {
      'color': this.iconColor,
      'width': `${this.iconSize}px`,
      'height': `${this.iconSize}px`,
      'font-size': `${this.iconSize}px`
    }
  }
}
