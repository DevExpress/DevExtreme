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
