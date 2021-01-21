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
      const instance = {} as any;
      const props = {
        accessKey: 'accessKey',
        activeStateEnabled: false,
        disabled: false,
        focusStateEnabled: false,
        height: 400,
        hint: 'hint',
        hoverStateEnabled: false,
        onContentReady: jest.fn(),
        rtlEnabled: false,
        tabIndex: 0,
        visible: true,
        width: 800,
      } as Partial<DataGridProps>;
      const gridProps = {
        aria: {
          role: 'presentation',
        },
        restAttributes: { 'rest-attributes': 'true' },
        instance,
        props,
      } as Partial<DataGridProps>;
      const tree = mount(<DataGridView {...gridProps as any} /> as any);

      expect(tree.find(Widget).props()).toMatchObject({
        ...props,
        aria: gridProps.aria,
        'rest-attributes': 'true',
      });
      expect(tree.find(DataGridViews).props()).toMatchObject({
        instance,
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
      const { instance } = component;

      expect(instance.option()).toMatchObject(component.props);

      const instance2 = component.instance;

      expect(instance).toBe(instance2);
    });

    it('Init when property as undefined', () => {
      const component = new DataGrid({});
      component.props = {
        columns: undefined,
      } as DataGridProps;
      const { instance } = component;

      expect(Object.prototype.hasOwnProperty.call(instance.option(), 'columns')).toBe(false);
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
