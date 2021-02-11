import React from 'react';
import { mount } from 'enzyme';
import {

  ScrollDirection,
} from '../scrollable_utils';

import {
  ScrollableSimulated as Scrollable,
  viewFunction,
} from '../scrollable_simulated';

import {
  ScrollableDirection,
} from '../types.d';

import { Scrollbar } from '../scrollbar';

class ScrollableTestHelper {
  direction: ScrollableDirection;

  viewModel: Scrollable;

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

  constructor(args) {
    this.viewModel = new Scrollable({
      ...args,
    }) as any;
    this.viewModel.scrollableRef = React.createRef();
    this.viewModel.containerRef = React.createRef();
    this.viewModel.contentRef = React.createRef();
    this.viewModel.wrapperRef = React.createRef();
    this.viewModel.verticalScrollbarRef = React.createRef();
    this.viewModel.horizontalScrollbarRef = React.createRef();

    this.viewModel.scrollableRef.current = {} as HTMLDivElement;
    this.viewModel.containerRef.current = {} as HTMLDivElement;
    this.viewModel.contentRef.current = {} as HTMLDivElement;
    this.viewModel.wrapperRef.current = {} as HTMLDivElement;
    this.viewModel.verticalScrollbarRef.current = {};
    this.viewModel.horizontalScrollbarRef.current = {};

    this.direction = args.direction;

    const { isVertical, isHorizontal, isBoth } = new ScrollDirection(args.direction);
    this.isVertical = isVertical;
    this.isHorizontal = isHorizontal;
    this.isBoth = isBoth;

    this.scrollable = mount(viewFunction(this.viewModel) as JSX.Element);

    this.viewModel.scrollableRef.current = this.scrollable.getDOMNode();
    this.viewModel.containerRef.current = this.getContainerElement();
    this.viewModel.contentRef.current = this.getContentElement();

    const { contentSize = 200, containerSize = 100, overflow = false } = args;

    this.initStyles(this.viewModel.containerRef.current!, containerSize, contentSize);
    this.initStyles(this.viewModel.contentRef.current!, contentSize, contentSize, overflow);
    this.initStyles(this.viewModel.scrollableRef.current!, containerSize, contentSize);
  }

  // eslint-disable-next-line class-methods-use-this
  initStyles(receivedElement, size, scrollSize, overflow?: boolean) {
    const element = receivedElement;

    Object.defineProperties(window.HTMLElement.prototype, {
      offsetHeight: {
        get() { return parseFloat(window.getComputedStyle(this).height) || 0; },
      },
      offsetWidth: {
        get() { return parseFloat(window.getComputedStyle(this).width) || 0; },
      },
      scrollHeight: {
        configurable: true,
        get() { return scrollSize || 0; },
      },
      scrollWidth: {
        configurable: true,
        get() { return scrollSize || 0; },
      },
      clientWidth: {
        configurable: true,
        get() { return parseFloat(window.getComputedStyle(this).width) || 0; },
      },
      clientHeight: {
        configurable: true,
        get() { return parseFloat(window.getComputedStyle(this).width) || 0; },
      },
    });

    ['width', 'height', 'outerWidth', 'outerHeight'].forEach((prop) => {
      element.style[prop] = `${size}px`;
    });

    if (overflow) {
      ['overflowX', 'overflowY'].forEach((prop) => {
        element.style[prop] = overflow;
      });
    }

    element.getBoundingClientRect = jest.fn(() => ({
      width: size,
      height: size,
    }));

    return element;
  }

  getScrollable() {
    return this.scrollable;
  }

  getContainerElement() {
    return this.scrollable.find('.dx-scrollable-container').getDOMNode();
  }

  getContentElement() {
    return this.scrollable.find('.dx-scrollable-content').getDOMNode();
  }

  getScrollableRef() {
    return this.viewModel.scrollableRef.current;
  }

  getScrollbars() {
    return this.scrollable.find(Scrollbar);
  }

  getVerticalScroll() {
    return this.scrollable.find('.dx-scrollbar-vertical .dx-scrollable-scroll');
  }

  getHorizontalScroll() {
    return this.scrollable.find('.dx-scrollbar-horizontal .dx-scrollable-scroll');
  }

  getVerticalScrollElement() {
    return this.getVerticalScroll().getElement();
  }

  getHorizontalScrollElement() {
    return this.getHorizontalScroll().getElement();
  }

  // eslint-disable-next-line class-methods-use-this
  extendProperties(ref, additionalProps: any) {
    const extendedProps = { ...ref.props, ...additionalProps };

    Object.assign(ref, { props: extendedProps });
  }

