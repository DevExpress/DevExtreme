import { Component, Input } from '@angular/core';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  standalone: false,
  selector: 'progress-bar',
  templateUrl: `.${modulePrefix}/progress-bar/progress-bar.component.html`,
  styleUrls: [`.${modulePrefix}/progress-bar/progress-bar.component.css`],
})
export class ProgressComponent {
  @Input() value: number;

  getStatusFormat(_, value: number): string {
    return `${value}%`;
  }
}
