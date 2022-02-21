import React from 'react';
import { mount } from 'enzyme';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetterExtender } from '../../../../utils/plugin/getter_extender';
import { Plugins } from '../../../../utils/plugin/context';
import { ValueSetter } from '../../../../utils/plugin/value_setter';
import {
  DataGridLight, viewFunction as DataGridView, DataGridLightProps,
  AllItems, Columns, KeyExprPlugin, VisibleColumns,
  VisibleItems, VisibleRows, VisibleDataRows, TotalCount,
} from '../data_grid_light';
import { Widget } from '../../../common/widget';
import { generateData, generateRows } from './test_data';

describe('DataGridLight', () => {
  describe('View', () => {
    it('default render', () => {
      const props = new DataGridLightProps();
      props.dataSource = [];
      const viewModel = {
        props,
        aria: { role: 'presentation' },
        classes: '',
        restAttributes: { 'rest-attributes': 'true' },
        columns: [{ dataField: 'id' }],
        keyExpr: 'id',
      } as Partial<DataGridLight>;
      const tree = mount(<DataGridView {...viewModel as any} /> as any);

      expect(tree.find(Widget).first().props()).toMatchObject({
        aria: { role: 'presentation' },
        classes: '',
        'rest-attributes': 'true',
      });

      expect(tree.find(ValueSetter).at(0).props()).toMatchObject({
        type: AllItems, value: props.dataSource,
      });
      expect(tree.find(ValueSetter).at(1).props()).toMatchObject({
        type: Columns, value: viewModel.columns,
      });
      expect(tree.find(ValueSetter).at(2).props()).toMatchObject({
        type: KeyExprPlugin, value: viewModel.keyExpr,
      });

      expect(tree.find(GetterExtender).at(0).props()).toMatchObject({
        type: VisibleColumns, order: -1, value: Columns,
      });
      expect(tree.find(GetterExtender).at(1).props()).toMatchObject({
        type: VisibleItems, order: -1, value: AllItems,
      });
      expect(tree.find(GetterExtender).at(2).props()).toMatchObject({
        type: VisibleRows, order: -1, value: VisibleDataRows,
      });
    });

    it('render with dataSource and 1 column', () => {
      const props = new DataGridLightProps();
      props.dataSource = [{ id: 1 }, { id: 2 }];
      const viewProps = {
        props,
        visibleRows: [{ data: { id: 1 }, rowType: 'data' }, { data: { id: 2 }, rowType: 'data' }],
        visibleColumns: [{ dataField: 'id' }],
      } as Partial<DataGridLight>;
      const tree = mount(<DataGridView {...viewProps as any} /> as any);

      expect(tree.find('tr')).toHaveLength(3);
      expect(tree.find('td')).toHaveLength(3);
      expect(tree.find('td').at(0).children().text()).toEqual('id');
      expect(tree.find('td').at(1).text()).toEqual('1');
      expect(tree.find('td').at(2).text()).toEqual('2');
    });

    it('render with dataSource and 2 columns', () => {
      const props = new DataGridLightProps();
      props.dataSource = [{ id: 1, name: 'name 1' }];
      const viewProps = {
        props,
        visibleRows: [{ data: { id: 1, name: 'name 1' }, rowType: 'data' }],
        visibleColumns: [
          { dataField: 'id' },
          { dataField: 'name' },
        ],
      } as Partial<DataGridLight>;
      const tree = mount(<DataGridView {...viewProps as any} /> as any);

      expect(tree.find('tr')).toHaveLength(2);
      expect(tree.find('td')).toHaveLength(4);
      expect(tree.find('td').at(0).children().text()).toEqual('id');
      expect(tree.find('td').at(1).children().text()).toEqual('name');
      expect(tree.find('td').at(2).text()).toEqual('1');
      expect(tree.find('td').at(3).text()).toEqual('name 1');
    });
  });

  describe('Getters', () => {
    describe('aria', () => {
      it('should have role "presentation"', () => {
        expect(new DataGridLight({}).aria).toEqual({ role: 'presentation' });
      });
    });

    describe('columns', () => {
      it('should handle user input', () => {
        const grid = new DataGridLight({
          columns: ['id', 'name'],
        });

        expect(grid.columns).toEqual([
          { dataField: 'id' },
          { dataField: 'name' },
        ]);
      });
    });

    describe('keyExpr', () => {
      it('should return keyExpr prop', () => {
        const grid = new DataGridLight({
          keyExpr: 'some key',
        });

        expect(grid.keyExpr).toEqual('some key');
      });

      it('should return null if user did not specified it', () => {
        const grid = new DataGridLight({});

        expect(grid.keyExpr).toEqual(null);
      });
    });
  });

  describe('Effects', () => {
    describe('updateVisibleRows', () => {
      const watchMock = jest.fn();
      const grid = new DataGridLight({});
      grid.plugins = {
        watch: watchMock,
      } as any;

      it('should update visibleRows', () => {
        grid.updateVisibleRows();

        const data = generateRows(10);

        const callback = watchMock.mock.calls[0][1];
        callback(data);

        expect(grid.visibleRows).toBe(data);
      });
    });

    describe('updateVisibleColumns', () => {
      const watchMock = jest.fn();
      const grid = new DataGridLight({});
      grid.plugins = {
        watch: watchMock,
      } as any;

      it('should update visibleColumns', () => {
        grid.updateVisibleColumns();

        const columns = [{ dataField: 'id' }];

        const callback = watchMock.mock.calls[0][1];
        callback(columns);

        expect(grid.visibleColumns).toBe(columns);
      });
    });
  });

  describe('Selectors', () => {
    describe('TotalCount', () => {
      it('should return count of AllItems', () => {
        const plugins = new Plugins();

        plugins.set(AllItems, [1, 2, 3]);

        expect(plugins.getValue(TotalCount)).toBe(3);
      });
    });

    describe('VisibleDataRows', () => {
      it('should wrap item into row object if keyExpr is defined', () => {
        const plugins = new Plugins();

        const data = generateData(2);

        plugins.extend(VisibleItems, 0, () => data);
        plugins.set(KeyExprPlugin, 'id');

        expect(plugins.getValue(VisibleDataRows)).toEqual([{
          rowType: 'data',
          key: 0,
          data: data[0],
        }, {
          rowType: 'data',
          key: 1,
          data: data[1],
        }]);
      });

      it('should wrap item into row object if keyExpr is not defined', () => {
        const plugins = new Plugins();

        const data = generateData(2);

        plugins.extend(VisibleItems, 0, () => data);
        plugins.set(KeyExprPlugin, null);

        expect(plugins.getValue(VisibleDataRows)).toEqual([{
          rowType: 'data',
          key: data[0],
          data: data[0],
        }, {
          rowType: 'data',
          key: data[1],
          data: data[1],
        }]);
      });
    });
  });
});
