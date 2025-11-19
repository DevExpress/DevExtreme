import { Component, Input } from '@angular/core';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'employee',
  templateUrl: `.${modulePrefix}/employee/employee.component.html`,
  styleUrls: [`.${modulePrefix}/employee/employee.component.css`],
})
export class Employee {
  @Input() firstName!: string;

  @Input() lastName!: string;
}
