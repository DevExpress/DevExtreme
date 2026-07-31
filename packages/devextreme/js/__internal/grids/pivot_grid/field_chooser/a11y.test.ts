import {
  beforeAll, describe, expect, it,
} from '@jest/globals';
import messageLocalization from '@js/common/core/localization/message';

import { getFieldItemA11yLabel, getFieldsHotkeysA11yDescription, getFieldsHotkeysA11yLabel } from './a11y';

const AREA_DESCRIPTION = 'Press Alt + Down arrow to open a header filter';

beforeAll(() => {
  // @ts-expect-error load is not declared on the localization typing
  messageLocalization.load({
    en: {
      'dxPivotGrid-ariaFieldLabel': 'Field: {0}',
      'dxPivotGrid-ariaFieldHeaderFilterLabel': 'Header filter applied',
      'dxPivotGrid-ariaFieldSortAscLabel': 'Sort order: ascending',
      'dxPivotGrid-ariaFieldSortDescLabel': 'Sort order: descending',
      'dxPivotGrid-ariaDescription': AREA_DESCRIPTION,
    },
  });
});

describe('getFieldItemA11yLabel', () => {
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

describe('getFieldsHotkeysA11yDescription', () => {
  it('should return the localized interaction description', () => {
    expect(getFieldsHotkeysA11yDescription()).toBe(AREA_DESCRIPTION);
  });
});

describe('getFieldsHotkeysA11yLabel', () => {
  it('should compose the base label with the interaction description', () => {
    expect(getFieldsHotkeysA11yLabel('Pivot grid')).toBe(`Pivot grid. ${AREA_DESCRIPTION}`);
  });

  it('should fall back to the description alone when the base label is empty', () => {
    expect(getFieldsHotkeysA11yLabel(undefined)).toBe(AREA_DESCRIPTION);
    expect(getFieldsHotkeysA11yLabel('')).toBe(AREA_DESCRIPTION);
  });
});
