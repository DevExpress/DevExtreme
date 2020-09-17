/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { mount, shallow } from 'enzyme';
import each from 'jest-each';
import DxDataGrid from '../../../../ui/data_grid';
import { viewFunction as DataGridView, DataGrid } from '../data_grid';
import { DataGridProps } from '../props';

const mockDispose = jest.fn();
const mockOption = jest.fn();

const mockDataGridMethods = {
  dispose: mockDispose,
  option: mockOption,
};

jest.mock('../../../../ui/data_grid/ui.data_grid', () => {
  const MockDxDataGrid = jest.fn().mockImplementation(() => mockDataGridMethods);
  (MockDxDataGrid as any).getInstance = jest.fn();
  return MockDxDataGrid;
});

const createWidget = () => {
  const component = new DataGrid({});
  component.widgetRef = {} as HTMLDivElement;
  return component;
};

describe('DataGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('View', () => {
    it('default render', () => {
      const widgetRef = React.createRef();
      const props = {
        props: new DataGridProps(),
        widgetRef,
        restAttributes: { 'rest-attributes': 'true' },
      } as any as Partial<DataGrid>;
      const tree = mount(<DataGridView {...props as any} /> as any);

      expect(tree.find('div').props()).toEqual({
        className: '',
        'rest-attributes': 'true',
      });
      expect(tree.find('div').instance()).toBe(widgetRef.current);
    });

    it('set className', () => {
      const props = {
        props: {
          className: 'custom-class',
        },
      } as any as Partial<DataGrid>;

      const tree = shallow<DataGrid>(<DataGridView {...props as any} /> as any);

      expect(tree.props().className).toEqual('custom-class');
    });
  });

  describe('Logic', () => {
    describe('properties', () => {
      it('picks props', () => {
        const dataSource = [];
        const component = new DataGrid({
          dataSource,
          tabIndex: 2,
          disabled: true,
        });

        const { properties } = component;

        expect(properties.dataSource).toStrictEqual(dataSource);
        expect(properties.tabIndex).toStrictEqual(2);
        expect(properties.disabled).toStrictEqual(true);
      });
    });

    describe('effects', () => {
      it('setupWidget', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.setupWidget();

        expect(DxDataGrid).toBeCalledTimes(1);
        expect(DxDataGrid).toBeCalledWith(component.widgetRef, spy.mock.results[0].value);
      });

      it('setupWidget returns dispose widget callback', () => {
        const component = createWidget();
        const dispose = component.setupWidget();

        dispose();

        expect(mockDispose).toBeCalledTimes(1);
      });

      it('updateWidget. Widget is not initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.updateWidget();

        expect(DxDataGrid).toBeCalledTimes(0);
        expect(spy).toBeCalledTimes(0);
      });

      it('updateWidget. Widget is initialized', () => {
        const component = createWidget();
        component.setupWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.updateWidget();

        expect(mockOption).toBeCalledWith(spy.mock.results[0].value);
      });
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
          const component = createWidget();
          component.setupWidget();

          component[methodName]();

          expect(mockDataGridMethods[methodName]).toHaveBeenCalled();
        });

        it(`${methodName} if widget is not initialized`, () => {
          const component = createWidget();

          component[methodName]();

          expect.assertions(0);
        });
      });
  });
});
