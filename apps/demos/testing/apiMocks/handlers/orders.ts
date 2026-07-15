import type { MockHandler } from '../types';
import { pad, numberParam, skipOf } from '../utils';

// GET /api/orders

const matches = (url: string): boolean => /\/api\/orders\b/i.test(url);

const TOTAL_COUNT = 93;

const cities = [
  'Anchorage', 'Boston', 'Chicago', 'Denver',
  'Eugene', 'Fresno', 'Honolulu', 'Las Vegas',
];

const states = [
  'Alaska', 'Massachusetts', 'Illinois', 'Colorado',
  'Oregon', 'California', 'Hawaii', 'Nevada',
];

const employees = [
  'Harv Mudd', 'Wally Hobbs', 'Ashley Wright', 'Todd Hoffman',
  'Sandra Johnson', 'James Anderson', 'Karen Goodson', 'Nat Wu',
];

const orderDate = (index: number): string => {
  const base = new Date(Date.UTC(2024, 0, 1));
  base.setUTCDate(base.getUTCDate() + index * 2);
  return `${base.getUTCFullYear()}-${pad(base.getUTCMonth() + 1)}-${pad(base.getUTCDate())}T00:00:00`;
};

const buildRow = (index: number) => ({
  OrderNumber: 10248 + index,
  OrderDate: orderDate(index),
  StoreCity: cities[index % cities.length],
  StoreState: states[index % states.length],
  Employee: employees[index % employees.length],
  SaleAmount: 1000 + ((index * 173) % 9000),
});

export const ordersHandler: MockHandler = {
  matches,
  respond: (url) => {
    const skip = skipOf(url);
    const take = numberParam(url, 'take', 12);
    const available = Math.max(0, TOTAL_COUNT - skip);
    return {
      data: Array.from({ length: Math.min(take, available) }, (_, i) => buildRow(skip + i)),
      totalCount: TOTAL_COUNT,
    };
  },
};
