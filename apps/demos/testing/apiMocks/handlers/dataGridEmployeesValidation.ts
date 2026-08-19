import type { MockHandler } from '../types';
import { aspNetLoadHandler, aspNetMutationHandler } from '../aspNet/store';
import employeesValidation from '../fixtures/employeesValidation.json';

export const dataGridEmployeesValidationHandlers: MockHandler[] = [
  aspNetLoadHandler(
    '/api/DataGridEmployeesValidation',
    employeesValidation,
  ),
  aspNetMutationHandler(
    '/api/DataGridEmployeesValidation',
  ),
];
