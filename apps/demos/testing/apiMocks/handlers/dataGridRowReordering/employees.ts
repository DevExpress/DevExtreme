import type { MockHandler } from '../../types';
import { aspNetLoadHandler } from '../../aspNet/store';
import employees from '../../fixtures/employees.json';

export const dataGridRowReorderingEmployeesHandler: MockHandler = aspNetLoadHandler(
  '/api/DataGridRowReordering/Employees',
  employees,
);
