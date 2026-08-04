import type { MockHandler } from '../types';
import employees from '../fixtures/diagramEmployees.json';

// GET /api/DiagramEmployees/Employees

export const diagramEmployeesHandler: MockHandler = {
  matches: (req) => /\/api\/DiagramEmployees\/Employees\b/i.test(req.url),
  respond: () => ({ data: employees, totalCount: -1, groupCount: -1 }),
};
