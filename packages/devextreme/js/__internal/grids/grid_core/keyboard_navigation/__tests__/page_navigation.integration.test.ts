import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import { triggerKeyDown, triggerPointerDown } from './helpers/utils';

const ROW_COUNT = 100;
const ROW_HEIGHT = 50;
const VIEWPORT_HEIGHT = 250;

interface ScrollableMock {
  container: () => HTMLElement;
  $content: () => { get: (index: number) => HTMLElement };
  _eventsStrategy: { fireEvent: (name: string, args: unknown[]) => void };
}

interface RowsViewMock {
  element: () => { get: (index: number) => HTMLElement };
  _handleScroll: (e: { component: unknown; scrollOffset: { top: number; left: number } }) => void;
}

let scrollTop = 0;

const getRowIndex = (element: Element): number => Number(element.getAttribute('aria-rowindex')) - 1;

const createRect = (top: number, height: number): DOMRect => ({
  top, bottom: top + height, height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}),
});

const mockLayout = (): void => {
  jest.spyOn(Element.prototype, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);

  jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function getRect(this: Element) {
    if (this.matches('tr.dx-data-row')) {
      return createRect(getRowIndex(this) * ROW_HEIGHT - scrollTop, ROW_HEIGHT);
    }

    if (this.matches('.dx-datagrid-rowsview .dx-datagrid-content')) {
      return createRect(-scrollTop, ROW_COUNT * ROW_HEIGHT);
    }

    return createRect(0, 0);
  });

  jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function getOffsetHeight(this: HTMLElement) {
    if (this.matches('tr.dx-data-row')) {
      return ROW_HEIGHT;
    }

    if (this.matches('.dx-scrollable-container')) {
      return VIEWPORT_HEIGHT;
    }

    if (this.matches('.dx-scrollable-content')) {
      return ROW_COUNT * ROW_HEIGHT;
    }

    return 0;
  });
};

const mockScrolling = (instance: DataGridInstance): void => {
  const scrollable = instance.getScrollable();
  const scrollableMock = scrollable as unknown as ScrollableMock;
  const rowsView = instance.getView('rowsView') as unknown as RowsViewMock;

  rowsView.element().get(0).style.height = `${VIEWPORT_HEIGHT}px`;
  scrollableMock.container().style.height = `${VIEWPORT_HEIGHT}px`;
  scrollableMock.$content().get(0).style.height = `${ROW_COUNT * ROW_HEIGHT}px`;

  jest.spyOn(scrollable, 'scrollTop').mockImplementation(() => scrollTop);
  jest.spyOn(scrollable, 'scrollBy').mockImplementation((distance) => {
    const top = typeof distance === 'number' ? distance : distance.top ?? 0;
    const scrollOffset = { top: Math.max(0, scrollTop + top), left: 0 };

    scrollTop = scrollOffset.top;
    rowsView._handleScroll({ component: scrollable, scrollOffset });
    scrollableMock._eventsStrategy.fireEvent('scroll', [{ scrollOffset }]);
  });
};

const pressKey = (instance: DataGridInstance, keyName: 'pageDown' | 'pageUp'): void => {
  triggerKeyDown(instance, keyName, document.activeElement);
  jest.runAllTimers();
};

describe('PageUp and PageDown with virtual scrolling', () => {
  beforeEach(() => {
    beforeTest();
    scrollTop = 0;
    mockLayout();
  });

  afterEach(() => {
    afterTest();
    jest.restoreAllMocks();
  });

  it.each([true, false])('should focus the top visible row after PageDown and PageUp when renderAsync is %s (T898324)', async (renderAsync) => {
    const { instance } = await createDataGrid({
      dataSource: Array.from({ length: ROW_COUNT }, (_, id) => ({ id, name: `Row ${id}` })),
      height: 300,
      columns: ['id', 'name'],
      scrolling: { mode: 'virtual', renderAsync },
    });
    mockScrolling(instance);
    jest.runAllTimers();

    triggerPointerDown(instance.getCellElement(0, 0) as unknown as HTMLElement);
    jest.runAllTimers();

    pressKey(instance, 'pageDown');

    expect(instance.option('focusedRowIndex')).toBe(VIEWPORT_HEIGHT / ROW_HEIGHT);

    pressKey(instance, 'pageUp');

    expect(scrollTop).toBe(0);
    expect(instance.option('focusedRowIndex')).toBe(0);
  });
});
