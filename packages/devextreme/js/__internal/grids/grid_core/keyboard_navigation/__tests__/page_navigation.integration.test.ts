import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { Deferred } from '@js/core/utils/deferred';
import type { LoadOptions } from '@js/data';
import CustomStore from '@js/data/custom_store';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import { createPendingTemplate } from '@ts/grids/grid_core/__tests__/__mock__/helpers/pending_template';
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
const ROWS_PER_PAGE = VIEWPORT_HEIGHT / ROW_HEIGHT;
const CONTENT_HEIGHT = ROW_COUNT * ROW_HEIGHT;
const LOAD_DELAY = 200;

const ROWS = Array.from({ length: ROW_COUNT }, (_, id) => ({ id, name: `Row ${id}` }));

type PageKey = 'pageDown' | 'pageUp';

interface ScrollOffset {
  top: number;
  left: number;
}

interface ScrollableMock {
  container: () => HTMLElement;
  $content: () => { get: (index: number) => HTMLElement };
  _createActionByOption: (optionName: string) => (args: { scrollOffset: ScrollOffset }) => void;
}

interface GridWithPendingTemplates {
  instance: DataGridInstance;
  renderPendingTemplates: () => void;
}

let scrollTop = 0;

const getRowIndex = (element: Element): number => Number(element.getAttribute('aria-rowindex')) - 1;

const getFocusedRowIndex = (): number | undefined => {
  const row = document.activeElement?.closest('tr.dx-data-row');

  return row ? getRowIndex(row) : undefined;
};

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
      return createRect(-scrollTop, CONTENT_HEIGHT);
    }

    return createRect(0, 0);
  });
};

const mockScrolling = (instance: DataGridInstance): void => {
  const scrollable = instance.getScrollable();
  const scrollableMock = scrollable as unknown as ScrollableMock;
  const rowsViewElement = instance.getView('rowsView').element()?.get(0) as HTMLElement;

  rowsViewElement.style.height = `${VIEWPORT_HEIGHT}px`;
  scrollableMock.container().style.height = `${VIEWPORT_HEIGHT}px`;
  scrollableMock.$content().get(0).style.height = `${CONTENT_HEIGHT}px`;

  jest.spyOn(scrollable, 'scrollTop').mockImplementation(() => scrollTop);
  jest.spyOn(scrollable, 'scrollBy').mockImplementation((distance) => {
    const top = typeof distance === 'number' ? distance : distance.top ?? 0;

    scrollTop = Math.min(Math.max(scrollTop + top, 0), CONTENT_HEIGHT - VIEWPORT_HEIGHT);
    scrollableMock._createActionByOption('onScroll')({ scrollOffset: { top: scrollTop, left: 0 } });
  });
};

const createGrid = async (options: DataGridProperties = {}): Promise<DataGridInstance> => {
  const { instance } = await createDataGrid({
    dataSource: ROWS,
    height: 300,
    columns: ['id', 'name'],
    scrolling: { mode: 'virtual' },
    ...options,
  });

  mockScrolling(instance);
  jest.runAllTimers();

  return instance;
};

const createGridWithAsyncRendering = (): Promise<DataGridInstance> => createGrid({
  scrolling: { mode: 'virtual', renderAsync: true },
});

const createRemoteStore = (): CustomStore => new CustomStore({
  key: 'id',
  load: ({ skip = 0, take = ROW_COUNT }: LoadOptions) => {
    const result = Deferred();

    // eslint-disable-next-line no-restricted-globals -- delays the load on fake timers
    setTimeout(() => {
      result.resolve({ data: ROWS.slice(skip, skip + take), totalCount: ROW_COUNT });
    }, LOAD_DELAY);

    return result.promise();
  },
});

const createGridWithAsyncTemplates = async (): Promise<GridWithPendingTemplates> => {
  const { template, renderPendingTemplates } = createPendingTemplate();
  const instance = await createGrid({
    columns: ['id', { dataField: 'name', cellTemplate: 'asyncTemplate' }],
    templatesRenderAsynchronously: true,
    integrationOptions: {
      templates: { asyncTemplate: template },
    },
  } as DataGridProperties);
  renderPendingTemplates();

  return { instance, renderPendingTemplates };
};

const clickRow = (instance: DataGridInstance, visibleRowIndex: number): void => {
  triggerPointerDown(instance.getCellElement(visibleRowIndex, 0) as unknown as HTMLElement);
};

const focusFirstCell = (instance: DataGridInstance): void => {
  clickRow(instance, 0);
  jest.runAllTimers();
};

const pressKey = (instance: DataGridInstance, keyName: PageKey): void => {
  triggerKeyDown(instance, keyName, document.activeElement);
  jest.runAllTimers();
};

const pressKeyWithoutRendering = (instance: DataGridInstance, keyName: PageKey): void => {
  triggerKeyDown(instance, keyName, document.activeElement);
  jest.advanceTimersByTime(0);
};

