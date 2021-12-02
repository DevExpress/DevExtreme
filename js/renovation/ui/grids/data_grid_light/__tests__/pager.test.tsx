import React from 'react';
import { mount } from 'enzyme';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GridPager, viewFunction as GridPagerView, GridPagerProps } from '../widgets/pager';

describe('Pager', () => {
  describe('View', () => {
    it('default render', () => {
      const props = new GridPagerProps();
      props.pageCount = 4;

      const viewProps = { props } as Partial<GridPager>;
      const tree = mount(<GridPagerView {...viewProps as any} /> as any);

      expect(tree.find('.dx-page')).toHaveLength(4);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('aria', () => {
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
    });
  });
});
