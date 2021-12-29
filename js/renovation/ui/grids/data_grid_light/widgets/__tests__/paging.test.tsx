import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import {
  Paging, PagingProps, viewFunction as PagingView, PageIndex, PageSize, SetPageIndex, PageCount,
} from '../paging';
import { generateData } from '../../__tests__/test_data';
import { Plugins } from '../../../../../utils/plugin/context';
import { ValueSetter } from '../../../../../utils/plugin/value_setter';
import { GetterExtender } from '../../../../../utils/plugin/getter_extender';
import { TotalCount, VisibleItems } from '../../data_grid_light';

describe('Paging', () => {
  describe('View', () => {
    it('should render ValueSetters and GetterExtender', () => {
      const viewProps = {
        props: new PagingProps(),
        pageSize: 30,
        setPageIndex: () => null,
        setPageSize: () => null,
        calculateVisibleItems: () => [],
      } as Partial<Paging>;

      const tree = mount(<PagingView {...viewProps as any} />);
      expect(tree.find(ValueSetter).at(0).props()).toEqual({
        type: PageIndex, value: 0,
      });
      expect(tree.find(ValueSetter).at(1).props()).toEqual({
        type: PageSize, value: viewProps.pageSize,
      });
      expect(tree.find(ValueSetter).at(2).props()).toEqual({
        type: SetPageIndex, value: viewProps.setPageIndex,
      });
      expect(tree.find(GetterExtender).at(0).props()).toEqual({
        type: VisibleItems, order: 1, func: viewProps.calculateVisibleItems,
      });
    });
  });

  describe('Methods', () => {
    describe('calculateVisibleItems', () => {
      const dataSource = generateData(20);

      it('should return full dataSource if paging is not enabled', () => {
        const paging = new Paging({
          enabled: false,
        });

        expect(paging.calculateVisibleItems(dataSource)).toEqual(dataSource);
      });

      it('should return full dataSource if pageSize is "all"', () => {
        const paging = new Paging({
          enabled: true,
          pageSize: 'all',
        });

        expect(paging.calculateVisibleItems(dataSource)).toEqual(dataSource);
      });

      it('should return first page', () => {
        const paging = new Paging({
          enabled: true,
          pageSize: 5,
          pageIndex: 0,
        });

        expect(
          paging.calculateVisibleItems(dataSource),
        ).toEqual(
          dataSource.slice(0, 5),
        );
      });

      it('should return second page', () => {
        const paging = new Paging({
          enabled: true,
          pageSize: 5,
          pageIndex: 1,
        });

        expect(
          paging.calculateVisibleItems(dataSource),
        ).toEqual(
          dataSource.slice(5, 10),
        );
      });

      it('should return last page if it is not full', () => {
        const paging = new Paging({
          enabled: true,
          pageSize: 15,
          pageIndex: 1,
        });

        expect(
          paging.calculateVisibleItems(dataSource),
        ).toEqual(
          dataSource.slice(15, 20),
        );
      });
    });
  });

  describe('Getters', () => {
    describe('pageSize', () => {
      it('should be equal to "all" if prop is zero', () => {
        const paging = new Paging({
          pageSize: 0,
        });

        expect(paging.pageSize).toEqual('all');
      });

      it('should be equal to prop otherwise', () => {
        const paging = new Paging({
          pageSize: 10,
        });

        expect(paging.pageSize).toEqual(10);
      });
    });
  });

  describe('Callbacks', () => {
    describe('setPageIndex', () => {
      it('should update props.pageIndex', () => {
        const paging = new Paging({});
        paging.setPageIndex(10);

        expect(paging.props.pageIndex).toEqual(10);
      });
    });

    describe('setPageSize', () => {
      it('should update props.pageSize', () => {
        const paging = new Paging({});
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
  });
});
