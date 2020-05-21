/* eslint-disable @typescript-eslint/explicit-function-return-type */
import getElementComputedStyle from '../../../js/renovation/pager/get-computed-style';
import { updateChildProps } from '../../../js/renovation/pager/resizable-container';
import type { GetHtmlElement } from '../../../js/renovation/pager/resizable-container';

jest.mock('../../../js/renovation/pager/get-computed-style');

(getElementComputedStyle as jest.Mock).mockImplementation((el) => el);

describe('resizable-container', () => {
  function getFakeHtml(width: number | null): HTMLElement| null {
    return width ? { width: `${width}px` } as unknown as HTMLElement : null;
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function getElementsRef({
    width, pageSizes, info, pages,
  }) {
    const parentHtmlEl = getFakeHtml(width);
    const pageSizesHtmlEl: GetHtmlElement = { getHtmlElement: () => getFakeHtml(pageSizes) };
    const infoHtmlEl: GetHtmlElement = { getHtmlElement: () => getFakeHtml(info) };
    const pagesHtmlEl = getFakeHtml(info + pages);
    return {
      parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl,
    };
  }
  it('updateChildProps: init', () => {
    const prevElementsWidth = {
      pageSizesHtmlEl: 0,
      pagesHtmlEl: 0,
      infoHtmlEl: 0,
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
    } = updateChildProps(parentHtmlEl, pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl, prevElementsWidth);
    expect(elementsWidth).toEqual({
      infoHtmlEl: 50,
      pageSizesHtmlEl: 100,
      pagesHtmlEl: 150,
    });
    expect(infoTextVisible).toBe(true);
    expect(isLargeDisplayMode).toBe(true);
  });
  it('updateChildProps: second update not mutate elementsWidth', () => {
    const prevElementsWidth = {
      pageSizesHtmlEl: 0,
      pagesHtmlEl: 0,
      infoHtmlEl: 0,
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
      pageSizesHtmlEl: 100,
      pagesHtmlEl: 200,
      infoHtmlEl: 100,
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
    const {
      infoTextVisible,
      isLargeDisplayMode,
    } = updateChildProps(parentHtmlEl,
      pageSizesHtmlEl, infoHtmlEl, pagesHtmlEl, { } as any);
    return {
      infoTextVisible,
      isLargeDisplayMode,
    };
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
