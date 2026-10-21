import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import config from '@js/core/config';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from './__mock__/helpers/utils';

describe('column format locale override', () => {
  beforeEach(() => {
    beforeTest();
    coreLocalization.locale('en');
    config({
      ...config(),
      numberFormat: {
        default: {
          locale: 'de-DE',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
      dateTimeFormat: {
        default: {
          locale: 'de-DE',
          type: 'shortDateShortTime',
        },
      },
    });
  });

  afterEach(() => {
    afterTest();
    coreLocalization.locale('en');
    const currentConfig = config();
    delete currentConfig.numberFormat;
    delete currentConfig.dateTimeFormat;
    delete currentConfig.dateFormat;
  });

  it('should keep the global format pattern and apply the column locale', async () => {
    const { instance } = await createDataGrid({
      dataSource: [{
        id: 1,
        amount: 12345.678,
        shippedAt: new Date(2024, 5, 15, 14, 30),
      }],
      columns: [
        { dataField: 'amount', dataType: 'number', format: { locale: 'en' } },
        { dataField: 'amount', dataType: 'number' },
        { dataField: 'shippedAt', dataType: 'datetime', format: { locale: 'en-US' } },
        { dataField: 'shippedAt', dataType: 'datetime' },
      ],
    });

    const cellText = (columnIndex: number): string => (
      (instance.getCellElement(0, columnIndex) as HTMLElement).textContent ?? ''
    );

    expect(cellText(0)).toBe('12,345.678');
    expect(cellText(1)).toBe('12.345,68');
    expect(cellText(2)).toBe('6/15/2024, 2:30 PM');
    expect(cellText(3)).toBe('15.6.2024, 14:30');
  });

  it('should not apply global date format locales to an explicit column format', async () => {
    config({
      ...config(),
      dateFormat: { default: { locale: 'de-DE', type: 'monthAndYear' } },
    });

    const shippedAt = new Date(2024, 5, 15, 14, 30);
    const { instance } = await createDataGrid({
      dataSource: [{ id: 1, shippedAt }],
      columns: [
        { dataField: 'shippedAt', dataType: 'date', format: { year: 'numeric', month: 'long', day: 'numeric' } },
        { dataField: 'shippedAt', dataType: 'date', format: 'dd MMMM yyyy' },
        {
          dataField: 'shippedAt',
          dataType: 'datetime',
          format: {
            year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
          },
        },
        { dataField: 'shippedAt', dataType: 'date' },
      ],
    });

    const cellText = (columnIndex: number): string => (
      (instance.getCellElement(0, columnIndex) as HTMLElement).textContent ?? ''
    );

    expect(cellText(0)).toBe('June 15, 2024');
    expect(cellText(1)).toBe('15 June 2024');
    expect(cellText(2)).toBe('6/15/2024, 2:30 PM');
    expect(cellText(3)).toBe('Juni 2024');
  });
});
