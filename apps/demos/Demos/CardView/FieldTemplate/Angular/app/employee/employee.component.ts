import {
  Component, computed, inject, input,
} from '@angular/core';
import { Service } from '../app.service';

@Component({
  selector: 'employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent {
  private readonly employees = inject(Service).getEmployees();

  readonly employeeID = input.required<number>();

  readonly text = computed(() => this.employees.find((e) => e.ID === this.employeeID()).Name);
}
