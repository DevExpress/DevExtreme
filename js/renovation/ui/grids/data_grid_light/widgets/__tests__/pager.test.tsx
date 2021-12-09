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
        pageSize: props.pageSize,
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
        pageSize: props.pageSize,
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
      describe('visible', () => {
        it('should be boolean if prop is boolean', () => {
          expect(new GridPager({
            visible: true,
          }).visible).toEqual(true);
        });

        it('should be false when auto and pageCount is 1', () => {
          expect(new GridPager({
            visible: 'auto',
            pageCount: 1,
          }).visible).toEqual(false);
        });

        it('should be true when auto and pageCount is more than 1', () => {
          expect(new GridPager({
            visible: 'auto',
            pageCount: 2,
          }).visible).toEqual(true);
        });
      });

      describe('allowedPageSizes', () => {
        it('should be equal to prop if it is array', () => {
          expect(new GridPager({
            allowedPageSizes: [1, 2, 3],
          }).allowedPageSizes).toEqual([1, 2, 3]);
        });

        it('should be calculated when auto', () => {
          expect(new GridPager({
            allowedPageSizes: 'auto',
            pageSize: 20,
          }).allowedPageSizes).toEqual([10, 20, 40]);
        });

        it('should be empty when auto and pageSize is all', () => {
          expect(new GridPager({
            allowedPageSizes: 'auto',
            pageSize: 'all',
          }).allowedPageSizes).toEqual([]);
        });
      });

      describe('pageSize', () => {
        it('should be number if prop is number', () => {
          expect(new GridPager({
            pageSize: 10,
          }).pageSize).toEqual(10);
        });

        it('should be all if prop is all', () => {
          expect(new GridPager({
            pageSize: 'all',
          }).pageSize).toEqual('all');
        });

        it('should be all if prop is zero', () => {
          expect(new GridPager({
            pageSize: 0,
          }).pageSize).toEqual('all');
        });
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
