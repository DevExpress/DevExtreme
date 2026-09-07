import { Component, Input, OnChanges } from '@angular/core';
import { Employee, Service } from '../app.service';

@Component({
  selector: 'employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnChanges {
  employees: Employee[];

  text: string;

  @Input() employeeID: number;

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  ngOnChanges(): void {
    const employee = this.employees.find((e) => e.ID === this.employeeID);
    this.text = employee.Name;
  }
}
