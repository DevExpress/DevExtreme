import React from 'react';
import { mount } from 'enzyme';
import {
  Paging, viewFunction as PagingView,
} from '../paging';
import { generateData } from '../../__tests__/test_data';
import { Plugins } from '../../../../../utils/plugin/context';

describe('Paging', () => {
  describe('View', () => {
    it('should be empty', () => {
      const tree = mount(<PagingView />);
      expect(tree.html()).toEqual(null);
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
    describe('totalCount', () => {
      it('should be equal to dataSource\'s length', () => {
        const dataSource = generateData(10);

        const paging = new Paging({});
        paging.dataSource = dataSource;

        expect(paging.totalCount).toEqual(dataSource.length);
      });
    });

    describe('pageCount', () => {
      it('should be 1 if pageSize = "all"', () => {
        const dataSource = generateData(10);

        const paging = new Paging({
          pageSize: 'all',
        });
        paging.dataSource = dataSource;

        expect(paging.pageCount).toEqual(1);
      });

      it('should be calculated', () => {
        const dataSource = generateData(10);

        const paging = new Paging({
          pageSize: 5,
        });
        paging.dataSource = dataSource;

        expect(paging.pageCount).toEqual(2);
      });

      it('should be rounded right', () => {
        const dataSource = generateData(11);

        const paging = new Paging({
          pageSize: 5,
        });
        paging.dataSource = dataSource;

        expect(paging.pageCount).toEqual(3);
      });
    });

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

  describe('Effects', () => {
    describe('addPagingHandler', () => {
      it('should update dataSource', () => {
        const extendMock = jest.fn();
        const paging = new Paging({});
        const dataSource = generateData(10);

        paging.plugins = {
          extend: extendMock,
        } as unknown as Plugins;

        paging.addPagingHandler();

        const extendCallback = extendMock.mock.calls[0][2];

        extendCallback(dataSource);
        expect(paging.dataSource).toEqual(dataSource);
      });
    });

    describe('updatePagingProps', () => {
      it('should set paging data for plugin', () => {
        const setMock = jest.fn();

        const paging = new Paging({
          pageIndex: 1,
          pageSize: 5,
        });
        paging.dataSource = generateData(10);

        paging.plugins = {
          set: setMock,
        } as any;

        paging.updatePagingProps();
        expect(setMock.mock.calls[0][1]).toMatchObject({
          pageIndex: 1,
          pageSize: 5,
          pageCount: 2,
          totalCount: 10,
          setPageIndex: paging.setPageIndex,
          setPageSize: paging.setPageSize,
        });
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
});
