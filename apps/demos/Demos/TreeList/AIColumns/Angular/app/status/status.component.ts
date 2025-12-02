import { Component, Input } from '@angular/core';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'status',
  templateUrl: `.${modulePrefix}/status/status.component.html`,
  styleUrls: [`.${modulePrefix}/status/status.component.css`],
})
export class Status {
  @Input() status!: string;
}
