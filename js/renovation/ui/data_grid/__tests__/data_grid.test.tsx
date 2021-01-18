import React from 'react';
import { mount } from 'enzyme';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import each from 'jest-each';
import { DataGrid, viewFunction as DataGridView } from '../data_grid';
import { DataGridProps } from '../props';
import { Widget } from '../../common/widget';
import { DataGridViews } from '../data_grid_views';
import '../datagrid_component';

jest.mock('../data_grid_views', () => ({ DataGridViews: () => null }));
jest.mock('../../../../ui/data_grid/ui.data_grid', () => jest.fn());
jest.mock('../datagrid_component', () => ({
  DataGridComponent: jest.fn().mockImplementation((options) => ({
    option() { return options; },
  })),
}));

describe('DataGrid', () => {
  describe('View', () => {
    it('default render', () => {
      const gridInstance = {} as any;
      const props = {
        restAttributes: { 'rest-attributes': 'true' },
        gridInstance,
      } as Partial<DataGrid>;
      const tree = mount(<DataGridView {...props as any} /> as any);

      expect(tree.find(Widget).props()).toMatchObject({
        'rest-attributes': 'true',
      });
      expect(tree.find(DataGridViews).props()).toMatchObject({
        gridInstance,
      });
    });
  });

  describe('Logic', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const mockDispose = jest.fn();
    const mockOption = jest.fn();

    const mockDataGridMethods = {
      dispose: mockDispose,
      option: mockOption,
    };

    it('Init', () => {
      const component = new DataGrid({});
      component.props = {
        columns: ['test'],
      } as DataGridProps;
      const { gridInstance } = component;

      expect(gridInstance.option()).toMatchObject(component.props);

      const gridInstance2 = component.gridInstance;

      expect(gridInstance).toBe(gridInstance2);
    });

    each`
      methodName
      ${'beginCustomLoading'}
      ${'byKey'}
      ${'cancelEditData'}
      ${'cellValue'}
      ${'clearFilter'}
      ${'clearSelection'}
      ${'clearSorting'}
      ${'closeEditCell'}
      ${'collapseAdaptiveDetailRow'}
      ${'columnCount'}
      ${'columnOption'}
      ${'deleteColumn'}
      ${'deleteRow'}
      ${'deselectAll'}
      ${'deselectRows'}
      ${'editCell'}
      ${'editRow'}
      ${'endCustomLoading'}
      ${'expandAdaptiveDetailRow'}
      ${'filter'}
      ${'focus'}
      ${'getCellElement'}
      ${'getCombinedFilter'}
      ${'getDataSource'}
      ${'getKeyByRowIndex'}
      ${'getRowElement'}
      ${'getRowIndexByKey'}
      ${'getScrollable'}
      ${'getVisibleColumnIndex'}
      ${'hasEditData'}
      ${'hideColumnChooser'}
      ${'isAdaptiveDetailRowExpanded'}
      ${'isRowFocused'}
      ${'isRowSelected'}
      ${'keyOf'}
      ${'navigateToRow'}
      ${'pageCount'}
      ${'pageIndex'}
      ${'pageSize'}
      ${'refresh'}
      ${'repaintRows'}
      ${'saveEditData'}
      ${'searchByText'}
      ${'selectAll'}
      ${'selectRows'}
      ${'selectRowsByIndexes'}
      ${'showColumnChooser'}
      ${'undeleteRow'}
      ${'updateDimensions'}
      ${'addColumn'}
      ${'addRow'}
      ${'clearGrouping'}
      ${'collapseAll'}
      ${'collapseRow'}
      ${'expandAll'}
      ${'expandRow'}
      ${'exportToExcel'}
      ${'getSelectedRowKeys'}
      ${'getSelectedRowsData'}
      ${'getTotalSummaryValue'}
      ${'getVisibleColumns'}
      ${'getVisibleRows'}
      ${'isRowExpanded'}
      ${'totalCount'}
      ${'getController'}
    `
      .describe('Methods', ({
        methodName,
      }) => {
        it(methodName, () => {
          mockDataGridMethods[methodName] = jest.fn();
          const component = new DataGrid({});
          component.componentInstance = mockDataGridMethods as any;

          component[methodName]();

          expect(mockDataGridMethods[methodName]).toHaveBeenCalled();
        });

        it(`${methodName} if widget is not initialized`, () => {
          const component = new DataGrid({});
          component.init = jest.fn();
          component.componentInstance = null as any;
          component[methodName]();

          expect.assertions(0);
        });
      });
  });
});
