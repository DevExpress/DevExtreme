import type {
  TestCaseFilterPanel,
  TestCaseHeaderFilter,
} from './types';

// NOTE: String has only same native type
export const STRING_DATA_CONFIGS = {
  string: [
    { id: 0, value: 'A_0' },
    { id: 1, value: 'A_1' },
    { id: 2, value: 'A_2' },
  ],
};

export const STRING_HEADER_FILTER_DATA_CONFIGS = {
  values: [
    {
      text: 'one value',
      value: ['A_0'],
    },
    {
      text: 'two values',
      value: ['A_0', 'A_1'],
    },
    {
      text: 'three values',
      value: ['A_0', 'A_1', 'A_2'],
    },
    {
      text: 'not exist value',
      value: ['A_100'],
    },
  ],
  conditions: [
    {
      text: 'one operator',
      value: ['value', 'contains', 'A_0'],
    },
    {
      text: 'two operators',
      value: [['value', '<>', 'A_0'], ['value', 'startswith', 'A_1']],
    },
    {
      text: 'three operators',
      value: [['value', '<>', 'A_0'], ['value', 'notcontains', 'A_1'], ['value', '=', 'A_2']],
    },
  ],
};

export const STRING_HEADER_FILTER: TestCaseHeaderFilter[] = [
  {
    caseName: 'one value',
    filteredIds: [0],
    changes: {
      headerFilterType: undefined,
      headerFilter: ['A_0'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: ['A_0'],
      filterPanel: ['value', '=', 'A_0'],
    },
  },
  {
    caseName: 'two values',
    filteredIds: [0, 2],
    changes: {
      headerFilterType: undefined,
      headerFilter: ['A_0', 'A_2'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: ['A_0', 'A_2'],
      filterPanel: ['value', 'anyof', ['A_0', 'A_2']],
    },
  },
  {
    caseName: 'include one value',
    filteredIds: [0],
    changes: {
      headerFilterType: 'include',
      headerFilter: ['A_0'],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['A_0'],
      filterPanel: ['value', '=', 'A_0'],
    },
  },
  {
    caseName: 'include two values',
    filteredIds: [0, 2],
    changes: {
      headerFilterType: 'include',
      headerFilter: ['A_0', 'A_2'],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['A_0', 'A_2'],
      filterPanel: ['value', 'anyof', ['A_0', 'A_2']],
    },
  },
  {
    caseName: 'exclude one value',
    filteredIds: [1, 2],
    changes: {
      headerFilterType: 'exclude',
      headerFilter: ['A_0'],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['A_0'],
      filterPanel: ['value', '<>', 'A_0'],
    },
  },
  {
    caseName: 'exclude two values',
    filteredIds: [1],
    changes: {
      headerFilterType: 'exclude',
      headerFilter: ['A_0', 'A_2'],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['A_0', 'A_2'],
      filterPanel: ['value', 'noneof', ['A_0', 'A_2']],
    },
  },
];

export const STRING_FILTER_PANEL: TestCaseFilterPanel[] = [
  {
    caseName: 'contains one',
    filteredIds: [1],
    changes: {
      filterPanel: ['value', 'contains', 'A_1'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', 'contains', 'A_1'],
    },
  },
  {
    caseName: 'contains all',
    filteredIds: [0, 1, 2],
    changes: {
      filterPanel: ['value', 'contains', 'A_'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', 'contains', 'A_'],
    },
  },
  {
    caseName: 'notcontains one',
    filteredIds: [0, 2],
    changes: {
      filterPanel: ['value', 'notcontains', 'A_1'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', 'notcontains', 'A_1'],
    },
  },
  {
    caseName: 'notcontains all',
    filteredIds: [],
    changes: {
      filterPanel: ['value', 'notcontains', 'A_'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', 'notcontains', 'A_'],
    },
  },
  {
    caseName: 'startswith',
    filteredIds: [0],
    changes: {
      filterPanel: ['value', 'startswith', 'A_0'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', 'startswith', 'A_0'],
    },
  },
  {
    caseName: 'startswith',
    filteredIds: [0, 1, 2],
    changes: {
      filterPanel: ['value', 'startswith', 'A_'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', 'startswith', 'A_'],
    },
  },
  {
    caseName: 'endswith one',
    filteredIds: [2],
    changes: {
      filterPanel: ['value', 'endswith', '2'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: undefined,
      filterPanel: ['value', 'endswith', '2'],
    },
  },
  {
    caseName: 'anyof one',
    filteredIds: [0],
    changes: {
      filterPanel: ['value', 'anyof', ['A_0']],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['A_0'],
      filterPanel: ['value', 'anyof', ['A_0']],
    },
  },
  {
    caseName: 'anyof two',
    filteredIds: [0, 2],
    changes: {
      filterPanel: ['value', 'anyof', ['A_0', 'A_2']],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['A_0', 'A_2'],
      filterPanel: ['value', 'anyof', ['A_0', 'A_2']],
    },
  },
  {
    caseName: 'noneof one',
    filteredIds: [1, 2],
    changes: {
      filterPanel: ['value', 'noneof', ['A_0']],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['A_0'],
      filterPanel: ['value', 'noneof', ['A_0']],
    },
  },
  {
    caseName: 'noneof two',
    filteredIds: [1],
    changes: {
      filterPanel: ['value', 'noneof', ['A_0', 'A_2']],
    },
    expected: {
      headerFilterType: 'exclude',
      headerFilter: ['A_0', 'A_2'],
      filterPanel: ['value', 'noneof', ['A_0', 'A_2']],
    },
  },
];

export const STRING_DS_VALUES_HEADER_FILTER: TestCaseHeaderFilter[] = [
  {
    caseName: 'one value',
    filteredIds: [0],
    changes: {
      headerFilterType: undefined,
      headerFilter: ['A_0'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: ['A_0'],
      filterPanel: ['value', 'anyof', ['A_0']],
    },
  },
  {
    caseName: 'two values',
    filteredIds: [0, 1],
    changes: {
      headerFilterType: undefined,
      headerFilter: ['A_0', 'A_1'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: ['A_0', 'A_1'],
      filterPanel: ['value', 'anyof', ['A_0', 'A_1']],
    },
  },
  {
    caseName: 'three values',
    filteredIds: [0, 1, 2],
    changes: {
      headerFilterType: undefined,
      headerFilter: ['A_0', 'A_1', 'A_2'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: ['A_0', 'A_1', 'A_2'],
      filterPanel: ['value', 'anyof', ['A_0', 'A_1', 'A_2']],
    },
  },
  {
    caseName: 'not exist value',
    filteredIds: [],
    changes: {
      headerFilterType: undefined,
      headerFilter: ['A_100'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: ['A_100'],
      filterPanel: ['value', 'anyof', ['A_100']],
    },
  },
];

export const STRING_DS_VALUES_FILTER_PANEL: TestCaseFilterPanel[] = [
  {
    caseName: 'one value',
    filteredIds: [0],
    changes: {
      filterPanel: ['value', '=', 'A_0'],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['A_0'],
      filterPanel: ['value', '=', 'A_0'],
    },
  },
  {
    caseName: 'two values',
    filteredIds: [0, 1],
    changes: {
      filterPanel: ['value', 'anyof', ['A_0', 'A_1']],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['A_0', 'A_1'],
      filterPanel: ['value', 'anyof', ['A_0', 'A_1']],
    },
  },
  {
    caseName: 'three values',
    filteredIds: [0, 1, 2],
    changes: {
      filterPanel: ['value', 'anyof', ['A_0', 'A_1', 'A_2']],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['A_0', 'A_1', 'A_2'],
      filterPanel: ['value', 'anyof', ['A_0', 'A_1', 'A_2']],
    },
  },
  {
    caseName: 'not exist value',
    filteredIds: [],
    changes: {
      filterPanel: ['value', 'anyof', ['A_100']],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['A_100'],
      filterPanel: ['value', 'anyof', ['A_100']],
    },
  },
  {
    caseName: 'not exist in header filter ds value',
    filteredIds: [],
    changes: {
      filterPanel: ['value', '=', 'A_200'],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['A_200'],
      filterPanel: ['value', '=', 'A_200'],
    },
  },
];

export const STRING_DS_CONDITIONS_HEADER_FILTER: TestCaseHeaderFilter[] = [
  {
    caseName: 'one operator',
    filteredIds: [0],
    changes: {
      headerFilterType: undefined,
      headerFilter: ['value', 'contains', 'A_0'],
    },
    expected: {
      headerFilterType: undefined,
      headerFilter: ['value', 'contains', 'A_0'],
      filterPanel: ['value', 'anyof', ['value', 'contains', 'A_0']],
    },
  },
  {
    caseName: 'two operators',
    filteredIds: [1],
    changes: {
      headerFilterType: undefined,
      // NOTE: In DataGrid headerFilter has extra array wrap too
      headerFilter: [[['value', '<>', 'A_0'], ['value', 'startswith', 'A_1']]],
    },
    expected: {
      headerFilterType: undefined,
      // NOTE: In DataGrid headerFilter has extra array wrap too
      headerFilter: [[['value', '<>', 'A_0'], ['value', 'startswith', 'A_1']]],
      filterPanel: ['value', 'anyof', [[['value', '<>', 'A_0'], ['value', 'startswith', 'A_1']]]],
    },
  },
  {
    caseName: 'three operators',
    filteredIds: [2],
    changes: {
      headerFilterType: undefined,
      // NOTE: In DataGrid headerFilter has extra array wrap too
      headerFilter: [[['value', '<>', 'A_0'], ['value', 'notcontains', 'A_1'], ['value', '=', 'A_2']]],
    },
    expected: {
      headerFilterType: undefined,
      // NOTE: In DataGrid headerFilter has extra array wrap too
      headerFilter: [[['value', '<>', 'A_0'], ['value', 'notcontains', 'A_1'], ['value', '=', 'A_2']]],
      filterPanel: ['value', 'anyof', [[['value', '<>', 'A_0'], ['value', 'notcontains', 'A_1'], ['value', '=', 'A_2']]]],
    },
  },
];

export const STRING_DS_CONDITIONS_FILTER_PANEL: TestCaseFilterPanel[] = [
  {
    caseName: 'one operator',
    filteredIds: [0],
    changes: {
      filterPanel: ['value', 'anyof', ['value', 'contains', 'A_0']],
    },
    expected: {
      headerFilterType: 'include',
      headerFilter: ['value', 'contains', 'A_0'],
      filterPanel: ['value', 'anyof', ['value', 'contains', 'A_0']],
    },
  },
  {
    caseName: 'two operators',
    filteredIds: [1],
    changes: {
      // NOTE: In DataGrid headerFilter has extra array wrap too
      filterPanel: ['value', 'anyof', [[['value', '<>', 'A_0'], ['value', 'startswith', 'A_1']]]],
    },
    expected: {
      headerFilterType: 'include',
      // NOTE: In DataGrid headerFilter has extra array wrap too
      headerFilter: [[['value', '<>', 'A_0'], ['value', 'startswith', 'A_1']]],
      filterPanel: ['value', 'anyof', [[['value', '<>', 'A_0'], ['value', 'startswith', 'A_1']]]],
    },
  },
  {
    caseName: 'three operators',
    filteredIds: [2],
    changes: {
      // NOTE: In DataGrid headerFilter has extra array wrap too
      filterPanel: ['value', 'anyof', [[['value', '<>', 'A_0'], ['value', 'notcontains', 'A_1'], ['value', '=', 'A_2']]]],
    },
    expected: {
      headerFilterType: 'include',
      // NOTE: In DataGrid headerFilter has extra array wrap too
      headerFilter: [[['value', '<>', 'A_0'], ['value', 'notcontains', 'A_1'], ['value', '=', 'A_2']]],
      filterPanel: ['value', 'anyof', [[['value', '<>', 'A_0'], ['value', 'notcontains', 'A_1'], ['value', '=', 'A_2']]]],
    },
  },
];
