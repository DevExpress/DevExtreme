import { Component, Input, OnChanges } from '@angular/core';
import { Employee, EmployeeService } from '../employee.service';

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
export class EmployeeComponent implements OnChanges {
  employees: Employee[];
  text: string;

  @Input() employeeID: number;

  constructor(service: EmployeeService) {
    this.employees = service.getEmployees();
  }

  ngOnChanges(): void {
    const employee = this.employees.find(e => e.ID === this.employeeID);
    this.text = employee.Name;
  }
}
