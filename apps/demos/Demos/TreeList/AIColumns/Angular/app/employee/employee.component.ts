import { Component, input } from '@angular/core';

@Component({
  selector: 'employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class Employee {
  readonly firstName = input.required<string>();

  readonly lastName = input.required<string>();
}
