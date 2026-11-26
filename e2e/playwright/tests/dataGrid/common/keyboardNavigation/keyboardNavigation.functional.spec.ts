/* eslint-disable no-param-reassign -- customizeColumns changes the columns it gets */
import type { Locator, Page } from '@playwright/test';
import type { GridsEditMode, Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { addFocusableElementBefore } from '../../../../helpers/domUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import { expectClass } from '../../../../models/internal/classMatcher';
import Button from '../../../../models/button';
import DataGrid from '../../../../models/dataGrid';
import type DataCell from '../../../../models/dataGrid/data/cell';
import DataRow from '../../../../models/dataGrid/data/row';
import HeaderFilter from '../../../../models/dataGrid/headers/headerFilter';
import Pagination from '../../../../models/pagination';
import { clickWithOffset } from '../../helpers/clickWithOffset';
import { getFocusedCellChangedArgs, getFocusedEvents, resetFocusedEvents } from '../../helpers/focusedEvents';
import { getData } from '../../helpers/generateDataSourceData';
import { getFirstDataRow } from '../../helpers/getFirstDataRow';
import { typeText } from '../../helpers/typeText';
import { waitForQueuedTimers } from '../../helpers/waitForQueuedTimers';

const GRID_SELECTOR = '#container';
const OTHER_CONTAINER_SELECTOR = '#otherContainer';
const FOCUSABLE_START = '#focusable-start';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const SELECTION_CLASS = 'dx-selection';

// A mouse holds its button down for tens of milliseconds. The grid handles a press partly on a
// timer, and a release before that timer (Playwright's default click) takes another path.
const MOUSE_PRESS_DURATION = 50;
// DevExtreme pairs two clicks within this time into a double click.
const DOUBLE_CLICK_WINDOW = 300;

const generateData = (rowCount: number, columnCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];

  for (let i = 0; i < rowCount; i += 1) {
    const item: Record<string, string> = {};

    for (let j = 0; j < columnCount; j += 1) {
      item[`field${j}`] = `${i}-${j}`;
    }
    items.push(item);
  }

  return items;
};

const createAdaptiveGrid = (page: Page, batchEditing: boolean): Promise<void> => createWidget(page, 'dxDataGrid', {
  keyExpr: 'name',
  dataSource: [
    {
      name: 'Alex', phone: '555555', text: 'aaaaaa', room: 1,
    },
    {
      name: 'Bob', phone: '777777', text: 'bbbbbb', room: 2,
    },
  ],
  ...batchEditing && {
    editing: {
      mode: 'batch',
      allowUpdating: true,
    },
  },
  width: 150,
  columnHidingEnabled: true,
  columns: [
    'name',
    {
      dataField: 'phone',
      hidingPriority: 0,
    }, {
      dataField: 'text',
      hidingPriority: 1,
    },
    'room',
  ],
});

const ADAPTIVE_ROW_GRID_OPTIONS: Properties = {
  columnHidingEnabled: true,
  dataSource: [
    {
      name: 'Alex', c0: 'c0_0', c1: 'c1_0', c2: 'c2_0',
    }, {
      name: 'Ben', c0: 'c0_1', c1: 'c1_2', c2: 'c2_2',
    }, {
      name: 'Dan', c0: 'c0_2', c1: 'c1_3', c2: 'c2_3',
    }, {
      name: 'John', c0: 'c0_3', c1: 'c1_4', c2: 'c2_4',
    },
  ],
  width: 600,
  columnWidth: 200,
};

const createDropDownButtonGridOptions = (): Properties => ({
  dataSource: [
    {
      id: 0, field1: 'test1', field2: 'test2', field3: 'test3',
    },
    {
      id: 0, field1: 'test4', field2: 'test5', field3: 'test6',
    },
  ],
  keyExpr: 'id',
  focusedRowEnabled: true,
  columns: [{
    dataField: 'field1',
    cellTemplate() {
      return $('<div>')
        // @ts-expect-error dx.all.d.ts typings are missing
        .dxDropDownButton({
          text: 'Action',
        });
    },
  }, 'field2', 'field3'],
});

const createEditCellTemplateGrid = (page: Page, mode: GridsEditMode): Promise<void> => createWidget(page, 'dxDataGrid', (editMode) => ({
  width: 800,
  dataSource: [
    {
      id: 0, field1: 'test1', field2: 'test2', field3: 'test3',
    },
  ],
  keyExpr: 'id',
  editing: {
    mode: editMode,
    allowUpdating: true,
  },
  columns: [
    'field1',
    {
      dataField: 'field2',
      editCellTemplate: (cellElement) => {
        $('<input type="button" value="My button" />')
          .addClass('my-button')
          .appendTo(cellElement);

        $('<input type="text"/>')
          .addClass('my-editor')
          .appendTo(cellElement);
      },
    },
    'field3',
  ],
}), GRID_SELECTOR, { arg: mode });

const getOnKeyDownCallCount = (page: Page): Promise<number> => page.evaluate(
  () => (window as any).onKeyDownCallCount,
);

interface FocusEventsCase {
  title: string;
  key: 'End' | 'Control+End';
  rowCount: number;
  columnCount: number;
  options: Properties;
  lastCell: [number, number];
  scrolledToBottom?: boolean;
  scrolledToRight?: boolean;
  events: { name: string; args: Record<string, number> }[];
}

const FOCUS_EVENTS_CASES: FocusEventsCase[] = [
  {
    title: 'Focus events should be called when pressing the End key',
    key: 'End',
    rowCount: 20,
    columnCount: 15,
    options: {},
    lastCell: [0, 14],
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 14, newRowIndex: 0, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedCellChanged', args: { columnIndex: 14, rowIndex: 0 } },
    ],
  },
  {
    title: 'Focus events should be called when pressing the End key when virtual columns are enabled',
    key: 'End',
    rowCount: 20,
    columnCount: 35,
    options: { scrolling: { columnRenderingMode: 'virtual' } },
    lastCell: [0, 34],
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 34, newRowIndex: 0, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedCellChanged', args: { columnIndex: 10, rowIndex: 0 } },
    ],
  },
  {
    title: 'Focus events should be called when pressing the End key when focusedRowEnabled is true',
    key: 'End',
    rowCount: 20,
    columnCount: 15,
    options: { keyExpr: 'field_0', focusedRowEnabled: true },
    lastCell: [0, 14],
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 14, newRowIndex: 0, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedRowChanging', args: { newRowIndex: 0, prevRowIndex: 0 } },
      { name: 'onFocusedCellChanged', args: { columnIndex: 14, rowIndex: 0 } },
    ],
  },
  {
    title: 'Focus events should be called when pressing the End key when virtual columns and focusedRowEnabled are enabled',
    key: 'End',
    rowCount: 20,
    columnCount: 35,
    options: {
      keyExpr: 'field_0',
      focusedRowEnabled: true,
      scrolling: { columnRenderingMode: 'virtual' },
    },
    lastCell: [0, 34],
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 34, newRowIndex: 0, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedRowChanging', args: { newRowIndex: 0, prevRowIndex: 0 } },
      { name: 'onFocusedCellChanged', args: { columnIndex: 10, rowIndex: 0 } },
    ],
  },
  {
    title: 'Focus events should be called when pressing the Ctrl + End key',
    key: 'Control+End',
    rowCount: 20,
    columnCount: 15,
    options: {},
    lastCell: [19, 14],
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 14, newRowIndex: 19, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedCellChanged', args: { columnIndex: 14, rowIndex: 19 } },
    ],
  },
  {
    title: 'Focus events should be called when pressing the Ctrl + End key when virtual columns are enabled',
    key: 'Control+End',
    rowCount: 20,
    columnCount: 35,
    options: { scrolling: { columnRenderingMode: 'virtual' } },
    lastCell: [19, 34],
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 34, newRowIndex: 19, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedCellChanged', args: { columnIndex: 10, rowIndex: 19 } },
    ],
  },
  {
    title: 'Focus events should be called when pressing the Ctrl + End key when virtual scrolling and columns are enabled',
    key: 'Control+End',
    rowCount: 200,
    columnCount: 35,
    options: { scrolling: { mode: 'virtual', columnRenderingMode: 'virtual' } },
    lastCell: [199, 34],
    scrolledToBottom: true,
    scrolledToRight: true,
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 34, newRowIndex: 199, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedCellChanged', args: { columnIndex: 10, rowIndex: 199 } },
    ],
  },
  {
    title: 'Focus events should be called when pressing the Ctrl + End key when rowRenderingMode is \'virtual\'',
    key: 'Control+End',
    rowCount: 200,
    columnCount: 15,
    options: { scrolling: { rowRenderingMode: 'virtual' } },
    lastCell: [19, 14],
    scrolledToBottom: true,
    scrolledToRight: true,
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 14, newRowIndex: 19, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedCellChanged', args: { columnIndex: 14, rowIndex: 19 } },
    ],
  },
  {
    title: 'Focus events should be called when pressing the Ctrl + End key when infinite scrolling is enabled',
    key: 'Control+End',
    rowCount: 200,
    columnCount: 15,
    options: { scrolling: { mode: 'infinite' } },
    lastCell: [19, 14],
    scrolledToRight: true,
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 14, newRowIndex: 19, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedCellChanged', args: { columnIndex: 14, rowIndex: 19 } },
    ],
  },
  {
    title: 'Focus events should be called when pressing the Ctrl + End key when focusedRowEnabled is true',
    key: 'Control+End',
    rowCount: 20,
    columnCount: 15,
    options: { keyExpr: 'field_0', focusedRowEnabled: true },
    lastCell: [19, 14],
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 14, newRowIndex: 19, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedRowChanging', args: { newRowIndex: 19, prevRowIndex: 0 } },
      { name: 'onFocusedRowChanged', args: { rowIndex: 19 } },
      { name: 'onFocusedCellChanged', args: { columnIndex: 14, rowIndex: 19 } },
    ],
  },
  {
    title: 'Focus events should be called when pressing the Ctrl + End key when virtual columns and focusedRowEnabled are enabled',
    key: 'Control+End',
    rowCount: 20,
    columnCount: 35,
    options: {
      keyExpr: 'field_0',
      focusedRowEnabled: true,
      scrolling: { columnRenderingMode: 'virtual' },
    },
    lastCell: [19, 34],
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 34, newRowIndex: 19, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedRowChanging', args: { newRowIndex: 19, prevRowIndex: 0 } },
      { name: 'onFocusedRowChanged', args: { rowIndex: 19 } },
      { name: 'onFocusedCellChanged', args: { columnIndex: 10, rowIndex: 19 } },
    ],
  },
  {
    title: 'Focus events should be called when pressing the Ctrl + End key when virtual columns, virtual scrolling and focusedRowEnabled are enabled',
    key: 'Control+End',
    rowCount: 200,
    columnCount: 35,
    options: {
      keyExpr: 'field_0',
      focusedRowEnabled: true,
      scrolling: { mode: 'virtual', columnRenderingMode: 'virtual' },
    },
    lastCell: [199, 34],
    scrolledToBottom: true,
    scrolledToRight: true,
    events: [
      {
        name: 'onFocusedCellChanging',
        args: {
          newColumnIndex: 34, newRowIndex: 199, prevColumnIndex: 1, prevRowIndex: 0,
        },
      },
      { name: 'onFocusedRowChanging', args: { newRowIndex: 199, prevRowIndex: 0 } },
      { name: 'onFocusedRowChanged', args: { rowIndex: 199 } },
      { name: 'onFocusedCellChanged', args: { columnIndex: 10, rowIndex: 199 } },
    ],
  },
];

const createFocusEventsGrid = (
  page: Page,
  options: Properties,
): Promise<void> => createWidget(page, 'dxDataGrid', (gridOptions) => ({
  ...gridOptions,
  onFocusedCellChanging(e) {
    (window as any).focusedEvents.push({ name: 'onFocusedCellChanging', args: e });
  },
  onFocusedRowChanging(e) {
    (window as any).focusedEvents.push({ name: 'onFocusedRowChanging', args: e });
  },
  onFocusedCellChanged(e) {
    (window as any).focusedEvents.push({ name: 'onFocusedCellChanged', args: e });
  },
  onFocusedRowChanged(e) {
    (window as any).focusedEvents.push({ name: 'onFocusedRowChanged', args: e });
  },
}), GRID_SELECTOR, { arg: options });

