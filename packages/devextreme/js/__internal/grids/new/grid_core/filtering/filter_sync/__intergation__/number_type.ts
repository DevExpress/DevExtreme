import type {
  TestCaseFilterPanel,
  TestCaseHeaderFilter,
} from './types';

export const NUMBER_DATA_CONFIGS = {
  number: [
    { id: 0, value: 0 },
    { id: 1, value: 1 },
    { id: 2, value: 2 },
  ],
  string: [
    { id: 0, value: '0' },
    { id: 1, value: '1' },
    { id: 2, value: '2' },
  ],
};

export const NUMBER_HEADER_FILTER: TestCaseHeaderFilter[] = [
  {
    caseName: 'one value',
    filteredIds: [0],
    changes: {
      headerFilterType: undefined,
      headerFilter: [0],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: [0],
      filterPanel: ['value', '=', 0],
    },
  },
  {
    caseName: 'two values',
    filteredIds: [0, 2],
    changes: {
      headerFilterType: undefined,
      headerFilter: [0, 2],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: [0, 2],
      filterPanel: ['value', 'anyof', [0, 2]],
    },
  },
  {
    caseName: 'include one value',
    filteredIds: [0],
    changes: {
      headerFilterType: 'include',
      headerFilter: [0],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: [0],
      filterPanel: ['value', '=', 0],
    },
  },
  {
    caseName: 'include two values',
    filteredIds: [0, 2],
    changes: {
      headerFilterType: 'include',
      headerFilter: [0, 2],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: [0, 2],
      filterPanel: ['value', 'anyof', [0, 2]],
    },
  },
  {
    caseName: 'exclude one value',
    filteredIds: [1, 2],
    changes: {
      headerFilterType: 'exclude',
      headerFilter: [0],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: [0],
      filterPanel: ['value', '<>', 0],
    },
  },
  {
    caseName: 'exclude two values',
    filteredIds: [1],
    changes: {
      headerFilterType: 'exclude',
      headerFilter: [0, 2],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: [0, 2],
      filterPanel: ['value', 'noneof', [0, 2]],
    },
  },
];

export const NUMBER_FILTER_PANEL: TestCaseFilterPanel[] = [
  {
    caseName: 'less one',
    filteredIds: [0],
    changes: {
      filterPanel: ['value', '<', 1],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '<', 1],
    },
  },
  {
    caseName: 'less all',
    filteredIds: [0, 1, 2],
    changes: {
      filterPanel: ['value', '<', 20],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '<', 20],
    },
  },
  {
    caseName: 'less none',
    filteredIds: [],
    changes: {
      filterPanel: ['value', '<', 0],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '<', 0],
    },
  },
  {
    caseName: 'less or equal one',
    filteredIds: [0],
    changes: {
      filterPanel: ['value', '<=', 0],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '<=', 0],
    },
  },
  {
    caseName: 'less or equal all',
    filteredIds: [0, 1, 2],
    changes: {
      filterPanel: ['value', '<=', 20],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '<=', 20],
    },
  },
  {
    caseName: 'less or equal none',
    filteredIds: [],
    changes: {
      filterPanel: ['value', '<=', -1],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '<=', -1],
    },
  },
  {
    caseName: 'greater one',
    filteredIds: [2],
    changes: {
      filterPanel: ['value', '>', 1],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '>', 1],
    },
  },
  {
    caseName: 'greater all',
    filteredIds: [0, 1, 2],
    changes: {
      filterPanel: ['value', '>', -1],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '>', -1],
    },
  },
  {
    caseName: 'greater none',
    filteredIds: [],
    changes: {
      filterPanel: ['value', '>', 2],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '>', 2],
    },
  },
  {
    caseName: 'greater or equal one',
    filteredIds: [2],
    changes: {
      filterPanel: ['value', '>=', 2],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '>=', 2],
    },
  },
  {
    caseName: 'greater or equal all',
    filteredIds: [0, 1, 2],
    changes: {
      filterPanel: ['value', '>=', 0],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '>=', 0],
    },
  },
  {
    caseName: 'greater or equal none',
    filteredIds: [],
    changes: {
      filterPanel: ['value', '>=', 3],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', '>=', 3],
    },
  },
  {
    caseName: 'equal',
    filteredIds: [1],
    changes: {
      filterPanel: ['value', '=', 1],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: [1],
      filterPanel: ['value', '=', 1],
    },
  },
  {
    caseName: 'not equal',
    filteredIds: [0, 2],
    changes: {
      filterPanel: ['value', '<>', 1],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: [1],
      filterPanel: ['value', '<>', 1],
    },
  },
  {
    caseName: 'anyof one',
    filteredIds: [1],
    changes: {
      filterPanel: ['value', 'anyof', [1]],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: [1],
      filterPanel: ['value', 'anyof', [1]],
    },
  },
  {
    caseName: 'anyof two',
    filteredIds: [0, 2],
    changes: {
      filterPanel: ['value', 'anyof', [0, 2]],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: [0, 2],
      filterPanel: ['value', 'anyof', [0, 2]],
    },
  },
  {
    caseName: 'noneof one',
    filteredIds: [0, 2],
    changes: {
      filterPanel: ['value', 'noneof', [1]],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: [1],
      filterPanel: ['value', 'noneof', [1]],
    },
  },
  {
    caseName: 'noneof two',
    filteredIds: [1],
    changes: {
      filterPanel: ['value', 'noneof', [0, 2]],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: [0, 2],
      filterPanel: ['value', 'noneof', [0, 2]],
    },
  },
];
