import { describe, expect, it } from '@jest/globals';
import $ from '@js/core/renderer';
import type dxPagination from '@js/ui/pagination';

import { DataController } from '../data_controller';
import { getContext } from '../di.test_utils';
import type { Options } from '../options';
import { OptionsControllerMock } from '../options_controller/options_controller.mock';
import { PagerView } from './view';

const createPagerView = (options?: Options) => {
  const context = getContext(options ?? {
    dataSource: [],
    pager: {
      visible: true,
    },
  });

  const rootElement = document.createElement('div');

  const pager = context.get(PagerView);
  const optionsController = context.get(OptionsControllerMock);

  pager.render(rootElement);

  return {
    rootElement,
    optionsController,
    dataController: context.get(DataController),
  };
};

const isPaginationVisible = (rootElement: HTMLDivElement): boolean => {
  const visible = rootElement.querySelector('.dx-pagination') !== null;

  return visible;
};

const getPagination = (rootElement: HTMLDivElement): dxPagination => {
  const element = rootElement.querySelector('.dx-pagination');
  const component = ($(element as any) as any).dxPagination('instance') as dxPagination;

  return component;
};

describe('Pager View', () => {
  describe('render', () => {
    it('empty PagerView', () => {
      const { rootElement } = createPagerView();

      expect(rootElement).toMatchSnapshot();
    });

    it('PagerView with options', () => {
      const { rootElement } = createPagerView({
        dataSource: [...new Array(20)].map((_, index) => ({ field: `test_${index}` })),
        paging: {
          pageIndex: 2,
        },
        pager: {
          showPageSizeSelector: true,
        },
      });

      expect(rootElement).toMatchSnapshot();
    });
  });

  describe('Visibility', () => {
    it('should be visible when visible = \'true\'', () => {
      const { rootElement } = createPagerView({
        dataSource: [...new Array(20)].map((_, index) => ({ field: `test_${index}` })),
        paging: {
          pageIndex: 6,
        },
        pager: {
          visible: true,
          showPageSizeSelector: true,
        },
      });

      expect(isPaginationVisible(rootElement)).toBeTruthy();
    });

    it('should be hidden when visible = \'false\'', () => {
      const { rootElement } = createPagerView({
        dataSource: [...new Array(20)].map((_, index) => ({ field: `test_${index}` })),
        paging: {
          pageIndex: 6,
        },
        pager: {
          visible: false,
          showPageSizeSelector: true,
        },
      });

      expect(isPaginationVisible(rootElement)).toBeFalsy();
    });

    it('should be hidden when visible = \'auto\' and pageCount <= 1', () => {
      const { rootElement } = createPagerView({
        dataSource: [...new Array(4)].map((_, index) => ({ field: `test_${index}` })),
        paging: {
          pageIndex: 6,
        },
        pager: {
          visible: 'auto',
          showPageSizeSelector: true,
        },
      });

      expect(isPaginationVisible(rootElement)).toBeFalsy();
    });

    it('should be visibl visible = \'auto\' and pageCount > 1', () => {
      const { rootElement } = createPagerView({
        dataSource: [...new Array(20)].map((_, index) => ({ field: `test_${index}` })),
        paging: {
          pageIndex: 6,
        },
        pager: {
          visible: 'auto',
          showPageSizeSelector: true,
        },
      });

      expect(isPaginationVisible(rootElement)).toBeTruthy();
    });

    it('should be hidden when changing a visible to \'false\' at runtime', () => {
      const { rootElement, optionsController } = createPagerView({
        dataSource: [...new Array(4)].map((_, index) => ({ field: `test_${index}` })),
        paging: {
          pageIndex: 6,
        },
        pager: {
          visible: true,
          showPageSizeSelector: true,
        },
      });

      optionsController.option('pager.visible', false);

      expect(isPaginationVisible(rootElement)).toBeFalsy();
    });

    it('should be visible when changing a visible to \'true\' at runtime', () => {
      const { rootElement, optionsController } = createPagerView({
        dataSource: [...new Array(4)].map((_, index) => ({ field: `test_${index}` })),
        paging: {
          pageIndex: 6,
        },
        pager: {
          visible: false,
          showPageSizeSelector: true,
        },
      });

      optionsController.option('pager.visible', true);

      expect(isPaginationVisible(rootElement)).toBeTruthy();
    });
  });

  describe('allowedPageSizes', () => {
    it('allowedPageSizes = \'auto\'', () => {
      const { rootElement } = createPagerView({
        dataSource: [...new Array(4)].map((_, index) => ({ field: `test_${index}` })),
        paging: {
          pageIndex: 6,
        },
        pager: {
          visible: true,
          allowedPageSizes: 'auto',
          showPageSizeSelector: true,
        },
      });

      const pagination = getPagination(rootElement);

      expect(pagination.option('allowedPageSizes')).toEqual([3, 6, 12]);
    });

    it('allowedPageSizes = custom values', () => {
      const { rootElement } = createPagerView({
        dataSource: [...new Array(20)].map((_, index) => ({ field: `test_${index}` })),
        paging: {
          pageIndex: 6,
        },
        pager: {
          visible: 'auto',
          allowedPageSizes: [4, 10, 20],
          showPageSizeSelector: true,
        },
      });

      const pagination = getPagination(rootElement);

      expect(pagination.option('allowedPageSizes')).toEqual([4, 10, 20]);
    });

    it('allowedPageSizes changed to custom values at runtime', () => {
      const { rootElement, optionsController } = createPagerView({
        dataSource: [...new Array(20)].map((_, index) => ({ field: `test_${index}` })),
        paging: {
          pageIndex: 6,
        },
        pager: {
          allowedPageSizes: 'auto',
          showPageSizeSelector: true,
        },
      });

      optionsController.option('pager.allowedPageSizes', [4, 10, 20]);

      const pagination = getPagination(rootElement);

      expect(pagination.option('allowedPageSizes')).toEqual([4, 10, 20]);
    });
  });
});
