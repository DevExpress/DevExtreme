/* eslint-disable spellcheck/spell-checker */
const OPERATION_ICONS: Record<string, string | undefined> = {
  '=': 'equal',
  '<>': 'notequal',
  '<': 'less',
  '<=': 'lessorequal',
  '>': 'greater',
  '>=': 'greaterorequal',
  notcontains: 'doesnotcontain',
  contains: 'contains',
  startswith: 'startswith',
  endswith: 'endswith',
  isblank: 'isblank',
  isnotblank: 'isnotblank',
};

const OPERATION_NAME: Record<string, string | undefined> = {
  '=': 'equal',
  '<>': 'notEqual',
  '<': 'lessThan',
  '<=': 'lessThanOrEqual',
  '>': 'greaterThan',
  '>=': 'greaterThanOrEqual',
  startswith: 'startsWith',
  contains: 'contains',
  notcontains: 'notContains',
  endswith: 'endsWith',
  isblank: 'isBlank',
  isnotblank: 'isNotBlank',
  between: 'between',
};

export default {
  getIconByFilterOperation(filterOperation: string): string | undefined {
    return OPERATION_ICONS[filterOperation];
  },

  getNameByFilterOperation(filterOperation: string): string | undefined {
    return OPERATION_NAME[filterOperation];
  },
};
