import React from 'react';
import { mount } from 'enzyme';
import { titleize } from '../../../../core/utils/inflector';
import {
  ScrollDirection,
} from '../utils/scroll_direction';

import {
  ScrollableNative as Scrollable,
  viewFunction,
  ScrollableNativePropsType,
} from '../scrollable_native';

import {
  SCROLLABLE_CONTAINER_CLASS,
  SCROLLABLE_CONTENT_CLASS,
  SCROLLABLE_SCROLL_CLASS,
  SCROLLVIEW_BOTTOM_POCKET_CLASS,
  SCROLLVIEW_TOP_POCKET_CLASS,
} from '../common/consts';

import { Scrollbar, ScrollbarPropsType } from '../scrollbar';

const BOTTOM_POCKET_HEIGHT = 55;

class ScrollableTestHelper {
  options: { [key: string]: any };

  viewModel: any;

  scrollable: any;

  isVertical: boolean;

  isHorizontal: boolean;

  isBoth: boolean;

  initHandlerMock?: jest.Mock;

  startHandlerMock?: jest.Mock;

  endHandlerMock?: jest.Mock;

  cancelHandlerMock?: jest.Mock;

  stopHandlerMock?: jest.Mock;

  scrollByHandlerMock?: jest.Mock;

  scrollBarHandlers?: string[];

  actionHandlers: { [key: string]: any };

  constructor(props: Partial<ScrollableNativePropsType & ScrollbarPropsType & { overflow: 'hidden' | 'visible' }>) {
    this.options = props;
    this.options.direction = this.options.direction || 'vertical';

    this.actionHandlers = this.getActionHandlers(this.options);

    this.viewModel = new Scrollable({
      onScroll: this.actionHandlers.onScroll,
      onUpdated: this.actionHandlers.onUpdated,
      onPullDown: this.actionHandlers.onPullDown,
      onReachBottom: this.actionHandlers.onReachBottom,
      ...this.options,
    }) as any;
    this.viewModel.scrollableRef = React.createRef();
    this.viewModel.containerRef = React.createRef();
    this.viewModel.contentRef = React.createRef();
    this.viewModel.wrapperRef = React.createRef();
    this.viewModel.topPocketRef = React.createRef();
    this.viewModel.bottomPocketRef = React.createRef();
    this.viewModel.verticalScrollbarRef = React.createRef();
    this.viewModel.horizontalScrollbarRef = React.createRef();

    const { isVertical, isHorizontal, isBoth } = new ScrollDirection(this.options.direction);
    this.isVertical = isVertical;
    this.isHorizontal = isHorizontal;
    this.isBoth = isBoth;

    this.scrollable = mount(viewFunction(this.viewModel) as JSX.Element);

    this.viewModel.scrollableRef.current = this.scrollable.getDOMNode();
    this.viewModel.containerRef.current = this.getContainerElement();
    this.viewModel.contentRef.current = this.getContentElement();

    const { contentSize = 200, containerSize = 100, overflow = 'hidden' } = this.options;
    let contentHeight = contentSize;

    if (this.options.forceGeneratePockets) {
      if (this.options.reachBottomEnabled) {
        contentHeight += BOTTOM_POCKET_HEIGHT;

        this.viewModel.bottomPocketRef.current = this.getBottomPocketElement();
        Object.defineProperties(this.viewModel.bottomPocketRef.current, {
          clientWidth: { configurable: true, get() { return 100; } },
          clientHeight: { configurable: true, get() { return BOTTOM_POCKET_HEIGHT; } },
        });
      }
    }

    this.initStyles(this.viewModel.containerRef.current,
      { width: containerSize, height: containerSize },
      { width: contentSize, height: contentHeight });
    this.initStyles(this.viewModel.contentRef.current,
      { width: contentSize, height: contentHeight },
      { width: contentSize, height: contentHeight }, overflow);
    this.initStyles(this.viewModel.scrollableRef.current,
      { width: containerSize, height: containerSize },
      { width: contentSize, height: contentHeight });

    this.viewModel.updateSizes();
  }

