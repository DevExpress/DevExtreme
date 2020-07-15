/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, createRef } from 'preact';
import { mount } from 'enzyme';
import DxDataGrid from '../../js/ui/data_grid';
import { viewFunction as DataGridView, DataGrid } from '../../js/renovation/data_grid/data_grid';
import { DataGridProps } from '../../js/renovation/data_grid/props';

const mockDispose = jest.fn();
const mockOption = jest.fn();

jest.mock('../../js/ui/data_grid', () => {
  const MockDxDataGrid = jest.fn().mockImplementation(() => ({
    dispose: mockDispose,
    option: mockOption,
  }));
  (MockDxDataGrid as any).getInstance = jest.fn();
  return MockDxDataGrid;
});

describe('DataGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('View', () => {
    it('default render', () => {
      const widgetRef = createRef();
      const props = {
        props: new DataGridProps(),
        widgetRef,
        restAttributes: { restAttributes: true },
      } as any as Partial<DataGrid>;
      const tree = mount<typeof DataGridView>(<DataGridView {...props as any} /> as any);

      expect(tree.find('div').props()).toEqual({
        className: '',
        restAttributes: true,
      });
      expect(tree.find('div').instance()).toBe(widgetRef.current);
    });

    it('set className', () => {
      const widgetRef = createRef();
      const props = {
        props: {
          className: 'custom-class',
        },
        widgetRef,
        restAttributes: { restAttributes: true },
      } as any as Partial<DataGrid>;

      const tree = mount<typeof DataGridView>(<DataGridView {...props as any} /> as any);

      expect(tree.find('div').props().className).toEqual('custom-class');
    });
  });
  describe('Logic', () => {
    it('getHtmlElement', () => {
      const widgetRef = 'ref' as any as HTMLDivElement;
      const component = new DataGrid({});
      component.widgetRef = widgetRef;

      expect(component.getHtmlElement()).toEqual('ref');
    });

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
      const createWidget = () => {
        const widgetRef = 'ref' as any as HTMLDivElement;
        const component = new DataGrid({});
        component.widgetRef = widgetRef;
        return component;
      };
      it('setupWidget', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.setupWidget();

        const DxDataGridMock = (DxDataGrid as any).mock;
        expect(DxDataGridMock.instances.length).toBe(1);
        expect(DxDataGridMock.calls[0][0]).toBe('ref');
        expect(DxDataGridMock.calls[0][1]).toBe(spy.mock.results[0].value);
      });

      it('setupWidget returns dispose widget callback', () => {
        const component = createWidget();
        const dispose = component.setupWidget();

        dispose();

        expect(mockDispose.mock.calls.length).toBe(1);
      });

      it('updateWidget. Widget is not initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.updateWidget();

        expect((DxDataGrid as any).mock.instances.length).toBe(0);
        expect(spy.mock.calls.length).toBe(0);
      });

      it('updateWidget. Widget is initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');
        (DxDataGrid as any).getInstance.mockReturnValue(new DxDataGrid('ref' as any as Element, {}));
        component.updateWidget();

        expect(mockOption.mock.calls[0][0]).toBe(spy.mock.results[0].value);
      });
    });
  });
});
