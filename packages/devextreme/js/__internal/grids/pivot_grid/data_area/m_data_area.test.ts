import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import { DataArea } from './m_data_area';

const createComponent = (): unknown => ({
  option: (optionName?: string) => {
    if (optionName === undefined) {
      return {};
    }

    return {
      rtlEnabled: false,
      encodeHtml: false,
    }[optionName];
  },
  _eventsStrategy: { hasEvent: () => false },
  _defaultActionArgs: () => ({}),
});

describe('DataArea', () => {
  let container: HTMLElement = document.createElement('div');

  const cellsData = [
    [{ text: '1' }, { text: '2' }],
    [{ text: '3' }, { text: '4' }],
  ];

  const renderDataArea = (data: unknown[]): DataArea => {
    const area = new DataArea(createComponent());

    area.render($(container), data);

    return area;
  };

  const getCellsTabIndexes = (): (string | null)[] => Array.from(container.querySelectorAll('td'))
    .map((cell) => cell.getAttribute('tabindex'));

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('render', () => {
    it('should make only the first data cell focusable', () => {
      renderDataArea(cellsData);

      expect(getCellsTabIndexes()).toEqual(['0', null, null, null]);
    });

    it('should keep the first data cell focusable after re-render', () => {
      const area = renderDataArea(cellsData);

      area.render($(container), cellsData);

      expect(getCellsTabIndexes()).toEqual(['0', null, null, null]);
    });

    it('should not fail when there is no data', () => {
      expect(() => renderDataArea([])).not.toThrow();
    });
  });

  describe('setColumnsWidth', () => {
    const getTableWidth = (): string => container.querySelector('table')!.style.width;

    const getColumnWidths = (): string[] => Array
      .from(container.querySelectorAll('col'))
      .map((col) => col.style.width);

    it('should set the width of every column', () => {
      const area = renderDataArea(cellsData);

      area.setColumnsWidth([10, 20]);

      expect(getColumnWidths()).toEqual(['10px', '20px']);
      expect(getTableWidth()).toEqual('30px');
    });

    it('should add the widths of extra columns to the last one', () => {
      const area = renderDataArea(cellsData);

      area.setColumnsWidth([10, 20, 30]);

      expect(getColumnWidths()).toEqual(['10px', '50px']);
      expect(getTableWidth()).toEqual('60px');
    });

    it('should span the requested width when rows have no cells', () => {
      const area = renderDataArea([[], []]);

      area.setColumnsWidth([10, 20, 30]);

      expect(getColumnWidths()).toEqual([]);
      expect(getTableWidth()).toEqual('60px');
    });

    it('should collapse the table when there are no columns at all', () => {
      const area = renderDataArea([[], []]);

      area.setColumnsWidth([]);

      expect(getTableWidth()).toEqual('0px');
    });
  });
});
