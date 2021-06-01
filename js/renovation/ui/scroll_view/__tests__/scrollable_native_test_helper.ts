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
  SCROLLVIEW_BOTTOM_POCKET_CLASS,
  SCROLLVIEW_TOP_POCKET_CLASS,
} from '../common/consts';

import { Scrollbar, ScrollbarPropsType } from '../scrollbar';

jest.mock('../../load_indicator', () => ({ LoadIndicator: React.forwardRef(() => null) }));
jest.mock('../../scroll_view/load_panel', () => ({ ScrollViewLoadPanel: React.forwardRef(() => null) }));

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
    this.viewModel.vScrollbarRef = React.createRef();
    this.viewModel.hScrollbarRef = React.createRef();

    const { isVertical, isHorizontal, isBoth } = new ScrollDirection(this.options.direction);
    this.isVertical = isVertical;
    this.isHorizontal = isHorizontal;
    this.isBoth = isBoth;

    this.scrollable = mount(viewFunction(this.viewModel));

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
        get() { return size.height || 0; },
      },
      offsetWidth: {
        get() { return size.width || 0; },
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
        get() { return size.width || 0; },
      },
      clientHeight: {
        configurable: true,
        get() { return size.height || 0; },
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

      Object.assign(scrollbar, {
        props: {
          ...scrollbar.props,
          ...{
            contentSize: 200,
            containerSize: 100,
            scrollableOffset: 0,
            scrollLocation: -50,
            ...additionalProps.props,
          },
        },
      });

      return scrollbar;
    };

    if (this.isBoth) {
      this.viewModel.hScrollbarRef.current = initSettings(scrollbars.at(0));
      this.viewModel.vScrollbarRef.current = initSettings(scrollbars.at(1));
    } else if (this.isVertical) {
      this.viewModel.vScrollbarRef.current = initSettings(scrollbars.at(0));
    } else if (this.isHorizontal) {
      this.viewModel.hScrollbarRef.current = initSettings(scrollbars.at(0));
    }
  }

  initScrollbarHandlerMocks(): void {
    this.scrollBarHandlers = ['init', 'start', 'end', 'cancel', 'stop', 'move', 'scrollBy', 'release'];

    this.scrollBarHandlers.forEach((handler) => {
      this[`${handler}HandlerMock`] = jest.fn();
      if (this.isVertical) {
        this.viewModel.vScrollbarRef.current[`${handler}Handler`] = this[`${handler}HandlerMock`];
      }
      if (this.isHorizontal) {
        this.viewModel.hScrollbarRef.current[`${handler}Handler`] = this[`${handler}HandlerMock`];
      }
    });
  }

  initContainerPosition({ top, left }: { top: number; left: number }): void {
    this.viewModel.containerRef.current.scrollTop = top;
    this.viewModel.containerRef.current.scrollLeft = left;

    if (this.isVertical && this.options.useSimulatedScrollbar) {
      this.viewModel.vScrollbarRef.current.props.scrollLocation = -top;
    }

    if (this.isHorizontal && this.options.useSimulatedScrollbar) {
      this.viewModel.hScrollbarRef.current.props.scrollLocation = -left;
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
  getActionHandlers(
    props: Pick<ScrollableNativePropsType, 'onScroll' | 'onUpdated' | 'onPullDown' | 'onReachBottom'>,
  ): { [T in 'onScroll' | 'onUpdated' | 'onPullDown' | 'onReachBottom']: any } {
    const actionHandlers = {
      onScroll: jest.fn(),
      onUpdated: jest.fn(),
      onPullDown: jest.fn(),
      onReachBottom: jest.fn(),
    };

    Object.keys(actionHandlers).forEach((key) => {
      // eslint-disable-next-line no-prototype-builtins
      if (props.hasOwnProperty(key)) {
        actionHandlers[key] = props[key];
      }
    });

    return actionHandlers;
  }
}

export { ScrollableTestHelper };
