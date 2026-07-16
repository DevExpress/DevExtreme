import {
  beforeAll, describe, expect, it,
} from '@jest/globals';
import messageLocalization from '@js/common/core/localization/message';

import { getFieldItemA11yLabel } from './a11y';

describe('getFieldItemA11yLabel', () => {
  beforeAll(() => {
    // @ts-expect-error load is not declared on the localization typing
    messageLocalization.load({
      en: {
        'dxPivotGrid-ariaFieldLabel': 'Field: {0}',
        'dxPivotGrid-ariaFieldHeaderFilterLabel': 'Header filter applied',
        'dxPivotGrid-ariaFieldISortAscLabel': 'Sort order: ascending',
        'dxPivotGrid-ariaFieldSortDescLabel': 'Sort order: descending',
      },
    });
  });

  it('should contain only the field name by default', () => {
    expect(getFieldItemA11yLabel('Region', {})).toBe('Field: Region');
  });

  it('should append the ascending sorting state', () => {
    expect(getFieldItemA11yLabel('Region', { sortOrder: 'asc' }))
      .toBe('Field: Region, Sort order: ascending');
  });

  it('should append the descending sorting state', () => {
    expect(getFieldItemA11yLabel('Region', { sortOrder: 'desc' }))
      .toBe('Field: Region, Sort order: descending');
  });

  it('should append the header filter state', () => {
    expect(getFieldItemA11yLabel('Region', { hasHeaderFilterValue: true }))
      .toBe('Field: Region, Header filter applied');
  });

  it('should compose all parts in a stable order', () => {
    expect(getFieldItemA11yLabel('Region', { sortOrder: 'asc', hasHeaderFilterValue: true }))
      .toBe('Field: Region, Header filter applied, Sort order: ascending');
  });
});
