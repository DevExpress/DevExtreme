import { Injectable } from '@angular/core';
import { Employee, employee } from './employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  getEmployee(): Employee {
    return employee;
  }
}