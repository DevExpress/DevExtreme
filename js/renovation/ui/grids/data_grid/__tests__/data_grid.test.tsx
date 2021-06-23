import React from 'react';
import { mount } from 'enzyme';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import each from 'jest-each';
import { RefObject } from '@devextreme-generator/declarations';
import { DataGrid, viewFunction as DataGridView, defaultOptionRules } from '../data_grid';
import { DataGridEditing, DataGridProps } from '../common/data_grid_props';
import { Widget } from '../../../common/widget';
import { DataGridViews } from '../data_grid_views';
import '../datagrid_component';
import { getUpdatedOptions } from '../utils/get_updated_options';
import { convertRulesToOptions } from '../../../../../core/options/utils';
import devices from '../../../../../core/devices';
import { current } from '../../../../../ui/themes';
import { hasWindow } from '../../../../../core/utils/window';
import { getPathParts } from '../../../../../core/utils/data';

interface Mock extends jest.Mock {}

const mockUpdateSize = jest.fn();

jest.mock('../data_grid_views', () => ({ DataGridViews: () => null }));
jest.mock('../../../../../ui/data_grid/ui.data_grid', () => jest.fn());
jest.mock('../datagrid_component', () => ({
  DataGridComponent: jest.fn().mockImplementation((element, options) => {
    const component = {
      options,
      option: () => options,
      beginUpdate: jest.fn(),
      endUpdate: jest.fn(),
      // eslint-disable-next-line no-underscore-dangle
      _options: { silent: jest.fn() },
      dispose: jest.fn(),
      on: jest.fn(),
      element: () => element,
      getController: jest.fn().mockImplementation(() => ({
        updateSize: mockUpdateSize,
      })),
      updateDimensions: jest.fn(),
    };
    options.onInitialized({ component });

    return component;
  }),
}));
jest.mock('../utils/get_updated_options');
jest.mock('../../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../../core/devices').default;
  const real = actualDevices.real.bind(actualDevices);

  actualDevices.real = jest.fn(real);

  return actualDevices;
});
jest.mock('../../../../../ui/themes', () => ({
  ...jest.requireActual('../../../../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));
jest.mock('../../../../../core/utils/window', () => ({
  ...jest.requireActual('../../../../../core/utils/window'),
  hasWindow: jest.fn(),
}));

describe('DataGrid', () => {
  beforeEach(() => {
    (hasWindow as jest.Mock).mockReturnValue(true);
  });

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

      component.setupInstance();

      expect(component.instance.option()).toMatchObject(component.props);
    });

    it('Init when property as undefined', () => {
      const component = new DataGrid({});
      component.props = {
        columns: undefined,
      } as DataGridProps;

      component.setupInstance();

      expect(Object.prototype.hasOwnProperty.call(component.instance.option(), 'columns')).toBe(false);
    });

    it('Init with widgetElementRef', () => {
      const component = new DataGrid({});
      component.widgetElementRef = {
        current: {} as HTMLDivElement,
      } as RefObject;

      component.setupInstance();

      expect(component.instance.element()).toBe(component.widgetElementRef.current);
    });

    it('Init with onInitialized', () => {
      const onInitialized = jest.fn();
      const component = new DataGrid({});
      component.props = {} as DataGridProps;
      component.restAttributes = { onInitialized };

      component.setupInstance();

      expect(onInitialized).toHaveBeenCalled();
    });

    it('updateSize should be called if not server side', () => {
      (hasWindow as jest.Mock).mockReturnValue(true);

      const component = new DataGrid({});

      component.setupInstance();

      expect(mockUpdateSize).toBeCalled();
    });

    it('updateSize should not be called if server side', () => {
      (hasWindow as jest.Mock).mockReturnValue(false);

      const component = new DataGrid({});

      component.setupInstance();

      expect(mockUpdateSize).not.toBeCalled();
    });

    // Related to
    // QUnit.test('The onOptionChanged event should be called once when changing column option'
    it('internal component shouldnt raise optionChanged', () => {
      const component = new DataGrid({ onOptionChanged: jest.fn() } as any);
      component.setupInstance() as any;
      expect((component.instance as any).options.onOptionChanged).toBeUndefined();
    });

    it('instance should subscribe on "onContentReady"', () => {
      const props = {
      } as DataGridProps;
      const contentReadyHandler = jest.fn();
      const component = new DataGrid(props);
      component.restAttributes = { onContentReady: contentReadyHandler };

      component.setupInstance();

      expect((component.instance as any).options.onContentReady).toBe(contentReadyHandler);
    });

    describe('Getters', () => {
      it('initializedInstance without setupInstance', () => {
        const component = new DataGrid({});

        expect(component.initializedInstance).toBeUndefined();
      });

      it('initializedInstance with setupInstance', () => {
        const component = new DataGrid({});

        component.setupInstance();

        expect(component.initializedInstance).toBeDefined();
      });
    });

    describe('Methods', () => {
      it('getComponentInstance', () => {
        const component = new DataGrid({});
        component.instance = mockDataGridMethods as any;

        expect(component.getComponentInstance()).toMatchObject(mockDataGridMethods);
      });

      it('columnOption with diff args', () => {
        const columnOption = jest.fn();
        (mockDataGridMethods as any).columnOption = columnOption;
        const component = new DataGrid({});
        component.instance = mockDataGridMethods as any;

        component.columnOption(0, 'visible', false);

        expect(columnOption).toBeCalledTimes(1);
        expect(columnOption).toBeCalledWith(0, 'visible', false);

        (mockDataGridMethods as any).columnOption.mockClear();

        component.columnOption(0, 'visible');

        expect(columnOption).toBeCalledTimes(1);
        expect(columnOption).toBeCalledWith(0, 'visible');
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
      ${'resize'}
      ${'isScrollbarVisible'}
      ${'getTopVisibleRowData'}
      ${'getScrollbarWidth'}
      ${'getDataProvider'}
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
            component.setupInstance = jest.fn();
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

        component.setupInstance();

        component.dispose()();

        expect(component.instance.dispose).toBeCalledTimes(1);
      });

      it('updateOptions', () => {
        (getUpdatedOptions as jest.Mock).mockReturnValue([{
          path: 'columns',
          value: ['test', 'test2'],
          previousValue: ['test'],
        }]);
        const initialProps = {
          columns: ['test'],
        } as DataGridProps;
        const component = new DataGrid(initialProps);

        component.setupInstance();

        component.instance.option = jest.fn();
        component.updateOptions();
        expect(component.prevProps).toBe(initialProps);
        component.props = {
          columns: ['test', 'test2'],
        } as DataGridProps;
        component.updateOptions();
        expect(getUpdatedOptions).toBeCalledTimes(1);
        expect(getUpdatedOptions).toBeCalledWith(initialProps, component.props);
        expect(component.prevProps).toBe(component.props);
        // eslint-disable-next-line no-underscore-dangle
        expect(component.instance._options.silent).toBeCalledWith('columns', ['test']);
        expect(component.instance.option).toBeCalledWith('columns', ['test', 'test2']);
        expect(component.instance.beginUpdate).toBeCalledTimes(1);
        expect(component.instance.endUpdate).toBeCalledTimes(1);
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

      it('The updateDimensions should be raised on dimensionChanged event', () => {
        const component = new DataGrid({});

        component.setupInstance();

        component.onDimensionChanged();

        expect(component.getComponentInstance().updateDimensions).toBeCalledTimes(1);
        expect(component.getComponentInstance().updateDimensions).toBeCalledWith(true);
      });

      it('The dimensionChanged event without instance', () => {
        const component = new DataGrid({});

        expect(component.onDimensionChanged.bind(component)).not.toThrow();
      });
    });
  });

  describe('Two way props synchronization', () => {
    it('subscribeOptionChanged effect subscribes to optionChanged event with instanceOptionChangedHandler handler', () => {
      const initialProps = {
      } as DataGridProps;
      const component = new DataGrid(initialProps);
      const e = { component: { option: jest.fn() } };

      component.instanceOptionChangedHandler = jest.fn();

      component.setupInstance();

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
      } as any);

      expect(component.props[propName]).toBe(newValue);
    });

    test.each`
    fullName
    ${'editing.changes'}
    ${'editing.editRowKey'}
    ${'editing.editColumnName'}
    ${'searchPanel.text'}
    `('$propName property should be assigned on optionChanged event call', ({ fullName }) => {
      const name = getPathParts(fullName)[0];
      const propName = getPathParts(fullName)[1];
      const prevValue = null;
      const newValue = {};
      const props = {
      } as DataGridProps;
      props[name] = { [propName]: prevValue };
      const component = new DataGrid(props);

      component.instanceOptionChangedHandler({
        name,
        fullName,
        value: newValue,
        previousValue: null,
        component: { option: (optionName) => optionName === fullName && newValue },
      } as any);

      expect(component.props[name][propName]).toBe(newValue);
    });

    it('property should not be assigned if compomnent value is changed during updating', () => {
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
      } as any);

      expect(component.props[propName]).toBe(oldValue);
    });

    it('property should not be assigned if value is not changed', () => {
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
      } as any);

      expect(component.props[propName]).toBe(oldValue);
    });

    it('not update internal component', () => {
      const props = {
      } as DataGridProps;
      const component = new DataGrid(props);
      component.setupInstance();
      component.prevProps = {} as any;
      component.instance.option = jest.fn();
      // simulate updateOptions effect call after state changed
      component.updateTwoWayValue = () => { component.updateOptions(); };
      component.instanceOptionChangedHandler({ } as any);
      expect(component.instance.option).not.toBeCalled();
    });
  });

  describe('Default options', () => {
    const getDefaultOptions = (): DataGridProps => Object.assign(new DataGridProps(),
      convertRulesToOptions(defaultOptionRules));

    beforeEach(() => {
      (devices.real as Mock).mockImplementation(() => ({ deviceType: 'desktop' }));
      (current as Mock).mockImplementation(() => 'generic');
    });

    afterEach(() => jest.resetAllMocks());

    describe('editing', () => {
      it('defaults should be defined for nested editing props', () => {
        const editing = new DataGridEditing();
        expect(editing.changes).toEqual([]);
      });
    });

    describe('showRowLines', () => {
      it('should be false by default', () => {
        expect(getDefaultOptions().showRowLines).toBe(false);
      });

      it('should be true if ios', () => {
        (devices.real as Mock).mockImplementation(() => ({ platform: 'ios' }));
        expect(getDefaultOptions().showRowLines).toBe(true);
      });

      it('should be true if material', () => {
        (current as Mock).mockImplementation(() => 'material');
        expect(getDefaultOptions().showRowLines).toBe(true);
      });
    });

    describe('showColumnLines', () => {
      it('should be true by default', () => {
        expect(getDefaultOptions().showColumnLines).toBe(true);
      });

      it('should be true if material', () => {
        (current as Mock).mockImplementation(() => 'material');
        expect(getDefaultOptions().showColumnLines).toBe(false);
      });
    });

    describe('headerFilter.height', () => {
      it('should be undefined by default', () => {
        expect(getDefaultOptions().headerFilter?.height).toBe(undefined);
      });

      it('should be 315 if material', () => {
        (current as Mock).mockImplementation(() => 'material');
        expect(getDefaultOptions().headerFilter?.height).toBe(315);
      });
    });

    describe('editing.useIcons', () => {
      it('should be false by default', () => {
        expect(getDefaultOptions().editing?.useIcons).toBe(false);
      });

      it('should be true if material', () => {
        (current as Mock).mockImplementation(() => 'material');
        expect(getDefaultOptions().editing?.useIcons).toBe(true);
      });
    });

    describe('grouping.expandMode', () => {
      it('should be buttonClick if desktop', () => {
        (devices.real as Mock).mockImplementation(() => ({ deviceType: 'desktop' }));
        expect(getDefaultOptions().grouping?.expandMode).toBe('buttonClick');
      });

      it('should be rowClick if not desktop', () => {
        (devices.real as Mock).mockImplementation(() => ({ deviceType: 'tablet' }));
        expect(getDefaultOptions().grouping?.expandMode).toBe('rowClick');
      });
    });
  });
});
