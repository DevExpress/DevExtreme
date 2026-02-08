import type {
  TestCaseFilterPanel,
  TestCaseHeaderFilter,
} from './types';

export const DATE_DATA_CONFIG = {
  date: [
    { id: 0, value: new Date('2024-01-01') },
    { id: 1, value: new Date('2024-01-02') },
    { id: 2, value: new Date('2024-02-01') },
    { id: 3, value: new Date('2024-02-02') },
    { id: 4, value: new Date('2025-01-01') },
    { id: 5, value: new Date('2025-01-02') },
    { id: 6, value: new Date('2026-01-01') },
    { id: 7, value: new Date('2026-01-02') },
  ],
  string: [
    { id: 0, value: '2024-01-01' },
    { id: 1, value: '2024-01-02' },
    { id: 2, value: '2024-02-01' },
    { id: 3, value: '2024-02-02' },
    { id: 4, value: '2025-01-01' },
    { id: 5, value: '2025-01-02' },
    { id: 6, value: '2026-01-01' },
    { id: 7, value: '2026-01-02' },
  ],
};

export const DATE_HEADER_FILTER: TestCaseHeaderFilter[] = [
  {
    caseName: 'include one year',
    filteredIds: [0, 1, 2, 3],
    changes: {
      headerFilterType: undefined,
      headerFilter: [2024],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: [2024],
      filterPanel: ['value', 'anyof', [2024]],
    },
  },
  {
    caseName: 'exclude one year',
    filteredIds: [4, 5, 6, 7],
    changes: {
      headerFilterType: 'exclude',
      headerFilter: [2024],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: [2024],
      filterPanel: ['value', 'noneof', [2024]],
    },
  },
  {
    caseName: 'include two years',
    filteredIds: [0, 1, 2, 3, 6, 7],
    changes: {
      headerFilterType: undefined,
      headerFilter: [2024, 2026],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: [2024, 2026],
      filterPanel: ['value', 'anyof', [2024, 2026]],
    },
  },
  {
    caseName: 'exclude two years',
    filteredIds: [4, 5],
    changes: {
      headerFilterType: 'exclude',
      headerFilter: [2024, 2026],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: [2024, 2026],
      filterPanel: ['value', 'noneof', [2024, 2026]],
    },
  },
  {
    caseName: 'include one month',
    filteredIds: [2, 3],
    changes: {
      headerFilterType: undefined,
      headerFilter: ['2024/2'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: ['2024/2'],
      filterPanel: ['value', 'anyof', ['2024/2']],
    },
  },
  {
    caseName: 'exclude one month',
    filteredIds: [0, 1, 4, 5, 6, 7],
    changes: {
      headerFilterType: 'exclude',
      headerFilter: ['2024/2'],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['2024/2'],
      filterPanel: ['value', 'noneof', ['2024/2']],
    },
  },
  {
    caseName: 'include two months',
    filteredIds: [0, 1, 4, 5],
    changes: {
      headerFilterType: 'include',
      headerFilter: ['2024/1', '2025/1'],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['2024/1', '2025/1'],
      filterPanel: ['value', 'anyof', ['2024/1', '2025/1']],
    },
  },
  {
    caseName: 'exclude two months',
    filteredIds: [2, 3, 6, 7],
    changes: {
      headerFilterType: 'exclude',
      headerFilter: ['2024/1', '2025/1'],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['2024/1', '2025/1'],
      filterPanel: ['value', 'noneof', ['2024/1', '2025/1']],
    },
  },
  {
    caseName: 'include one date',
    filteredIds: [0],
    changes: {
      headerFilterType: 'include',
      headerFilter: ['2024/1/1'],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['2024/1/1'],
      filterPanel: ['value', 'anyof', ['2024/1/1']],
    },
  },
  {
    caseName: 'exclude one date',
    filteredIds: [1, 2, 3, 4, 5, 6, 7],
    changes: {
      headerFilterType: 'exclude',
      headerFilter: ['2024/1/1'],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['2024/1/1'],
      filterPanel: ['value', 'noneof', ['2024/1/1']],
    },
  },
  {
    caseName: 'include two dates',
    filteredIds: [0, 6],
    changes: {
      headerFilterType: 'include',
      headerFilter: ['2024/1/1', '2026/1/1'],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['2024/1/1', '2026/1/1'],
      filterPanel: ['value', 'anyof', ['2024/1/1', '2026/1/1']],
    },
  },
  {
    caseName: 'exclude two dates',
    filteredIds: [1, 2, 3, 4, 5, 7],
    changes: {
      headerFilterType: 'exclude',
      headerFilter: ['2024/1/1', '2026/1/1'],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['2024/1/1', '2026/1/1'],
      filterPanel: ['value', 'noneof', ['2024/1/1', '2026/1/1']],
    },
  },
];

export const DATE_FILTER_PANEL: TestCaseFilterPanel[] = [
  // NOTE: FilterPanel filter that equal part of date is an incorrect configuration (filter)
  // E.g: ['value', '=', '2024/2'] or ['value', '=', 2024]
  {
    caseName: 'equal date',
    filteredIds: [4],
    changes: {
      filterPanel: ['value', '=', '2025/1/1'],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['2025/1/1'],
      filterPanel: ['value', '=', '2025/1/1'],
    },
  },
  {
    caseName: 'anyof year one',
    filteredIds: [0, 1, 2, 3],
    changes: {
      filterPanel: ['value', 'anyof', [2024]],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: [2024],
      filterPanel: ['value', 'anyof', [2024]],
    },
  },
  {
    caseName: 'anyof year two',
    filteredIds: [0, 1, 2, 3, 6, 7],
    changes: {
      filterPanel: ['value', 'anyof', [2024, 2026]],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: [2024, 2026],
      filterPanel: ['value', 'anyof', [2024, 2026]],
    },
  },
  {
    caseName: 'anyof month one',
    filteredIds: [2, 3],
    changes: {
      filterPanel: ['value', 'anyof', ['2024/2']],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['2024/2'],
      filterPanel: ['value', 'anyof', ['2024/2']],
    },
  },
  {
    caseName: 'anyof month two',
    filteredIds: [2, 3, 6, 7],
    changes: {
      filterPanel: ['value', 'anyof', ['2024/2', '2026/1']],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['2024/2', '2026/1'],
      filterPanel: ['value', 'anyof', ['2024/2', '2026/1']],
    },
  },
  {
    caseName: 'anyof date one',
    filteredIds: [4],
    changes: {
      filterPanel: ['value', 'anyof', ['2025/1/1']],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['2025/1/1'],
      filterPanel: ['value', 'anyof', ['2025/1/1']],
    },
  },
  {
    caseName: 'anyof date two',
    filteredIds: [4, 7],
    changes: {
      filterPanel: ['value', 'anyof', ['2025/1/1', '2026/1/2']],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['2025/1/1', '2026/1/2'],
      filterPanel: ['value', 'anyof', ['2025/1/1', '2026/1/2']],
    },
  },
  // NOTE: FilterPanel filter that not equal part of date is an incorrect configuration (filter)
  // E.g: ['value', '<>', '2024/2'] or ['value', '<>', 2024]
  {
    caseName: 'not equal date',
    filteredIds: [0, 1, 2, 3, 5, 6, 7],
    changes: {
      filterPanel: ['value', '<>', '2025/1/1'],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['2025/1/1'],
      // Same filter by meaning as initial one
      filterPanel: ['value', '<>', '2025/1/1'],
    },
  },
  {
    caseName: 'noneof year one',
    filteredIds: [4, 5, 6, 7],
    changes: {
      filterPanel: ['value', 'noneof', [2024]],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: [2024],
      filterPanel: ['value', 'noneof', [2024]],
    },
  },
  {
    caseName: 'noneof year two',
    filteredIds: [4, 5],
    changes: {
      filterPanel: ['value', 'noneof', [2024, 2026]],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: [2024, 2026],
      filterPanel: ['value', 'noneof', [2024, 2026]],
    },
  },
  {
    caseName: 'noneof month one',
    filteredIds: [0, 1, 4, 5, 6, 7],
    changes: {
      filterPanel: ['value', 'noneof', ['2024/2']],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['2024/2'],
      filterPanel: ['value', 'noneof', ['2024/2']],
    },
  },
  {
    caseName: 'noneof month two',
    filteredIds: [0, 1, 4, 5],
    changes: {
      filterPanel: ['value', 'noneof', ['2024/2', '2026/1']],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['2024/2', '2026/1'],
      filterPanel: ['value', 'noneof', ['2024/2', '2026/1']],
    },
  },
  {
    caseName: 'noneof date one',
    filteredIds: [0, 1, 2, 3, 5, 6, 7],
    changes: {
      filterPanel: ['value', 'noneof', ['2025/1/1']],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['2025/1/1'],
      filterPanel: ['value', 'noneof', ['2025/1/1']],
    },
  },
  {
    caseName: 'noneof date two',
    filteredIds: [0, 1, 2, 3, 5, 6],
    changes: {
      filterPanel: ['value', 'noneof', ['2025/1/1', '2026/1/2']],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['2025/1/1', '2026/1/2'],
      filterPanel: ['value', 'noneof', ['2025/1/1', '2026/1/2']],
    },
  },
  {
    caseName: 'less than date string',
    filteredIds: [0, 1, 2, 3],
    changes: {
      filterPanel: ['value', '<', '2025/1/1'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '<', '2025/1/1'],
    },
  },
  {
    caseName: 'less than js date',
    filteredIds: [0, 1, 2, 3],
    changes: {
      filterPanel: ['value', '<', new Date('2025/1/1')],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '<', new Date('2025/1/1')],
    },
  },
  {
    caseName: 'less or equal than date string',
    filteredIds: [0, 1, 2, 3, 4],
    changes: {
      filterPanel: ['value', '<=', '2025/1/1'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '<=', '2025/1/1'],
    },
  },
  {
    caseName: 'less or equal than js date',
    filteredIds: [0, 1, 2, 3, 4],
    changes: {
      filterPanel: ['value', '<=', new Date('2025/1/1')],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '<=', new Date('2025/1/1')],
    },
  },
  {
    caseName: 'greater than date string',
    filteredIds: [5, 6, 7],
    changes: {
      filterPanel: ['value', '>', '2025/1/1'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '>', '2025/1/1'],
    },
  },
  {
    caseName: 'greater than js date',
    filteredIds: [5, 6, 7],
    changes: {
      filterPanel: ['value', '>', new Date('2025/1/1')],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '>', new Date('2025/1/1')],
    },
  },
  {
    caseName: 'greater or equal than date string',
    filteredIds: [4, 5, 6, 7],
    changes: {
      filterPanel: ['value', '>=', '2025/1/1'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '>=', '2025/1/1'],
    },
  },
  {
    caseName: 'greater or equal than js date',
    filteredIds: [4, 5, 6, 7],
    changes: {
      filterPanel: ['value', '>=', new Date('2025/1/1')],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '>=', new Date('2025/1/1')],
    },
  },
];
