import '@ts/ui/scroll_view/scrollable';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import type { AreaItemCell, AreaItemComponent } from '../area_item/types';
import { FAKE_TABLE_CLASS } from '../keyboard_navigation/const';
import { HorizontalHeadersArea, VerticalHeadersArea } from './headers_area';

const TABLE_OFFSET = 1000;
const CELL_SIZES = [100, 120, 300];
const POSITION_PAST_TABLE = TABLE_OFFSET + 520;

const createComponent = (options: Record<string, unknown> = {}): AreaItemComponent => ({
  option: (optionName?: string): unknown => {
    if (optionName === undefined) {
      return {};
    }

    return {
      rtlEnabled: false,
      encodeHtml: false,
      'scrolling.mode': 'virtual',
      ...options,
    }[optionName];
  },
  _eventsStrategy: { hasEvent: () => false },
  _defaultActionArgs: () => ({}),
}) as unknown as AreaItemComponent;

describe('Headers areas', () => {
  let container: HTMLElement = document.createElement('div');

  const getFakeTable = (): HTMLElement | null => container.querySelector(`.${FAKE_TABLE_CLASS}`);

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('HorizontalHeadersArea render cells', () => {
    const renderArea = (
      data: AreaItemCell[][],
      options: Record<string, unknown> = {},
    ): HorizontalHeadersArea => {
      const area = new HorizontalHeadersArea(createComponent(options));

      area.render($(container), data);

      return area;
    };

    const getCell = (): HTMLTableCellElement | null => container.querySelector('td');

    const getCellText = (): HTMLElement | null | undefined => getCell()?.querySelector(':scope > span');

    it('should set the row and column spans of a cell', () => {
      renderArea([[{ text: 'A', rowspan: 2, colspan: 3 }]]);

      expect(getCell()?.getAttribute('rowspan')).toBe('2');
      expect(getCell()?.getAttribute('colspan')).toBe('3');
    });

    it('should make a cell focusable but not a white space cell', () => {
      renderArea([[{ text: 'A' }, { isWhiteSpace: true }]]);

      const cells = Array.from(container.querySelectorAll('td'));

      expect(cells.map((cell) => cell.getAttribute('tabindex'))).toEqual(['-1', null]);
    });

    it('should apply the width and the classes of a cell', () => {
      renderArea([[{ text: 'A', width: 50, type: 'T' }]]);

      expect(getCell()?.style.minWidth).toBe('50px');
      expect(getCell()?.classList).toContain('dx-total');
    });

    it('should render an expand icon for an expandable cell', () => {
      renderArea([[{ text: 'A', expanded: false }]]);

      const icon = getCell()?.querySelector('.dx-expand-icon-container');

      expect(icon?.getAttribute('role')).toBe('button');
      expect(icon?.getAttribute('aria-label')).toBe('A');
      expect(icon?.getAttribute('aria-expanded')).toBe('false');
      expect(icon?.getAttribute('tabindex')).toBe('-1');
      expect(getCell()?.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set the white space of a cell with word wrap', () => {
      renderArea([[{ text: 'A', wordWrapEnabled: false }]]);

      expect(getCellText()?.style.whiteSpace).toBe('nowrap');
    });

    it('should encode the cell text when encodeHtml is true', () => {
      renderArea([[{ text: '<b>A</b>' }]], { encodeHtml: true });

      expect(getCellText()?.innerHTML).toBe('&lt;b&gt;A&lt;/b&gt;');
    });
  });

  describe('HorizontalHeadersArea scrollTo with virtual scrolling', () => {
    const renderVirtualArea = (): HorizontalHeadersArea => {
      const area = new HorizontalHeadersArea(createComponent());

      area.render($(container), [[{ text: 'A' }, { text: 'B' }, { text: 'C' }]]);
      area.setVirtualContentParams({ left: TABLE_OFFSET, width: 3000, height: 300 });
      area.renderScrollable();
      area.setGroupWidth(200);
      area.setColumnsWidth(CELL_SIZES);

      return area;
    };

    it('should show the fake table at the position scrolled past the rendered table', () => {
      const area = renderVirtualArea();

      area.scrollTo({ left: POSITION_PAST_TABLE });

      expect(getFakeTable()?.style.left).toBe(`${POSITION_PAST_TABLE}px`);
      expect(getFakeTable()?.classList).not.toContain('dx-hidden');
    });

    it('should hide the fake table when scrolled back to the rendered table', () => {
      const area = renderVirtualArea();

      area.scrollTo({ left: POSITION_PAST_TABLE });
      area.scrollTo({ left: TABLE_OFFSET });

      expect(getFakeTable()?.style.left).toBe(`${TABLE_OFFSET}px`);
      expect(getFakeTable()?.classList).toContain('dx-hidden');
    });
  });

  describe('VerticalHeadersArea scrollTo with virtual scrolling', () => {
    const renderVirtualArea = (): VerticalHeadersArea => {
      const area = new VerticalHeadersArea(createComponent());

      area.render($(container), [[{ text: 'A' }], [{ text: 'B' }], [{ text: 'C' }]]);
      area.setVirtualContentParams({ top: TABLE_OFFSET, width: 300, height: 3000 });
      area.renderScrollable();
      area.setGroupHeight(200);
      area.setRowsHeight(CELL_SIZES);

      return area;
    };

    it('should show the fake table at the position scrolled past the rendered table', () => {
      const area = renderVirtualArea();

      area.scrollTo({ top: POSITION_PAST_TABLE });

      expect(getFakeTable()?.style.top).toBe(`${POSITION_PAST_TABLE}px`);
      expect(getFakeTable()?.classList).not.toContain('dx-hidden');
    });

    it('should hide the fake table when scrolled back to the rendered table', () => {
      const area = renderVirtualArea();

      area.scrollTo({ top: POSITION_PAST_TABLE });
      area.scrollTo({ top: TABLE_OFFSET });

      expect(getFakeTable()?.style.top).toBe(`${TABLE_OFFSET}px`);
      expect(getFakeTable()?.classList).toContain('dx-hidden');
    });
  });
});
