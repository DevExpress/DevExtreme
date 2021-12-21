import React from 'react';
import { mount } from 'enzyme';
import {
  Pager, viewFunction as GridPagerView, PagerProps,
} from '../pager';
import { PagerContent } from '../../../../pager/content';
import { Plugins } from '../../../../../utils/plugin/context';
import { PlaceholderExtender } from '../../../../../utils/plugin/placeholder_extender';

describe('Pager', () => {
  describe('View', () => {
    it('default render', () => {
      const props = new PagerProps();

      const viewProps: Partial<Pager> = {
        props,
        pageCount: 10,
        totalCount: 20,
        pageIndex: 30,
        pageSize: 40,
      };

      const placeholderTree = mount(<GridPagerView {...viewProps as any} /> as any);
      const { template: PagerTemplate } = placeholderTree.find(PlaceholderExtender).props();

      const tree = mount(<PagerTemplate />);
      expect(tree.find(PagerContent).props()).toMatchObject({
        displayMode: 'adaptive',
        infoText: 'Page {0} of {1} ({2} items)',
        pageCount: 10,
        totalCount: 20,
        pageIndex: 30,
        pageSize: 40,
        showInfo: false,
        showNavigationButtons: false,
        showPageSizes: false,
        visible: true,
      });
    });

    it('should pass zero to pager component when pageSize is "all"', () => {
      const props = new PagerProps();

      const viewProps = {
        props,
        pageCount: 10,
        totalCount: 20,
        pageIndex: 30,
        pageSize: 'all',
      } as Partial<Pager>;

      const placeholderTree = mount(<GridPagerView {...viewProps as any} /> as any);
      const { template: PagerTemplate } = placeholderTree.find(PlaceholderExtender).props();

      const tree = mount(<PagerTemplate />);
      expect(tree.find(PagerContent).props()).toMatchObject({
        displayMode: 'adaptive',
        infoText: 'Page {0} of {1} ({2} items)',
        pageCount: 10,
        totalCount: 20,
        pageIndex: 30,
        pageSize: 0,
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
        expect(new Pager({
          allowedPageSizes: [1, 2, 3],
        }).allowedPageSizes).toEqual([1, 2, 3]);
      });

      it('should be calculated when auto', () => {
        const grid = new Pager({
          allowedPageSizes: 'auto',
        });

        grid.pageSize = 20;

        expect(grid.allowedPageSizes).toEqual([10, 20, 40]);
      });

      it('should be empty when auto and pageSize is all', () => {
        const grid = new Pager({
          allowedPageSizes: 'auto',
        });

        grid.pageSize = 'all';

        expect(grid.allowedPageSizes).toEqual([]);
      });
    });
  });

  describe('Callbacks', () => {
    describe('onPageIndexChange', () => {
      it('should update pageIndex', () => {
        const pager = new Pager({});
        pager.plugins = {
          getValue: () => ({ setPageIndex: (n) => { pager.pageIndex = n; } }),
        } as any;

        pager.onPageIndexChange(10);
        expect(pager.pageIndex).toEqual(10);
      });

      it('should work when paging plugin is empty', () => {
        const pager = new Pager({});
        pager.plugins = {
          getValue: () => null,
        } as any;

        expect(() => pager.onPageIndexChange(10)).not.toThrow();
      });
    });

    describe('onPageSizeChange', () => {
      it('should update pager.pageSize', () => {
        const pager = new Pager({});
        pager.plugins = {
          getValue: () => ({ setPageSize: (n) => { pager.pageSize = n; } }),
        } as any;

        pager.onPageSizeChange(10);
        expect(pager.pageSize).toEqual(10);
      });

      it('should set pager.pageSize to "all" when called with zero', () => {
        const pager = new Pager({});
        pager.plugins = {
          getValue: () => ({ setPageSize: (n) => { pager.pageSize = n; } }),
        } as any;

        pager.onPageSizeChange(0);
        expect(pager.pageSize).toEqual('all');
      });

      it('should work when paging plugin is empty', () => {
        const pager = new Pager({});
        pager.plugins = {
          getValue: () => null,
        } as any;

        expect(() => pager.onPageSizeChange(10)).not.toThrow();
      });
    });
  });

  describe('Effects', () => {
    describe('subscribeToPagingPluginUpdates', () => {
      it('should update paging props', () => {
        const watchMock = jest.fn();
        const pager = new Pager({});

        pager.plugins = {
          watch: watchMock,
        } as unknown as Plugins;

        pager.subscribeToPagingPluginUpdates();

        watchMock.mock.calls[0][1]({
          pageSize: 5,
          pageIndex: 10,
        });

        expect(pager.pageSize).toEqual(5);
        expect(pager.pageIndex).toEqual(10);
      });
    });
  });
});
