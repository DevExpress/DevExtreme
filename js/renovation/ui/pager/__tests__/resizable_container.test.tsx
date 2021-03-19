/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import getElementComputedStyle from '../utils/get_computed_style';
import {
  ResizableContainer,
  viewFunction as ResizableContainerComponent,
  ResizableContainerProps,
  calculateAdaptivityProps,
} from '../resizable_container';
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
    const parentHtmlEl = getFakeHtml(width) as HTMLDivElement;
    const pageSizesHtmlEl = pageSizes ? getFakeHtml(pageSizes) as HTMLDivElement : undefined;
    const infoHtmlEl = info ? getFakeHtml(info) as HTMLDivElement : undefined;
    const pagesHtmlEl = getFakeHtml(info + pages);
    return {
      parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
    };
  }

  describe('View', () => {
    it('render', () => {
      const contentTemplate = jest.fn();
      const props = {
        parentRef: 'parentRef' as any,
        pageSizesRef: 'pageSizesRef' as any,
        infoTextRef: 'infoTextRef' as any,
        pagesRef: 'pagesRef' as any,
        infoTextVisible: true,
        isLargeDisplayMode: true,
        props: {
          contentTemplate,
          pagerProps: {
            pagerPropsProp1: 'pagerPropsProp1',
            pagerPropsProp2: 'pagerPropsProp2',
          } as any,
        },
        restAttributes: { restAttribute: {} },
      } as Partial<ResizableContainer>;

      const tree = shallow(
        <ResizableContainerComponent {...props as any} />,
      );
      expect(tree.props()).toEqual({
        pagerPropsProp1: 'pagerPropsProp1',
        pagerPropsProp2: 'pagerPropsProp2',
        restAttribute: props.restAttributes?.restAttribute,
        infoTextRef: 'infoTextRef',
        infoTextVisible: true,
        isLargeDisplayMode: true,
        pageSizesRef: 'pageSizesRef',
        pagesRef: 'pagesRef',
        rootElementRef: 'parentRef',
      });
      expect(tree.exists(contentTemplate)).toBe(true);
    });
  });

  describe('Logic', () => {
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
    function updateComponent(component: ResizableContainer, sizes: {
      width; pageSizes; info; pages;
    }) {
      const {
        parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
      } = getElementsRef(sizes);
      component.parentRef = parentHtmlEl;
      component.pageSizesRef = pageSizesHtmlEl;
      component.pagesRef = pagesHtmlEl as HTMLElement;
      component.infoTextRef = infoHtmlEl;
      return component;
    }

    describe('UpdateChildProps', () => {
      it('first render should update elementsWidth', () => {
        const component = createComponent({
          width: 400, pageSizes: 100, info: 50, pages: 100,
        });
        component.effectUpdateChildProps();
        expect(component.elementsWidth).toEqual({
          info: 50,
          pageSizes: 100,
          pages: 100,
        });
        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(true);
      });

      it('no pageSizes and info', () => {
        const component = createComponent({
          width: 400, pageSizes: null, info: null, pages: 100,
        });
        component.effectUpdateChildProps();
        expect(component.elementsWidth).toEqual({
          info: 0,
          pageSizes: 0,
          pages: 100,
        });
        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(true);
      });

      it('resize from large to small', () => {
        const component = createComponent({
          width: 450, pageSizes: 100, pages: 200, info: 100,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(true);
        updateComponent(component, {
          width: 350, pageSizes: 100, pages: 200, info: 100,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        expect(component.isLargeDisplayMode).toBe(true);
        component.effectUpdateChildProps();
        updateComponent(component, {
          width: 250, pageSizes: 100, pages: 200, info: 0,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        expect(component.isLargeDisplayMode).toBe(false);
        updateComponent(component, {
          width: 200, pageSizes: 50, pages: 50, info: 0,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        expect(component.isLargeDisplayMode).toBe(false);
        expect(component.elementsWidth).toEqual({
          info: 100,
          pageSizes: 100,
          pages: 200,
        });
      });

      it('resize from small to lagre', () => {
        const component = createComponent({
          width: 300, pageSizes: 100, pages: 200, info: 100,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        expect(component.isLargeDisplayMode).toBe(false);
        updateComponent(component, {
          width: 300, pageSizes: 50, pages: 50, info: 0,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        expect(component.isLargeDisplayMode).toBe(false);
        updateComponent(component, {
          width: 400, pageSizes: 50, pages: 50, info: 0,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        expect(component.isLargeDisplayMode).toBe(true);
        updateComponent(component, {
          width: 400, pageSizes: 100, pages: 200, info: 0,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        expect(component.isLargeDisplayMode).toBe(true);
        updateComponent(component, {
          width: 450, pageSizes: 100, pages: 200, info: 0,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(true);
        updateComponent(component, {
          width: 450, pageSizes: 100, pages: 200, info: 100,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(true);
        expect(component.elementsWidth).toEqual({
          info: 100,
          pageSizes: 100,
          pages: 200,
        });
      });

      it('pageIndex changed and info not fitted to size', () => {
        const component = createComponent({
          width: 450, pageSizes: 100, pages: 200, info: 100,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(true);
        expect(component.elementsWidth).toEqual({
          info: 100,
          pageSizes: 100,
          pages: 200,
        });
        // pageIndex is changed and info text size grows
        updateComponent(component, {
          width: 450, pageSizes: 100, pages: 200, info: 160,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        expect(component.isLargeDisplayMode).toBe(true);
        expect(component.elementsWidth).toEqual({
          info: 160,
          pageSizes: 100,
          pages: 200,
        });
      });

      // T962160
      it('info should be shown after pageIndex is changed from 5 to 1 page', () => {
        const component = createComponent({
          width: 450, pageSizes: 100, pages: 200, info: 100,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(true);
        // pageIndex is changed and pages size grows because 2 separator show
        updateComponent(component, {
          width: 450, pageSizes: 100, pages: 250, info: 100,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        // move back to the first page
        updateComponent(component, {
          width: 450, pageSizes: 100, pages: 200, info: 100,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(true);
      });

      it('pageSize changed and large content not fitted to size', () => {
        const component = createComponent({
          width: 210, pageSizes: 100, pages: 100, info: 20,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        expect(component.isLargeDisplayMode).toBe(true);
        expect(component.elementsWidth).toEqual({
          info: 20,
          pageSizes: 100,
          pages: 100,
        });
        // pageSizes is changed and content size grows
        updateComponent(component, {
          width: 210, pageSizes: 120, pages: 100, info: 0,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        expect(component.isLargeDisplayMode).toBe(false);
        expect(component.elementsWidth).toEqual({
          info: 20,
          pageSizes: 120,
          pages: 100,
        });
      });

      it('update elementsWidth if widths changed', () => {
        const component = createComponent({
          width: 350, pageSizes: 100, pages: 100, info: 100,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(true);
        expect(component.elementsWidth).toEqual({
          info: 100,
          pageSizes: 100,
          pages: 100,
        });
        // pageIndex and pageSizes is changed
        updateComponent(component, {
          width: 350, pageSizes: 110, pages: 110, info: 90,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(true);
        expect(component.elementsWidth).toEqual({
          info: 90,
          pageSizes: 110,
          pages: 110,
        });
      });

      it('visible is changed from false to true', () => {
      // visible false
        const component = createComponent({
          width: 0, pageSizes: 0, info: 0, pages: 0,
        });
        component.effectUpdateChildProps();
        expect(component.elementsWidth).toBeUndefined();
        expect(component.isLargeDisplayMode).toBe(true);
        expect(component.infoTextVisible).toBe(true);
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
        expect(component.elementsWidth).toEqual({
          info: 50,
          pageSizes: 100,
          pages: 100,
        });
      });
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

        dispose?.();
      });

      it('remove', () => {
        const component = createComponent({
          width: 0, pageSizes: 0, info: 0, pages: 0,
        });
        const dispose = component.subscribeToResize();

        dispose?.();

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

        dispose?.();
      });
    });
  });

  describe('calculateAdaptivityProps', () => {
    function testChildProps(widths: Parameters<typeof getElementsRef>[0]) {
      return calculateAdaptivityProps({ parent: widths.width, ...widths });
    }

    it('fit size', () => {
      const {
        infoTextVisible,
        isLargeDisplayMode,
      } = testChildProps({
        width: 400, pageSizes: 100, info: 50, pages: 100 + 50,
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
        width: 400, pageSizes: 100, info: 300, pages: 100, // 300 + 100,
      });
      expect(infoTextVisible).toBe(false);
      expect(isLargeDisplayMode).toBe(true);
    });

    it('info text not fit and isLargeDisplayMode not possible', () => {
      const {
        infoTextVisible,
        isLargeDisplayMode,
      } = testChildProps({
        width: 400, pageSizes: 250, info: 100, pages: 100 + 250,
      });
      expect(infoTextVisible).toBe(false);
      expect(isLargeDisplayMode).toBe(false);
    });
  });
});
