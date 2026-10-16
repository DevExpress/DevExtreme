import { Component, Input } from '@angular/core';

@Component({
  selector: 'employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class Employee {
  @Input() firstName!: string;

  @Input() lastName!: string;
}
