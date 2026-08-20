import { Component, Input } from '@angular/core';
import {
  DxProgressBarModule,
} from 'devextreme-angular';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
  imports: [
    DxProgressBarModule,
  ],
})
export class ProgressComponent {
  @Input() value: number;

  getStatusFormat(_, value: number): string {
    return `${value}%`;
  }
}
