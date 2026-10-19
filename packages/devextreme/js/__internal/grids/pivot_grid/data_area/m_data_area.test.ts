import '@ts/ui/scroll_view/scrollable';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import { FAKE_TABLE_CLASS } from '../keyboard_navigation/const';
import { DataArea } from './m_data_area';

const createComponent = (options: Record<string, unknown> = {}): unknown => ({
  option: (optionName?: string): unknown => {
    if (optionName === undefined) {
      return {};
    }

    return {
      rtlEnabled: false,
      encodeHtml: false,
      ...options,
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

  describe('scrollTo with virtual scrolling', () => {
    const TABLE_OFFSET = 1000;
    const CELL_SIZES = [100, 120, 300];
    const POSITION_PAST_TABLE = TABLE_OFFSET + 520;

    const renderVirtualDataArea = (rtlEnabled = false): DataArea => {
      const area = new DataArea(createComponent({
        rtlEnabled,
        'scrolling.mode': 'virtual',
        scrolling: { useNative: false },
      }));
      const row = [{ text: '1' }, { text: '2' }, { text: '3' }];

      area.render($(container), [row, row, row]);
      area.setVirtualContentParams({
        left: TABLE_OFFSET, top: TABLE_OFFSET, width: 3000, height: 3000,
      });
      area.renderScrollable();
      area.setGroupWidth(200);
      area.setGroupHeight(200);
      area.setColumnsWidth(CELL_SIZES);
      area.setRowsHeight(CELL_SIZES);

      return area;
    };

    const getFakeTable = (): HTMLElement => container.querySelector(`.${FAKE_TABLE_CLASS}`)!;

    it('should show the fake table at the position scrolled past the rendered table', () => {
      const area = renderVirtualDataArea();

      area.scrollTo({ left: POSITION_PAST_TABLE, top: POSITION_PAST_TABLE });

      expect(getFakeTable().style.left).toBe(`${POSITION_PAST_TABLE}px`);
      expect(getFakeTable().style.top).toBe(`${POSITION_PAST_TABLE}px`);
      expect(getFakeTable().classList).not.toContain('dx-hidden');
    });

    it('should hide the fake table when scrolled back to the rendered table', () => {
      const area = renderVirtualDataArea();

      area.scrollTo({ left: POSITION_PAST_TABLE, top: POSITION_PAST_TABLE });
      area.scrollTo({ left: TABLE_OFFSET, top: TABLE_OFFSET });

      expect(getFakeTable().style.left).toBe(`${TABLE_OFFSET}px`);
      expect(getFakeTable().style.top).toBe(`${TABLE_OFFSET}px`);
      expect(getFakeTable().classList).toContain('dx-hidden');
    });

    it('should offset the fake table from the right when rtlEnabled is true', () => {
      const area = renderVirtualDataArea(true);

      area.scrollTo({ left: POSITION_PAST_TABLE, top: TABLE_OFFSET });

      expect(getFakeTable().style.right).toBe(`${POSITION_PAST_TABLE}px`);
      expect(getFakeTable().classList).not.toContain('dx-hidden');
    });
  });
});