  initScrollbarSettings(additionalProps:
  { [key: string]: any } = { translateOffset: 0, props: {} }) {
    const scrollbars = this.getScrollbars();

    const initSettings = (scrollbarRef) => {
      const scrollbar = scrollbarRef.instance();
      scrollbar.scrollbarRef = React.createRef();
      scrollbar.scrollbarRef.current = scrollbarRef.getDOMNode();
      scrollbar.scrollRef = React.createRef();
      scrollbar.scrollRef.current = scrollbarRef.find('.dx-scrollable-scroll').getDOMNode();

      scrollbar.translateOffset = additionalProps.translateOffset;
      scrollbar.scrollableOffset = 0;
      scrollbar.location = -50;

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
            contentRef: { current: this.viewModel.contentRef.current },
            containerRef: { current: this.viewModel.containerRef.current },
            ...additionalProps.props,
          },
        },
      });

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

  initScrollbarHandlerMocks() {
    this.scrollBarHandlers = ['init', 'start', 'end', 'cancel', 'stop', 'scrollBy'];

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

  changeScrollbarHandlerMock(handler, callback) {
    if (this.isBoth) {
      this.viewModel.horizontalScrollbarRef.current[`${handler}Handler`] = (args) => callback(args);
      this.viewModel.verticalScrollbarRef.current[`${handler}Handler`] = (args) => callback(args);
    } else if (this.isVertical) {
      this.viewModel.verticalScrollbarRef.current[`${handler}Handler`] = (args) => callback(args);
    } else if (this.isHorizontal) {
      this.viewModel.horizontalScrollbarRef.current[`${handler}Handler`] = (args) => callback(args);
    }
  }

  changeScrollbarProp(prop, value) {
    if (this.isBoth) {
      this.viewModel.horizontalScrollbarRef.current.props[prop] = value;
      this.viewModel.verticalScrollbarRef.current.props[prop] = value;
    } else if (this.isVertical) {
      this.viewModel.verticalScrollbarRef.current.props[prop] = value;
    } else if (this.isHorizontal) {
      this.viewModel.horizontalScrollbarRef.current.props[prop] = value;
    }
  }

  checkScrollbarProps(expectedProps) {
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

  changeScrollbarMethod(method, mock) {
    if (this.isBoth) {
      this.viewModel.horizontalScrollbarRef.current[method] = mock;
      this.viewModel.verticalScrollbarRef.current[method] = mock;
    } else if (this.isVertical) {
      this.viewModel.verticalScrollbarRef.current[method] = mock;
    } else if (this.isHorizontal) {
      this.viewModel.horizontalScrollbarRef.current[method] = mock;
    }
  }

  initContainerPosition({ top, left }) {
    this.viewModel.containerRef.current!.scrollTop = top;
    this.viewModel.containerRef.current!.scrollLeft = left;
  }

  initScrollbarLocation({ top, left }) {
    if (this.isVertical) {
      this.viewModel.verticalScrollbarRef.current.location = top;
    }
    if (this.isHorizontal) {
      this.viewModel.horizontalScrollbarRef.current.location = left;
    }
  }

  checkContainerPosition(jestExpect, expectedPosition) {
    if (this.isVertical) {
      jestExpect(
        this.viewModel.verticalScrollbarRef.current.props.containerRef.current
          .scrollTop,
      ).toEqual(expectedPosition.top);
    }
    if (this.isHorizontal) {
      jestExpect(
        this.viewModel.horizontalScrollbarRef.current.props.containerRef.current
          .scrollLeft,
      ).toEqual(expectedPosition.left);
    }
  }

  checkScrollbarScrollPositions(jestExpect, { vertical, horizontal }) {
    if (this.isVertical) {
      jestExpect(window.getComputedStyle(
        this.getVerticalScroll().getDOMNode(),
      ).transform).toEqual(vertical);
    }

    if (this.isHorizontal) {
      jestExpect(window.getComputedStyle(
        this.getHorizontalScroll().getDOMNode(),
      ).transform).toEqual(horizontal);
    }
  }

  checkScrollbarEventHandlerCalls(jestExpect, expectedHandlers, expectedArgs) {
    this.scrollBarHandlers?.forEach((handler) => {
      const indexOf = expectedHandlers.indexOf(handler);
      if (indexOf !== -1) {
        if (this.isBoth) {
          jestExpect(this[`${handler}HandlerMock`]).toBeCalledTimes(2);
          if (expectedArgs[indexOf].length === 2) {
            jestExpect(this[`${handler}HandlerMock`]).toHaveBeenNthCalledWith(1, expectedArgs[indexOf][0], expectedArgs[indexOf][1]);
          } else {
            jestExpect(this[`${handler}HandlerMock`]).toHaveBeenNthCalledWith(2, expectedArgs[indexOf][0]);
          }
        } else {
          jestExpect(this[`${handler}HandlerMock`]).toBeCalledTimes(1);
          if (expectedArgs[indexOf].length === 2) {
            jestExpect(this[`${handler}HandlerMock`]).toHaveBeenCalledWith(expectedArgs[indexOf][0], expectedArgs[indexOf][1]);
          } else {
            jestExpect(this[`${handler}HandlerMock`]).toHaveBeenCalledWith(expectedArgs[indexOf][0]);
          }
        }
      } else {
        jestExpect(this[`${handler}HandlerMock`]).toBeCalledTimes(0);
      }
    });
  }

  checkValidDirection(jestExpect, expectedValidDirections, options?: {[key: string]: any }) {
    if (expectedValidDirections) {
      jestExpect(this.viewModel.validDirections).toEqual(expectedValidDirections);
    } else {
      jestExpect(this.viewModel.validDirections).toEqual(this.getValidDirection(options));
    }
  }

  getValidDirection(options): { vertical: boolean; horizontal: boolean} {
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

  // eslint-disable-next-line class-methods-use-this
  getContainerRefMock({
    clientWidth = 100, clientHeight = 100, scrollTop = 50, scrollLeft = 50, offsetWidth = 300,
    offsetHeight = 300, scrollWidth = 600, scrollHeight = 600,
  }): any {
    return {
      clientWidth,
      clientHeight,
      scrollTop,
      scrollLeft,
      offsetWidth,
      offsetHeight,
      scrollWidth,
      scrollHeight,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  checkScrollParams(jestExpect, actualParams, expectedParams): void {
    const checkedParams = expectedParams;

    if (this.direction === 'vertical') {
      delete checkedParams.reachedLeft;
      delete checkedParams.reachedRight;
    } else if (this.direction === 'horizontal') {
      delete checkedParams.reachedTop;
      delete checkedParams.reachedBottom;
    }

    jestExpect(actualParams).toMatchObject(checkedParams);
  }
}

export { ScrollableTestHelper };
