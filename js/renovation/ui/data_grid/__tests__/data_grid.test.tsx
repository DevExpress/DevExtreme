/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { mount, shallow } from 'enzyme';
import DxDataGrid from '../../../../ui/data_grid';
import { viewFunction as DataGridView, DataGrid } from '../data_grid';
import { DataGridProps } from '../props';

const mockDispose = jest.fn();
const mockOption = jest.fn();

jest.mock('../../../../ui/data_grid', () => {
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
      const widgetRef = {} as HTMLDivElement;
      const createWidget = () => {
        const component = new DataGrid({});
        component.widgetRef = widgetRef;
        return component;
      };

      it('setupWidget', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.setupWidget();

        expect(DxDataGrid).toBeCalledTimes(1);
        expect(DxDataGrid).toBeCalledWith(widgetRef, spy.mock.results[0].value);
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
        const spy = jest.spyOn(component, 'properties', 'get');
        (DxDataGrid as any).getInstance.mockReturnValue(new DxDataGrid('ref' as any as Element, {}));
        component.updateWidget();

        expect(mockOption).toBeCalledWith(spy.mock.results[0].value);
      });
    });
  });
});
