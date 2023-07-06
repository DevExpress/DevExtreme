/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { RefObject } from '@devextreme-generator/declarations';
import getElementComputedStyle from '../../../utils/get_computed_style';
import {
  ResizableContainer,
  viewFunction as ResizableContainerComponent,
  ResizableContainerProps,
  calculateLargeDisplayMode,
  calculateInfoTextVisible,
} from '../resizable_container';
import resizeCallbacks from '../../../../core/utils/resize_callbacks';
import { InternalPagerProps } from '../common/pager_props';
import * as GetElementWidth from '../utils/get_element_width';

jest.mock('../../../utils/get_computed_style');
jest.mock('../../../../core/utils/resize_callbacks');
jest.spyOn(GetElementWidth, 'getElementContentWidth');
jest.spyOn(GetElementWidth, 'getElementWidth');

(getElementComputedStyle as jest.Mock).mockImplementation((el) => el);

describe('resizable-container', () => {
  function getFakeHtml(width: number | null): HTMLDivElement | undefined {
    return width ? { width: `${width}px` } as unknown as HTMLDivElement : undefined;
  }
  function getElementsRef({
    width, pageSizes, info, pages,
  }) {
    const parentHtmlEl = { current: getFakeHtml(width) } as RefObject<HTMLDivElement>;
    const pageSizesHtmlEl = {
      current: pageSizes ? getFakeHtml(pageSizes) : undefined,
    } as RefObject<HTMLDivElement>;
    const infoHtmlEl = {
      current: info ? getFakeHtml(info) : undefined,
    } as RefObject<HTMLDivElement>;
    const pagesHtmlEl = { current: getFakeHtml(pages) } as RefObject<HTMLDivElement>;
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
        contentAttributes: {
          pagerPropsProp1: 'pagerPropsProp1',
          pagerPropsProp2: 'pagerPropsProp2',
          pageIndexChange: jest.fn(),
          pageSizeChange: jest.fn(),
        } as Partial<InternalPagerProps>,
        props: {
          contentTemplate,
        } as any,
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
        pageIndexChange: expect.any(Function),
        pageSizeChange: expect.any(Function),
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
      component.pagesRef = pagesHtmlEl;
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
      component.pagesRef = pagesHtmlEl;
      component.infoTextRef = infoHtmlEl;
      return component;
    }

    describe('UpdateChildProps', () => {
      describe('contentAttributes', () => {
        it('should merge rest attributes with know pager props exclude react twoWay defaultPageSize and defaultPageIndex', () => {
          const resizableContainer = new ResizableContainer({
            pagerProps: { defaultPageSize: 5, defaultIndex: 5, infoText: true },
          } as any);

          expect(resizableContainer.contentAttributes).toMatchObject({
            'rest-attributes': 'restAttributes',
            infoText: true,
          });
        });
      });

      // T1125402
      it('calculate elementsWidth should use rigth width methods', () => {
        const component = createComponent({
          width: 400, pageSizes: 100, info: 50, pages: 100,
        });
        component.effectUpdateChildProps();
        expect(GetElementWidth.getElementContentWidth)
          .toHaveBeenNthCalledWith(1, component.parentRef.current);
        expect(GetElementWidth.getElementWidth)
          .toHaveBeenCalledWith(component.pageSizesRef.current);
        expect(GetElementWidth.getElementWidth)
          .toHaveBeenCalledWith(component.infoTextRef.current);
        expect(GetElementWidth.getElementWidth)
          .toHaveBeenCalledWith(component.pagesRef.current);
      });

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

      it('simulate resize from large to small in react', () => {
        const component = createComponent({
          width: 450, pageSizes: 100, pages: 200, info: 100,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(true);
        updateComponent(component, {
          width: 350, pageSizes: 100, pages: 200, info: 100,
        });
        // resize callback start
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
        expect(component.isLargeDisplayMode).toBe(true);
        // in react state don't changed before all effect completed
        component.infoTextVisible = true;
        // effect effectUpdateChildProps because re-render after state changed
        component.effectUpdateChildProps();
        component.infoTextVisible = true;
        // childs render with updated state infoTextVisible = false
        updateComponent(component, {
          width: 350, pageSizes: 100, pages: 200, info: 0,
        });
        // resize callback end but resizeCallbacks fire resuse
        // because unsubscribe and sibscribe to resizeCallbacks
        // BUT resize callback closure wrong infoTextVisible = true
        expect(component.infoTextVisible).toBe(true);
        component.effectUpdateChildProps();
        //  effect effectUpdateChildProps because re-render
        component.infoTextVisible = false;
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(false);
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
        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(false);
        updateComponent(component, {
          width: 400, pageSizes: 50, pages: 50, info: 100,
        });
        component.effectUpdateChildProps();
        expect(component.infoTextVisible).toBe(true);
        expect(component.isLargeDisplayMode).toBe(true);
        updateComponent(component, {
          width: 400, pageSizes: 100, pages: 200, info: 100,
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

      it('updateAdaptivityProps should not be called when the invisible container is resized', () => {
        const component = createComponent({
          width: 100, pageSizes: 20, info: 30, pages: 30,
        });
        const updateAdaptivityPropsSpy = jest.spyOn(component, 'updateAdaptivityProps');
        const addMock = (resizeCallbacks as any).add.mock;
        component.effectUpdateChildProps();
        expect(updateAdaptivityPropsSpy).toBeCalledTimes(1);

        const dispose = component.subscribeToResize();
        expect(addMock.calls.length).toBe(1);

        const resizeFire = addMock.calls[0][0];
        updateComponent(component, {
          width: 110, pageSizes: 20, pages: 30, info: 30,
        });
        resizeFire(); // resizeCallbacks.fire() - jest mock bug
        expect(updateAdaptivityPropsSpy).toBeCalledTimes(2);
        expect(component.isLargeDisplayMode).toBe(true);

        updateComponent(component, {
          width: 0, pageSizes: 20, pages: 30, info: 30,
        });
        resizeFire();
        expect(updateAdaptivityPropsSpy).toBeCalledTimes(2);
        expect(component.isLargeDisplayMode).toBe(true);

        dispose?.();
      });
    });
  });

  describe('calculateLargeDisplayMode', () => {
    function testChildProps(widths: { width: number; pageSizes: number; pages: number }) {
      return calculateLargeDisplayMode({ parent: widths.width, ...widths });
    }

    it('fit size', () => {
      const isLargeDisplayMode = testChildProps({
        width: 400, pageSizes: 100, pages: 100 + 50,
      });
      expect(isLargeDisplayMode).toBe(true);
    });

    it('not fit size', () => {
      const isLargeDisplayMode = testChildProps({
        width: 200, pageSizes: 100, pages: 100 + 50,
      });
      expect(isLargeDisplayMode).toBe(false);
    });
  });

  describe('calculateInfoTextVisible', () => {
    function testChildProps(widths: {
      width: number;
      pageSizes: number;
      info: number;
      pages: number;
    }) {
      return calculateInfoTextVisible({ parent: widths.width, ...widths });
    }

    it('showInfo false', () => {
      const infoTextVisible = testChildProps({
        width: 400, pageSizes: 100, info: 0, pages: 100,
      });
      expect(infoTextVisible).toBe(true);
    });

    it('showInfo true', () => {
      const infoTextVisible = testChildProps({
        width: 400, pageSizes: 100, info: 100, pages: 100,
      });
      expect(infoTextVisible).toBe(true);
    });

    it('info text fit', () => {
      const infoTextVisible = testChildProps({
        width: 350, pageSizes: 100, info: 100, pages: 100,
      });
      expect(infoTextVisible).toBe(true);
    });

    it('info text not fit', () => {
      const infoTextVisible = testChildProps({
        width: 250, pageSizes: 100, info: 100, pages: 100,
      });
      expect(infoTextVisible).toBe(false);
    });
  });
});
