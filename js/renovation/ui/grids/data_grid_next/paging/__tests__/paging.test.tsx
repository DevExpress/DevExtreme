import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import { DataGridNextPaging, DataGridNextPagingProps, viewFunction as PagingView } from '../paging';
import {
  PageIndex, PageSize, SetPageIndex, SetPageSize, PageCount, PagingEnabled,
  ApplyPagingToVisibleItems, AddPagingToLoadOptions, LoadPageCount, SetLoadPageCount,
  AddPagingToLocalDataState,
} from '../plugins';
import { generateData } from '../../__tests__/test_data';
import { Plugins } from '../../../../../utils/plugin/context';
import { ValueSetter } from '../../../../../utils/plugin/value_setter';
import { GetterExtender } from '../../../../../utils/plugin/getter_extender';
import {
  TotalCount, LocalVisibleItems, RemoteOperations, LoadOptionsValue, LocalDataState,
} from '../../plugins';
import { DataState } from '../../types';

describe('Paging', () => {
  describe('View', () => {
    it('should render ValueSetters and GetterExtender', () => {
      const viewProps = {
        props: new DataGridNextPagingProps(),
        pageSize: 30,
        loadPageCount: 1,
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
      expect(tree.find(ValueSetter).at(5).props()).toEqual({
        type: LoadPageCount, value: viewProps.loadPageCount,
      });
      expect(tree.find(ValueSetter).at(6).props()).toEqual({
        type: SetLoadPageCount, value: viewProps.setLoadPageCount,
      });
      expect(tree.find(GetterExtender).at(0).props()).toEqual({
        type: LocalVisibleItems, order: 1, value: ApplyPagingToVisibleItems,
      });
      expect(tree.find(GetterExtender).at(1).props()).toEqual({
        type: LoadOptionsValue, order: 1, value: AddPagingToLoadOptions,
      });
      expect(tree.find(GetterExtender).at(2).props()).toEqual({
        type: LocalDataState, order: 1, value: AddPagingToLocalDataState,
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

    describe('setLoadpageCount', () => {
      it('should update loadPageCount', () => {
        const paging = new DataGridNextPaging({});
        paging.setLoadPageCount(5);

        expect(paging.loadPageCount).toEqual(5);
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
        plugins.extend(LocalVisibleItems, -1, () => dataSource);
        plugins.set(PagingEnabled, true);
        plugins.set(PageIndex, 0);
        plugins.set(PageSize, 20);
        plugins.set(LoadPageCount, 1);
      });

      it('should return full dataSource if paging is not enabled', () => {
        plugins.set(PagingEnabled, false);

        expect(plugins.getValue(ApplyPagingToVisibleItems)).toEqual(dataSource);
      });

      it('should return full dataSource if pageSize is "all"', () => {
        plugins.set(PageSize, 'all');

        expect(plugins.getValue(ApplyPagingToVisibleItems)).toEqual(dataSource);
      });

      it('should return first page', () => {
        plugins.set(PageIndex, 0);
        plugins.set(PageSize, 5);

        expect(
          plugins.getValue(ApplyPagingToVisibleItems),
        ).toEqual(
          dataSource.slice(0, 5),
        );
      });

      it('should return second page', () => {
        plugins.set(PageIndex, 1);
        plugins.set(PageSize, 5);

        expect(
          plugins.getValue(ApplyPagingToVisibleItems),
        ).toEqual(
          dataSource.slice(5, 10),
        );
      });

      it('should return last page if it is not full', () => {
        plugins.set(PageIndex, 1);
        plugins.set(PageSize, 15);

        expect(
          plugins.getValue(ApplyPagingToVisibleItems),
        ).toEqual(
          dataSource.slice(15, 20),
        );
      });
    });

    describe('AddPagingToLoadOptions', () => {
      const plugins = new Plugins();

      beforeEach(() => {
        plugins.set(PagingEnabled, true);
        plugins.set(PageIndex, 0);
        plugins.set(PageSize, 20);
        plugins.set(LoadPageCount, 1);
      });

      it('should return empty object if remoteOperations is false', () => {
        plugins.set(RemoteOperations, false);

        expect(plugins.getValue(AddPagingToLoadOptions)).toEqual({});
      });

      it('should return empty object if paging is not enabled', () => {
        plugins.set(RemoteOperations, true);
        plugins.set(PagingEnabled, false);

        expect(plugins.getValue(AddPagingToLoadOptions)).toEqual({});
      });

      it('should return full dataSource if pageSize is "all"', () => {
        plugins.set(RemoteOperations, true);
        plugins.set(PageSize, 'all');

        expect(plugins.getValue(AddPagingToLoadOptions)).toEqual({});
      });

      it('should return object with skip/take/requireTotalCount fields', () => {
        plugins.set(PageIndex, 2);
        plugins.set(PageSize, 5);

        expect(
          plugins.getValue(AddPagingToLoadOptions),
        ).toEqual({
          skip: 10,
          take: 5,
          requireTotalCount: true,
        });
      });
    });

    describe('AddPagingToLocalDataState', () => {
      let plugins = new Plugins();
      const reinitPlugins = () => {
        plugins = new Plugins();
      };

      beforeEach(reinitPlugins);

      it('should return undefined', () => {
        plugins.extend(LocalDataState, -1, () => undefined);
        plugins.set(PageIndex, 2);
        plugins.set(PageSize, 10);

        expect(plugins.getValue(AddPagingToLocalDataState)).toBe(undefined);
      });

      it('should return state with offset', () => {
        const state: DataState = {
          data: [],
          totalCount: 50,
        };
        plugins.extend(LocalDataState, -1, () => state);
        plugins.set(PageIndex, 2);
        plugins.set(PageSize, 10);

        expect(plugins.getValue(AddPagingToLocalDataState)).toEqual({
          data: [],
          totalCount: 50,
          dataOffset: 20,
        });
      });
    });
  });
});
