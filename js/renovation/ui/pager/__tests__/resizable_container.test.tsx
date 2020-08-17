/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import getElementComputedStyle from '../utils/get_computed_style';
import {
  ResizableContainer,
  viewFunction as ResizableContainerComponent,
  ResizableContainerProps,
  updateChildProps,
} from '../resizable_container';
import { GetHtmlElement } from '../common/types.d';
import resizeCallbacks from '../../../../core/utils/resize_callbacks';

jest.mock('../utils/get_computed_style');
jest.mock('../../../../core/utils/resize_callbacks');

(getElementComputedStyle as jest.Mock).mockImplementation((el) => el);

describe('resizable-container', () => {
  function getFakeHtml(width: number | null): HTMLElement | undefined {
    return width ? { width: `${width}px` } as unknown as HTMLElement : undefined;
  }
  function getElementsRef({
    width, pageSizes, info, pages,
  }) {
    const parentHtmlEl = getFakeHtml(width) as HTMLElement;
    const pageSizesHtmlEl: GetHtmlElement | undefined = pageSizes
      ? { getHtmlElement: () => getFakeHtml(pageSizes) } : undefined;
    const infoHtmlEl: GetHtmlElement | undefined = info
      ? { getHtmlElement: () => getFakeHtml(info) } : undefined;
    const pagesHtmlEl = getFakeHtml(info + pages);
    return {
      parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
    };
  }

  describe('View', () => {
    it('render', () => {
      const contentTemplate = jest.fn();
      const props = {
        parentRef: 'parentRef',
        pageSizesRef: 'pageSizesRef',
        infoTextRef: 'infoTextRef',
        pagesRef: 'pagesRef',
        infoTextVisible: true,
        isLargeDisplayMode: true,
        pagerProps: {
          pagerPropsProp1: 'pagerPropsProp1',
          pagerPropsProp2: 'pagerPropsProp2',
        },
        props: { contentTemplate },
        restAttributes: { restAttribute: {} },
      } as any as ResizableContainer;

      const tree = shallow<typeof ResizableContainerComponent>(
        <ResizableContainerComponent {...props as any} /> as any,
      );
      expect(tree.props()).toEqual({
        pagerPropsProp1: 'pagerPropsProp1',
        pagerPropsProp2: 'pagerPropsProp2',
        restAttribute: props.restAttributes.restAttribute,
        infoTextRef: 'infoTextRef',
        infoTextVisible: true,
        isLargeDisplayMode: true,
        pageSizesRef: 'pageSizesRef',
        pagesRef: 'pagesRef',
        parentRef: 'parentRef',
      });
    });
  });

  describe('behaviour', () => {
    function createComponent(sizes: {
      width; pageSizes; info; pages;
    }) {
      const component = new ResizableContainer({ } as ResizableContainerProps);
      const {
        parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
      } = getElementsRef(sizes);
      component.parentRef = parentHtmlEl;
      component.pageSizesRef = pageSizesHtmlEl;
      component.pagesRef = pagesHtmlEl as HTMLElement;
      component.infoTextRef = infoHtmlEl;
      return component;
    }

    it('effectUpdateChildProps', () => {
      const component = createComponent({
        width: 400, pageSizes: 100, info: 50, pages: 100,
      });
      component.effectUpdateChildProps();
      expect(component.elementsWidth).toEqual({
        info: 50,
        pageSizes: 100,
        pages: 150,
      });
      expect(component.infoTextVisible).toBe(true);
      expect(component.isLargeDisplayMode).toBe(true);
    });

    it('effectUpdateChildProps, visible change from false to true', () => {
      // visible false
      const component = createComponent({
        width: 0, pageSizes: 0, info: 0, pages: 0,
      });
      component.effectUpdateChildProps();
      expect(component.elementsWidth).toEqual({
        info: 0,
        pageSizes: 0,
        pages: 0,
      });
      expect(component.isLargeDisplayMode).toBe(true);
      expect(component.infoTextVisible).toBe(true);
      const { elementsWidth } = component;
      // visible true
      const {
        parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
      } = getElementsRef({
        width: 400, pageSizes: 100, info: 50, pages: 100,
      });
      component.parentRef = parentHtmlEl;
      component.pageSizesRef = pageSizesHtmlEl;
      component.pagesRef = pagesHtmlEl;
      component.infoTextRef = infoHtmlEl;
      component.effectUpdateChildProps();
      expect(component.isLargeDisplayMode).toBe(true);
      expect(component.infoTextVisible).toBe(true);
      expect(elementsWidth).not.toBe(component.elementsWidth);
    });

    describe('subscribeToResize', () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      it('subscribe', () => {
        const component = createComponent({
          width: 0, pageSizes: 0, info: 0, pages: 0,
        });

        const dispose = component.subscribeToResize();

        expect(resizeCallbacks.add).toBeCalledTimes(1);
        expect(resizeCallbacks.remove).toBeCalledTimes(0);

        dispose();
      });

      it('remove', () => {
        const component = createComponent({
          width: 0, pageSizes: 0, info: 0, pages: 0,
        });
        const dispose = component.subscribeToResize();

        dispose();

        expect(resizeCallbacks.remove).toBeCalledTimes(1);
        const callbackPassedToAdd = (resizeCallbacks as any).add.mock.calls[0][0];
        const callbackPassedToRemove = (resizeCallbacks as any).add.mock.calls[0][0];
        expect(callbackPassedToAdd).toEqual(callbackPassedToRemove);
      });

      it('updateChildProps on resizeCallback', () => {
        const component = createComponent({
          width: 10, pageSizes: 50, info: 50, pages: 50,
        });
        component.effectUpdateChildProps();

        const {
          parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
        } = getElementsRef({
          width: 400, pageSizes: 100, info: 50, pages: 100,
        });
        component.parentRef = parentHtmlEl;
        component.pageSizesRef = pageSizesHtmlEl;
        component.pagesRef = pagesHtmlEl;
        component.infoTextRef = infoHtmlEl;

        const addMock = (resizeCallbacks as any).add.mock;
        const dispose = component.subscribeToResize();
        expect(addMock.calls.length).toBe(1);

        addMock.calls[0][0](); // resizeCallbacks.fire() - jest mock bug

        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(true);

        dispose();
      });
    });

    it('pagerProps', () => {
      const props: ResizableContainerProps = {
        contentTemplate: 'template',
        pageIndexChange: () => { },
        pageSizeChange: () => { },
        pageIndex: 1,
        pageCount: 2,
        pageSize: 10,
        pageSizes: [1, 2],
        pagesCountText: 'count',
      };
      const component = new ResizableContainer(props);

      const { contentTemplate, ...expected } = props;
      expect(component.pagerProps).toMatchObject(expected);
    });
  });

  describe('updateChildProps', () => {
    it('init', () => {
      const prevElementsWidth = {
        pageSizes: 0,
        pages: 0,
        info: 0,
      };
      const {
        parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
      } = getElementsRef({
        width: 400, pageSizes: 100, info: 50, pages: 100,
      });
      const {
        elementsWidth,
        infoTextVisible,
        isLargeDisplayMode,
      } = updateChildProps(parentHtmlEl,
        pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl, prevElementsWidth);
      expect(elementsWidth).toEqual({
        info: 50,
        pageSizes: 100,
        pages: 150,
      });
      expect(infoTextVisible).toBe(true);
      expect(isLargeDisplayMode).toBe(true);
    });

    it('no pageSizes and info', () => {
      const prevElementsWidth = {
        pageSizes: 0,
        pages: 0,
        info: 0,
      };
      const {
        parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
      } = getElementsRef({
        width: 400, pageSizes: null, info: null, pages: 100,
      });
      const {
        elementsWidth,
        infoTextVisible,
        isLargeDisplayMode,
      } = updateChildProps(parentHtmlEl,
        pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl, prevElementsWidth);
      expect(elementsWidth).toEqual({
        info: 0,
        pageSizes: 0,
        pages: 100,
      });
      expect(infoTextVisible).toBe(true);
      expect(isLargeDisplayMode).toBe(true);
    });

    it('second update not mutate elementsWidth', () => {
      const prevElementsWidth = {
        pageSizes: 0,
        pages: 0,
        info: 0,
      };
      const {
        parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
      } = getElementsRef({
        width: 400, pageSizes: 100, info: 50, pages: 100,
      });
      const { elementsWidth } = updateChildProps(parentHtmlEl,
        pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl, prevElementsWidth);
      const { elementsWidth: nextElementsWidth } = updateChildProps(parentHtmlEl,
        pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl, elementsWidth);
      expect(elementsWidth === nextElementsWidth).toBe(true);
    });

    it('update from large to small not mutate elementsWidth', () => {
      const largeElementsWidth = {
        pageSizes: 100,
        pages: 200,
        info: 100,
      };
      const {
        parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
      } = getElementsRef({
        width: 400, pageSizes: 100, info: 100, pages: 100,
      });
      const { elementsWidth } = updateChildProps(parentHtmlEl,
        pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl, largeElementsWidth);
      expect(elementsWidth === largeElementsWidth).toBe(true);
    });

    function testChildProps(widths: Parameters<typeof getElementsRef>[0]) {
      const {
        parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
      } = getElementsRef(widths);
      return updateChildProps(parentHtmlEl,
        pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl, {
          pageSizes: 0,
          pages: 0,
          info: 0,
        } as any);
    }

    it('fit size', () => {
      const {
        infoTextVisible,
        isLargeDisplayMode,
      } = testChildProps({
        width: 400, pageSizes: 100, info: 50, pages: 100,
      });
      expect(infoTextVisible).toBe(true);
      expect(isLargeDisplayMode).toBe(true);
    });

    it('showInfo false and infoRef null', () => {
      const {
        infoTextVisible,
        isLargeDisplayMode,
      } = testChildProps({
        width: 400, pageSizes: 100, info: null, pages: 100,
      });
      expect(infoTextVisible).toBe(true);
      expect(isLargeDisplayMode).toBe(true);
    });

    it('info text not fit', () => {
      const {
        infoTextVisible,
        isLargeDisplayMode,
      } = testChildProps({
        width: 400, pageSizes: 100, info: 300, pages: 100,
      });
      expect(infoTextVisible).toBe(false);
      expect(isLargeDisplayMode).toBe(true);
    });

    it('info text not fit and isLargeDisplayMode not possible', () => {
      const {
        infoTextVisible,
        isLargeDisplayMode,
      } = testChildProps({
        width: 400, pageSizes: 250, info: 100, pages: 250,
      });
      expect(infoTextVisible).toBe(false);
      expect(isLargeDisplayMode).toBe(false);
    });
  });
});
