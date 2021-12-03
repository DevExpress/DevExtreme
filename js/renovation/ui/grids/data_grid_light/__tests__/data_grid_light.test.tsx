import React from 'react';
import { mount } from 'enzyme';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DataGridLight, viewFunction as DataGridView, DataGridLightProps } from '../data_grid_light';
import { Widget } from '../../../common/widget';
import { columns, customers } from './test_data';

describe('DataGridLight', () => {
  describe('View', () => {
    it('default render', () => {
      const props = {
        props: new DataGridLightProps(),
        aria: { role: 'presentation' },
        classes: '',
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<DataGridLight>;
      const tree = mount(<DataGridView {...props as any} /> as any);

      expect(tree.find(Widget).first().props()).toMatchObject({
        aria: { role: 'presentation' },
        classes: '',
        'rest-attributes': 'true',
      });
    });

    it('render with dataSource and 1 column', () => {
      const props = new DataGridLightProps();
      props.dataSource = [{ id: 1 }, { id: 2 }];
      props.columns = ['id'];
      const viewProps = {
        props,
        visibleItems: props.dataSource,
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
      props.columns = ['id', 'name'];
      const viewProps = {
        props,
        visibleItems: props.dataSource,
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

  describe('Logic', () => {
    describe('Getters', () => {
      describe('aria', () => {
        it('should have role "presentation"', () => {
          expect(new DataGridLight({}).aria).toEqual({ role: 'presentation' });
        });
      });

      // todo: move when paging will be in different module
      describe('paging', () => {
        it('should calculate visibleItems', () => {
          let dataGrid = new DataGridLight({
            dataSource: customers,
            columns,
            paging: {
              enabled: true,
              pageIndex: 0,
              pageSize: 5,
            },
          });
          dataGrid.updatePagingProps();
          expect(dataGrid.visibleItems).toEqual(customers.slice(0, 5));

          dataGrid = new DataGridLight({
            dataSource: customers,
            columns,
            paging: {
              enabled: true,
              pageIndex: 1,
              pageSize: 5,
            },
          });
          dataGrid.updatePagingProps();
          expect(dataGrid.visibleItems).toEqual(customers.slice(5, 10));

          dataGrid = new DataGridLight({
            dataSource: customers,
            columns,
            paging: {
              enabled: true,
              pageIndex: 1,
              pageSize: 'all',
            },
          });
          dataGrid.updatePagingProps();
          expect(dataGrid.visibleItems).toEqual(customers);
        });
      });
    });

    describe('Callbacks', () => {
      it('onPageIndexChange', () => {
        const grid = new DataGridLight({});

        grid.onPageIndexChange(100);
        expect(grid.pagingPageIndex).toEqual(100);
      });

      it('onPageSizeChange', () => {
        const grid = new DataGridLight({});

        grid.onPageSizeChange(100);
        expect(grid.pagingPageSize).toEqual(100);
      });
    });
  });
});