test.describe('Keyboard Navigation - common', () => {
  test('Cell should not highlighted after editing another cell when startEditAction: dblClick and editing.mode: batch', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { name: 'Alex', phone: '555555', room: 1 },
        { name: 'Dan', phone: '553355', room: 2 },
      ],
      columns: ['name', 'phone', 'room'],
      editing: {
        mode: 'batch',
        allowUpdating: true,
        startEditAction: 'dblClick',
      },
      // @ts-expect-error private option
      loadingTimeout: null,
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const cell01 = dataGrid.getDataCell(0, 1);
    const cell11 = dataGrid.getDataCell(1, 1);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell01.expectFocusVisible(false);
    await cell11.expectFocusVisible(false);

    await cell11.element.dblclick();

    await cell11.expectFocusVisible();
    await cell01.expectFocusVisible(false);

    await cell01.element.click({ delay: MOUSE_PRESS_DURATION });

    await cell11.expectEditCell(false);
    // The grid shows or hides the clicked cell's focus a moment after the click.
    await waitForQueuedTimers(page);
    await cell01.expectFocusVisible(false);
    await cell11.expectFocusVisible(false);

    // Cell (0, 1) stays in the DOM, so a click within the window still pairs with the click on it,
    // and the double click below would not start editing (T1338452 covers only a removed cell).
    // eslint-disable-next-line no-restricted-syntax -- the double-click window is a time
    await page.waitForTimeout(DOUBLE_CLICK_WINDOW);
    await cell11.element.dblclick();

    await cell11.expectEditCell();
    await cell01.expectFocusVisible(false);

    await cell01.element.click({ delay: MOUSE_PRESS_DURATION });

    await expect(cell01.element).toBeFocused();
    await waitForQueuedTimers(page);
    await cell01.expectFocusVisible(false);
    await cell11.expectFocusVisible(false);
  });

  test('Changing keyboardNavigation options should not invalidate the entire content (T1197829)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).invalidateCounter = 0;
      (window as any).renderTableCounter = 0;
    });

    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [...new Array(5)].map((_, index) => ({ id: index, text: `item ${index}` })),
      keyExpr: 'id',
      columns: [
        { dataField: 'id' },
        { dataField: 'text' },
      ],
      focusedRowEnabled: true,
      keyboardNavigation: {
        editOnKeyPress: true,
        enterKeyAction: 'startEdit',
        enterKeyDirection: 'column',
      },
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      onFocusedRowChanging(e) {
        if ((e.newRowIndex + 1) % 2 === 0) {
          e.component.option('keyboardNavigation.enterKeyAction', 'moveFocus');
        } else {
          e.component.option('keyboardNavigation.enterKeyAction', 'startEdit');
        }
      },
      onInitialized(e) {
        const dataGrid: any = e.component;
        const rowsView = dataGrid.getView('rowsView');
        // eslint-disable-next-line no-underscore-dangle
        const defaultInvalidate = rowsView._invalidate;
        // eslint-disable-next-line no-underscore-dangle
        rowsView._invalidate = (...args) => {
          (window as any).invalidateCounter += 1;
          return defaultInvalidate.apply(rowsView, args);
        };

        // eslint-disable-next-line no-underscore-dangle
        const defaultRenderTable = rowsView._renderTable;
        // eslint-disable-next-line no-underscore-dangle
        rowsView._renderTable = (...args) => {
          (window as any).renderTableCounter += 1;
          return defaultRenderTable.apply(rowsView, args);
        };
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const getInvalidateCount = (): Promise<number> => page.evaluate(
      () => (window as any).invalidateCounter,
    );
    const getRenderTableCount = (): Promise<number> => page.evaluate(
      () => (window as any).renderTableCounter,
    );

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect.poll(getInvalidateCount).toBe(0);
    await expect.poll(getRenderTableCount).toBe(2);

    await dataGrid.getDataCell(1, 1).element.click();
    await dataGrid.getDataCell(1, 1).expectFocusVisible();
    await dataGrid.getDataCell(1, 1).expectEditCell();
    // The editor gets the focus a moment after the cell starts editing: a key before it misses.
    await expect(dataGrid.getDataCell(1, 1).getEditor().element).toBeFocused();
    await page.keyboard.press('Enter');
    await dataGrid.getDataCell(2, 1).expectFocusVisible();
    await dataGrid.getDataCell(2, 1).expectEditCell(false);
    await page.keyboard.press('Enter');
    await dataGrid.getDataCell(2, 1).expectEditCell();
    await expect(dataGrid.getDataCell(2, 1).getEditor().element).toBeFocused();
    await page.keyboard.press('Enter');
    await dataGrid.getDataCell(3, 1).expectFocusVisible();
    await dataGrid.getDataCell(3, 1).expectEditCell(false);
    await page.keyboard.press('Enter');
    await dataGrid.getDataCell(4, 1).expectFocusVisible();
    await dataGrid.getDataCell(4, 1).expectEditCell(false);
    await page.keyboard.press('Enter');
    await dataGrid.getDataCell(4, 1).expectEditCell();

    await dataGrid.getDataCell(1, 1).element.click();
    await dataGrid.getDataCell(1, 1).expectFocusVisible();
    await dataGrid.getDataCell(1, 1).expectEditCell();
    await expect(dataGrid.getDataCell(1, 1).getEditor().element).toBeFocused();
    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(2, 0).expectFocusVisible();
    await dataGrid.getDataCell(2, 0).expectEditCell();

    await expect.poll(getInvalidateCount).toBe(0);
    await expect.poll(getRenderTableCount).toBe(9);
  });

  test('Navigation via the Tab key should work when cellRender/cellComponent is used (T1207684)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(2)].map((_, index) => ({ id: index, text: `item ${index}` })),
      keyExpr: 'id',
      columns: [
        { dataField: 'id' },
        { dataField: 'text', allowSorting: false, cellTemplate: '#test' },
      ],
      // @ts-expect-error private option
      templatesRenderAsynchronously: true,
    });

    await page.evaluate(() => {
      const dataGrid = ($('#container') as any).dxDataGrid('instance');

      // eslint-disable-next-line no-underscore-dangle
      dataGrid.getView('rowsView')._templatesCache = {};

      // eslint-disable-next-line no-underscore-dangle
      dataGrid._getTemplate = () => ({
        render(options) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises -- it only resolves
          Promise.resolve().then(() => options.deferred?.resolve());
        },
      });

      dataGrid.repaint();
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).element.click();
    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(0, 0).expectFocusVisible();
  });

  test('Next cell should be focused immediately on a single Enter key press if showEditorAlways is enabled in cell mode (T1196539)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { name: 'Alex', phone: '555555', room: 1 },
        { name: 'Dan', phone: '553355', room: 2 },
        { name: 'Joe', phone: '335533', room: 3 },
      ],
      columns: [{
        dataField: 'name',
        showEditorAlways: true,
      }, 'phone', 'room'],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        selectTextOnEditStart: true,
      },
      keyboardNavigation: {
        enterKeyAction: 'startEdit',
        enterKeyDirection: 'column',
      },
      repaintChangesOnly: true,
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await typeText(dataGrid.getDataCell(0, 0).getEditor().element, 'test');
    await page.keyboard.press('Enter');
    await dataGrid.getDataCell(1, 0).expectFocusVisible();

    await page.keyboard.press('Enter');

    await testScreenshot(page, 'cell-focus-showEditorAlways-T1196539.png', { element: dataGrid.element });

    await page.keyboard.press('Enter');
    await dataGrid.getDataCell(2, 0).expectFocusVisible();
  });

  test('Cell should highlighted after editing another cell when startEditAction is "dblClick" and editing mode is "cell"', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { name: 'Alex', phone: '555555', room: 1 },
        { name: 'Dan', phone: '553355', room: 2 },
      ],
      columns: ['name', 'phone', 'room'],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        startEditAction: 'dblClick',
      },
      onFocusedCellChanging: (e) => { e.isHighlighted = true; },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const cell01 = dataGrid.getDataCell(0, 1);
    const cell11 = dataGrid.getDataCell(1, 1);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await cell01.expectFocusVisible(false);
    await cell11.expectFocusVisible(false);

    await cell11.element.dblclick();
    await cell11.expectFocusVisible();
    await cell01.expectFocusVisible(false);

    await cell01.element.click();
    await cell01.expectFocusVisible();
    await cell11.expectFocusVisible(false);
    await cell11.expectEditCell(false);

    await cell11.element.dblclick();
    await cell11.expectFocusVisible();
    await cell01.expectFocusVisible(false);

    await cell01.element.click();
    await expect(cell01.element).toBeFocused();
    await cell01.expectFocusVisible();
    await cell11.expectFocusVisible(false);
  });

  test('Cell should be focused after Enter key press if enterKeyDirection is "none" and enterKeyAction is "moveFocus"', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 200,
      width: 200,
      dataSource: [
        { id: 0 },
        { id: 1 },
      ],
      editing: {
        mode: 'batch',
        allowUpdating: true,
        allowDeleting: true,
      },
      keyboardNavigation: {
        enterKeyAction: 'moveFocus',
        enterKeyDirection: 'none',
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const dataCell = dataGrid.getDataCell(0, 0).element;
    const commandCell = dataGrid.getDataCell(0, 1).element;

    await dataCell.click();
    await page.keyboard.press('Escape');
    await expect(dataCell).toBeFocused();
    await page.keyboard.press('Enter');
    // Where Enter moves the focus, it can do so a moment later: check once that has passed.
    await waitForQueuedTimers(page);
    await expect(dataCell).toBeFocused();

    await page.keyboard.press('Enter');
    await waitForQueuedTimers(page);
    await expect(dataCell).toBeFocused();

    await page.keyboard.press('Tab');
    // The Tab focuses the command cell and, a moment later, its link: Enter is for the link.
    await expect(dataGrid.getDataRow(0).getCommandCell(1).getDeleteButton()).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(commandCell).toBeFocused();
    await dataGrid.getDataRow(0).expectRemoved();
  });

  test('TextArea should be focused on editing start', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { id: 0, name: 'Alex' },
        { id: 1, name: 'Bob' },
      ],
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: [
        {
          dataField: 'name',
          editCellTemplate: (cell): any => $(cell).append($('<textarea class="text-area-1" />')),
        },
        {
          dataField: 'phone',
          editCellTemplate: (cell): any => $(cell).append($('<textarea class="text-area-2" />')),
        },
        {
          dataField: 'room',
          editCellTemplate: (cell): any => $(cell).append($('<textarea />')),
        },
      ],
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const dataCell = dataGrid.getDataCell(1, 0);
    const textArea = dataCell.element.locator('.text-area-1');

    await dataGrid.getDataRow(1).getCommandCell(3).getEditButton().click();
    await dataCell.expectEditCell();
    await expect(textArea).toBeAttached();
    await expect(textArea).toBeFocused();
  });

  test('Navigation through views using Tab, Shift+Tab', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 300,
      dataSource: [
        { name: 'Alex', c0: 'c0_0' },
        { name: 'Ben', c0: 'c0_1' },
        { name: 'Dan', c0: 'c0_2' },
        { name: 'John', c0: 'c0_3' },
      ],
      keyExpr: 'name',
      editing: {
        allowUpdating: true,
        allowDeleting: true,
        selectTextOnEditStart: true,
        useIcons: true,
      },
      headerFilter: { visible: true },
      filterPanel: { visible: true },
      filterRow: { visible: true },
      pager: {
        allowedPageSizes: [1, 2],
        showPageSizeSelector: true,
        showNavigationButtons: true,
      },
      paging: {
        pageSize: 2,
      },
      focusedRowEnabled: true,
      selection: {
        mode: 'multiple',
        showCheckBoxesMode: 'always',
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);
    const filterRow = headers.getFilterRow();
    const filterPanel = dataGrid.getFilterPanel();
    const pager = dataGrid.getPager();
    const dataRow0 = dataGrid.getDataRow(0);
    const dataRow1 = dataGrid.getDataRow(1);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');
    await expect(headerRow.getCommandCell(0).getSelectCheckBox()).toBeFocused();
    await headers.expectFocusedState();
    await expect(headerRow.getCommandCell(0).element).not.toBeFocused();

    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(1).element).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(1).getFilterIcon()).toBeFocused();
    await headers.expectFocusedState();

    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(2).element).toBeFocused();
    await headers.expectFocusedState();
    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(2).getFilterIcon()).toBeFocused();
    await headers.expectFocusedState();

    await page.keyboard.press('Tab');
    await expect(filterRow.getFilterCell(1).getSearchIcon().element).toBeFocused();
    await headers.expectFocusedState();
    await filterRow.getFilterCell(1).getSearchIcon().expectFocusedState();

    await page.keyboard.press('Tab');
    await expect(filterRow.getFilterCell(1).getEditorInput().element).toBeFocused();
    await headers.expectFocusedState();

    await page.keyboard.press('Tab');
    await expect(filterRow.getFilterCell(2).getSearchIcon().element).toBeFocused();
    await headers.expectFocusedState();
    await filterRow.getFilterCell(2).getSearchIcon().expectFocusedState();

    await page.keyboard.press('Tab');
    await expect(filterRow.getFilterCell(2).getEditorInput().element).toBeFocused();
    await headers.expectFocusedState();

    await page.keyboard.press('Tab');
    await expect(dataRow0.getCommandCell(0).getSelectCheckBox()).toBeFocused();
    await expect(dataRow0.getCommandCell(0).element).not.toBeFocused();
    await dataRow0.getCommandCell(0).expectFocusVisible();

    await page.keyboard.press('Tab');
    await expect(dataRow0.getDataCell(1).element).toBeFocused();
    await dataRow0.getDataCell(1).expectFocusVisible();

    await page.keyboard.press('Tab');
    await expect(dataRow0.getDataCell(2).element).toBeFocused();
    await dataRow0.getDataCell(2).expectFocusVisible();

    await page.keyboard.press('Tab');
    await expect(dataRow0.getCommandCell(3).getButton(0)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataRow0.getCommandCell(3).getButton(1)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataRow1.getCommandCell(0).getSelectCheckBox()).toBeFocused();
    await expect(dataRow1.getCommandCell(0).element).not.toBeFocused();
    await dataRow1.getCommandCell(0).expectFocusVisible();

    await page.keyboard.press('Tab');
    await expect(dataRow1.getDataCell(1).element).toBeFocused();
    await dataRow1.getDataCell(1).expectFocusVisible();

    await page.keyboard.press('Tab');
    await expect(dataRow1.getDataCell(2).element).toBeFocused();
    await dataRow1.getDataCell(2).expectFocusVisible();

    await page.keyboard.press('Tab');
    await expect(dataRow1.getCommandCell(3).getButton(0)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataRow1.getCommandCell(3).getButton(1)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(filterPanel.getIconFilter().element).toBeFocused();
    await filterPanel.expectFocusedState();

    await page.keyboard.press('Tab');
    await expect(filterPanel.getFilterText().element).toBeFocused();
    await filterPanel.expectFocusedState();

    await page.keyboard.press('Tab');
    await expect(pager.getPageSize(0)).toBeFocused();
    await pager.expectState('focused');

    await page.keyboard.press('Tab');
    await expect(pager.getPageSize(1)).toBeFocused();
    await pager.expectState('focused');

    await page.keyboard.press('Tab');
    await expect(pager.getNavPage('1')).toBeFocused();
    await pager.expectState('focused');
    await expect(pager.getPrevNavButton()).not.toBeFocused();

    await page.keyboard.press('Tab');
    await expect(pager.getNavPage('2')).toBeFocused();
    await pager.expectState('focused');

    await page.keyboard.press('Tab');
    await expect(pager.getNextNavButton()).toBeFocused();
    await pager.expectState('focused');

    await page.keyboard.press('Tab');

    await page.keyboard.press('Shift+Tab');
    await expect(pager.getNextNavButton()).toBeFocused();
    await pager.expectState('focused');

    await page.keyboard.press('Shift+Tab');
    await expect(pager.getNavPage('2')).toBeFocused();
    await pager.expectState('focused');

    await page.keyboard.press('Shift+Tab');
    await expect(pager.getNavPage('1')).toBeFocused();
    await pager.expectState('focused');

    await page.keyboard.press('Shift+Tab');
    await expect(pager.getPageSize(1)).toBeFocused();
    await pager.expectState('focused');
    await expect(pager.getPrevNavButton()).not.toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(pager.getPageSize(0)).toBeFocused();
    await pager.expectState('focused');

    await page.keyboard.press('Shift+Tab');
    await expect(filterPanel.getFilterText().element).toBeFocused();
    await filterPanel.expectFocusedState();

    await page.keyboard.press('Shift+Tab');
    await expect(filterPanel.getIconFilter().element).toBeFocused();
    await filterPanel.expectFocusedState();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow1.getCommandCell(3).getButton(1)).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow1.getCommandCell(3).getButton(0)).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow1.getDataCell(2).element).toBeFocused();
    await dataRow1.getDataCell(2).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow1.getDataCell(1).element).toBeFocused();
    await dataRow1.getDataCell(1).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow1.getCommandCell(0).getSelectCheckBox()).toBeFocused();
    await expect(dataRow1.getCommandCell(0).element).not.toBeFocused();
    await dataRow1.getCommandCell(0).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow0.getCommandCell(3).getButton(1)).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow0.getCommandCell(3).getButton(0)).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(dataGrid.getDataCell(0, 2).element).toBeFocused();
    await dataGrid.getDataCell(0, 2).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(dataGrid.getDataCell(0, 1).element).toBeFocused();
    await dataGrid.getDataCell(0, 1).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow0.getCommandCell(0).getSelectCheckBox()).toBeFocused();
    await expect(dataRow0.getCommandCell(0).element).not.toBeFocused();
    await dataRow0.getCommandCell(0).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow0.getCommandCell(0).element).toBeFocused();
    await expect(dataRow0.getCommandCell(0).getSelectCheckBox()).not.toBeFocused();
    await dataRow0.getCommandCell(0).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(filterRow.getFilterCell(2).getEditorInput().element).toBeFocused();
    await headers.expectFocusedState();

    await page.keyboard.press('Shift+Tab');
    await expect(filterRow.getFilterCell(2).getSearchIcon().element).toBeFocused();
    await headers.expectFocusedState();
    await filterRow.getFilterCell(2).getSearchIcon().expectFocusedState();

    await page.keyboard.press('Shift+Tab');
    await expect(filterRow.getFilterCell(1).getEditorInput().element).toBeFocused();
    await headers.expectFocusedState();

    await page.keyboard.press('Shift+Tab');
    await expect(filterRow.getFilterCell(1).getSearchIcon().element).toBeFocused();
    await headers.expectFocusedState();
    await filterRow.getFilterCell(1).getSearchIcon().expectFocusedState();

    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getHeaderCell(2).getFilterIcon()).toBeFocused();
    await headers.expectFocusedState();
    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getHeaderCell(2).element).toBeFocused();
    await headers.expectFocusedState();

    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getHeaderCell(1).getFilterIcon()).toBeFocused();
    await headers.expectFocusedState();
    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getHeaderCell(1).element).toBeFocused();
    await headers.expectFocusedState();

    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getCommandCell(0).getSelectCheckBox()).toBeFocused();
    await headers.expectFocusedState();
    await expect(headerRow.getCommandCell(0).element).not.toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator(FOCUSABLE_START)).toBeFocused();
  });

  test('Select - The first command cell should be focused using Tab (T884646)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 300,
      dataSource: [
        { name: 'Alex' },
      ],
      keyExpr: 'name',
      selection: {
        mode: 'multiple',
        showCheckBoxesMode: 'always',
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const dataRow = dataGrid.getDataRow(0);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');
    await expect(headerRow.getCommandCell(0).getSelectCheckBox()).toBeFocused();
    await expect(headerRow.getCommandCell(0).element).not.toBeFocused();

    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(1).element).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataRow.getCommandCell(0).element).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible();
    await expect(dataRow.getCommandCell(0).getSelectCheckBox()).not.toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dataRow.getCommandCell(0).getSelectCheckBox()).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible();
    await expect(dataRow.getCommandCell(0).element).not.toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataRow.getDataCell(1).element).toBeFocused();
    await dataRow.getDataCell(1).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow.getCommandCell(0).getSelectCheckBox()).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible();
    await expect(dataRow.getCommandCell(0).element).not.toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(dataRow.getCommandCell(0).element).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible();
    await expect(dataRow.getCommandCell(0).getSelectCheckBox()).not.toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getHeaderCell(1).element).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getCommandCell(0).getSelectCheckBox()).toBeFocused();
    await expect(headerRow.getCommandCell(0).element).not.toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator(FOCUSABLE_START)).toBeFocused();
  });

  test('Edit - The first command cell should be focused using Tab (T884646)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 300,
      dataSource: [
        { name: 'Alex' },
      ],
      columns: [
        { type: 'buttons' },
        'name',
      ],
      keyExpr: 'name',
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const dataRow = dataGrid.getDataRow(0);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(0).element).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(1).element).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataRow.getCommandCell(0).element).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible();
    await expect(dataRow.getCommandCell(0).getButton(0)).not.toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dataRow.getCommandCell(0).getButton(0)).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible(false);
    await expect(dataRow.getCommandCell(0).element).not.toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataRow.getDataCell(1).element).toBeFocused();
    await dataRow.getDataCell(1).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow.getCommandCell(0).getButton(0)).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible(false);
    await expect(dataRow.getCommandCell(0).element).not.toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(dataRow.getCommandCell(0).element).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible();
    await expect(dataRow.getCommandCell(0).getButton(0)).not.toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getHeaderCell(1).element).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getHeaderCell(0).element).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator(FOCUSABLE_START)).toBeFocused();
  });

  test('Detail - The first command cell should be focused using Tab (T884646)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 300,
      dataSource: [
        { name: 'Alex' },
      ],
      keyExpr: 'name',
      masterDetail: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const dataRow = dataGrid.getDataRow(0);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(1).element).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataRow.getCommandCell(0).element).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible();

    await page.keyboard.press('Tab');
    await expect(dataRow.getDataCell(1).element).toBeFocused();
    await dataRow.getDataCell(1).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow.getCommandCell(0).element).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getHeaderCell(1).element).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator(FOCUSABLE_START)).toBeFocused();
  });

  test('Adaptive - Hidden cells should not be focused using Tab (T887014)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'name',
      dataSource: [
        { name: 'Alex', phone: '5555555555', room: 1 },
      ],
      width: 150,
      columnHidingEnabled: true,
      columns: [
        {
          type: 'adaptive',
        },
        'name',
        {
          dataField: 'phone',
          hidingPriority: 0,
        },
        'room',
      ],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const dataRow = dataGrid.getDataRow(0);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(0).element).toBeFocused();
    await expect(headerRow.getHeaderCell(0).element).toHaveAttribute('tabindex');
    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(1).element).toBeFocused();
    await expect(headerRow.getHeaderCell(1).element).toHaveAttribute('tabindex');
    await headerRow.getHeaderCell(2).expectHidden();
    await expect(headerRow.getHeaderCell(2).element).not.toHaveAttribute('tabindex');

    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(3).element).toBeFocused();
    await expect(headerRow.getHeaderCell(3).element).toHaveAttribute('tabindex');

    await page.keyboard.press('Tab');
    await expect(dataRow.getCommandCell(0).element).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible();

    await page.keyboard.press('Tab');
    await expect(dataRow.getDataCell(1).element).toBeFocused();
    await dataRow.getDataCell(1).expectFocusVisible();
    await dataRow.getDataCell(2).expectHidden();
    await expect(dataRow.getDataCell(2).element).not.toHaveAttribute('tabindex');

    await page.keyboard.press('Tab');
    await expect(dataRow.getDataCell(3).element).toBeFocused();
    await dataRow.getDataCell(3).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow.getDataCell(1).element).toBeFocused();
    await dataRow.getDataCell(1).expectFocusVisible();
    await dataRow.getDataCell(2).expectHidden();
    await expect(dataRow.getDataCell(2).element).not.toHaveAttribute('tabindex');

    await page.keyboard.press('Shift+Tab');
    await expect(dataRow.getCommandCell(0).element).toBeFocused();
    await dataRow.getCommandCell(0).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getHeaderCell(3).element).toBeFocused();
    await expect(headerRow.getHeaderCell(3).element).toHaveAttribute('tabindex');

    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getHeaderCell(1).element).toBeFocused();
    await expect(headerRow.getHeaderCell(1).element).toHaveAttribute('tabindex');
    await headerRow.getHeaderCell(2).expectHidden();
    await expect(headerRow.getHeaderCell(2).element).not.toHaveAttribute('tabindex');
    await page.keyboard.press('Shift+Tab');
    await expect(headerRow.getHeaderCell(0).element).toBeFocused();
    await expect(headerRow.getHeaderCell(0).element).toHaveAttribute('tabindex');

    await page.keyboard.press('Shift+Tab');
    await expect(page.locator(FOCUSABLE_START)).toBeFocused();
  });

  test('Select views by Ctrl+Up, Ctrl+Down keys', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 300,
      dataSource: [
        { name: 'Alex', c0: 'c0_0' },
        { name: 'Ben', c0: 'c0_1' },
        { name: 'Dan', c0: 'c0_2' },
        { name: 'John', c0: 'c0_3' },
      ],
      keyExpr: 'name',
      editing: {
        allowUpdating: true,
        allowDeleting: true,
        selectTextOnEditStart: true,
        useIcons: true,
      },
      headerFilter: { visible: true },
      filterPanel: { visible: true },
      filterRow: { visible: true },
      pager: {
        allowedPageSizes: [1, 2],
        showPageSizeSelector: true,
        showNavigationButtons: true,
      },
      paging: {
        pageSize: 2,
      },
      focusedRowEnabled: true,
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const headers = dataGrid.getHeaders();
    const headerRow = headers.getHeaderRow(0);
    const filterRow = headers.getFilterRow();
    const filterPanel = dataGrid.getFilterPanel();
    const pager = dataGrid.getPager();

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(0).element).toBeFocused();
    await headers.expectFocusedState();

    await page.keyboard.press('Control+ArrowDown');
    await expect(filterRow.getFilterCell(0).getEditorInput().element).toBeFocused();
    await headers.expectFocusedState();

    await page.keyboard.press('Control+ArrowDown');
    await dataGrid.getDataRow(0).expectFocusedRow();

    await page.keyboard.press('Control+ArrowDown');
    await expect(filterPanel.getIconFilter().element).toBeFocused();
    await filterPanel.expectFocusedState();

    await page.keyboard.press('Control+ArrowDown');
    await pager.expectState('focused');
    await expect(pager.getPageSize(0)).toBeFocused();

    await page.keyboard.press('Control+ArrowUp');
    await expect(filterPanel.getIconFilter().element).toBeFocused();
    await filterPanel.expectFocusedState();

    await page.keyboard.press('Control+ArrowUp');
    // Row 0 stays the focused row: the focus coming back to it shows the key has worked.
    await expect(dataGrid.getDataRow(0).element).toBeFocused();
    await dataGrid.getDataRow(0).expectFocusedRow();

    await page.keyboard.press('Control+ArrowUp');
    await expect(filterRow.getFilterCell(0).getEditorInput().element).toBeFocused();
    await headers.expectFocusedState();

    await page.keyboard.press('Control+ArrowUp');
    await expect(headerRow.getHeaderCell(0).element).toBeFocused();
    await headers.expectFocusedState();
  });

  test('DataGrid - Scroll bars should not appear when updating edge cell focus overlay position (T812494)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 150,
      width: 200,
      columnAutoWidth: true,
      dataSource: [
        { c0: 'c0_0', c1: 'c1_0' },
        { c0: 'c0_1', c1: 'c1_1' },
      ],
      scrolling: {
        useNative: true,
      },
      columns: [
        'c0',
        { dataField: 'c1', width: 50 },
      ],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await expect(dataGrid.getDataCell(0, 0).element).toBeFocused();
    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(0, 1).expectFocusVisible();
    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(1, 0).expectFocusVisible();
    await expect.poll(() => dataGrid.getScrollbarWidth(false)).toBe(0);
  });

  test('Tab key on the focused group row should be handled by default behavior (T833621)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: [
        { id: 0, c0: 'Test00 resize', c1: 'Test10' },
        { id: 1, c0: 'Test01 resize', c1: 'Test11' },
        { id: 1, c0: 'Test01 resize', c1: 'Test12' },
        { id: 1, c0: 'Test01 resize', c1: 'Test10' },
        { id: 1, c0: 'Test01 resize', c1: 'Test11' },
        { id: 1, c0: 'Test01 resize', c1: 'Test12' },
        { id: 1, c0: 'Test01 resize', c1: 'Test10' },
      ],
      columns: [
        'id',
        'c0',
        {
          dataField: 'c1',
          groupIndex: 0,
          showWhenGrouped: true,
        },
      ],
      paging: {
        pageSize: 2,
      },
      grouping: {
        autoExpandAll: false,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const groupRow = dataGrid.getGroupRow(1);
    const pagerPage0 = dataGrid.getPager().getNavPage('1');

    await groupRow.element.click();
    await groupRow.expectFocusHidden();
    await page.keyboard.press('Tab');
    await expect(pagerPage0).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(groupRow.element).toBeFocused();
    await groupRow.expectFocusHidden(false);
    await expectClass(groupRow.element, FOCUSED_STATE_CLASS, false);
    await page.keyboard.press('Tab');
    await expect(pagerPage0).toBeFocused();
    await groupRow.expectFocusHidden(false);
  });

  test('DataGrid - Focus should move back to headers on Shift+Tab when multiple grouping is applied (T1325775)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      showBorders: true,
      keyExpr: 'id',
      dataSource: [
        {
          id: 1,
          state: 'Arkansas',
          city: 'Bentonville',
          company: 'Super Mart of the West',
        },
        {
          id: 2,
          state: 'Arkansas',
          city: 'Bentonville',
          company: 'Electronics Depot',
        },
        {
          id: 3,
          state: 'California',
          city: 'Cupertino',
          company: 'Braeburn',
        },
      ],
      grouping: {
        autoExpandAll: true,
      },
      columns: [
        {
          dataField: 'state',
          groupIndex: 0,
        },
        {
          dataField: 'city',
          groupIndex: 1,
        },
        'company',
      ],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const headerCell = headerRow.getHeaderCell(2);
    const stateGroupRow = dataGrid.getGroupRow(0);
    const cityGroupRow = dataGrid.getGroupRow(1);
    const firstDataCell = dataGrid.getDataCell(2, 2);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');
    await headerCell.expectFocused();

    await page.keyboard.press('Tab');
    await stateGroupRow.expectFocusVisible();

    await page.keyboard.press('Tab');
    await cityGroupRow.expectFocusVisible();

    await page.keyboard.press('Tab');
    await firstDataCell.expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await cityGroupRow.expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await stateGroupRow.expectFocusVisible();

    await page.keyboard.press('Shift+Tab');
    await headerCell.expectFocused();
  });

  test('Row should not be focused by "focusedRowIndex" after change "pageIndex" by pager if "autoNavigateToFocused" row is false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0, c0: 'c0_0' },
        { id: 1, c0: 'c0_1' },
        { id: 2, c0: 'c0_2' },
        { id: 3, c0: 'c0_3' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      autoNavigateToFocusedRow: false,
      focusedRowIndex: 1,
      paging: {
        pageSize: 2,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const pager = dataGrid.getPager();

    await dataGrid.getDataRow(1).expectFocusedRow();
    await pager.getNavPage('2').click();
    await expectClass(pager.getNavPage('2'), SELECTION_CLASS);
    await expect(dataGrid.getFocusedRow().element).toHaveCount(0);
  });

  test('Cell should be highlighted after editing another cell when startEditAction is \'dblClick\' and \'batch\' edit mode if isHighlighted is set to true in onFocusedCellChanging (T836391)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { name: 'Alex', phone: '555555', room: 1 },
        { name: 'Dan', phone: '553355', room: 2 },
      ],
      columns: ['name', 'phone', 'room'],
      editing: {
        mode: 'batch',
        allowUpdating: true,
        startEditAction: 'dblClick',
      },
      onFocusedCellChanging: (e) => { e.isHighlighted = true; },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const cell0 = dataGrid.getDataCell(0, 0);
    const cell1 = dataGrid.getDataCell(0, 1);

    await cell0.expectFocusVisible(false);
    await cell1.expectFocusVisible(false);

    await cell0.element.dblclick();
    await cell0.expectFocusVisible();
    await cell0.expectEditCell();

    await cell1.element.click();
    await cell1.expectFocusVisible();
    await cell0.expectFocusVisible(false);
    await cell0.expectEditCell(false);
  });

  test('Previous navigation elements should not have "tabindex" if navigation action is "click" (T870120)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 4, c0: 'c0_4', c1: 'c1_4' },
        { id: 5, c0: 'c0_5', c1: 'c1_5' },
        { id: 6, c0: 'c0_6', c1: 'c1_6' },
      ],
      tabIndex: 111,
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 3; colIndex += 1) {
        const cell = dataGrid.getDataCell(rowIndex, colIndex);

        await cell.element.click();
        await expect(cell.element, `cell[${rowIndex}, ${colIndex}] is focused`).toBeFocused();
        await expect(cell.element, `cell[${rowIndex}, ${colIndex}] has tabindex`).toHaveAttribute('tabindex', '111');
      }
    }
  });

  test('Previous navigation elements should not have "tabindex" if navigation action is "tab" (T870120)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 4, c0: 'c0_4', c1: 'c1_4' },
        { id: 5, c0: 'c0_5', c1: 'c1_5' },
        { id: 6, c0: 'c0_6', c1: 'c1_6' },
      ],
      tabIndex: 111,
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();

    for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 3; colIndex += 1) {
        const cell = dataGrid.getDataCell(rowIndex, colIndex);

        await expect(cell.element, `cell[${rowIndex}, ${colIndex}] is focused`).toBeFocused();
        await expect(cell.element, `cell[${rowIndex}, ${colIndex}] has tabindex`).toHaveAttribute('tabindex', '111');
        await page.keyboard.press('Tab');
      }
    }
  });

  test('The first group row should be expanded when the Enter key is pressed (T869799)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { name: 'Alex', phone: '555555' },
      ],
      columns: [{
        dataField: 'name',
        groupIndex: 0,
      }, 'phone'],
      grouping: {
        autoExpandAll: false,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const firstGroupRow = dataGrid.getGroupRow(0);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await expect(firstGroupRow.element).toBeFocused();
    await firstGroupRow.expectFocusVisible();
    await firstGroupRow.expectExpanded(false);

    await page.keyboard.press('Enter');

    await firstGroupRow.expectExpanded();
    await expect(firstGroupRow.element).toBeFocused();
    await firstGroupRow.expectFocusVisible();
  });

  test('The expand cell should not lose focus on expanding a master row (T892203)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      showBorders: true,
      keyExpr: 'id',
      dataSource: [{ id: 1 }, { id: 2 }],
      masterDetail: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const headerCell01 = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
    const dataRow0 = dataGrid.getDataRow(0);
    const cell00 = dataRow0.getCommandCell(0);
    const cell01 = dataRow0.getDataCell(1);
    const dataRow1 = dataGrid.getDataRow(1);
    const cell10 = dataRow1.getCommandCell(0);
    const cell11 = dataRow1.getDataCell(1);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');

    await expect(headerCell01.element).toBeFocused();

    await page.keyboard.press('Tab');

    await expect(cell00.element).toBeFocused();
    await cell00.expectFocusVisible();

    await page.keyboard.press('Enter');

    await dataRow0.expectExpanded();
    await expect(cell00.element).toBeFocused();
    await cell00.expectFocusVisible();

    await page.keyboard.press('Tab');

    await expect(cell01.element).toBeFocused();
    await cell01.expectFocusVisible();

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    await expect(cell10.element).toBeFocused();
    await cell10.expectFocusVisible();

    await page.keyboard.press('Tab');

    await expect(cell11.element).toBeFocused();
    await cell11.expectFocusVisible();

    await page.keyboard.press('Shift+Tab');

    await expect(cell10.element).toBeFocused();
    await cell10.expectFocusVisible();

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');

    await expect(cell00.element).toBeFocused();
    await cell00.expectFocusVisible();

    await page.keyboard.press('Enter');

    await dataRow0.expectExpanded(false);
    await expect(cell00.element).toBeFocused();
    await cell00.expectFocusVisible();

    await page.keyboard.press('Shift+Tab');

    await expect(headerCell01.element).toBeFocused();

    await page.keyboard.press('Shift+Tab');

    await expect(page.locator(FOCUSABLE_START)).toBeFocused();
  });

  ['Batch', 'Cell'].forEach((editMode) => {
    test(`${editMode} mode - Cells in a new row should be updated on Tab (T898356)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [],
        editing: {
          mode: editMode.toLowerCase() as GridsEditMode,
          allowAdding: true,
        },
        columns: ['a', 'b'],
      });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
      const cell00 = dataGrid.getDataCell(0, 0);
      const editor00 = cell00.getEditor();
      const cell01 = dataGrid.getDataCell(0, 1);
      const editor01 = cell01.getEditor();

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await addRowButton.click();

      await cell00.expectFocusVisible();
      await expect(editor00.element).toBeAttached();
      await expect(editor00.element).toBeFocused();

      await typeText(editor00.element, '1');
      await page.keyboard.press('Tab');

      await cell01.expectFocusVisible();
      await cell00.expectFocusVisible(false);
      await expect.poll(() => dataGrid.apiGetCellValue(0, 0)).toBe('1');
      await expect(editor01.element).toBeAttached();
      await expect(editor01.element).toBeFocused();

      await typeText(editor01.element, '2');
      await page.keyboard.press('Tab');

      await cell01.expectFocusVisible(false);
      await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBe('2');
    });

    test(`${editMode} mode - Cells in a new row should be updated on Shift+Tab (T898356)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [],
        editing: {
          mode: editMode.toLowerCase() as GridsEditMode,
          allowAdding: true,
        },
        columns: ['a', 'b'],
      });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
      const cell00 = dataGrid.getDataCell(0, 0);
      const editor00 = cell00.getEditor();
      const cell01 = dataGrid.getDataCell(0, 1);
      const editor01 = cell01.getEditor();

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await addRowButton.click();
      await dataGrid.getDataRow(0).expectInserted();
      await cell01.element.click();

      await cell01.expectFocusVisible();
      await expect(editor01.element).toBeAttached();
      await expect(editor01.element).toBeFocused();

      await typeText(editor01.element, '2');
      await page.keyboard.press('Shift+Tab');

      await cell00.expectFocusVisible();
      await cell01.expectFocusVisible(false);
      await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBe('2');
      await expect(editor00.element).toBeAttached();
      await expect(editor00.element).toBeFocused();

      await typeText(editor00.element, '1');
      await page.keyboard.press('Shift+Tab');

      await cell00.expectFocusVisible(false);
      await expect.poll(() => dataGrid.apiGetCellValue(0, 0)).toBe('1');
    });

    test(`${editMode} mode - Cells in a modified row should be updated on Tab (T898356)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [{ a: '1', b: '2' }],
        editing: {
          mode: editMode.toLowerCase() as GridsEditMode,
          allowUpdating: true,
        },
        columns: ['a', 'b'],
      });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const cell00 = dataGrid.getDataCell(0, 0);
      const editor00 = cell00.getEditor();
      const cell01 = dataGrid.getDataCell(0, 1);
      const editor01 = cell01.getEditor();

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await cell00.element.click();

      await cell00.expectFocusVisible();
      await expect(editor00.element).toBeAttached();
      await expect(editor00.element).toBeFocused();

      await typeText(editor00.element, '1');
      await expect(editor00.element).toHaveValue('11');

      await page.keyboard.press('Tab');
      await cell01.expectFocusVisible();
      await cell00.expectFocusVisible(false);
      await expect.poll(() => dataGrid.apiGetCellValue(0, 0)).toBe('11');
      await expect(editor01.element).toBeAttached();
      await expect(editor01.element).toBeFocused();

      await typeText(editor01.element, '2');
      await page.keyboard.press('Tab');

      await cell01.expectFocusVisible(false);
      await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBe('22');
    });

    test(`${editMode} mode - Cells in a modified row should be updated on Shift+Tab (T898356)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [{ a: '1', b: '2' }],
        editing: {
          mode: editMode.toLowerCase() as GridsEditMode,
          allowUpdating: true,
        },
        columns: ['a', 'b'],
      });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const cell00 = dataGrid.getDataCell(0, 0);
      const editor00 = cell00.getEditor();
      const cell01 = dataGrid.getDataCell(0, 1);
      const editor01 = cell01.getEditor();

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await cell01.element.click();

      await cell01.expectFocusVisible();
      await expect(editor01.element).toBeAttached();
      await expect(editor01.element).toBeFocused();

      await typeText(editor01.element, '2');
      await page.keyboard.press('Shift+Tab');

      await cell00.expectFocusVisible();
      await cell01.expectFocusVisible(false);
      await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBe('22');
      await expect(editor00.element).toBeAttached();
      await expect(editor00.element).toBeFocused();

      await typeText(editor00.element, '1');
      await page.keyboard.press('Shift+Tab');

      await cell00.expectFocusVisible(false);
      await expect.poll(() => dataGrid.apiGetCellValue(0, 0)).toBe('11');
    });

    test(`${editMode} mode - Shift+Tab from the first editable cell should move focus to the last header (T1329750)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [{ a: '1', b: '2' }],
        editing: {
          mode: editMode.toLowerCase() as GridsEditMode,
          allowUpdating: true,
        },
        columns: ['a', 'b'],
      });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const cell00 = dataGrid.getDataCell(0, 0);
      const editor00 = cell00.getEditor();
      const lastHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await cell00.element.click();
      await cell00.expectFocusVisible();
      await expect(editor00.element).toBeFocused();

      await page.keyboard.press('Shift+Tab');

      await expect(lastHeaderCell.element).toBeFocused();
      await cell00.expectFocusVisible(false);
    });
  });

  test('Horizontal moving by keydown if scrolling.columnRenderingMode: virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      width: 300,
      dataSource: data,
      columnWidth: 90,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
      paging: {
        enabled: false,
      },
      onFocusedCellChanging: (e) => { e.isHighlighted = true; },
    }), GRID_SELECTOR, { arg: generateData(2, 20) });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();

    for (let i = 0; i < 19; i += 1) {
      await page.keyboard.press('ArrowRight');
      await dataGrid.getDataCell(0, i + 1).expectFocusVisible();
    }

    for (let i = 19; i >= 1; i -= 1) {
      await page.keyboard.press('ArrowLeft');
      await dataGrid.getDataCell(0, i - 1).expectFocusVisible();
    }
  });

  test('Vertical moving by keydown if scrolling.mode: virtual, scrolling.rowRenderingMode: virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      width: 300,
      height: 200,
      dataSource: data,
      scrolling: {
        mode: 'virtual',
        rowRenderingMode: 'virtual',
      },
      paging: {
        enabled: false,
      },
      onFocusedCellChanging: (e) => { e.isHighlighted = true; },
    }), GRID_SELECTOR, { arg: generateData(20, 2) });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();

    // The grid renders the rows of a new scroll position a moment later: a key before that is lost.
    for (let i = 0; i < 19; i += 1) {
      await page.keyboard.press('ArrowDown');
      await dataGrid.getDataCell(i + 1, 0).expectFocusVisible();
      await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
    }

    for (let i = 19; i >= 1; i -= 1) {
      await page.keyboard.press('ArrowUp');
      await dataGrid.getDataCell(i - 1, 0).expectFocusVisible();
      await expect.poll(() => dataGrid.isViewportRowsRenderPending()).toBe(false);
    }
  });

  ['cell', 'batch'].forEach((editMode) => {
    test(`Moving by Tab key if scrolling.columnRenderingMode: virtual, editing.mode: ${editMode}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        width: 300,
        columnWidth: 70,
        dataSource: generateData(2, 10),
        scrolling: {
          columnRenderingMode: 'virtual',
          useNative: false,
        },
        editing: {
          mode: editMode as GridsEditMode,
          allowUpdating: true,
        },
        paging: {
          enabled: false,
        },
      });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.getDataCell(0, 0).element.click();

      for (let rowIndex = 0; rowIndex < 2; rowIndex += 1) {
        for (let columnIndex = 0; columnIndex < 10; columnIndex += 1) {
          const cell = dataGrid.getDataCell(rowIndex, columnIndex);

          await cell.expectFocusVisible();
          await cell.expectEditCell();

          await page.keyboard.press('Tab');
        }
      }

      await dataGrid.getDataCell(1, 9).element.click();

      for (let rowIndex = 1; rowIndex >= 0; rowIndex -= 1) {
        for (let columnIndex = 9; columnIndex >= 0; columnIndex -= 1) {
          const cell = dataGrid.getDataCell(rowIndex, columnIndex);

          await cell.expectFocusVisible();
          await cell.expectEditCell();

          await page.keyboard.press('Shift+Tab');
        }
      }
    });
  });

  [false, true].forEach((rtlEnabled) => {
    test(`Moving by Tab key if scrolling.columnRenderingMode: virtual and fixed columns are enabled${rtlEnabled ? ' (rtlEnabled)' : ''}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', ({ data, rtl }): Properties => ({
        columnWidth: 70,
        dataSource: data,
        rtlEnabled: rtl,
        scrolling: {
          columnRenderingMode: 'virtual',
          useNative: false,
        },
        width: 500,
        selection: {
          mode: 'multiple',
          showCheckBoxesMode: 'always',
        },
        columnFixing: {
          // @ts-expect-error private option
          legacyMode: true,
        },
        customizeColumns(columns) {
          if (rtl) {
            columns[0].fixedPosition = 'right';
            columns[0].fixed = true;
            columns[1].fixedPosition = 'right';
            columns[1].fixed = true;
            columns[15].fixed = true;
            columns[16].fixed = true;
          } else {
            columns[0].fixed = true;
            columns[1].fixed = true;
            columns[15].fixedPosition = 'right';
            columns[15].fixed = true;
            columns[16].fixedPosition = 'right';
            columns[16].fixed = true;
          }
        },
      }), GRID_SELECTOR, { arg: { data: generateData(2, 17), rtl: rtlEnabled } });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      const getCell = (rowIndex: number, columnIndex: number): DataCell => (
        columnIndex <= 2 || columnIndex >= 16
          ? dataGrid.getFixedDataCell(rowIndex, columnIndex)
          : dataGrid.getDataCell(rowIndex, columnIndex)
      );

      await dataGrid.getFixedDataRow(0).getSelectCheckBox().click();

      for (let rowIndex = 0; rowIndex < 2; rowIndex += 1) {
        for (let columnIndex = 0; columnIndex <= 17; columnIndex += 1) {
          if (columnIndex === 0) {
            await expect(dataGrid.getFixedDataRow(rowIndex).getSelectCheckBox()).toBeFocused();
            await page.keyboard.press('Tab');
          } else {
            await getCell(rowIndex, columnIndex).expectFocusVisible();

            if (rowIndex === 1 && columnIndex === 17) {
              break;
            }

            await page.keyboard.press('Tab');
          }
        }
      }

      for (let rowIndex = 1; rowIndex >= 0; rowIndex -= 1) {
        for (let columnIndex = 17; columnIndex >= 0; columnIndex -= 1) {
          if (columnIndex === 0) {
            await expect(dataGrid.getFixedDataRow(rowIndex).getSelectCheckBox()).toBeFocused();
            await page.keyboard.press('Shift+Tab');
          } else {
            await getCell(rowIndex, columnIndex).expectFocusVisible();

            if (rowIndex === 0 && columnIndex === 0) {
              break;
            }

            await page.keyboard.press('Shift+Tab');
          }
        }
      }
    });
  });

  ['Batch', 'Cell'].forEach((editMode) => {
    [true, false].forEach((focusedRowEnabled) => {
      test(`A stand-alone input should be focused on click after modifying a cell if focusedRowEnabled = ${focusedRowEnabled} and editing mode is ${editMode} (T940309)`, async ({ page }) => {
        await page.evaluate(() => {
          $('<input id="myinput">').prependTo('body');
        });
        await createWidget(page, 'dxDataGrid', {
          dataSource: [{ id: 1, name: 'test' }],
          keyExpr: 'id',
          columns: ['name'],
          focusedRowKey: 1,
          focusedRowEnabled,
          editing: {
            mode: editMode.toLowerCase() as GridsEditMode,
            allowUpdating: true,
          },
        });

        const dataGrid = new DataGrid(page, GRID_SELECTOR);
        const cell = dataGrid.getDataCell(0, 0);
        const cellEditor = cell.getEditor().element;
        const inputElement = page.locator('#myinput');

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        await cell.element.click();

        await expect(cellEditor).toBeAttached();

        await typeText(cellEditor, 'new text');
        await inputElement.click();

        await expect(cellEditor).not.toBeAttached();
        await expect(inputElement).toBeFocused();
      });
    });
  });

  test('Empty row should lose focus on Tab (T941246)', async ({ page }) => {
    await page.evaluate(() => {
      $('<input id="myinput1">').prependTo('body');
      $('<input id="myinput2">').appendTo('body');
    });
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      columns: ['id'],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
    const inputElement1 = page.locator('#myinput1');
    const inputElement2 = page.locator('#myinput2');

    await inputElement1.click();
    await expect(inputElement1).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(headerCell.element).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataGrid.getRowsView()).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(inputElement2).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(dataGrid.getRowsView()).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(headerCell.element).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(inputElement1).toBeFocused();
  });

  [false, true].forEach((isCommandColumnFixed) => {
    const fixedState = isCommandColumnFixed ? 'fixed' : 'unfixed';

    const createGrid = (page: Page, commandColumnPosition: 'left' | 'right'): Promise<void> => {
      const commandColumn = {
        type: 'buttons' as const,
        fixed: isCommandColumnFixed,
        fixedPosition: commandColumnPosition,
      };

      return createWidget(page, 'dxDataGrid', {
        dataSource: [
          { name: 'Alex', c0: 'c0_0' },
          { name: 'Ben', c0: 'c0_1' },
        ],
        keyExpr: 'name',
        columnFixing: {
          // @ts-expect-error private option
          legacyMode: true,
        },
        columns: commandColumnPosition === 'left'
          ? [commandColumn, 'name', 'c0']
          : ['name', 'c0', commandColumn],
        editing: {
          mode: 'row',
          allowUpdating: true,
          useIcons: true,
        },
        sorting: {
          mode: 'none',
        },
      });
    };

    const getDataRow = (dataGrid: DataGrid, index: number): DataRow => (
      isCommandColumnFixed ? dataGrid.getFixedDataRow(index) : dataGrid.getDataRow(index)
    );

    const checkNavigationWithLeftCommandColumn = async (
      page: Page,
      dataGrid: DataGrid,
    ): Promise<void> => {
      const headers = dataGrid.getHeaders();
      const commandHeaderCell = headers.getHeaderRow(0, isCommandColumnFixed).getHeaderCell(0);
      const commandCell = getDataRow(dataGrid, 0).getCommandCell(0);

      await commandHeaderCell.element.click();
      await expect(commandHeaderCell.element).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(headers.getHeaderRow(0).getHeaderCell(1).element).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(headers.getHeaderRow(0).getHeaderCell(2).element).toBeFocused();
      await page.keyboard.press('Tab');

      await expect(commandCell.element).toBeFocused();
      // After a Tab from the headers, the grid takes over the cell's focus a moment later: a Tab
      // before that is lost.
      await commandCell.expectFocusVisible();
      await page.keyboard.press('Tab');
      await expect(commandCell.getButton(0)).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(dataGrid.getDataCell(0, 1).element).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(dataGrid.getDataCell(0, 2).element).toBeFocused();
      await page.keyboard.press('Tab');

      await expect(getDataRow(dataGrid, 1).getCommandCell(0).getButton(0)).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(dataGrid.getDataCell(1, 1).element).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(dataGrid.getDataCell(1, 2).element).toBeFocused();
    };

    const checkNavigationWithRightCommandColumn = async (
      page: Page,
      dataGrid: DataGrid,
    ): Promise<void> => {
      const headers = dataGrid.getHeaders();

      await headers.getHeaderRow(0).getHeaderCell(0).element.click();
      await expect(headers.getHeaderRow(0).getHeaderCell(0).element).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(headers.getHeaderRow(0).getHeaderCell(1).element).toBeFocused();
      await page.keyboard.press('Tab');

      if (!isCommandColumnFixed) {
        await expect(headers.getHeaderRow(0).getHeaderCell(2).element).toBeFocused();
        await page.keyboard.press('Tab');
      }

      await expect(dataGrid.getDataCell(0, 0).element).toBeFocused();
      // After a Tab from the headers, the grid takes over the cell's focus a moment later: a Tab
      // before that is lost.
      await dataGrid.getDataCell(0, 0).expectFocusVisible();
      await page.keyboard.press('Tab');
      await expect(dataGrid.getDataCell(0, 1).element).toBeFocused();
      await page.keyboard.press('Tab');

      await expect(getDataRow(dataGrid, 0).getCommandCell(2).getButton(0)).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(dataGrid.getDataCell(1, 0).element).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(dataGrid.getDataCell(1, 1).element).toBeFocused();
    };

    // The page ends with the grid: below it is the document, outside the body's box.
    const clickBelow = async (page: Page, element: Locator): Promise<void> => {
      const box = await element.boundingBox();

      await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height + 10);
    };

    test(`The first cell should be focused on pressing the tab key after clicking on the document when command column is ${fixedState} and on the left side (T951849)`, async ({ page }) => {
      await createGrid(page, 'left');

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await checkNavigationWithLeftCommandColumn(page, dataGrid);

      await page.keyboard.press('Tab');
      await expect(dataGrid.getDataCell(1, 2).element).not.toBeFocused();
      await clickBelow(page, dataGrid.element);

      await checkNavigationWithLeftCommandColumn(page, dataGrid);
    });

    test(`The cell focus should be restored on pressing shift and tab keys when command column is ${fixedState} and on the left side (T951849)`, async ({ page }) => {
      await createGrid(page, 'left');

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await checkNavigationWithLeftCommandColumn(page, dataGrid);
    });

    test(`The first cell should be focused on pressing the tab key after clicking on the document when command column is ${fixedState} and on the right side (T951849)`, async ({ page }) => {
      await createGrid(page, 'right');

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const lastButton = getDataRow(dataGrid, 1).getCommandCell(2).getButton(0);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await checkNavigationWithRightCommandColumn(page, dataGrid);
      await page.keyboard.press('Tab');
      await expect(lastButton).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(lastButton).not.toBeFocused();
      await clickBelow(page, dataGrid.element);

      await checkNavigationWithRightCommandColumn(page, dataGrid);
      await page.keyboard.press('Tab');
      await expect(lastButton).toBeFocused();
    });

    test(`The first cell should be focused on pressing shift and tab keys after clicking on the document when command column is ${fixedState} and on the right side (T951849)`, async ({ page }) => {
      await createGrid(page, 'right');

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await checkNavigationWithRightCommandColumn(page, dataGrid);

      await page.keyboard.press('Shift+Tab');
      await expect(dataGrid.getDataCell(1, 0).element).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(getDataRow(dataGrid, 0).getCommandCell(2).getButton(0)).toBeFocused();
    });

    test(`The cell focus should be restored on pressing shift and tab keys when command column is ${fixedState} and on the right side (T951849)`, async ({ page }) => {
      await createGrid(page, 'right');

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await checkNavigationWithRightCommandColumn(page, dataGrid);
      await page.keyboard.press('Tab');
      await expect(getDataRow(dataGrid, 1).getCommandCell(2).getButton(0)).toBeFocused();
    });
  });

  test('Grid should get focus when the focus method is called (T955678)', async ({ page }) => {
    await page.evaluate(() => {
      $('<div id="mycontainer">').prependTo('body');
    });
    await createWidget(page, 'dxButton', () => ({
      text: 'Focus',
      onClick() {
        ($('#container') as any).dxDataGrid('instance').focus();
      },
    }), '#mycontainer');
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }],
      keyExpr: 'id',
      focusedRowEnabled: true,
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const button = page.locator('#mycontainer');
    const body = page.locator('body');
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await button.click();

    await expect(dataGrid.getDataRow(0).element).toBeFocused();
    await dataGrid.getDataRow(0).expectFocusedRow();

    await page.keyboard.press('ArrowDown');

    await expect(dataGrid.getDataRow(1).element).toBeFocused();
    await dataGrid.getDataRow(1).expectFocusedRow();

    await page.keyboard.press('ArrowUp');

    await expect(dataGrid.getDataRow(0).element).toBeFocused();
    await dataGrid.getDataRow(0).expectFocusedRow();

    await clickWithOffset(body, 200, 20);
    await button.click();
    await page.keyboard.press('ArrowRight');

    await expect(dataGrid.getDataCell(0, 1).element).toBeFocused();
    await dataGrid.getDataCell(0, 1).expectFocusVisible();
    await dataGrid.getDataRow(0).expectFocusedRow();

    await clickWithOffset(body, 200, 20);
    await button.click();

    await expect(dataGrid.getDataRow(0).element).toBeFocused();
    await dataGrid.getDataRow(0).expectFocusedRow();

    await page.keyboard.press('ArrowDown');

    await expect(dataGrid.getDataRow(1).element).toBeFocused();
    await dataGrid.getDataRow(1).expectFocusedRow();
  });

  test('New mode. A cell should be focused when the PageDow/Up key is pressed (T898324)', async ({ page }) => {
    const items = [...new Array(100)].map((_, i) => ({
      ID: i + 1,
      Name: `Name ${i + 1}`,
      Description: `Description ${i + 1}`,
    }));

    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      keyExpr: 'ID',
      remoteOperations: true,
      height: 300,
      scrolling: {
        mode: 'virtual',
        renderAsync: false,
        legacyMode: false,
      },
      columns: ['Name', 'Description'],
      onFocusedCellChanging(e) {
        e.isHighlighted = true;
      },
    }), GRID_SELECTOR, { arg: items });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();

    await dataGrid.getDataCell(0, 0).expectFocusVisible();
    await expect.poll(() => dataGrid.apiOption('focusedRowIndex')).toBe(0);
    await expect.poll(() => dataGrid.apiOption('focusedColumnIndex')).toBe(0);

    await page.keyboard.press('PageDown');

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    // The focused row index changes once the grid has scrolled: read it after that.
    await expect.poll(() => dataGrid.apiOption('focusedRowIndex')).toBeGreaterThanOrEqual(5);

    const focusedRowIndex: number = await dataGrid.apiOption('focusedRowIndex');
    await dataGrid.getDataCell(focusedRowIndex, 0).expectFocusVisible();
    await expect.poll(() => dataGrid.apiOption('focusedColumnIndex')).toBe(0);

    await page.keyboard.press('PageUp');

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await dataGrid.getDataCell(0, 0).expectFocusVisible();
    await expect.poll(() => dataGrid.apiOption('focusedRowIndex')).toBe(0);
    await expect.poll(() => dataGrid.apiOption('focusedColumnIndex')).toBe(0);
  });

  ['Row', 'Cell', 'Batch'].forEach((editMode) => {
    [false, true].forEach((repaintChangesOnly) => {
      test(`${editMode} - Focus next cell using tab after adding row if some another row is focused and repaintChangesOnly is ${repaintChangesOnly} (T1004913, T1036685)`, async ({ page }) => {
        await createWidget(page, 'dxDataGrid', {
          dataSource: [{ ID: 1, FirstName: 'John' }],
          keyExpr: 'ID',
          repaintChangesOnly,
          editing: {
            mode: editMode.toLowerCase() as GridsEditMode,
            allowUpdating: true,
            allowAdding: true,
          },
          focusedRowEnabled: true,
          focusedRowKey: 1,
          columns: ['ID', 'FirstName'],
        });

        const dataGrid = new DataGrid(page, GRID_SELECTOR);
        const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();
        const insertedRow = getFirstDataRow(dataGrid);
        const cell00 = insertedRow.getDataCell(0);
        const editor00 = cell00.getEditor();
        const cell01 = insertedRow.getDataCell(1);
        const editor01 = cell01.getEditor();

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        await addRowButton.click();

        await cell00.expectFocusVisible();
        await expect(editor00.element).toBeFocused();

        await page.keyboard.press('Tab');

        await cell01.expectFocusVisible();
        await expect(editor01.element).toBeFocused();
      });
    });
  });

  test('Cells should be focused after saving data when filter is applied and cell mode is used (T1029906)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { id: 1, name: 'aaa' },
        { id: 2, name: 'aba' },
        { id: 3, name: 'baa' },
        { id: 4, name: 'bca' },
        { id: 5, name: 'acd' },
      ],
      keyExpr: 'id',
      columns: [{
        dataField: 'name',
        filterValue: 'a',
      }],
      filterRow: {
        visible: true,
        applyFilter: 'auto',
      },
      keyboardNavigation: {
        enterKeyAction: 'moveFocus',
        enterKeyDirection: 'column',
        editOnKeyPress: true,
      },
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
      onFocusedCellChanging(e) {
        e.isHighlighted = true;
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();

    await dataGrid.getDataCell(0, 0).expectFocusVisible();
    await expect(dataGrid.getDataCell(0, 0).getEditor().element).toBeAttached();

    await page.keyboard.press('Escape');

    await expect(dataGrid.getDataCell(0, 0).getEditor().element).not.toBeAttached();
    await dataGrid.getDataCell(0, 0).expectFocusVisible();

    await page.keyboard.press('ArrowDown');

    await dataGrid.getDataCell(1, 0).expectFocusVisible();

    await page.keyboard.press('d');
    await page.keyboard.press('Enter');

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect.poll(async () => (await dataGrid.apiGetVisibleRows()).length).toBe(4);
    await dataGrid.getDataCell(2, 0).expectFocusVisible();

    await page.keyboard.press('ArrowDown');

    await dataGrid.getDataCell(3, 0).expectFocusVisible();
  });

  test('Lookup editor should update cell value on down or up key when cell is focused by tab or shift+tab (T1036028)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          id: 1, field1: 'a', field2: '1', field3: 'b',
        },
      ],
      keyExpr: 'id',
      columns: ['field1',
        {
          dataField: 'field2',
          lookup: {
            dataSource: [
              { id: '1' },
              { id: '2' },
            ],
            displayExpr: 'id',
            valueExpr: 'id',
          },
        },
        'field3'],
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataRow(0).getCommandCell(3).getButton(0).click();

    await dataGrid.getDataRow(0).expectEdited();
    await dataGrid.getDataCell(0, 0).expectFocusVisible();

    await page.keyboard.press('Tab');

    await dataGrid.getDataCell(0, 1).expectFocusVisible();
    await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBe('1');

    await page.keyboard.press('ArrowDown');

    await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBe('2');

    await page.keyboard.press('Tab');

    await dataGrid.getDataCell(0, 2).expectFocusVisible();

    await page.keyboard.press('Shift+Tab');

    await dataGrid.getDataCell(0, 1).expectFocusVisible();
    await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBe('2');

    await page.keyboard.press('ArrowUp');

    await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBe('1');
  });

  [false, true].forEach((repaintChangesOnly) => {
    test(`Editor in the filter row should not lose focus when groups are expanded after the filtering (repaintChangesOnly is ${repaintChangesOnly}) (T1038332)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (repaint) => ({
        dataSource: [
          {
            ID: 1,
            Name: 'Name_1',
            Category: 'Category_1',
          },
          {
            ID: 2,
            Name: 'Name_2',
            Category: 'Category_1',
          },
          {
            ID: 3,
            Name: 'Name_3',
            Category: 'Category_2',
          },
        ],
        keyExpr: 'ID',
        repaintChangesOnly: repaint,
        filterRow: {
          visible: true,
        },
        grouping: {
          autoExpandAll: false,
        },
        onContentReady(e) {
          if (e.component.getCombinedFilter()) {
            // @ts-expect-error flag for test
            if (e.component.myAllExpand) {
              // @ts-expect-error flag for test
              e.component.myAllExpand = false;
              return;
            }
            // @ts-expect-error flag for test
            e.component.myAllExpand = true;
            e.component.expandAll(0);
          }
        },
        columns: [
          'Name',
          {
            dataField: 'Category',
            groupIndex: 0,
          },
        ],
      }), GRID_SELECTOR, { arg: repaintChangesOnly });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const filterRowCell = dataGrid.getHeaders().getFilterRow().getFilterCell(1);
      const filterRowEditor = filterRowCell.getEditorInput();

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await filterRowEditor.element.click();

      await expect(filterRowEditor.element).toBeFocused();
      await filterRowCell.expectFocusVisible();

      await typeText(filterRowEditor.element, 'Name');

      // The filter applies a moment after the typing, and the groups expand once it has.
      await expect.poll(async () => (await dataGrid.apiGetVisibleRows()).length).toBe(5);
      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect(filterRowEditor.element).toBeFocused();
      await filterRowCell.expectFocusVisible();

      await typeText(filterRowEditor.element, '_1');

      await expect.poll(async () => (await dataGrid.apiGetVisibleRows()).length).toBe(2);
      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect(filterRowEditor.element).toBeFocused();
      await filterRowCell.expectFocusVisible();
    });
  });

  test('Checkbox value is changed properly on tab when the batch editing mode and focused row are enabled (T1059412)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      columns: [
        {
          dataField: 'id',
          allowEditing: false,
        },
        {
          dataField: 'checked',
          dataType: 'boolean',
        },
      ],
      dataSource: [
        {
          id: 1,
          checked: false,
        },
      ],
      editing: {
        allowAdding: true,
        allowUpdating: true,
        mode: 'batch',
      },
      focusedRowEnabled: true,
      keyboardNavigation: {
        editOnKeyPress: true,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const insertedRow = getFirstDataRow(dataGrid);
    // The inserted row takes aria-rowindex 1 and goes before the first data row.
    const firstDataRow = new DataRow(dataGrid.getDataRow(0).element.nth(1));
    const checkBoxCell = insertedRow.getDataCell(1);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaderPanel().getAddRowButton().click();

    await insertedRow.expectInserted();

    await firstDataRow.getDataCell(0).element.click();

    await firstDataRow.expectFocusedRow();

    await page.keyboard.press('ArrowUp');

    await insertedRow.getDataCell(0).expectFocusVisible();

    await page.keyboard.press('ArrowRight');

    await checkBoxCell.expectFocusVisible();

    await page.keyboard.press('Space');

    await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBeTruthy();
    await checkBoxCell.expectFocusVisible();
    await checkBoxCell.expectModified();

    await page.keyboard.press('Space');

    await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBeFalsy();
    await checkBoxCell.expectFocusVisible();
    await checkBoxCell.expectModified();

    await page.keyboard.press('Space');

    await expect.poll(() => dataGrid.apiGetCellValue(0, 1)).toBeTruthy();
    await checkBoxCell.expectFocusVisible();
    await checkBoxCell.expectModified();
  });

  [false, true].forEach((hasFixedColumns) => {
    test(`The last cell should be focused after changing the page size when scrolling.columnRenderingMode is virtual${hasFixedColumns ? ' and fixed columns are enabled' : ''} (T1063530)`, async ({ page }) => {
      const items = [...new Array(5)].map((_, i) => {
        const item: Record<string, unknown> = { id: i + 1 };

        for (let j = 1; j < 7; j += 1) {
          item[`field${j + 1}`] = `Field_${i + 1}_${j + 1}`;
        }

        return item;
      });

      await createWidget(page, 'dxDataGrid', ({ data, fixed }): Properties => ({
        dataSource: data,
        keyExpr: 'id',
        width: 450,
        columnWidth: 150,
        ...fixed && {
          columnFixing: {
            // @ts-expect-error private option
            legacyMode: true,
          },
          customizeColumns(columns) {
            columns[0].fixed = true;
            columns[6].fixed = true;
            columns[6].fixedPosition = 'right';
          },
        },
        paging: {
          pageSize: 2,
        },
        scrolling: {
          columnRenderingMode: 'virtual',
        },
        pager: {
          visible: true,
          allowedPageSizes: [1, 2],
          showPageSizeSelector: true,
        },
      }), GRID_SELECTOR, { arg: { data: items, fixed: hasFixedColumns } });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const pager = dataGrid.getPager();
      const getCell = (rowIndex: number, columnIndex: number): DataCell => (
        hasFixedColumns && (columnIndex === 0 || columnIndex === 6)
          ? dataGrid.getFixedDataCell(rowIndex, columnIndex)
          : dataGrid.getDataCell(rowIndex, columnIndex)
      );
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await getCell(0, 0).element.click();

      await getCell(0, 0).expectFocusHidden();

      for (let i = 0; i < 6; i += 1) {
        await page.keyboard.press('Tab');
        await getCell(0, i + 1).expectFocusVisible();
      }

      for (let i = 0; i < 7; i += 1) {
        await page.keyboard.press('Tab');
        await getCell(1, i).expectFocusVisible();
      }

      await page.keyboard.press('Tab');

      await expect(pager.getPageSize(0)).toBeFocused();

      await page.keyboard.press('Space');

      await expect.poll(async () => (await dataGrid.apiGetVisibleRows()).length).toBe(1);

      await page.keyboard.press('Shift+Tab');

      await getCell(0, 6).expectFocusVisible();
    });
  });

  test('Window should not be scrolled after clicking on freespace row (T1104035)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1 }, { id: 2 }],
      keyExpr: 'id',
      height: 1500,
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const getWindowScrollTop = (): Promise<number> => page.evaluate(() => window.scrollY);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    expect(await getWindowScrollTop()).toBe(0);

    // The row runs past the bottom of the viewport: a click at its top doesn't scroll to get there.
    await dataGrid.getFreeSpaceRow().locator('td').first().click({ position: { x: 10, y: 10 } });

    await expect(dataGrid.getRowsView()).toBeFocused();
    expect(await getWindowScrollTop()).toBe(0);
  });

  test('Navigation shouldn\'t get stuck on cell templates with links in them when navigating from outside the grid (T1123129)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: {
        store: {
          type: 'array',
          data: [
            { name: 'Alex', phone: '555555' },
            { name: 'Dan', phone: '553355' },
          ],
          key: 'name',
        },
        paginate: true,
      },
      keyExpr: 'name',
      columns: ['name', {
        cellTemplate: (cellElement) => $(cellElement).append('<a  href=\'#\' >Link</a>'),
      }, 'phone'],
      pager: {
        visible: true,
        allowedPageSizes: [1, 2],
        showPageSizeSelector: true,
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const pageSize = dataGrid.getPager().getPageSize(0);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    for (let i = 0; i < 2; i += 1) {
      await pageSize.click();
      await expect(dataGrid.getDataRows()).toHaveCount(1);

      // The Shift+Tab from the pager reaches the template's link, and the grid sends the focus on
      // to a cell: the next Shift+Tab leaves the rows.
      await page.keyboard.press('Shift+Tab');
      await expect(dataGrid.getDataCell(0, 0).element).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2).element).toBeFocused();
    }
  });

  // T1134231
  [
    {
      title: 'Adaptive - Adaptive cells should be focused by tab key press',
      batchEditing: false,
    },
    {
      title: 'Adaptive with batch edit mode - Adaptive cells should not go into edit state by tab key press',
      batchEditing: true,
    },
  ].forEach(({ title, batchEditing }) => {
    test(title, async ({ page }) => {
      await createAdaptiveGrid(page, batchEditing);

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const headerRow = dataGrid.getHeaders().getHeaderRow(0);
      const firstDataRow = dataGrid.getDataRow(0);
      const secondDataRow = dataGrid.getDataRow(1);
      const adaptiveDetailRow = dataGrid.getAdaptiveRow(0);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await dataGrid.apiExpandAdaptiveDetailRow('Alex');
      await addFocusableElementBefore(page, GRID_SELECTOR);

      await expect(adaptiveDetailRow.element).toBeAttached();

      await page.locator(FOCUSABLE_START).click();
      await page.keyboard.press('Tab');
      await expect(headerRow.getHeaderCell(0).element).toBeFocused();
      await expect(headerRow.getHeaderCell(0).element).toHaveAttribute('tabindex');
      await headerRow.getHeaderCell(1).expectHidden();
      await expect(headerRow.getHeaderCell(1).element).not.toHaveAttribute('tabindex');
      await headerRow.getHeaderCell(2).expectHidden();
      await expect(headerRow.getHeaderCell(2).element).not.toHaveAttribute('tabindex');

      await page.keyboard.press('Tab');
      await expect(headerRow.getHeaderCell(3).element).toBeFocused();
      await expect(headerRow.getHeaderCell(3).element).toHaveAttribute('tabindex');

      await page.keyboard.press('Tab');
      await firstDataRow.getDataCell(0).expectFocusVisible();
      await expect(firstDataRow.getDataCell(0).element).toBeFocused();
      await firstDataRow.getDataCell(1).expectHidden();
      await expect(firstDataRow.getDataCell(1).element).toHaveAttribute('tabindex', '-1');
      await firstDataRow.getDataCell(2).expectHidden();
      await expect(firstDataRow.getDataCell(2).element).toHaveAttribute('tabindex', '-1');

      await page.keyboard.press('Tab');
      await firstDataRow.getDataCell(3).expectFocusVisible();
      await expect(firstDataRow.getDataCell(3).element).toBeFocused();

      await page.keyboard.press('Tab');
      await firstDataRow.getCommandCell(4).expectFocusVisible();
      await expect(firstDataRow.getCommandCell(4).element).toBeFocused();

      await page.keyboard.press('Tab');
      await adaptiveDetailRow.getAdaptiveCell(0).expectFocusVisible();
      await expect(adaptiveDetailRow.getAdaptiveCell(0).element).toBeFocused();

      await page.keyboard.press('Tab');
      await adaptiveDetailRow.getAdaptiveCell(1).expectFocusVisible();
      await expect(adaptiveDetailRow.getAdaptiveCell(1).element).toBeFocused();

      await page.keyboard.press('Tab');
      await secondDataRow.getDataCell(0).expectFocusVisible();
      await expect(secondDataRow.getDataCell(0).element).toBeFocused();

      await page.keyboard.press('Tab');
      await secondDataRow.getDataCell(3).expectFocusVisible();
      await expect(secondDataRow.getDataCell(3).element).toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await secondDataRow.getDataCell(0).expectFocusVisible();
      await expect(secondDataRow.getDataCell(0).element).toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await adaptiveDetailRow.getAdaptiveCell(1).expectFocusVisible();
      await expect(adaptiveDetailRow.getAdaptiveCell(1).element).toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await adaptiveDetailRow.getAdaptiveCell(0).expectFocusVisible();
      await expect(adaptiveDetailRow.getAdaptiveCell(0).element).toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await firstDataRow.getCommandCell(4).expectFocusVisible();
      await expect(firstDataRow.getCommandCell(4).element).toBeFocused();
    });
  });

  test('Adaptive with batch edit mode - Adaptive cells should be focused by tab key press when they are in edit state', async ({ page }) => {
    await createAdaptiveGrid(page, true);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const firstDataRow = dataGrid.getDataRow(0);
    const secondDataRow = dataGrid.getDataRow(2);
    const adaptiveDetailRow = dataGrid.getAdaptiveRow(0);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiExpandAdaptiveDetailRow('Alex');
    await addFocusableElementBefore(page, GRID_SELECTOR);

    await expect(adaptiveDetailRow.element).toBeAttached();

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(0).element).toBeFocused();
    await expect(headerRow.getHeaderCell(0).element).toHaveAttribute('tabindex');
    await headerRow.getHeaderCell(1).expectHidden();
    await expect(headerRow.getHeaderCell(1).element).not.toHaveAttribute('tabindex');
    await headerRow.getHeaderCell(2).expectHidden();
    await expect(headerRow.getHeaderCell(2).element).not.toHaveAttribute('tabindex');

    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(3).element).toBeFocused();
    await expect(headerRow.getHeaderCell(3).element).toHaveAttribute('tabindex');

    await page.keyboard.press('Tab');
    await firstDataRow.getDataCell(0).expectFocusVisible();
    await expect(firstDataRow.getDataCell(0).element).toBeFocused();

    await firstDataRow.getDataCell(0).element.click();
    await firstDataRow.getDataCell(0).expectEditCell();
    // The editor gets the focus a moment after the cell starts editing: a key before it misses.
    await expect(firstDataRow.getDataCell(0).getEditor().element).toBeFocused();
    await firstDataRow.getDataCell(1).expectHidden();
    await expect(firstDataRow.getDataCell(1).element).not.toHaveAttribute('tabindex');
    await firstDataRow.getDataCell(2).expectHidden();
    await expect(firstDataRow.getDataCell(2).element).not.toHaveAttribute('tabindex');

    await page.keyboard.press('Tab');
    await firstDataRow.getDataCell(3).expectFocusVisible();
    await firstDataRow.getDataCell(3).expectEditCell();

    await page.keyboard.press('Tab');
    await adaptiveDetailRow.getAdaptiveCell(0).expectFocusVisible();
    await adaptiveDetailRow.getAdaptiveCell(0).expectEditCell();

    await page.keyboard.press('Tab');
    await adaptiveDetailRow.getAdaptiveCell(1).expectFocusVisible();
    await adaptiveDetailRow.getAdaptiveCell(1).expectEditCell();

    await page.keyboard.press('Tab');
    await secondDataRow.getDataCell(0).expectFocusVisible();
    await secondDataRow.getDataCell(0).expectEditCell();

    await page.keyboard.press('Tab');
    await secondDataRow.getDataCell(3).expectFocusVisible();
    await secondDataRow.getDataCell(3).expectEditCell();

    await page.keyboard.press('Shift+Tab');
    await secondDataRow.getDataCell(0).expectFocusVisible();
    await secondDataRow.getDataCell(0).expectEditCell();

    await page.keyboard.press('Shift+Tab');
    await adaptiveDetailRow.getAdaptiveCell(1).expectFocusVisible();
    await adaptiveDetailRow.getAdaptiveCell(1).expectEditCell();

    await page.keyboard.press('Shift+Tab');
    await adaptiveDetailRow.getAdaptiveCell(0).expectFocusVisible();
    await adaptiveDetailRow.getAdaptiveCell(0).expectEditCell();

    await page.keyboard.press('Shift+Tab');
    await firstDataRow.getDataCell(3).expectFocusVisible();
    await firstDataRow.getDataCell(3).expectEditCell();
  });

  test('DataGrid - An exception should not throw after pressing the space key in an empty grid with virtual scrolling and row selection enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      keyExpr: 'Test',
      columns: ['Test'],
      showBorders: true,
      scrolling: {
        mode: 'virtual',
      },
      selection: {
        mode: 'single',
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
  });

  test('DataGrid - "Maximum call stack size exceeded" error occurs on navigating summary items in the group footer via arrow keys (T1175253)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(3, 3),
      keyExpr: 'field_0',
      showBorders: true,
      columns: [{
        dataField: 'field_0',
        groupIndex: 0,
      }, {
        dataField: 'field_1',
      }, {
        dataField: 'field_2',
      }],
      summary: {
        groupItems: [{
          column: 'field_2',
          summaryType: 'count',
          displayFormat: 'Total: {0}',
          showInGroupFooter: true,
        }],
      },
      searchPanel: {
        visible: true,
        width: 240,
        placeholder: 'Search...',
      },
      paging: {
        pageSize: 3,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();

    for (let i = 0; i < 4; i += 1) {
      await page.keyboard.press('Tab');
    }

    // After a Tab from the headers, the grid takes over the row's focus a moment later: a Tab
    // before that is lost.
    await dataGrid.getGroupRow(0).expectFocusVisible();

    for (let i = 0; i < 7; i += 1) {
      await page.keyboard.press('Tab');
    }

    await expect(dataGrid.getPager().getNavPage('2')).toBeFocused();

    await dataGrid.getGroupFooterRow(0).click();
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');

    await expect(dataGrid.getSummaryItem(0)).toHaveText('Total: 1');
  });

  test('DataGrid - focusedRowIndex is -1 when the first data cell is focused with the keyboard (T1175896)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ field_0: 'val_0_0', field_1: 'val_0_1' }],
      keyExpr: 'field_0',
      showBorders: true,
      searchPanel: {
        visible: true,
      },
      onKeyDown(e) {
        const eventKey = e.event?.key?.toLowerCase?.();
        if (eventKey === 'enter') {
          const focusedRowIndex = e.component.option('focusedRowIndex');
          $('#otherContainer').text(String(focusedRowIndex));
        }
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getSearchBox().input.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(dataGrid.getDataCell(0, 0).element).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page.locator('#otherContainer')).toHaveText('0');
  });

  test('DataGrid - onFocusedCellChanged parameters should be correct when focusing the first cell (T1282664)', async ({ page }) => {
    await resetFocusedEvents(page);

    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ field_0: 'val_0_0', field_1: 'val_0_1' }],
      keyExpr: 'field_0',
      showBorders: true,
      searchPanel: {
        visible: true,
      },
      onFocusedCellChanged(e) {
        (window as any).focusedEvents.push({ name: 'onFocusedCellChanged', args: e });
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getSearchBox().input.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await expect(dataGrid.getDataCell(0, 0).element).toBeFocused();
    await expect.poll(() => getFocusedCellChangedArgs(page)).toEqual({
      cellText: 'val_0_0',
      columnIndex: 0,
      rowIndex: 0,
      rowData: {
        field_0: 'val_0_0',
        field_1: 'val_0_1',
      },
    });
  });

  test('DataGrid - Cell focus in edit mode does not work correctly if a cell has a disabled editor (T1177434)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', ({ data }) => ({
      onEditorPreparing(e) {
        if (e.dataField === 'field_1') {
          e.editorOptions.disabled = true;
        }
      },
      dataSource: data,
      showBorders: true,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
        allowDeleting: true,
      },
      selection: {
        mode: 'multiple',
      },
      toolbar: {
        items: [
          {
            name: 'addRowButton',
            showText: 'always',
          },
        ],
      },
    }), GRID_SELECTOR, { arg: { data: getData(3, 3) } });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getToolbar().getItem(0).click();
    // The editor gets the focus a moment after the cell starts editing: a key before it misses.
    await expect(getFirstDataRow(dataGrid).getDataCell(1).getEditor().element).toBeFocused();
    await page.keyboard.press('Tab');

    await expect(page.locator('td:focus')).toHaveAttribute('aria-colindex', '3');
  });

  // T1178858
  test('Keyboard navigation behavior should be changed after changing the keyboardNavigation.enabled option', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 600,
      dataSource: [
        { name: 'Alex', c0: 'c0_0' },
        { name: 'Ben', c0: 'c0_1' },
        { name: 'Dan', c0: 'c0_2' },
        { name: 'John', c0: 'c0_3' },
      ],
      keyExpr: 'name',
      keyboardNavigation: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const firstDataCell = dataGrid.getDataCell(0, 0);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await firstDataCell.element.click();
    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(0, 1).expectFocusVisible();

    await dataGrid.apiOption('keyboardNavigation.enabled', false);

    await firstDataCell.element.click();
    await page.keyboard.press('Tab');
    await expect(dataGrid.getDataCell(0, 1).element).not.toBeFocused();
    await dataGrid.getDataCell(0, 1).expectFocusVisible(false);

    await dataGrid.apiOption('keyboardNavigation.enabled', true);

    await firstDataCell.element.click();
    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(0, 1).expectFocusVisible();
  });

  test('Adaptive row should toggle when press enter key', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', ADAPTIVE_ROW_GRID_OPTIONS);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 1).element.click();
    await page.keyboard.press('Tab');
    await dataGrid.getDataRow(0).getCommandCell(4).expectFocusVisible();

    await page.keyboard.press('Enter');

    await testScreenshot(page, 'adaptive-row-opened-via-keyboard.png', { element: dataGrid.element });

    await page.keyboard.press('Enter');

    await testScreenshot(page, 'adaptive-row-closed-via-keyboard.png', { element: dataGrid.element });
  });

  test('Focus position should be correct when open second adaptive row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', ADAPTIVE_ROW_GRID_OPTIONS);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const focusAdaptiveButtonCell = async (rowIndex: number): Promise<void> => {
      await dataGrid.getDataCell(rowIndex, 1).element.click();
      await page.keyboard.press('Tab');
      await dataGrid.getDataRow(rowIndex).getCommandCell(4).expectFocusVisible();
    };

    await focusAdaptiveButtonCell(0);
    await page.keyboard.press('Enter');

    await focusAdaptiveButtonCell(1);
    await page.keyboard.press('Enter');

    await testScreenshot(page, 'focus-position-when-second-adaptive-row-opened.png', { element: dataGrid.element });
  });

  // T1185341
  test('Focus first cell with dropDownButton (via tab key) -> open dropDownButton list (via up key)-> close dropDownButton list (via esc key) -> navigation to the right when focusedRowEnabled is true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', createDropDownButtonGridOptions);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const dropDownButton = dataGrid.getDataCell(0, 0).getDropDownButton();
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');
    await expect(headerRow.getHeaderCell(0).element).toBeFocused();

    await page.keyboard.press('Control+ArrowDown');
    await dataGrid.getDataRow(0).expectFocusedRow();
    await dataGrid.getDataCell(0, 0).expectFocusVisible();

    await page.keyboard.press('ArrowUp');
    await expect.poll(() => dropDownButton.isOpened()).toBe(true);

    await page.keyboard.press('Escape');
    await expect.poll(() => dropDownButton.isOpened()).toBe(false);

    await page.keyboard.press('ArrowRight');
    await dataGrid.getDataCell(0, 1).expectFocusVisible();
  });

  // T1185341
  test('Focus second cell (via click) -> tab navigation when focusedRowEnabled is true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', createDropDownButtonGridOptions);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 1).element.click();
    await dataGrid.getDataRow(0).expectFocusedRow();

    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(0, 2).expectFocusVisible();
  });

  // T1187124
  test('Keyboard navigation should work after opening-closing master-detal', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ],
      keyExpr: 'id',
      // Sorting would reload the rows and drop the collapsed detail row.
      sorting: {
        mode: 'none',
      },
      masterDetail: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const expandCell = dataGrid.getDataRow(0).getCommandCell(0);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expandCell.element.click();
    await expect(dataGrid.getMasterRow(0).element).toBeVisible();
    await expandCell.element.click();
    await expect(dataGrid.getMasterRow(0).element).toBeHidden();

    const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
    await headerCell.element.click();
    await expect(headerCell.element).toBeFocused();
    await page.keyboard.press('Tab');
    // After a Tab from the headers, the grid takes over the cell's focus a moment later: a Tab
    // before that is lost.
    await expandCell.expectFocusVisible();
    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(0, 1).expectFocusVisible();

    await page.keyboard.press('ArrowDown');
    await dataGrid.getDataCell(1, 1).expectFocusVisible();

    await page.keyboard.press('ArrowDown');
    await dataGrid.getDataCell(2, 1).expectFocusVisible();

    await page.keyboard.press('ArrowDown');
    await dataGrid.getDataCell(3, 1).expectFocusVisible();
  });

  test('TreeList/DataGrid - Focus indicator is not visible when the Toolbar includes a DropDownButton item (T1225005)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(1, 2),
      toolbar: {
        items: [
          {
            widget: 'dxDropDownButton',
            location: 'before',
            options: {
              text: 'Clear Batch',
              items: [
                { text: 'Delete All Lines' },
                { text: 'Zero All Values' },
              ],
            },
          },
        ],
      },
      keyExpr: 'field_0',
      showBorders: true,
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
    // The click sorts by the column, and the grid renders the rows again a moment later: the focus
    // a key gives before that is lost.
    await dataGrid.waitForContentReady(() => headerCell.element.click());
    await expect(headerCell.element).toBeFocused();
    await page.keyboard.press('Tab');

    await expect(dataGrid.getFocusOverlay()).toBeAttached();
  });

  // T1240353
  test('Enter key should not trigger other function besides the function assigned on the clicked button', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        {
          ID: 1,
          Prefix: 'Mr.',
          FirstName: 'John',
        },
      ],
      keyExpr: 'ID',
      columns: ['Prefix', 'FirstName'],
      masterDetail: {
        enabled: true,
        template(container) {
          const buttonContainer = $('<div>')
            .addClass('button-container')
            .appendTo(container);

          $('<button>')
            .text('Edit')
            .attr('id', 'editButton')
            .on('click', () => {
              $('#otherContainer').text('first button');
            })
            .appendTo(buttonContainer);

          $('<button>')
            .text('Focus me and press Enter')
            .on('click', () => {
              $('#otherContainer').text('second button');
            })
            .appendTo(buttonContainer);
        },
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataCell(0, 0).element.click();
    await page.locator('#editButton').click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await expect(page.locator('#otherContainer')).toHaveText('second button');
  });

  test('DataGrid - Data rows are skipped during Tab navigation if the first column is hidden via hidingPriority (T1228477)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(3, 5),
      keyExpr: 'field_0',
      columns: [{
        dataField: 'field_0',
        hidingPriority: 0,
      }, {
        dataField: 'field_1',
        hidingPriority: 1,
      }, 'field_2', 'field_3', 'field_4'],
      showBorders: true,
      width: 300,
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getDataCell(0, 2).element).toHaveAttribute('tabindex', '0');
  });

  test('DataGrid input cell should not put tabindex to incorrect element while on edit mode (T1239462)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      showBorders: true,
      selection: {
        mode: 'multiple',
      },
      editing: {
        mode: 'form',
        allowAdding: true,
      },
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [
        'Calculation',
        'CalculationType',
        {
          type: 'buttons',
          fixed: true,
        },
      ],
      dataSource: {
        store: [],
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getToolbar().getItem(0).click();
    // The editor gets the focus a moment after the row starts editing: a key before it misses.
    await expect(dataGrid.getFormItemEditor(0)).toBeFocused();
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'data-grid_keyboard-navigation-input-text-focused.png', { element: dataGrid.element });
  });

  test('Cancel button in the last column cannot be focused via the Tab key (T1248987)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'ID',
      dataSource: [
        {
          ID: 1,
          FirstName: 'John',
        },
      ],
      showBorders: true,
      editing: {
        allowAdding: true,
        mode: 'row',
        editRowKey: 1,
      },
      columnFixing: {
        enabled: true,
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [
        'FirstName',
      ],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const commandCell = dataGrid.getFixedDataRow(0).getCommandCell(1);
    const editCell = dataGrid.getDataCell(0, 0);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await editCell.element.click();
    await expect(editCell.getEditor().element).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(commandCell.getButton(0)).toBeFocused();
    // The grid focuses the cell's first link again a moment later: a Tab before that is undone.
    await waitForQueuedTimers(page);
    await page.keyboard.press('Tab');
    await expect(commandCell.getButton(1)).toBeFocused();
  });

  test('Grids a11y: Fix the header filter and the column chooser focus issue and update VPAT', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 3),
      headerFilter: {
        visible: true,
      },
      columnChooser: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const headerFilter = new HeaderFilter(page);
    const columnChooser = dataGrid.getColumnChooser();
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getFilterIcon()
      .click();
    // The list takes the focus, then renders again once its items load and leaves the focus on the
    // body: the Tabs start from there.
    await expect(headerFilter.getListItems()).toHaveCount(5);

    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Tab');
    }

    await expect(headerFilter.getButtons().nth(1)).toBeFocused();

    await dataGrid.getColumnChooserButton().click();
    await expect(columnChooser.content).toBeFocused();

    for (let i = 0; i < 3; i += 1) {
      await page.keyboard.press('Tab');
    }

    await expect(columnChooser.getCloseButton()).toBeFocused();
  });

  // T1285421
  test('Multiple DataGrids - Ctrl+Up/Down from filter row should focus data row in the same grid', async ({ page }) => {
    const options: Properties = {
      dataSource: getData(5, 2),
      columns: ['field_0', 'field_1'],
      filterRow: { visible: true },
    };

    await createWidget(page, 'dxDataGrid', options);
    await createWidget(page, 'dxDataGrid', options, OTHER_CONTAINER_SELECTOR);

    const firstGrid = new DataGrid(page, GRID_SELECTOR);
    const secondGrid = new DataGrid(page, OTHER_CONTAINER_SELECTOR);
    const firstGridFilterInput = firstGrid.getFilterCell(0).getEditorInput().element;
    const secondGridFilterInput = secondGrid.getFilterCell(0).getEditorInput().element;
    const firstGridDataCell = firstGrid.getDataCell(0, 0).element;
    const secondGridDataCell = secondGrid.getDataCell(0, 0).element;
    await expect.poll(() => firstGrid.isReady()).toBe(true);
    await expect.poll(() => secondGrid.isReady()).toBe(true);

    await secondGridDataCell.click();

    await page.keyboard.press('Control+ArrowUp');
    await expect(secondGridFilterInput).toBeFocused();
    await expect(firstGridFilterInput).not.toBeFocused();

    await page.keyboard.press('Control+ArrowDown');
    await expect(secondGridDataCell).toBeFocused();
    await expect(firstGridDataCell).not.toBeFocused();
  });

  test('DataGrid + standalone Pagination - Ctrl+Up on focused standalone Pagination should not move focus to the DataGrid', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1' },
        { id: 2, name: 'Name 2' },
        { id: 3, name: 'Name 3' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
    });

    await createWidget(page, 'dxPagination', {
      pageCount: 3,
      pageSize: 1,
      visible: true,
      showPageSizeSelector: true,
      allowedPageSizes: [1, 2, 3],
    }, OTHER_CONTAINER_SELECTOR);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const pageSize = new Pagination(page, OTHER_CONTAINER_SELECTOR).getPageSize(0);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await pageSize.click();
    await expect(pageSize).toBeFocused();

    await page.keyboard.press('Control+ArrowUp');
    await expect(pageSize).toBeFocused();
    await dataGrid.getDataRow(0).expectFocusedRow(false);
  });

  test('DataGrid with Pagination in master detail - Ctrl+Up on focused standalone Pagination should not move focus to the DataGrid', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { id: 1, name: 'Name 1' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      selection: {
        mode: 'single',
      },
      masterDetail: {
        autoExpandAll: true,
        enabled: true,
        template: (container) => {
          $('<div>')
            .attr('id', 'masterDetailPager')
            .appendTo(container)
            // @ts-expect-error dx.all.d.ts typings are missing
            .dxPagination({
              pageCount: 3,
              pageSize: 1,
              visible: true,
              showPageSizeSelector: true,
              allowedPageSizes: [1, 2, 3],
            });
        },
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const pageSize = new Pagination(page, '#masterDetailPager').getPageSize(0);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await pageSize.click();
    await expect(pageSize).toBeFocused();

    await page.evaluate((gridSelector) => {
      (window as any).dataRowFocusCount = 0;
      document.querySelector(gridSelector)?.addEventListener('focusin', (e) => {
        if ((e.target as Element).classList.contains('dx-data-row')) {
          (window as any).dataRowFocusCount += 1;
        }
      });
    }, GRID_SELECTOR);

    await page.keyboard.press('Control+ArrowUp');
    await dataGrid.getDataRow(0).expectFocusedRow(false);
    // The grid itself moves the focus to its headers; the pager must not focus a row first.
    expect(await page.evaluate(() => (window as any).dataRowFocusCount)).toBe(0);
  });

  test('DataGrid - The onKeyDown event should be called once for group panel', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).onKeyDownCallCount = 0;
    });

    await createWidget(page, 'dxDataGrid', ({ data }) => ({
      dataSource: data,
      showBorders: true,
      onKeyDown() {
        (window as any).onKeyDownCallCount += 1;
      },
      groupPanel: {
        visible: true,
      },
      columns: [
        { dataField: 'field_0', groupIndex: 0 },
        { dataField: 'field_1', groupIndex: 1 },
        'field_2',
        'field_3',
        'field_4',
      ],
    }), GRID_SELECTOR, { arg: { data: getData(5, 5) } });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getGroupPanel().getHeader(0).element.click();
    await page.keyboard.press('Tab');

    expect(await getOnKeyDownCallCount(page)).toBe(1);
  });

  test('DataGrid - The onKeyDown event should be called once for headers', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).onKeyDownCallCount = 0;
    });

    await createWidget(page, 'dxDataGrid', ({ data }) => ({
      dataSource: data,
      showBorders: true,
      onKeyDown() {
        (window as any).onKeyDownCallCount += 1;
      },
    }), GRID_SELECTOR, { arg: { data: getData(5, 5) } });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element.click();
    await page.keyboard.press('Tab');

    expect(await getOnKeyDownCallCount(page)).toBe(1);
  });

  // T1299278
  test('The row edit mode - Tab navigation through interactive elements in an editable cell when editCellTemplate is set', async ({ page }) => {
    await createEditCellTemplateGrid(page, 'row');

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const dataCell = dataGrid.getDataCell(0, 0);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiEditRow(0);

    await dataCell.element.click();
    await dataCell.expectEditCell();
    await dataCell.expectFocusVisible();
    await expect(dataCell.getEditor().element).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataGrid.getDataCell(0, 1).element.locator('.my-button')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataGrid.getDataCell(0, 1).element.locator('.my-editor')).toBeFocused();

    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(0, 2).expectEditCell();
    await dataGrid.getDataCell(0, 2).expectFocusVisible();
  });

  // T1299278
  test('The row edit mode - Shift + Tab navigation through interactive elements in an editable cell when editCellTemplate is set', async ({ page }) => {
    await createEditCellTemplateGrid(page, 'row');

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const dataCell = dataGrid.getDataCell(0, 2);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiEditRow(0);

    await dataCell.element.click();
    await dataCell.expectEditCell();
    await dataCell.expectFocusVisible();
    await expect(dataCell.getEditor().element).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(dataGrid.getDataCell(0, 1).element.locator('.my-editor')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(dataGrid.getDataCell(0, 1).element.locator('.my-button')).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await dataGrid.getDataCell(0, 0).expectEditCell();
    await dataGrid.getDataCell(0, 0).expectFocusVisible();
  });

  // T1299278
  test('The batch edit mode - Tab navigation through interactive elements in an editable cell when editCellTemplate is set', async ({ page }) => {
    await createEditCellTemplateGrid(page, 'batch');

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const dataCell = dataGrid.getDataCell(0, 0);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataCell.element.click();
    await dataCell.expectEditCell();
    await dataCell.expectFocusVisible();
    // The editor gets the focus a moment after the cell starts editing: a key before it misses.
    await expect(dataCell.getEditor().element).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataGrid.getDataCell(0, 1).element.locator('.my-button')).toBeFocused();
    // The grid focuses the cell's first input again a moment later: a Tab before that is undone.
    await waitForQueuedTimers(page);

    await page.keyboard.press('Tab');
    await expect(dataGrid.getDataCell(0, 1).element.locator('.my-editor')).toBeFocused();

    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(0, 2).expectEditCell();
    await dataGrid.getDataCell(0, 2).expectFocusVisible();
  });

  // T1299278
  test('The batch edit mode - Shift + Tab navigation through interactive elements in an editable cell when editCellTemplate is set', async ({ page }) => {
    await createEditCellTemplateGrid(page, 'batch');

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const dataCell = dataGrid.getDataCell(0, 2);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataCell.element.click();
    await dataCell.expectEditCell();
    await dataCell.expectFocusVisible();
    // The editor gets the focus a moment after the cell starts editing: a key before it misses.
    await expect(dataCell.getEditor().element).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(dataGrid.getDataCell(0, 1).element.locator('.my-button')).toBeFocused();
    // The grid focuses the cell's first input again a moment later: a Tab before that is undone.
    await waitForQueuedTimers(page);

    await page.keyboard.press('Shift+Tab');
    await dataGrid.getDataCell(0, 0).expectEditCell();
    await dataGrid.getDataCell(0, 0).expectFocusVisible();
  });

  test('DataGrid - Cell focus works incorrectly if the command column has a disabled native button element (T1179207)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', ({ data }) => ({
      dataSource: data,
      showBorders: true,
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowDeleting: true,
      },
      columns: ['field_0', 'field_1', {
        type: 'buttons',
        buttons: [{
          template() {
            return $('<button>').text('Edit');
          },
        }, {
          template() {
            return $('<button>').attr({
              disabled: true,
            }).text('Delete');
          },
        }],
      }],
    }), GRID_SELECTOR, { arg: { data: getData(2, 2) } });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();

    for (let i = 0; i < 4; i += 1) {
      await page.keyboard.press('Tab');
    }

    // After a Tab from the headers, the grid takes over the cell's focus a moment later: a Tab
    // before that is lost.
    await dataGrid.getDataCell(0, 0).expectFocusVisible();

    for (let i = 0; i < 3; i += 1) {
      await page.keyboard.press('Tab');
    }

    await expect(page.locator('td:focus')).toHaveAttribute('aria-colindex', '1');
  });

  test('All rows should be focused on arrow-up/down when virtual scrolling enabled with group summary (T1014612)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ],
      keyExpr: 'id',
      grouping: {
        autoExpandAll: true,
      },
      scrolling: {
        mode: 'virtual',
      },
      summary: {
        groupItems: [{
          column: 'id',
          summaryType: 'count',
          showInGroupFooter: true,
        }],
      },
      columns: ['id', {
        dataField: 'name',
        groupIndex: 0,
      }],
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();
    await page.keyboard.press('Tab');
    await expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1).element).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dataGrid.getGroupRow(0).element).toBeFocused();
    await dataGrid.getGroupRow(0).expectFocusVisible();

    await page.keyboard.press('ArrowDown');
    await expect(dataGrid.getDataCell(1, 1).element).toBeFocused();
    await dataGrid.getDataCell(1, 1).expectFocusVisible();

    await page.keyboard.press('ArrowDown');
    await expect(dataGrid.getGroupFooterRow(0)).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(dataGrid.getGroupRow(1).element).toBeFocused();
    await dataGrid.getGroupRow(1).expectFocusVisible();

    await page.keyboard.press('ArrowDown');
    await expect(dataGrid.getDataCell(4, 1).element).toBeFocused();
    await dataGrid.getDataCell(4, 1).expectFocusVisible();

    await page.keyboard.press('ArrowUp');
    await expect(dataGrid.getGroupRow(1).element).toBeFocused();
    await dataGrid.getGroupRow(1).expectFocusVisible();

    await page.keyboard.press('ArrowUp');
    await expect(dataGrid.getGroupFooterRow(0)).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(dataGrid.getDataCell(1, 1).element).toBeFocused();
    await dataGrid.getDataCell(1, 1).expectFocusVisible();

    await page.keyboard.press('ArrowUp');
    await expect(dataGrid.getGroupRow(0).element).toBeFocused();
    await dataGrid.getGroupRow(0).expectFocusVisible();
  });

  test('The last cell should be focused after changing the page size (T1063530)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(5)].map((_, i) => ({ ID: i + 1, Name: `Name ${i + 1}` })),
      keyExpr: 'ID',
      columnWidth: 150,
      paging: {
        pageSize: 2,
      },
      pager: {
        visible: true,
        allowedPageSizes: [1, 2],
        showPageSizeSelector: true,
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const pager = dataGrid.getPager();
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await addFocusableElementBefore(page, GRID_SELECTOR);

    await page.locator(FOCUSABLE_START).click();

    for (let i = 0; i < 3; i += 1) {
      await page.keyboard.press('Tab');
    }

    await dataGrid.getDataCell(0, 0).expectFocusVisible();

    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(0, 1).expectFocusVisible();

    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(1, 0).expectFocusVisible();

    await page.keyboard.press('Tab');
    await dataGrid.getDataCell(1, 1).expectFocusVisible();

    await page.keyboard.press('Tab');
    await expect(pager.getPageSize(0)).toBeFocused();

    await page.keyboard.press('Space');
    await expect.poll(async () => (await dataGrid.apiGetVisibleRows()).length).toBe(1);

    await page.keyboard.press('Shift+Tab');
    await dataGrid.getDataCell(0, 1).expectFocusVisible();
  });

  [true, false].forEach((useNativeScrolling) => {
    FOCUS_EVENTS_CASES.forEach(({
      title, key, rowCount, columnCount, options, lastCell, events,
      scrolledToBottom, scrolledToRight,
    }) => {
      test(`${title} (scrolling.useNative = ${useNativeScrolling})`, async ({ page }) => {
        await resetFocusedEvents(page);
        await createFocusEventsGrid(page, {
          dataSource: getData(rowCount, columnCount),
          columnWidth: 100,
          height: 500,
          width: 800,
          showBorders: true,
          ...options,
          scrolling: {
            ...options.scrolling,
            useNative: useNativeScrolling,
          },
        });

        const dataGrid = new DataGrid(page, GRID_SELECTOR);
        await expect.poll(() => dataGrid.isReady()).toBe(true);

        await dataGrid.getDataCell(0, 0).element.click();
        await expect(options.focusedRowEnabled
          ? dataGrid.getDataRow(0).element
          : dataGrid.getDataCell(0, 0).element).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(dataGrid.getDataCell(0, 1).element).toBeFocused();

        await resetFocusedEvents(page);
        await page.keyboard.press(key);

        await expect.poll(() => dataGrid.isReady()).toBe(true);
        if (scrolledToBottom) {
          await expect.poll(() => dataGrid.isScrolledToBottom()).toBe(true);
        }
        if (scrolledToRight) {
          await expect.poll(() => dataGrid.isScrolledToRight()).toBe(true);
        }
        await expect(dataGrid.getDataCell(...lastCell).element).toBeFocused();
        await expect.poll(() => getFocusedEvents(page)).toMatchObject(events);
      });
    });
  });

  test('Focus should be set to the grid to allow keyboard navigation when the focus method is called (T1308919)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }],
      keyExpr: 'id',
      focusedRowEnabled: true,
    });
    await createWidget(page, 'dxButton', () => ({
      text: 'Focus Grid',
      onClick() {
        ($('#container') as any).dxDataGrid('instance').focus();
      },
    }), OTHER_CONTAINER_SELECTOR);

    const button = new Button(page, OTHER_CONTAINER_SELECTOR);
    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const firstDataCell = dataGrid.getDataCell(0, 0);
    const firstRow = dataGrid.getDataRow(0);
    const secondRow = dataGrid.getDataRow(1);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiFocus(firstDataCell.element);

    await firstDataCell.expectFocusVisible();
    await firstRow.expectFocusedRow();

    await button.focus();

    await button.expectFocused();
    await firstDataCell.expectFocusVisible(false);
    await firstRow.expectFocusedRow();

    await page.keyboard.press('ArrowDown');

    await secondRow.expectFocusedRow(false);

    // Enter clicks the button, which focuses the grid.
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');

    await secondRow.expectFocusedRow();
  });

  [true, false].forEach((focusedRowEnabled) => {
    test(`Focus should return to the last active cell when re-entering the rowsview via kbn if focusedRowEnabled=${focusedRowEnabled} (T1308919)`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }],
        keyExpr: 'id',
        focusedRowEnabled,
        searchPanel: { visible: true },
      });
      await createWidget(page, 'dxButton', { text: 'Focus receiver' }, OTHER_CONTAINER_SELECTOR);

      const button = new Button(page, OTHER_CONTAINER_SELECTOR);
      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const searchPanel = dataGrid.getSearchBox();
      const secondIDCell = dataGrid.getDataCell(1, 0);
      const secondNameCell = dataGrid.getDataCell(1, 1);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await searchPanel.input.click();
      for (let i = 0; i < 3; i += 1) {
        await page.keyboard.press('Tab');
      }
      // After a Tab from the headers, the grid takes over the cell's focus a moment later: a Tab
      // before that is lost.
      await dataGrid.getDataCell(0, 0).expectFocusVisible();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      await secondIDCell.expectFocusVisible();

      await searchPanel.focus();

      await searchPanel.expectFocused();
      await secondIDCell.expectFocusVisible(false);

      for (let i = 0; i < 3; i += 1) {
        await page.keyboard.press('Tab');
      }

      await secondIDCell.expectFocusVisible();

      await page.keyboard.press('Tab');
      // The grid takes over the cell's focus a moment after the Tab: a Tab out before that leaves a
      // cell the grid hasn't focused yet.
      await secondNameCell.expectFocusVisible();
      await page.keyboard.press('Tab');

      await button.expectFocused();

      await page.keyboard.press('Shift+Tab');

      await secondNameCell.expectFocusVisible();
    });
  });
});
