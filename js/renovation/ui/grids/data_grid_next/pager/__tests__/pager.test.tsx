import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import {
  DataGridNextPager, viewFunction as GridPagerView, DataGridNextPagerProps,
} from '../pager';
import { PagerContent } from '../../../../pager/content';
import { PlaceholderExtender } from '../../../../../utils/plugin/placeholder_extender';
import { PageSize, SetPageIndex, SetPageSize } from '../../paging/plugins';

describe('Pager', () => {
  each`
         pageSize    | pageSizeExpected
         ${'all'}    | ${0}
         ${40}       | ${40}
    `
    .describe('View', ({
      pageSize, pageSizeExpected,
    }) => {
      const name = JSON.stringify({
        pageSize, pageSizeExpected,
      });

      it(name, () => {
        const props = new DataGridNextPagerProps();
        const viewProps: Partial<DataGridNextPager> = {
          props,
        };
        const pageCount = 10;
        const totalCount = 20;
        const pageIndex = 30;

        const placeholderTree = mount(<GridPagerView {...viewProps as any} /> as any);
        const { template } = placeholderTree.find(PlaceholderExtender).props();
        const PagerTemplate = template({ deps: [pageIndex, pageSize, totalCount, pageCount] });

        const tree = mount(PagerTemplate);
        expect(tree.find(PagerContent).props()).toMatchObject({
          displayMode: 'adaptive',
          infoText: 'Page {0} of {1} ({2} items)',
          pageCount: 10,
          totalCount: 20,
          pageIndex: 30,
          pageSize: pageSizeExpected,
          showInfo: false,
          showNavigationButtons: false,
          showPageSizes: false,
          visible: true,
        });
      });
    });

  describe('Getters', () => {
    describe('allowedPageSizes', () => {
      it('should be equal to prop if it is array', () => {
        expect(new DataGridNextPager({
          allowedPageSizes: [1, 2, 3],
        }).allowedPageSizes).toEqual([1, 2, 3]);
      });

      it('should be calculated when auto', () => {
        const pager = new DataGridNextPager({
          allowedPageSizes: 'auto',
        });

        pager.plugins.set(PageSize, 20);
        pager.updatePageSize();

        expect(pager.allowedPageSizes).toEqual([10, 20, 40]);
      });

      it('should be empty when auto and pageSize is all', () => {
        const pager = new DataGridNextPager({
          allowedPageSizes: 'auto',
        });

        pager.plugins.set(PageSize, 'all');

        expect(pager.allowedPageSizes).toEqual([]);
      });
    });
  });

  describe('Callbacks', () => {
    describe('onPageIndexChange', () => {
      it('should update pageIndex', () => {
        const pager = new DataGridNextPager({});
        const setPageIndex = jest.fn();
        pager.plugins.set(SetPageIndex, setPageIndex);

        pager.onPageIndexChange(10);

        expect(setPageIndex).toHaveBeenCalledWith(10);
      });

      it('should work when paging plugin is empty', () => {
        const pager = new DataGridNextPager({});

        expect(() => pager.onPageIndexChange(10)).not.toThrow();
      });
    });

    describe('onPageSizeChange', () => {
      it('should update pager.pageSize', () => {
        const pager = new DataGridNextPager({});
        const setPageSize = jest.fn();
        pager.plugins.set(SetPageSize, setPageSize);

        pager.onPageSizeChange(10);

        expect(setPageSize).toHaveBeenCalledWith(10);
      });

      it('should set pager.pageSize to "all" when called with zero', () => {
        const pager = new DataGridNextPager({});
        const setPageSize = jest.fn();
        pager.plugins.set(SetPageSize, setPageSize);

        pager.onPageSizeChange(0);

        expect(setPageSize).toHaveBeenCalledWith('all');
      });

      it('should work when paging plugin is empty', () => {
        const pager = new DataGridNextPager({});

        expect(() => pager.onPageSizeChange(10)).not.toThrow();
      });
    });
  });
});