  // eslint-disable-next-line class-methods-use-this
  initStyles(
    element: HTMLDivElement,
    size: { width: number; height: number },
    scrollSize: { width: number; height: number },
    overflow?: string,
  ): HTMLDivElement {
    const el = element;

    Object.defineProperties(el, {
      offsetHeight: {
        get() { return parseFloat(window.getComputedStyle(this).height) || 0; },
      },
      offsetWidth: {
        get() { return parseFloat(window.getComputedStyle(this).width) || 0; },
      },
      scrollHeight: {
        configurable: true,
        get() { return scrollSize.height || 0; },
      },
      scrollWidth: {
        configurable: true,
        get() { return scrollSize.width || 0; },
      },
      clientWidth: {
        configurable: true,
        get() { return parseFloat(window.getComputedStyle(this).width) || 0; },
      },
      clientHeight: {
        configurable: true,
        get() { return parseFloat(window.getComputedStyle(this).height) || 0; },
      },
    });

    ['width', 'height'].forEach((prop) => {
      el.style[prop] = `${size[prop]}px`;
    });

    ['outerWidth', 'outerHeight'].forEach((prop) => {
      el.style[prop] = `${size[`outer${titleize(prop)}`]}px`;
    });

    if (overflow) {
      ['overflowX', 'overflowY'].forEach((prop) => {
        el.style[prop] = overflow;
      });
    }

    el.getBoundingClientRect = () => ({ width: size.width, height: size.height } as DOMRect);

    return el;
  }

  getScrollable(): any {
    return this.scrollable;
  }

  getContainerElement(): HTMLDivElement {
    return this.scrollable.find(`.${SCROLLABLE_CONTAINER_CLASS}`).getDOMNode();
  }

