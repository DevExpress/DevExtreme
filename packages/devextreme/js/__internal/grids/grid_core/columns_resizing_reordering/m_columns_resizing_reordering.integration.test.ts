import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import {
  end as dragEventEnd,
  move as dragEventMove,
  start as dragEventStart,
} from '@js/common/core/events/drag';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type DataGrid from '@js/ui/data_grid';
import errors from '@js/ui/widget/ui.errors';
import { fire } from '@ts/__tests__/utils';
import type { DataGridModel } from '@ts/grids/data_grid/__tests__/__mock__/model/data_grid';

import {
  afterTest as baseAfterTest,
  beforeTest as baseBeforeTest,
  createDataGrid,
} from '../__tests__/__mock__/helpers/utils';

const beforeTest = (): void => {
  baseBeforeTest();
  jest.spyOn(errors, 'log').mockImplementation(jest.fn());
};

const afterTest = baseAfterTest;

describe('Performance optimization', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  const createGridWith200Columns = async (): Promise<{
    $container: dxElementWrapper;
    component: DataGridModel;
    instance: DataGrid;
  }> => {
    const columns = [
      {
        dataField: 'id', caption: 'ID', width: '100px', fixed: true,
      },
      {
        caption: 'Name',
        columns: [
          { dataField: 'name.first', caption: 'First name', width: '150px' },
          { dataField: 'name.last', caption: 'Last name', width: '150px' },
        ],
      },
      ...Array.from({ length: 198 }, (_, index) => ({
        dataField: `values.${index}`,
        caption: `Value ${index + 1}`,
        width: '100px',
      })),
    ];

    const dataSource = [
      {
        id: 1,
        name: { first: 'John', last: 'Doe' },
        values: Array.from({ length: 198 }, (_, index) => index + 1),
      },
    ];

    return createDataGrid({
      dataSource,
      columns,
      width: '100%',
      showBorders: true,
      showColumnLines: true,
      allowColumnResizing: true,
      allowColumnReordering: true,
    });
  };

  describe('ColumnsResizerViewController', () => {
    it('should call "_pointCreated" 202 times when generating points by columns (1 fixed + 1 group + 2 group children + 198 regular)', async () => {
      const { instance } = await createGridWith200Columns();
      const columnsResizerController = (instance as any).getController('columnsResizer');

      const pointCreatedSpy = jest.spyOn(columnsResizerController, '_pointCreated');

      columnsResizerController.pointsByColumns();

      expect(pointCreatedSpy).toHaveBeenCalledTimes(202);
    });

    it('should call "getColumnElements" as many times as there are head rows', async () => {
      const { instance } = await createGridWith200Columns();
      const columnsResizerController = (instance as any).getController('columnsResizer');
      const columnHeadersView = (instance as any).getView('columnHeadersView');

      const columnHeadersViewSpy = jest.spyOn(columnHeadersView, 'getColumnElements');

      columnsResizerController.pointsByColumns();

      expect(columnHeadersViewSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('DraggingHeaderViewController', () => {
    const getDragEvent = (
      eventName: string,
      headerOffset: { left: number; top: number },
      dragOffset: { left: number; top: number },
    ) => {
      const dragEndEvent = document.createEvent('CustomEvent') as any;

      dragEndEvent.initCustomEvent(eventName, true, true);
      dragEndEvent.pageX = headerOffset.left + dragOffset.left;
      dragEndEvent.pageY = headerOffset.top + dragOffset.top;
      dragEndEvent.pointerType = 'mouse';

      return dragEndEvent;
    };

    it('should call "getBoundingRect" once for each dragging panel view', async () => {
      const { instance } = await createGridWith200Columns();
      const columnHeadersView = (instance as any).getView('columnHeadersView');
      const columnChooserView = (instance as any).getView('columnChooserView');
      const headerPanelView = (instance as any).getView('headerPanel');

      const getBoundingViewMocks = [
        jest.spyOn(columnHeadersView, 'getBoundingRect'),
        jest.spyOn(columnChooserView, 'getBoundingRect'),
        jest.spyOn(headerPanelView, 'getBoundingRect'),
      ];

      const $headerCell = $(columnHeadersView.element()).find('.dx-header-row td').eq(5);
      const headerOffset = $headerCell.offset();

      if (!headerOffset) {
        throw new Error('Header cell not found');
      }

      const dragStartOffset = { left: 10, top: 10 };
      const dragStartEvent = getDragEvent(dragEventStart, headerOffset, dragStartOffset);
      $headerCell.get(0)?.dispatchEvent(dragStartEvent);

      const dragMoveOffset = { left: 500, top: 10 };
      const dragMoveEvent = getDragEvent(dragEventMove, headerOffset, dragMoveOffset);
      $headerCell.get(0)?.dispatchEvent(dragMoveEvent);

      const dragEndOffset = { left: 500, top: 10 };
      const dragEndEvent = getDragEvent(dragEventEnd, headerOffset, dragEndOffset);
      $headerCell.get(0)?.dispatchEvent(dragEndEvent);

      getBoundingViewMocks.forEach((getBoundingViewMock) => {
        expect(getBoundingViewMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe('Column resize separator bounds (T1335911)', () => {
  beforeEach(beforeTest);
  afterEach(() => {
    afterTest();
    jest.restoreAllMocks();
  });

  const createResizableGrid = async (
    fixed: boolean,
    columnResizingMode: 'widget' | 'nextColumn' = 'widget',
  ): ReturnType<typeof createDataGrid> => {
    let grid: DataGrid | null = null;
    const fields = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];
    const initialWidths = [180, 100, 100, 100, 100];
    const createRect = (left: number, width: number): DOMRect => ({
      x: left,
      y: 50,
      width,
      height: 24,
      top: 50,
      right: left + width,
      bottom: 74,
      left,
      toJSON: () => ({}),
    });

    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function getRect(this: Element): DOMRect {
      const widths = fields.map((field, index) => Number(grid?.columnOption(field, 'width') ?? initialWidths[index]));
      if (this.matches('.dx-header-row > td')) {
        const index = Array.from(this.parentElement?.children ?? []).indexOf(this);
        const left = fixed && index >= 3
          ? 600 - widths.slice(index).reduce((sum, width) => sum + width, 0)
          : 100 + widths.slice(0, index).reduce((sum, width) => sum + width, 0);

        return createRect(left, widths[index]);
      }

      return createRect(100, 500);
    });
    jest.spyOn(Element.prototype, 'getClientRects').mockImplementation(function getRects(this: Element): DOMRectList {
      return [this.getBoundingClientRect()] as unknown as DOMRectList;
    });
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function getWidth(this: HTMLElement): number {
      return this.getBoundingClientRect().width;
    });
    jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(24);

    const result = await createDataGrid({
      dataSource: [{ id: 1, City: 'Atlanta' }],
      columns: fields.map((dataField, index) => ({
        dataField,
        width: initialWidths[index],
        fixed: fixed && index >= 3,
        fixedPosition: 'right',
      })),
      width: 500,
      height: 300,
      allowColumnResizing: true,
      columnResizingMode,
    });
    grid = result.instance;
    result.$container.find('.dx-header-row').css('height', 24);
    result.$container.find('.dx-datagrid-columns-separator').css('width', 3);

    return result;
  };

  it('keeps the separator between adjacent right-fixed columns in nextColumn mode (T1335911)', async () => {
    const { $container, instance } = await createResizableGrid(true, 'nextColumn');
    const header = $container.find('.dx-header-row > td').get(3);

    fire(header, 'dxpointermove', { x: 500, y: 60, pointerType: 'mouse' });
    fire(header, 'dxpointerdown', { x: 500, y: 60, pointerType: 'mouse' });
    fire(header, 'dxpointermove', { x: 470, y: 60, pointerType: 'mouse' });

    expect(instance.columnOption('Phone', 'width')).toBe(70);
    expect(instance.columnOption('Fax', 'width')).toBe(130);
    expect($container.find('.dx-datagrid-columns-separator').css('left')).toBe('370px');

    fire($container.get(0), 'dxpointermove', { x: 530, y: 60, pointerType: 'mouse' });

    expect(instance.columnOption('Phone', 'width')).toBe(130);
    expect(instance.columnOption('Fax', 'width')).toBe(70);
    expect($container.find('.dx-datagrid-columns-separator').css('left')).toBe('430px');
  });

  it('keeps the separator before right-fixed columns while the resized column continues growing (T1335911)', async () => {
    const { $container, instance } = await createResizableGrid(true);
    const header = $container.find('.dx-header-row > td').get(1);

    fire(header, 'dxpointermove', { x: 380, y: 60, pointerType: 'mouse' });
    fire(header, 'dxpointerdown', { x: 380, y: 60, pointerType: 'mouse' });
    fire(header, 'dxpointermove', { x: 800, y: 60, pointerType: 'mouse' });

    expect(instance.columnOption('City', 'width')).toBe(520);
    expect($container.find('.dx-datagrid-columns-separator').css('left')).toBe('297px');

    fire($container.get(0), 'dxpointermove', { x: 330, y: 60, pointerType: 'mouse' });

    expect(instance.columnOption('City', 'width')).toBe(50);
    expect($container.find('.dx-datagrid-columns-separator').css('left')).toBe('230px');
  });

  it('keeps the entire separator inside the grid without fixed columns while the resized column continues growing (T1335911)', async () => {
    const { $container, instance } = await createResizableGrid(false);
    const header = $container.find('.dx-header-row > td').get(1);

    fire(header, 'dxpointermove', { x: 380, y: 60, pointerType: 'mouse' });
    fire(header, 'dxpointerdown', { x: 380, y: 60, pointerType: 'mouse' });
    fire(header, 'dxpointermove', { x: 800, y: 60, pointerType: 'mouse' });

    expect(instance.columnOption('City', 'width')).toBe(520);
    expect($container.find('.dx-datagrid-columns-separator').css('left')).toBe('497px');
  });

  it('keeps the separator before right-fixed columns when the page scrolls horizontally during resizing (T1335911)', async () => {
    const { $container, instance } = await createResizableGrid(true);
    const header = $container.find('.dx-header-row > td').get(1);

    fire(header, 'dxpointermove', { x: 380, y: 60, pointerType: 'mouse' });
    fire(header, 'dxpointerdown', { x: 380, y: 60, pointerType: 'mouse' });
    jest.replaceProperty(window, 'pageXOffset', 120);
    fire(header, 'dxpointermove', { x: 800, y: 60, pointerType: 'mouse' });

    expect(instance.columnOption('City', 'width')).toBe(520);
    expect($container.find('.dx-datagrid-columns-separator').css('left')).toBe('297px');
  });
});
