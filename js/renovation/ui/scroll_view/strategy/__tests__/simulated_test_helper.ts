import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { RefObject } from '@devextreme-generator/declarations';
import { titleize } from '../../../../../core/utils/inflector';
import {
  ScrollDirection,
} from '../../utils/scroll_direction';

import {
  ScrollableSimulated as Scrollable,
  ScrollableSimulated,
  viewFunction,
} from '../simulated';

import {
  SCROLLABLE_CONTAINER_CLASS,
  SCROLLABLE_CONTENT_CLASS,
  SCROLLVIEW_BOTTOM_POCKET_CLASS,
  SCROLLVIEW_CONTENT_CLASS,
  SCROLLVIEW_TOP_POCKET_CLASS,
} from '../../common/consts';

import { Scrollbar, ScrollbarPropsType } from '../../scrollbar/scrollbar';
import { ScrollableSimulatedProps } from '../../common/simulated_strategy_props';
import { AnimatedScrollbar } from '../../scrollbar/animated_scrollbar';

// jest.mock('../../../load_indicator', () => ({ LoadIndicator: React.forwardRef(() => null) }));
// jest.mock('../../internal/load_panel',
// () => ({ ScrollViewLoadPanel: React.forwardRef(() => null) }));

const TOP_POCKET_HEIGHT = 80;
const BOTTOM_POCKET_HEIGHT = 55;

interface Mock extends jest.Mock {}
class ScrollableTestHelper {
  options: Partial<ScrollableSimulatedProps & ScrollbarPropsType & { overflow: 'hidden' | 'visible' }>;

  viewModel: ScrollableSimulated;

  scrollable: any;

  isVertical: boolean;

  isHorizontal: boolean;

  isBoth: boolean;

  scrollBarHandlers?: { name: string }[];

  actionHandlers: { [key: string]: any };

  constructor(props: Partial<ScrollableSimulatedProps & ScrollbarPropsType & { overflow: 'hidden' | 'visible' }>) {
    this.options = props;
    this.actionHandlers = this.getActionHandlers(this.options);

    this.viewModel = new Scrollable({
      onStart: this.actionHandlers.onStart,
      onScroll: this.actionHandlers.onScroll,
      onUpdated: this.actionHandlers.onUpdated,
      onEnd: this.actionHandlers.onEnd,
      onPullDown: this.actionHandlers.onPullDown,
      onReachBottom: this.actionHandlers.onReachBottom,
      onBounce: this.actionHandlers.onBounce,
      onVisibilityChange: this.actionHandlers.onVisibilityChange,
      needRenderScrollbars: true,
      ...this.options,
    });
    this.viewModel.scrollableRef = React.createRef() as RefObject<HTMLDivElement>;
    this.viewModel.containerRef = React.createRef() as RefObject<HTMLDivElement>;
    this.viewModel.contentRef = React.createRef() as RefObject<HTMLDivElement>;
    this.viewModel.wrapperRef = React.createRef() as RefObject<HTMLDivElement>;
    this.viewModel.topPocketRef = React.createRef() as RefObject<HTMLDivElement>;
    this.viewModel.bottomPocketRef = React.createRef() as RefObject<HTMLDivElement>;
    this.viewModel.vScrollbarRef = React.createRef() as RefObject<AnimatedScrollbar>;
    this.viewModel.hScrollbarRef = React.createRef() as RefObject<AnimatedScrollbar>;

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

    if (this.options.needScrollViewContentWrapper) {
      this.viewModel.scrollViewContentRef = React.createRef() as RefObject<HTMLDivElement>;
      this.viewModel.scrollViewContentRef.current = this.getScrollViewContentElement();
    }

    if (this.options.forceGeneratePockets) {
      if (this.options.pullDownEnabled) {
        contentHeight += TOP_POCKET_HEIGHT;

        this.viewModel.topPocketRef.current = this.getTopPocketElement();
        Object.defineProperties(this.viewModel.topPocketRef.current, {
          clientWidth: { configurable: true, get() { return 100; } },
          clientHeight: { configurable: true, get() { return TOP_POCKET_HEIGHT; } },
        });
      }
      if (this.options.reachBottomEnabled) {
        contentHeight += BOTTOM_POCKET_HEIGHT;

        this.viewModel.bottomPocketRef.current = this.getBottomPocketElement();
        Object.defineProperties(this.viewModel.bottomPocketRef.current, {
          clientWidth: { configurable: true, get() { return 100; } },
          clientHeight: { configurable: true, get() { return BOTTOM_POCKET_HEIGHT; } },
        });
      }
    }

    this.viewModel.containerRef.current.scrollTop = 0;
    this.viewModel.containerRef.current.scrollLeft = 0;
    this.initStyles(this.viewModel.containerRef.current,
      { width: containerSize, height: containerSize },
      { width: contentSize, height: contentHeight });
    this.initStyles(this.viewModel.contentRef.current,
      { width: contentSize, height: contentHeight },
      { width: contentSize, height: contentHeight }, overflow);
    this.initStyles(this.viewModel.scrollableRef.current!,
      { width: containerSize, height: containerSize },
      { width: contentSize, height: contentHeight });

    this.viewModel.updateElementDimensions();
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

    if (overflow) {
      ['overflowX', 'overflowY'].forEach((prop) => {
        el.style[prop] = overflow;
      });
    }

    el.getBoundingClientRect = () => ({ width: size.width, height: size.height } as DOMRect);

    return el;
  }

