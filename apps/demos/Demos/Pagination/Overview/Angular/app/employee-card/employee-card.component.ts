import { Component, input } from '@angular/core';
import type { Employee } from '../app.service';

@Component({
  selector: 'employee-card',
  templateUrl: './employee-card.component.html',
})
export class EmployeeCard {
  readonly employee = input.required<Employee>();
}
