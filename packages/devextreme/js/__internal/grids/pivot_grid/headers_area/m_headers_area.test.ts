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
import { HorizontalHeadersArea, VerticalHeadersArea } from './m_headers_area';

const TABLE_OFFSET = 1000;
const CELL_SIZES = [100, 120, 300];
const POSITION_PAST_TABLE = TABLE_OFFSET + 520;

const createComponent = (): unknown => ({
  option: (optionName?: string): unknown => {
    if (optionName === undefined) {
      return {};
    }

    return {
      rtlEnabled: false,
      encodeHtml: false,
      'scrolling.mode': 'virtual',
    }[optionName];
  },
  _eventsStrategy: { hasEvent: () => false },
  _defaultActionArgs: () => ({}),
});

describe('Headers areas', () => {
  let container: HTMLElement = document.createElement('div');

  const getFakeTable = (): HTMLElement => container.querySelector(`.${FAKE_TABLE_CLASS}`)!;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
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

      expect(getFakeTable().style.left).toBe(`${POSITION_PAST_TABLE}px`);
      expect(getFakeTable().classList).not.toContain('dx-hidden');
    });

    it('should hide the fake table when scrolled back to the rendered table', () => {
      const area = renderVirtualArea();

      area.scrollTo({ left: POSITION_PAST_TABLE });
      area.scrollTo({ left: TABLE_OFFSET });

      expect(getFakeTable().style.left).toBe(`${TABLE_OFFSET}px`);
      expect(getFakeTable().classList).toContain('dx-hidden');
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

      expect(getFakeTable().style.top).toBe(`${POSITION_PAST_TABLE}px`);
      expect(getFakeTable().classList).not.toContain('dx-hidden');
    });

    it('should hide the fake table when scrolled back to the rendered table', () => {
      const area = renderVirtualArea();

      area.scrollTo({ top: POSITION_PAST_TABLE });
      area.scrollTo({ top: TABLE_OFFSET });

      expect(getFakeTable().style.top).toBe(`${TABLE_OFFSET}px`);
      expect(getFakeTable().classList).toContain('dx-hidden');
    });
  });
});