describe('PageUp and PageDown with virtual scrolling (T898324)', () => {
  beforeEach(() => {
    beforeTest();
    scrollTop = 0;
    mockLayout();
  });

  afterEach(() => {
    afterTest();
    jest.restoreAllMocks();
  });

  it.each([true, false])('should focus the top visible row when scrolling.renderAsync is %s', async (renderAsync) => {
    const instance = await createGrid({ scrolling: { mode: 'virtual', renderAsync } });
    focusFirstCell(instance);

    const focusedRowIndexes = (['pageDown', 'pageDown', 'pageUp', 'pageUp'] as const).map((keyName) => {
      pressKey(instance, keyName);

      return getFocusedRowIndex();
    });

    expect(focusedRowIndexes).toEqual([ROWS_PER_PAGE, 2 * ROWS_PER_PAGE, ROWS_PER_PAGE, 0]);
    expect(instance.option('focusedRowIndex')).toBe(0);
    expect(scrollTop).toBe(0);
  });

  it('should move the focused row when scrolling.legacyMode is true and rows are rendered virtually', async () => {
    const instance = await createGrid({
      scrolling: {
        mode: 'virtual', rowRenderingMode: 'virtual', legacyMode: true, renderAsync: true,
      },
    } as DataGridProperties);
    focusFirstCell(instance);

    const focusedRowIndexes = (['pageDown', 'pageDown', 'pageUp', 'pageUp'] as const).map((keyName) => {
      pressKey(instance, keyName);

      return instance.option('focusedRowIndex');
    });

    expect(focusedRowIndexes).toEqual([ROWS_PER_PAGE, 2 * ROWS_PER_PAGE, ROWS_PER_PAGE, 0]);
  });

  it('should focus the top visible row when PageDown is pressed again before the rows are rendered', async () => {
    const instance = await createGridWithAsyncRendering();
    const pressCount = 4;
    focusFirstCell(instance);

    Array.from({ length: pressCount }).forEach(() => {
      pressKeyWithoutRendering(instance, 'pageDown');
    });
    jest.runAllTimers();

    expect(getFocusedRowIndex()).toBe(pressCount * ROWS_PER_PAGE);
  });

  it('should focus the top visible row when the grid is repainted before the rows are rendered', async () => {
    const instance = await createGridWithAsyncRendering();
    const pressCount = 4;
    let renderCount = 0;
    focusFirstCell(instance);
    instance.getView('rowsView').renderCompleted.add(() => {
      renderCount += 1;
    });

    Array.from({ length: pressCount }).forEach(() => {
      pressKeyWithoutRendering(instance, 'pageDown');
    });
    instance.repaint();
    const isRowsRenderPendingAfterRepaint = instance.getView('rowsView').isViewportRowsRenderPending();
    const renderCountBeforeTimeout = renderCount;
    jest.runAllTimers();

    expect(renderCountBeforeTimeout).toBeGreaterThan(0);
    expect(isRowsRenderPendingAfterRepaint).toBe(true);
    expect(getFocusedRowIndex()).toBe(pressCount * ROWS_PER_PAGE);
  });

  it('should not focus the previous row when the grid is repainted before the rows are rendered', async () => {
    const instance = await createGridWithAsyncRendering();
    focusFirstCell(instance);

    pressKeyWithoutRendering(instance, 'pageDown');
    instance.repaint();
    jest.advanceTimersByTime(0);
    const focusedRowIndexAfterRepaint = getFocusedRowIndex();
    jest.runAllTimers();

    expect(focusedRowIndexAfterRepaint).toBeUndefined();
    expect(getFocusedRowIndex()).toBe(ROWS_PER_PAGE);
  });

  it('should focus the top visible row once its rows are loaded from a remote store', async () => {
    const instance = await createGrid({
      keyExpr: undefined,
      dataSource: createRemoteStore(),
      remoteOperations: { paging: true },
    });
    focusFirstCell(instance);
    pressKey(instance, 'pageDown');

    pressKeyWithoutRendering(instance, 'pageDown');
    const isLoadingOnFocusRestore = instance.getController('data').isLoading();
    jest.runAllTimers();

    expect(isLoadingOnFocusRestore).toBe(true);
    expect(getFocusedRowIndex()).toBe(2 * ROWS_PER_PAGE);
  });

  it('should focus the top visible row when PageDown is pressed during custom loading', async () => {
    const instance = await createGrid();
    focusFirstCell(instance);

    instance.beginCustomLoading('');
    pressKey(instance, 'pageDown');

    expect(getFocusedRowIndex()).toBe(ROWS_PER_PAGE);
  });

  it('should focus the top visible row once its rows are loaded from a remote store during custom loading', async () => {
    const instance = await createGrid({
      keyExpr: undefined,
      dataSource: createRemoteStore(),
      remoteOperations: { paging: true },
    });
    focusFirstCell(instance);
    pressKey(instance, 'pageDown');
    instance.beginCustomLoading('');

    pressKeyWithoutRendering(instance, 'pageDown');
    const isDataLoadingOnFocusRestore = instance.getController('dataSource').isLoading();
    jest.runAllTimers();

    expect(isDataLoadingOnFocusRestore).toBe(true);
    expect(getFocusedRowIndex()).toBe(2 * ROWS_PER_PAGE);
  });

  it('should focus the top visible row once its rows have rendered async templates', async () => {
    const { instance, renderPendingTemplates } = await createGridWithAsyncTemplates();
    focusFirstCell(instance);
    pressKey(instance, 'pageDown');
    renderPendingTemplates();

    pressKey(instance, 'pageDown');
    const isWaitingForTemplates = instance.getView('rowsView').isWaitingForRowsLayout();
    renderPendingTemplates();

    expect(isWaitingForTemplates).toBe(true);
    expect(getFocusedRowIndex()).toBe(2 * ROWS_PER_PAGE);
  });

  it('should ignore downArrow pressed before the rows of the new position are rendered', async () => {
    const instance = await createGridWithAsyncRendering();
    focusFirstCell(instance);
    pressKey(instance, 'pageDown');

    pressKeyWithoutRendering(instance, 'pageUp');
    triggerKeyDown(instance, 'downArrow', document.activeElement);
    const focusedRowIndexBeforeRendering = getFocusedRowIndex();
    jest.runAllTimers();

    expect(focusedRowIndexBeforeRendering).toBeUndefined();
    expect(getFocusedRowIndex()).toBe(0);
  });

  it('should not ignore downArrow pressed while the rows of a scroll without PageUp and PageDown are rendering', async () => {
    const instance = await createGridWithAsyncRendering();
    focusFirstCell(instance);

    instance.getScrollable().scrollBy({ top: ROW_HEIGHT });
    const isRowsRenderPending = instance.getView('rowsView').isViewportRowsRenderPending();
    triggerKeyDown(instance, 'downArrow', document.activeElement);

    expect(isRowsRenderPending).toBe(true);
    expect(getFocusedRowIndex()).toBe(1);
  });

  it('should not ignore downArrow pressed after PageDown while the data is reloading when scrolling is standard', async () => {
    const instance = await createGrid({
      keyExpr: undefined,
      dataSource: createRemoteStore(),
      remoteOperations: { paging: true },
      paging: { enabled: false },
      scrolling: { mode: 'standard' },
    });
    focusFirstCell(instance);

    instance.refresh().catch(() => {});
    pressKeyWithoutRendering(instance, 'pageDown');
    const isLoadingOnFocusRestore = instance.getController('data').isLoading();
    triggerKeyDown(instance, 'downArrow', document.activeElement);
    const focusedRowIndexBeforeLoading = getFocusedRowIndex();
    jest.runAllTimers();

    expect(isLoadingOnFocusRestore).toBe(true);
    expect(focusedRowIndexBeforeLoading).toBe(ROWS_PER_PAGE + 1);
    expect(getFocusedRowIndex()).toBe(ROWS_PER_PAGE + 1);
  });

  it('should keep the row focused by downArrow after the next render once the page navigation is completed', async () => {
    const instance = await createGridWithAsyncRendering();
    focusFirstCell(instance);
    pressKey(instance, 'pageDown');
    triggerKeyDown(instance, 'downArrow', document.activeElement);
    jest.runAllTimers();

    instance.repaint();
    jest.runAllTimers();

    expect(getFocusedRowIndex()).toBe(ROWS_PER_PAGE + 1);
  });

  it('should keep the row focused by a click before the rows of the new position are rendered', async () => {
    const instance = await createGridWithAsyncRendering();
    const clickedVisibleRowIndex = 2;
    focusFirstCell(instance);
    pressKey(instance, 'pageDown');

    pressKeyWithoutRendering(instance, 'pageUp');
    clickRow(instance, clickedVisibleRowIndex);
    jest.runAllTimers();

    expect(instance.option('focusedRowIndex')).toBe(ROWS_PER_PAGE + clickedVisibleRowIndex);
  });

  it('should keep the cell focused by the focus method before the rows of the new position are rendered', async () => {
    const instance = await createGridWithAsyncRendering();
    const focusedVisibleRowIndex = 2;
    focusFirstCell(instance);
    pressKey(instance, 'pageDown');

    pressKeyWithoutRendering(instance, 'pageUp');
    instance.focus(instance.getCellElement(focusedVisibleRowIndex, 0) as HTMLElement);
    jest.runAllTimers();

    expect(instance.option('focusedRowIndex')).toBe(ROWS_PER_PAGE + focusedVisibleRowIndex);
  });
});
