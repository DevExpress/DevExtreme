import React from 'react';
import { mount } from 'enzyme';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import each from 'jest-each';
import { RefObject } from '@devextreme-generator/declarations';
import { DataGrid, viewFunction as DataGridView } from '../data_grid';
import { DataGridProps } from '../common/data_grid_props';
import { Widget } from '../../../common/widget';
import { DataGridViews } from '../data_grid_views';
import '../datagrid_component';
import { getUpdatedOptions } from '../utils/get_updated_options';

jest.mock('../data_grid_views', () => ({ DataGridViews: () => null }));
jest.mock('../../../../../ui/data_grid/ui.data_grid', () => jest.fn());
jest.mock('../datagrid_component', () => ({
  DataGridComponent: jest.fn().mockImplementation((element, options) => ({
    option: () => options,
    dispose: jest.fn(),
    on: jest.fn(),
    element: () => element,
    getController: jest.fn().mockImplementation(() => ({
      updateSize: jest.fn(),
    })),
  })),
}));
jest.mock('../utils/get_updated_options');

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
      } as Partial<DataGridProps> & { aria: Record<string, unknown> };
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

      const instance = component.createInstance();

      expect(instance.option()).toMatchObject(component.props);
    });

    it('Init when property as undefined', () => {
      const component = new DataGrid({});
      component.props = {
        columns: undefined,
      } as DataGridProps;

      const instance = component.createInstance();

      expect(Object.prototype.hasOwnProperty.call(instance.option(), 'columns')).toBe(false);
    });

    it('Init with widgetElementRef', () => {
      const component = new DataGrid({});
      component.widgetElementRef = {
        current: {} as HTMLDivElement,
      } as RefObject;

      const instance = component.createInstance();

      expect(instance.element()).toBe(component.widgetElementRef.current);
    });

    describe('Methods', () => {
      it('getComponentInstance', () => {
        const component = new DataGrid({});
        component.instance = mockDataGridMethods as any;

        expect(component.getComponentInstance()).toMatchObject(mockDataGridMethods);
      });

      it('callMethod with diff args', () => {
        (mockDataGridMethods as any).columnOption = jest.fn();
        const component = new DataGrid({});
        component.instance = mockDataGridMethods as any;

        component.callMethod('columnOption', [0, 'visible', false]);

        expect((mockDataGridMethods as any).columnOption).toBeCalledTimes(1);
        expect((mockDataGridMethods as any).columnOption.mock.calls[0]).toEqual([0, 'visible', false]);

        (mockDataGridMethods as any).columnOption.mockClear();

        component.callMethod('columnOption', [0, 'visible', undefined]);

        expect((mockDataGridMethods as any).columnOption).toBeCalledTimes(1);
        expect((mockDataGridMethods as any).columnOption.mock.calls[0]).toEqual([0, 'visible']);
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
      ${'resize'}
    `
        .describe('Proxying the Grid methods', ({
          methodName,
        }) => {
          it(methodName, () => {
            mockDataGridMethods[methodName] = jest.fn();
            const component = new DataGrid({});
            component.instance = mockDataGridMethods as any;

            component[methodName]();

            expect(mockDataGridMethods[methodName]).toHaveBeenCalled();
          });

          it(`${methodName} if widget is not initialized`, () => {
            const component = new DataGrid({});
            component.createInstance = jest.fn();
            component.instance = null as any;
            component[methodName]();

            expect.assertions(0);
          });
        });
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      it('dispose', () => {
        const component = new DataGrid({});

        component.initInstanceElement();

        component.dispose()();

        expect(component.instance.dispose).toBeCalledTimes(1);
      });
    });

    describe('Events', () => {
      it('onHoverStart, onHoverEnd handlers should update hover state', () => {
        const component = new DataGrid({});
        const currentTarget = {
          classList: {
            add: jest.fn(),
            remove: jest.fn(),
          },
        } as any;

        component.onHoverStart({
          currentTarget,
        } as Event);

        expect(currentTarget.classList.remove).toBeCalledTimes(0);
        expect(currentTarget.classList.add).toBeCalledTimes(1);
        expect(currentTarget.classList.add).toHaveBeenCalledWith('dx-state-hover');

        component.onHoverEnd({
          currentTarget,
        } as Event);

        expect(currentTarget.classList.add).toBeCalledTimes(1);
        expect(currentTarget.classList.remove).toBeCalledTimes(1);
        expect(currentTarget.classList.remove).toHaveBeenCalledWith('dx-state-hover');
      });
    });
  });

  describe('', () => {
    it('updateOptions', () => {
      (getUpdatedOptions as jest.Mock).mockReturnValue([{ path: 'columns', value: ['test', 'test2'] }]);
      const initialProps = {
        columns: ['test'],
      } as DataGridProps;
      const component = new DataGrid(initialProps);

      component.initInstanceElement();

      component.instance.option = jest.fn();
      component.instance.beginUpdate = jest.fn();
      component.instance.endUpdate = jest.fn();
      component.updateOptions();
      expect(component.prevProps).toBe(initialProps);
      component.props = {
        columns: ['test', 'test2'],
      } as DataGridProps;
      component.updateOptions();
      expect(getUpdatedOptions).toBeCalledTimes(1);
      expect(getUpdatedOptions).toBeCalledWith(initialProps, component.props);
      expect(component.prevProps).toBe(component.props);
      expect(component.instance.option).toBeCalledWith('columns', ['test', 'test2']);
      expect(component.instance.beginUpdate).toBeCalledTimes(1);
      expect(component.instance.endUpdate).toBeCalledTimes(1);
    });
  });

  describe('Two way props synchronization', () => {
    it('initInstanceElement effect subscribes to optionChanged event with instanceOptionChangedHandler handler', () => {
      const initialProps = {
      } as DataGridProps;
      const component = new DataGrid(initialProps);
      const e = { component: { option: jest.fn() } };

      component.instanceOptionChangedHandler = jest.fn();

      component.initInstanceElement();

      expect(component.instance.on).toBeCalledWith('optionChanged', expect.any(Function));

      const calledOptionChangedHandler = (component.instance.on as jest.Mock).mock.calls[0][1];
      calledOptionChangedHandler(e);

      expect(component.instanceOptionChangedHandler).toBeCalledWith(e);
    });

    test.each`
    propName
    ${'focusedRowKey'}
    ${'focusedRowIndex'}
    ${'focusedColumnIndex'}
    ${'filterValue'}
    ${'selectedRowKeys'}
    ${'selectionFilter'}
    `('$propName property should be assigned on optionChanged event call', ({ propName }) => {
      const prevValue = null;
      const newValue = {};
      const props = {
      } as DataGridProps;
      props[propName] = prevValue;
      const component = new DataGrid(props);

      component.instanceOptionChangedHandler({
        name: propName,
        fullName: propName,
        value: newValue,
        previousValue: null,
        component: { option: (name) => name === propName && newValue },
      });

      expect(component.props[propName]).toBe(newValue);
    });

    test.each`
    propName
    ${'changes'}
    ${'editRowKey'}
    ${'editColumnName'}
    `('edting.$propName property should be assigned on optionChanged event call', ({ propName }) => {
      const prevValue = null;
      const newValue = {};
      const props = {
      } as DataGridProps;
      props.editing = { [propName]: prevValue };
      const component = new DataGrid(props);
      const fullPropName = `editing.${propName}`;

      component.instanceOptionChangedHandler({
        name: 'editing',
        fullName: fullPropName,
        value: newValue,
        previousValue: null,
        component: { option: (name) => name === fullPropName && newValue },
      });

      expect((component.props.editing as any)[propName]).toBe(newValue);
    });

    test('property should not be assigned if compomnent value is changed during updating', () => {
      const oldValue = -1;
      const newValue = 1;
      const componentValue = 2;
      const propName = 'focusedRowIndex';

      const props = {
      } as DataGridProps;
      props[propName] = oldValue;
      const component = new DataGrid(props);

      component.instanceOptionChangedHandler({
        name: propName,
        fullName: propName,
        value: newValue,
        previousValue: null,
        component: { option: (name) => name === propName && componentValue },
      });

      expect(component.props[propName]).toBe(oldValue);
    });

    test('property should not be assigned if value is not changed', () => {
      const oldValue = null;
      const newValue = [];
      const propName = 'focusedRowKey';

      const props = {
      } as DataGridProps;
      props[propName] = oldValue;
      const component = new DataGrid(props);

      component.instanceOptionChangedHandler({
        name: propName,
        fullName: propName,
        value: newValue,
        previousValue: newValue,
        component: { option: (name) => name === propName && newValue },
      });

      expect(component.props[propName]).toBe(oldValue);
    });
  });
});
