import type { MockHandler } from '../../types';
import { aspNetLoadHandler } from '../../aspNet/store';
import employees from '../../fixtures/employees.json';

export const dataGridCustomEditorsEmployeesHandler: MockHandler = aspNetLoadHandler(
  '/api/DataGridCustomEditors/Employees',
  employees,
);
