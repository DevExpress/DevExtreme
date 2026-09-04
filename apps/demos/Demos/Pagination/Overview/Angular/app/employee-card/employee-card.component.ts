import { Component, Input } from '@angular/core';
import { Employee } from '../app.service';

@Component({
  selector: 'employee-card',
  templateUrl: './employee-card.component.html',
})
export class EmployeeCard {
  @Input() employee: Employee;
}
