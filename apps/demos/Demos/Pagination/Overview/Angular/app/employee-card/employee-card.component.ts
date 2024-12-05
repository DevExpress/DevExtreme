import { Component, Input } from '@angular/core';
import { Employee } from '../app.service';

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'employee-card',
  templateUrl: `.${modulePrefix}/employee-card/employee-card.component.html`,
})
export class EmployeeCard {
  @Input() employee: Employee;
}