  getScrollable(): ReactWrapper<ScrollableSimulated> {
    return this.scrollable;
  }

  getContainerElement(): HTMLDivElement {
    return this.scrollable.find(`.${SCROLLABLE_CONTAINER_CLASS}`).getDOMNode();
  }

  getContentElement(): HTMLDivElement {
    return this.scrollable.find(`.${SCROLLABLE_CONTENT_CLASS}`).getDOMNode();
  }

  getScrollViewContentElement(): HTMLDivElement {
    return this.scrollable.find(`.${SCROLLVIEW_CONTENT_CLASS}`).getDOMNode();
  }

  getTopPocketElement(): HTMLDivElement {
    return this.scrollable.find(`.${SCROLLVIEW_TOP_POCKET_CLASS}`).getDOMNode();
  }

  getBottomPocketElement(): HTMLDivElement {
    return this.scrollable.find(`.${SCROLLVIEW_BOTTOM_POCKET_CLASS}`).getDOMNode();
  }

  getAnimatedScrollbars(): any {
    return this.scrollable.find(AnimatedScrollbar);
  }

  getScrollbars(): any {
    return this.scrollable.find(Scrollbar);
  }

  getVScrollbar(): AnimatedScrollbar {
    return this.viewModel.vScrollbarRef.current!;
  }

  getHScrollbar(): AnimatedScrollbar {
    return this.viewModel.hScrollbarRef.current!;
  }

  initScrollbarSettings(additionalProps:
  { [key: string]: any } = { props: {} }): void {
    const { vScrollLocation = -50, hScrollLocation = -50, ...restProps } = additionalProps.props;

    const initSettings = (animatedScrollbars, scrollbars, index) => {
      const animatedScrollbar = animatedScrollbars.at(index).instance();
      const scrollbar = scrollbars.at(index).instance();

      if (scrollbar.props.direction === 'vertical') {
        restProps.scrollLocation = vScrollLocation;
        scrollbar.prevScrollLocation = vScrollLocation;
      }
      if (scrollbar.props.direction === 'horizontal') {
        restProps.scrollLocation = hScrollLocation;
        scrollbar.prevScrollLocation = hScrollLocation;
      }
      scrollbar.scrollbarRef = React.createRef();
      scrollbar.scrollbarRef.current = scrollbars.at(index).getDOMNode();

      scrollbar.thumbRef = React.createRef();
      scrollbar.thumbRef.current = scrollbars.at(index).find('.dx-scrollable-scroll').getDOMNode();

      Object.assign(animatedScrollbar, {
        props: {
          ...animatedScrollbar.props,
          ...{
            contentSize: 200,
            containerSize: 100,
            minOffset: 0,
            maxOffset: -100,
            bottomPocketSize: 0,
            scrollLocationChange:
              animatedScrollbar.props.scrollLocationChange.bind(this.viewModel),
            ...restProps,
          },
        },
      });

      Object.assign(scrollbar, {
        props: {
          ...scrollbar.props,
          ...{
            contentSize: 200,
            containerSize: 100,
            minOffset: 0,
            maxOffset: -100,
            ...restProps,
          },
        },
      });

      animatedScrollbar.scrollbarRef = {
        current: scrollbar,
      };

      return animatedScrollbar;
    };

    const animatedScrollbars = this.getAnimatedScrollbars();
    const scrollbars = this.getScrollbars();

    if (this.isBoth) {
      this.viewModel.hScrollbarRef.current = initSettings(animatedScrollbars, scrollbars, 0);
      this.viewModel.vScrollbarRef.current = initSettings(animatedScrollbars, scrollbars, 1);
    } else if (this.isVertical) {
      this.viewModel.vScrollbarRef.current = initSettings(animatedScrollbars, scrollbars, 0);
    } else if (this.isHorizontal) {
      this.viewModel.hScrollbarRef.current = initSettings(animatedScrollbars, scrollbars, 0);
    }
  }

