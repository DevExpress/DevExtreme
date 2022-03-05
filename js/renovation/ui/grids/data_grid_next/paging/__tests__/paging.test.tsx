import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import { DataGridNextPaging, DataGridNextPagingProps, viewFunction as PagingView } from '../paging';
import {
  PageIndex, PageSize, SetPageIndex, SetPageSize, PageCount, PagingEnabled, CalculateVisibleItems,
} from '../plugins';
import { generateData } from '../../__tests__/test_data';
import { Plugins } from '../../../../../utils/plugin/context';
import { ValueSetter } from '../../../../../utils/plugin/value_setter';
import { GetterExtender } from '../../../../../utils/plugin/getter_extender';
import { TotalCount, VisibleItems } from '../../data_grid_next';

describe('Paging', () => {
  describe('View', () => {
    it('should render ValueSetters and GetterExtender', () => {
      const viewProps = {
        props: new DataGridNextPagingProps(),
        pageSize: 30,
        setPageIndex: () => null,
        setPageSize: () => null,
        calculateVisibleItems: () => [],
      } as Partial<DataGridNextPaging>;

      const tree = mount(<PagingView {...viewProps as any} />);
      expect(tree.find(ValueSetter).at(0).props()).toEqual({
        type: PageIndex, value: 0,
      });
      expect(tree.find(ValueSetter).at(1).props()).toEqual({
        type: PageSize, value: viewProps.pageSize,
      });
      expect(tree.find(ValueSetter).at(2).props()).toEqual({
        type: PagingEnabled, value: true,
      });
      expect(tree.find(ValueSetter).at(3).props()).toEqual({
        type: SetPageIndex, value: viewProps.setPageIndex,
      });
      expect(tree.find(ValueSetter).at(4).props()).toEqual({
        type: SetPageSize, value: viewProps.setPageSize,
      });
      expect(tree.find(GetterExtender).at(0).props()).toEqual({
        type: VisibleItems, order: 1, value: CalculateVisibleItems,
      });
    });
  });

  describe('Getters', () => {
    describe('pageSize', () => {
      it('should be equal to "all" if prop is zero', () => {
        const paging = new DataGridNextPaging({
          pageSize: 0,
        });

        expect(paging.pageSize).toEqual('all');
      });

      it('should be equal to prop otherwise', () => {
        const paging = new DataGridNextPaging({
          pageSize: 10,
        });

        expect(paging.pageSize).toEqual(10);
      });
    });
  });

  describe('Callbacks', () => {
    describe('setPageIndex', () => {
      it('should update props.pageIndex', () => {
        const paging = new DataGridNextPaging({});
        paging.setPageIndex(10);

        expect(paging.props.pageIndex).toEqual(10);
      });
    });

    describe('setPageSize', () => {
      it('should update props.pageSize', () => {
        const paging = new DataGridNextPaging({});
        paging.setPageSize(10);

        expect(paging.props.pageSize).toEqual(10);
      });
    });
  });

  describe('Selectors', () => {
    each`
        totalCount    | pageSize    | pageCount  
        ${100}        | ${'all'}    | ${1}
        ${10}         | ${5}        | ${2}
        ${11}         | ${5}        | ${3}
    `
      .describe('PageCount', ({
        totalCount, pageSize, pageCount,
      }) => {
        const name = JSON.stringify({
          totalCount, pageSize, pageCount,
        });

        it(name, () => {
          const plugins = new Plugins();
          plugins.set(TotalCount, totalCount);
          plugins.set(PageSize, pageSize);

          expect(plugins.getValue(PageCount)).toEqual(pageCount);
        });
      });

    describe('calculateVisibleItems', () => {
      const dataSource = generateData(20);

      const plugins = new Plugins();

      beforeEach(() => {
        plugins.extend(VisibleItems, -1, () => dataSource);
        plugins.set(PagingEnabled, true);
        plugins.set(PageIndex, 0);
        plugins.set(PageSize, 20);
      });

      it('should return full dataSource if paging is not enabled', () => {
        plugins.set(PagingEnabled, false);

        expect(plugins.getValue(CalculateVisibleItems)).toEqual(dataSource);
      });

      it('should return full dataSource if pageSize is "all"', () => {
        plugins.set(PageSize, 'all');

        expect(plugins.getValue(CalculateVisibleItems)).toEqual(dataSource);
      });

      it('should return first page', () => {
        plugins.set(PageIndex, 0);
        plugins.set(PageSize, 5);

        expect(
          plugins.getValue(CalculateVisibleItems),
        ).toEqual(
          dataSource.slice(0, 5),
        );
      });

      it('should return second page', () => {
        plugins.set(PageIndex, 1);
        plugins.set(PageSize, 5);

        expect(
          plugins.getValue(CalculateVisibleItems),
        ).toEqual(
          dataSource.slice(5, 10),
        );
      });

      it('should return last page if it is not full', () => {
        plugins.set(PageIndex, 1);
        plugins.set(PageSize, 15);

        expect(
          plugins.getValue(CalculateVisibleItems),
        ).toEqual(
          dataSource.slice(15, 20),
        );
      });
    });
  });
});
