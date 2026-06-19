import { describe, expect, it } from '@jest/globals';
import filterUtils from '@js/ui/shared/filtering';

import gridCoreUtils from '../../m_utils';
import { getFormatOptions } from '../m_header_filter';

describe('getGroupInterval', () => {
  describe('headerFilter.groupInterval normalization', () => {
    it.each([
      {
        caseName: 'scalar number', dataType: 'number', groupInterval: 100, expected: [100],
      },
      {
        caseName: 'number[]', dataType: 'number', groupInterval: [100, 10], expected: [100, 10],
      },
      {
        caseName: 'three-level number[]', dataType: 'number', groupInterval: [100000, 10000, 1000], expected: [100000, 10000, 1000],
      },
      {
        caseName: 'string[] (hierarchy field names)', dataType: 'string', groupInterval: ['Country', 'State', 'City'], expected: ['Country', 'State', 'City'],
      },
      {
        caseName: 'unset', dataType: 'number', groupInterval: undefined, expected: undefined,
      },
      {
        caseName: 'date, default', dataType: 'date', groupInterval: undefined, expected: ['year', 'month', 'day'],
      },
      {
        caseName: 'datetime, default', dataType: 'datetime', groupInterval: undefined, expected: ['year', 'month', 'day', 'hour', 'minute'],
      },
      {
        caseName: 'date, "year"', dataType: 'date', groupInterval: 'year', expected: ['year'],
      },
      {
        caseName: 'date, "month"', dataType: 'date', groupInterval: 'month', expected: ['year', 'month'],
      },
      {
        caseName: 'date, "quarter"', dataType: 'date', groupInterval: 'quarter', expected: ['year', 'quarter'],
      },
      {
        caseName: 'datetime, "hour"', dataType: 'datetime', groupInterval: 'hour', expected: ['year', 'month', 'day', 'hour'],
      },
      {
        caseName: 'datetime, "second"', dataType: 'datetime', groupInterval: 'second', expected: ['year', 'month', 'day', 'hour', 'minute', 'second'],
      },
      {
        caseName: 'date, null', dataType: 'date', groupInterval: null, expected: undefined,
      },
      {
        caseName: 'date, ["quarter", "second"]', dataType: 'date', groupInterval: ['quarter', 'second'], expected: ['year', 'month', 'day'],
      },
      {
        caseName: 'date, [10, 20]', dataType: 'date', groupInterval: [10, 20], expected: ['year', 'month', 'day'],
      },
      {
        caseName: 'date, ["a", "b"]', dataType: 'date', groupInterval: ['a', 'b'], expected: ['year', 'month', 'day'],
      },
      {
        caseName: 'datetime, ["quarter", "second"]', dataType: 'datetime', groupInterval: ['quarter', 'second'], expected: ['year', 'month', 'day', 'hour', 'minute'],
      },
    ])('normalizes $caseName into $expected', ({ dataType, groupInterval, expected }) => {
      const column = { dataType, headerFilter: { groupInterval } };

      expect(filterUtils.getGroupInterval(column)).toEqual(expected);
    });
  });
});

describe('getHeaderFilterGroupParameters', () => {
  it('builds one remote group parameter per level, expanding all but the last', () => {
    const column = {
      dataField: 'Price', dataType: 'number', headerFilter: { groupInterval: [100, 10] },
    };

    expect(gridCoreUtils.getHeaderFilterGroupParameters(column, true)).toEqual([
      { selector: 'Price', groupInterval: 100, isExpanded: true },
      { selector: 'Price', groupInterval: 10, isExpanded: false },
    ]);
  });

  it('supports an arbitrary number of levels', () => {
    const column = {
      dataField: 'Population',
      dataType: 'number',
      headerFilter: { groupInterval: [100000, 10000, 1000] },
    };

    expect(gridCoreUtils.getHeaderFilterGroupParameters(column, true)).toEqual([
      { selector: 'Population', groupInterval: 100000, isExpanded: true },
      { selector: 'Population', groupInterval: 10000, isExpanded: true },
      { selector: 'Population', groupInterval: 1000, isExpanded: false },
    ]);
  });

  it('builds a local interval selector per level that buckets the cell value', () => {
    const column = {
      dataField: 'Price',
      dataType: 'number',
      headerFilter: { groupInterval: [100, 10] },
      calculateCellValue: (data) => data.Price,
    };

    const params = gridCoreUtils.getHeaderFilterGroupParameters(column);

    expect(params).toHaveLength(2);
    // 753 -> floor(753 / 100) * 100 on the outer level, floor(753 / 10) * 10 on the inner level
    expect(params[0]({ Price: 753 })).toBe(700);
    expect(params[1]({ Price: 753 })).toBe(750);
  });
});

describe('getFormatOptions', () => {
  it('selects the interval of the requested level for a number[]', () => {
    const column = { dataType: 'number', headerFilter: { groupInterval: [100, 10] } };

    expect(getFormatOptions(700, column, 0).groupInterval).toBe(100);
    expect(getFormatOptions(750, column, 1).groupInterval).toBe(10);
  });

  it('formats a numeric bucket as a "<value> - <value + interval>" range', () => {
    const column = { dataType: 'number', headerFilter: { groupInterval: [100, 10] } };

    expect(getFormatOptions(700, column, 0).getDisplayFormat()).toBe('700 - 800');
    expect(getFormatOptions(750, column, 1).getDisplayFormat()).toBe('750 - 760');
  });

  it('selects the hierarchy level name for a string[]', () => {
    const column = { dataType: 'string', headerFilter: { groupInterval: ['Country', 'State', 'City'] } };

    expect(getFormatOptions('USA', column, 0).groupInterval).toBe('Country');
    expect(getFormatOptions('Arkansas', column, 1).groupInterval).toBe('State');
    expect(getFormatOptions('Bentonville', column, 2).groupInterval).toBe('City');
  });
});
