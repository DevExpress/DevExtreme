import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import config from '@js/core/config';
import formatHelper from '@js/format_helper';

import { normalizeColumn } from './utils';

const GLOBAL_FORMAT_KEYS = ['dateFormat', 'dateTimeFormat'] as const;

describe('CardView column format with global date formats', () => {
  const date = new Date(2024, 5, 15, 14, 30);
  let savedLocale = '';
  let savedValues: Partial<Record<typeof GLOBAL_FORMAT_KEYS[number], unknown>> = {};

  beforeEach(() => {
    savedLocale = coreLocalization.locale();
    savedValues = {};
    GLOBAL_FORMAT_KEYS.forEach((key) => {
      savedValues[key] = config()[key];
    });

    coreLocalization.locale('en');
    config({
      ...config(),
      dateFormat: { default: { locale: 'de-DE', type: 'monthAndYear' } },
      dateTimeFormat: { default: { locale: 'de-DE', type: 'shortDateShortTime' } },
    });
  });

  afterEach(() => {
    const currentConfig = config();

    GLOBAL_FORMAT_KEYS.forEach((key) => {
      if (savedValues[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete currentConfig[key];
      } else {
        currentConfig[key] = savedValues[key] as never;
      }
    });
    coreLocalization.locale(savedLocale);
  });

  const formatByColumn = (
    column: Omit<Parameters<typeof normalizeColumn>[0], 'visibleIndex'>,
  ): string => {
    const { format } = normalizeColumn({ ...column, visibleIndex: 0 });

    return formatHelper.format(date, format);
  };

  it('should not apply global date format locales to an explicit column format', () => {
    expect(formatByColumn({
      name: 'a',
      dataField: 'a',
      dataType: 'date',
      format: { year: 'numeric', month: 'long', day: 'numeric' },
    })).toBe('June 15, 2024');
    expect(formatByColumn({
      name: 'b',
      dataField: 'b',
      dataType: 'date',
      format: 'dd MMMM yyyy',
    })).toBe('15 June 2024');
    expect(formatByColumn({
      name: 'c',
      dataField: 'c',
      dataType: 'datetime',
      format: {
        year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
      },
    })).toBe('6/15/2024, 2:30 PM');
  });

  it('should apply global date formats to a column without a format', () => {
    expect(formatByColumn({ name: 'd', dataField: 'd', dataType: 'date' })).toBe('Juni 2024');
    expect(formatByColumn({ name: 'e', dataField: 'e', dataType: 'datetime' })).toBe('15.6.2024, 14:30');
  });
});