  initScrollbarHandlerMocks(): void {
    this.scrollBarHandlers = [
      { name: 'init' },
      { name: 'start' },
      { name: 'end' },
      { name: 'cancel' },
      { name: 'stop' },
      { name: 'move' },
      { name: 'release' }];

    this.scrollBarHandlers.forEach(({ name }) => {
      this[`${name}VScrollbarHandlerMock`] = jest.fn();
      this[`${name}HScrollbarHandlerMock`] = jest.fn();

      if (this.isVertical) {
        this.getVScrollbar()[`${name}Handler`] = this[`${name}VScrollbarHandlerMock`];
      }
      if (this.isHorizontal) {
        this.getHScrollbar()[`${name}Handler`] = this[`${name}HScrollbarHandlerMock`];
      }
    });
  }

  changeScrollbarMethod(method: string, mock: Mock): void {
    if (this.isVertical) {
      this.getVScrollbar()[method] = mock;
    }
    if (this.isHorizontal) {
      this.getHScrollbar()[method] = mock;
    }
  }

  initContainerPosition({ top, left }: { top: number; left: number }): void {
    this.viewModel.containerRef.current!.scrollTop = top;
    this.viewModel.containerRef.current!.scrollLeft = left;

    this.viewModel.savedScrollOffset = { scrollTop: top, scrollLeft: left };

    this.viewModel.vScrollLocation = -top;
    this.viewModel.hScrollLocation = -left;
  }

  checkContainerPosition(jestExpect: (any) => any,
    expectedPosition: { top: number; left: number }): void {
    const { scrollTop, scrollLeft } = this.viewModel.containerRef.current!;

    jestExpect(scrollTop).toEqual(expectedPosition.top);
    jestExpect(scrollLeft).toEqual(expectedPosition.left);
  }

  checkScrollbarEventHandlerCalls(jestExpect: (any) => any,
    direction: 'vertical' | 'horizontal',
    expectedHandlers: string[],
    expectedArgs: (boolean | number | { [key: string]: any })[][]): void {
    const prefix = direction === 'vertical' ? 'V' : 'H';
    this.scrollBarHandlers?.forEach((handler) => {
      const indexOf = expectedHandlers.indexOf(handler.name);

      if (indexOf !== -1 && this[`is${titleize(direction)}`]) {
        jestExpect(this[`${handler.name}${prefix}ScrollbarHandlerMock`]).toBeCalledTimes(1);
        jestExpect(this[`${handler.name}${prefix}ScrollbarHandlerMock`].mock.calls).toEqual([expectedArgs[indexOf]]);
      } else {
        jestExpect(this[`${handler.name}${prefix}ScrollbarHandlerMock`]).toBeCalledTimes(0);
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
    props: Pick<ScrollableSimulatedProps, 'onStart' | 'onScroll' | 'onUpdated' | 'onEnd' | 'onPullDown' | 'onReachBottom' | 'onBounce' | 'onVisibilityChange'>,
  ): { [T in 'onStart' | 'onScroll' | 'onUpdated' | 'onEnd' | 'onPullDown' | 'onReachBottom' | 'onBounce' | 'onVisibilityChange']: any } {
    const actionHandlers = {
      onStart: jest.fn(),
      onScroll: jest.fn(),
      onUpdated: jest.fn(),
      onEnd: jest.fn(),
      onPullDown: jest.fn(),
      onReachBottom: jest.fn(),
      onBounce: jest.fn(),
      onVisibilityChange: jest.fn(),
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
