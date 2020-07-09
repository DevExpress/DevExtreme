/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from 'preact';
import { shallow } from 'enzyme';
import getElementComputedStyle from '../../../js/renovation/pager/utils/get-computed-style';
import {
  ResizableContainer,
  viewFunction as ResizableContainerComponent,
  ResizableContainerProps,
  updateChildProps,
} from '../../../js/renovation/pager/resizable-container';
import { GetHtmlElement } from '../../../js/renovation/pager/pager.types.d';

jest.mock('../../../js/renovation/pager/utils/get-computed-style');

(getElementComputedStyle as jest.Mock).mockImplementation((el) => el);
describe('resizable-container', () => {
  function getFakeHtml(width: number | null): HTMLElement | undefined {
    return width ? { width: `${width}px` } as unknown as HTMLElement : undefined;
  }
  function getElementsRef({
    width, pageSizes, info, pages,
  }) {
    const parentHtmlEl = getFakeHtml(width) as HTMLElement;
    const pageSizesHtmlEl: GetHtmlElement = { getHtmlElement: () => getFakeHtml(pageSizes) };
    const infoHtmlEl: GetHtmlElement = { getHtmlElement: () => getFakeHtml(info) };
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
        props: { contentTemplate, pagerContentProps: 'pagerContentProps' },
      } as any as ResizableContainer;

      const tree = shallow<typeof ResizableContainerComponent>(
        <ResizableContainerComponent {...props as any} /> as any,
      );
      expect(tree.props()).toEqual({
        pagerContentProps: 'pagerContentProps',
        children: [],
        infoTextRef: 'infoTextRef',
        infoTextVisible: true,
        isLargeDisplayMode: true,
        pageSizesRef: 'pageSizesRef',
        pagesRef: 'pagesRef',
        parentRef: 'parentRef',
      });
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
      component.parentRef = parentHtmlEl as HTMLElement;
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
  });
  describe('updateChildProps', () => {
    it('updateChildProps: init', () => {
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
    it('updateChildProps: second update not mutate elementsWidth', () => {
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
    it('updateChildProps: update from large to small not mutate elementsWidth', () => {
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
    it('updateChildProps: fit size', () => {
      const {
        infoTextVisible,
        isLargeDisplayMode,
      } = testChildProps({
        width: 400, pageSizes: 100, info: 50, pages: 100,
      });
      expect(infoTextVisible).toBe(true);
      expect(isLargeDisplayMode).toBe(true);
    });

    it('updateChildProps: showInfo false and infoRef null', () => {
      const {
        infoTextVisible,
        isLargeDisplayMode,
      } = testChildProps({
        width: 400, pageSizes: 100, info: null, pages: 100,
      });
      expect(infoTextVisible).toBe(true);
      expect(isLargeDisplayMode).toBe(true);
    });
    it('updateChildProps: info text not fit', () => {
      const {
        infoTextVisible,
        isLargeDisplayMode,
      } = testChildProps({
        width: 400, pageSizes: 100, info: 300, pages: 100,
      });
      expect(infoTextVisible).toBe(false);
      expect(isLargeDisplayMode).toBe(true);
    });
    it('updateChildProps: info text not fit and isLargeDisplayMode not possible', () => {
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