  getContentElement(): HTMLDivElement {
    return this.scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`).getDOMNode();
  }

  getTopPocketElement(): HTMLDivElement {
    return this.scrollable.find(`.${SCROLLVIEW_TOP_POCKET_CLASS}`).getDOMNode();
  }

  getBottomPocketElement(): HTMLDivElement {
    return this.scrollable.find(`.${SCROLLVIEW_BOTTOM_POCKET_CLASS}`).getDOMNode();
  }

  getScrollbars(): any {
    return this.scrollable.find(Scrollbar);
  }

  getVerticalScroll(): any {
    return this.scrollable.find(`.dx-scrollbar-vertical .${SCROLLABLE_SCROLL_CLASS}`);
  }

  getHorizontalScroll(): any {
    return this.scrollable.find(`.dx-scrollbar-horizontal .${SCROLLABLE_SCROLL_CLASS}`);
  }

  getVerticalScrollElement(): any {
    return this.getVerticalScroll().getElement();
  }

  getHorizontalScrollElement(): any {
    return this.getHorizontalScroll().getElement();
  }

  // eslint-disable-next-line class-methods-use-this
  extendProperties(ref, additionalProps: { [key: string]: any }): void {
    const extendedProps = { ...ref.props, ...additionalProps };

    Object.assign(ref, { props: extendedProps });
  }

  initScrollbarSettings(additionalProps:
  { [key: string]: any } = { translateOffset: 0, props: {} }): any {
    const scrollbars = this.getScrollbars();

    const initSettings = (scrollbarRef) => {
      const scrollbar = scrollbarRef.instance();
      scrollbar.scrollbarRef = React.createRef();
      scrollbar.scrollbarRef.current = scrollbarRef.getDOMNode();
      scrollbar.scrollRef = React.createRef();
      scrollbar.scrollRef.current = scrollbarRef.find('.dx-scrollable-scroll').getDOMNode();

      scrollbar.translateOffset = additionalProps.translateOffset;
      scrollbar.scrollLocation = -50;

      Object.assign(scrollbar, {
        props: {
          ...scrollbar.props,
          ...{
            scaleRatio: 1,
            contentSize: 200,
            containerSize: 100,
            baseContentSize: additionalProps.props.contentSize || 200,
            baseContainerSize: additionalProps.props.containerSize || 100,
            scrollableOffset: 0,
            ...additionalProps.props,
          },
        },
      });

      scrollbar.updateMinOffset();

      return scrollbar;
    };

    if (this.isBoth) {
      this.viewModel.horizontalScrollbarRef.current = initSettings(scrollbars.at(0));
      this.viewModel.verticalScrollbarRef.current = initSettings(scrollbars.at(1));
    } else if (this.isVertical) {
      this.viewModel.verticalScrollbarRef.current = initSettings(scrollbars.at(0));
    } else if (this.isHorizontal) {
      this.viewModel.horizontalScrollbarRef.current = initSettings(scrollbars.at(0));
    }
  }

  initScrollbarHandlerMocks(): void {
    this.scrollBarHandlers = ['init', 'start', 'end', 'cancel', 'stop', 'move', 'scrollBy', 'release'];

    this.scrollBarHandlers.forEach((handler) => {
      this[`${handler}HandlerMock`] = jest.fn();
      if (this.isVertical) {
        this.viewModel.verticalScrollbarRef.current[`${handler}Handler`] = this[`${handler}HandlerMock`];
      }
      if (this.isHorizontal) {
        this.viewModel.horizontalScrollbarRef.current[`${handler}Handler`] = this[`${handler}HandlerMock`];
      }
    });
  }

  changeScrollbarProp(prop: string, value: number): void {
    if (this.isBoth) {
      this.viewModel.horizontalScrollbarRef.current.props[prop] = value;
      this.viewModel.verticalScrollbarRef.current.props[prop] = value;
    } else if (this.isVertical) {
      this.viewModel.verticalScrollbarRef.current.props[prop] = value;
    } else if (this.isHorizontal) {
      this.viewModel.horizontalScrollbarRef.current.props[prop] = value;
    }
  }

  checkScrollbarProps(expectedProps: { [key: string]: any }): void {
    if (this.isVertical) {
      this.viewModel.verticalScrollbarRef.current!.props = {
        direction: 'vertical',
        ...expectedProps,
      };
    }
    if (this.isHorizontal) {
      this.viewModel.horizontalScrollbarRef.current!.props = {
        direction: 'horizontal',
        ...expectedProps,
      };
    }
  }

  changeScrollbarMethod(method: string, mock): void {
    const { horizontalScrollbarRef, verticalScrollbarRef } = this.viewModel;

    if (this.isBoth) {
      horizontalScrollbarRef.current![method] = mock;
      verticalScrollbarRef.current![method] = mock;
    } else if (this.isVertical) {
      verticalScrollbarRef.current![method] = mock;
    } else if (this.isHorizontal) {
      horizontalScrollbarRef.current![method] = mock;
    }
  }

  callScrollbarMethod(method: string): void {
    const { horizontalScrollbarRef, verticalScrollbarRef } = this.viewModel;

    if (this.isBoth) {
      horizontalScrollbarRef.current![method]();
      verticalScrollbarRef.current![method]();
    } else if (this.isVertical) {
      verticalScrollbarRef.current![method]();
    } else if (this.isHorizontal) {
      horizontalScrollbarRef.current![method]();
    }
  }

  initContainerPosition({ top, left }: { top: number; left: number }): void {
    this.viewModel.containerRef.current!.scrollTop = top;
    this.viewModel.containerRef.current!.scrollLeft = left;

    if (this.isVertical && this.options.useSimulatedScrollbar) {
      this.viewModel.verticalScrollbarRef.current.scrollLocation = -top;
    }

    if (this.isHorizontal && this.options.useSimulatedScrollbar) {
      this.viewModel.horizontalScrollbarRef.current.scrollLocation = -left;
    }
  }

  checkContainerPosition(jestExpect: (any) => any,
    expectedPosition: { top: number; left: number }): void {
    const { scrollTop, scrollLeft } = this.viewModel.containerRef.current;

    jestExpect(scrollTop).toEqual(expectedPosition.top);
    jestExpect(scrollLeft).toEqual(expectedPosition.left);
  }

  checkScrollTransform(jestExpect: (any) => any,
    { vertical, horizontal }: { vertical: string; horizontal: string }): void {
    if (this.isBoth) {
      jestExpect(this.getScrollbars().at(0).instance().scrollStyles).toHaveProperty('transform', horizontal);
      jestExpect(this.getScrollbars().at(1).instance().scrollStyles).toHaveProperty('transform', vertical);
    } else if (this.isVertical) {
      jestExpect(this.getScrollbars().at(0).instance().scrollStyles).toHaveProperty('transform', vertical);
    } else if (this.isHorizontal) {
      jestExpect(this.getScrollbars().at(0).instance().scrollStyles).toHaveProperty('transform', horizontal);
    }
  }

  checkScrollbarEventHandlerCalls(jestExpect: (any) => any,
    expectedHandlers: string[],
    expectedArgs: (boolean | { x: number; y: number } | { [key: string]: any })[][]): void {
    this.scrollBarHandlers?.forEach((handler) => {
      const indexOf = expectedHandlers.indexOf(handler);
      if (indexOf !== -1) {
        if (this.isBoth) {
          jestExpect(this[`${handler}HandlerMock`]).toBeCalledTimes(2);
          if (expectedArgs[indexOf].length === 2) {
            jestExpect(this[`${handler}HandlerMock`]).toHaveBeenNthCalledWith(1, expectedArgs[indexOf][0], expectedArgs[indexOf][1]);
          } else if (expectedArgs[indexOf].length === 1) {
            jestExpect(this[`${handler}HandlerMock`]).toHaveBeenNthCalledWith(2, expectedArgs[indexOf][0]);
          }
        } else {
          jestExpect(this[`${handler}HandlerMock`]).toBeCalledTimes(1);
          if (expectedArgs[indexOf].length === 2) {
            jestExpect(this[`${handler}HandlerMock`]).toHaveBeenCalledWith(expectedArgs[indexOf][0], expectedArgs[indexOf][1]);
          } else if (expectedArgs[indexOf].length === 1) {
            jestExpect(this[`${handler}HandlerMock`]).toHaveBeenCalledWith(expectedArgs[indexOf][0]);
          }
        }
      } else {
        jestExpect(this[`${handler}HandlerMock`]).toBeCalledTimes(0);
      }
    });
  }

  checkActionHandlerCalls(jestExpect: (any) => any,
    expectedHandlers: string[],
    expectedArgs: ({ [key: string]: any })): void {
    Object.keys(this.actionHandlers).forEach((key) => {
      const indexOf = expectedHandlers.indexOf(key);
      if (indexOf !== -1) {
        jestExpect(this.actionHandlers[key]).toBeCalledTimes(1);
        jestExpect(this.actionHandlers[key]).toHaveBeenCalledWith(expectedArgs[indexOf][0]);
      } else if (this.actionHandlers[key]) {
        jestExpect(this.actionHandlers[key]).toBeCalledTimes(0);
      } else {
        jestExpect(this.actionHandlers[key]).toEqual(undefined);
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getActionHandlers(props: any): { [key: string]: any } {
    const actionHandlers = {
      onStart: jest.fn(),
      onScroll: jest.fn(),
      onUpdated: jest.fn(),
      onStop: jest.fn(),
      onEnd: jest.fn(),
      onPullDown: jest.fn(),
      onReachBottom: jest.fn(),
      onBounce: jest.fn(),
    };

    Object.keys(actionHandlers).forEach((key) => {
      // eslint-disable-next-line no-prototype-builtins
      if (props.hasOwnProperty(key)) {
        actionHandlers[key] = props[key];
      }
    });

    return actionHandlers;
  }

  checkValidDirection(jestExpect: (any) => any,
    expectedValidDirections: { vertical?: boolean; horizontal?: boolean } | undefined,
    options: { [key: string]: string | boolean }): void {
    if (expectedValidDirections) {
      jestExpect(this.viewModel.validDirections).toEqual(expectedValidDirections);
    } else {
      jestExpect(this.viewModel.validDirections).toEqual(this.getValidDirection(options));
    }
  }

  getValidDirection(options: { [key: string]: any }): { vertical: boolean; horizontal: boolean } {
    const {
      scrollByContent, scrollByThumb, targetClass, isDxWheelEvent,
    } = options;

    const isDirectionValid = scrollByContent || (scrollByThumb && targetClass !== 'dx-scrollable-container');

    return {
      vertical: isDxWheelEvent
        ? true
        : this.isVertical && isDirectionValid && !(this.isBoth && scrollByThumb && !scrollByContent && targetClass !== 'dx-scrollable-container'),
      horizontal: isDxWheelEvent
        ? true
        : this.isHorizontal && isDirectionValid,
    };
  }
}

export { ScrollableTestHelper };
