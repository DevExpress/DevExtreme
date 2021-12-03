import React from 'react';
import { mount } from 'enzyme';
import { GridPager, viewFunction as GridPagerView, GridPagerProps } from '../pager';
import { Pager } from '../../../../pager/pager';

describe('Pager', () => {
  describe('View', () => {
    it('default render', () => {
      const props = new GridPagerProps();
      props.pageCount = 4;

      const viewProps = {
        props,
        visible: true,
      } as Partial<GridPager>;

      const tree = mount(<GridPagerView {...viewProps as any} /> as any);
      expect(tree.find(Pager).props()).toMatchObject({
        displayMode: 'adaptive',
        infoText: 'Page {0} of {1} ({2} items)',
        pageCount: 4,
        pageIndex: 1,
        pageSize: 20,
        showInfo: false,
        showNavigationButtons: false,
        showPageSizes: false,
        totalCount: 0,
        visible: true,
      });
    });

    it('should pass zero to pager component when pageSize is "all"', () => {
      const props = new GridPagerProps();
      props.pageCount = 4;
      props.pageSize = 'all';

      const viewProps = {
        props,
        visible: true,
      } as Partial<GridPager>;

      const tree = mount(<GridPagerView {...viewProps as any} /> as any);
      expect(tree.find(Pager).props()).toMatchObject({
        displayMode: 'adaptive',
        infoText: 'Page {0} of {1} ({2} items)',
        pageCount: 4,
        pageIndex: 1,
        pageSize: 0,
        showInfo: false,
        showNavigationButtons: false,
        showPageSizes: false,
        totalCount: 0,
        visible: true,
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('should calculate "visible" option', () => {
        expect(new GridPager({
          visible: true,
        }).visible).toEqual(true);

        expect(new GridPager({
          visible: 'auto',
          pageCount: 1,
        }).visible).toEqual(false);

        expect(new GridPager({
          visible: 'auto',
          pageCount: 2,
        }).visible).toEqual(true);
      });

      it('should calculate "allowedPageSizes" option', () => {
        expect(new GridPager({
          allowedPageSizes: [1, 2, 3],
        }).allowedPageSizes).toEqual([1, 2, 3]);

        expect(new GridPager({
          allowedPageSizes: 'auto',
          pageSize: 'all',
        }).allowedPageSizes).toEqual([]);

        expect(new GridPager({
          allowedPageSizes: 'auto',
          pageSize: 20,
        }).allowedPageSizes).toEqual([10, 20, 40]);
      });
    });

    describe('Callbacks', () => {
      it('onPageIndexChange', () => {
        const pager = new GridPager({});
        pager.onPageIndexChange(10);

        expect(pager.props.pageIndex).toEqual(9); // zero-based in grid, one-based in pager
      });

      it('onPageSizeChange', () => {
        const pager = new GridPager({});

        pager.onPageSizeChange(10);
        expect(pager.props.pageSize).toEqual(10);

        pager.onPageSizeChange(0);
        expect(pager.props.pageSize).toEqual('all');
      });
    });
  });
});
