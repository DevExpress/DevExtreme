import {
  Component,
  ComponentBindings,
  JSXComponent,
  Slot,
  OneWay,
  Method,
  Ref,
  Event,
  Effect,
} from 'devextreme-generator/component_declaration/common';
import { subscribeToScrollEvent } from '../utils/subscribe_to_event';
import { isNumeric } from '../../core/utils/type';
import { Widget } from './common/widget';
import BaseWidgetProps from '../utils/base_props';
import { combineClasses } from '../utils/combine_classes';
import { DisposeEffectReturn } from '../utils/effect_return.d';

const DIRECTION_VERTICAL = 'vertical';
const DIRECTION_HORIZONTAL = 'horizontal';
const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';

export interface ScrollViewLocation {
  top: number;
  left: number;
}

export interface ScrollOffset {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface ScrollViewBoundaryProps {
  reachedBottom: boolean;
  reachedLeft: boolean;
  reachedRight: boolean;
  reachedTop: boolean;
}

export type ScrollViewDirection = 'both' | 'horizontal' | 'vertical';

export const ensureLocation = (
  location: number | Partial<ScrollViewLocation>,
): ScrollViewLocation => {
  if (isNumeric(location)) {
    return {
      left: location,
      top: location,
    };
  }
  return { top: 0, left: 0, ...location };
};

export const getRelativeLocation = (element: HTMLElement): ScrollViewLocation => {
  const result = { top: 0, left: 0 };
  let targetElement = element;
  while (!targetElement.matches(`.${SCROLLABLE_CONTENT_CLASS}`)) {
    result.top += targetElement.offsetTop;
    result.left += targetElement.offsetLeft;
    targetElement = targetElement.offsetParent as HTMLElement;
  }
  return result;
};

export const viewFunction = ({
  cssClasses, contentRef, containerRef,
  props: {
    disabled, height, width, rtlEnabled, children,
  },
  restAttributes,
}: ScrollView): JSX.Element => (
  <Widget
    classes={cssClasses}
    disabled={disabled}
    rtlEnabled={rtlEnabled}
    height={height}
    width={width}
    {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
  >
    <div className="dx-scrollable-wrapper">
      <div className="dx-scrollable-container" ref={containerRef as any}>
        <div className={SCROLLABLE_CONTENT_CLASS} ref={contentRef as any}>
          {children}
        </div>
      </div>
    </div>
  </Widget>
);

/* istanbul ignore next: class has only props default */
@ComponentBindings()
export class ScrollViewProps {
  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @OneWay() direction: ScrollViewDirection = DIRECTION_VERTICAL;

  @Event() onScroll: (e: {
    event: Event;
    scrollOffset: Partial<ScrollOffset>;
    reachedLeft?: boolean;
    reachedRight?: boolean;
    reachedTop?: boolean;
    reachedBottom?: boolean;
  }) => void = () => {};
}
type ScrollViewPropsType = ScrollViewProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;

@Component({
  jQuery: { register: true },
  view: viewFunction,
})
export class ScrollView extends JSXComponent<ScrollViewPropsType>() {
  @Ref() contentRef!: HTMLDivElement;

  @Ref() containerRef!: HTMLDivElement;

  @Method()
  content(): HTMLDivElement {
    return this.contentRef;
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollBy(distance: any): void {
    const location = ensureLocation(distance);

    if (this.isDirection(DIRECTION_VERTICAL)) {
      this.containerRef.scrollTop = Math.round(this.scrollOffset().top + location.top);
    }
    if (this.isDirection(DIRECTION_HORIZONTAL)) {
      this.containerRef.scrollLeft = Math.round(this.scrollOffset().left + location.left);
    }
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollTo(targetLocation: any): void {
    const location = ensureLocation(targetLocation);
    this.scrollBy({
      left: location.left - this.scrollOffset().left,
      top: location.top - this.scrollOffset().top,
    });
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollToElement(element: HTMLElement, offset?: any): void {
    if (element.closest(`.${SCROLLABLE_CONTENT_CLASS}`)) {
      const scrollOffset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...(offset as Partial<ScrollOffset>),
      };
      this.scrollTo({
        top: this.getScrollTopLocation(element, scrollOffset),
        left: this.getScrollLeftLocation(element, scrollOffset),
      });
    }
  }

  @Method()
  scrollHeight(): number {
    return this.content().offsetHeight;
  }

  @Method()
  scrollWidth(): number {
    return this.content().offsetWidth;
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollOffset(): any {
    return {
      left: this.containerRef.scrollLeft,
      top: this.containerRef.scrollTop,
    };
  }

  @Method()
  scrollTop(): number {
    return this.scrollOffset().top;
  }

  @Method()
  scrollLeft(): number {
    return this.scrollOffset().left;
  }

  @Method()
  clientHeight(): number {
    return this.containerRef.clientHeight;
  }

  @Method()
  clientWidth(): number {
    return this.containerRef.clientWidth;
  }

  @Effect() scrollEffect(): DisposeEffectReturn {
    return subscribeToScrollEvent(this.containerRef,
      (event: Event) => this.props.onScroll({
        event,
        scrollOffset: this.scrollOffset(),
        ...this.getBoundaryProps(),
      }));
  }

  private getBoundaryProps(): Partial<ScrollViewBoundaryProps> {
    const { left, top } = this.scrollOffset();
    const {
      scrollWidth, clientWidth, scrollHeight, clientHeight,
    } = this.containerRef;

    const boundaryProps: Partial<ScrollViewBoundaryProps> = {};

    if (this.isDirection(DIRECTION_HORIZONTAL)) {
      boundaryProps.reachedLeft = left <= 0;
      boundaryProps.reachedRight = left >= scrollWidth - clientWidth;
    }

    if (this.isDirection(DIRECTION_VERTICAL)) {
      boundaryProps.reachedTop = top <= 0;
      // Problem with rounding for 4k resolution. Do we need round it?
      boundaryProps.reachedBottom = top >= scrollHeight - clientHeight;
    }

    return boundaryProps;
  }

  private isDirection(direction: ScrollViewDirection): boolean {
    const { direction: currentDirection } = this.props;

    if (direction === DIRECTION_VERTICAL) {
      return currentDirection !== DIRECTION_HORIZONTAL;
    }
    if (direction === DIRECTION_HORIZONTAL) {
      return currentDirection !== DIRECTION_VERTICAL;
    }
    return currentDirection === direction;
  }

  get cssClasses(): string {
    const { direction } = this.props;

    const classesMap = {
      'dx-scrollview': true,
      'dx-scrollable': true,
      [`dx-scrollable-${direction}`]: true,
      'dx-scrollable-native': true,
      'dx-scrollable-native-generic': true,
    };
    return combineClasses(classesMap);
  }

  private getScrollBarWidth(): number {
    return this.containerRef.offsetWidth - this.containerRef.clientWidth;
  }

  private getScrollTopLocation(element: HTMLElement, scrollOffset: ScrollOffset): number {
    const offsetTop = getRelativeLocation(element).top;
    const containerHeight = this.containerRef.offsetHeight;
    const scrollBarWidth = this.getScrollBarWidth();
    const { offsetHeight } = element;
    const { top: scrollOffsetTop, bottom: scrollOffsetBottom } = scrollOffset;
    const { top } = this.scrollOffset();

    if (offsetTop < top + scrollOffsetTop) {
      if (offsetHeight < containerHeight - scrollOffsetTop - scrollOffsetBottom) {
        return offsetTop - scrollOffsetTop;
      }
      return offsetTop + offsetHeight - containerHeight + scrollOffsetBottom + scrollBarWidth;
    }

    if (offsetTop + offsetHeight >= top + containerHeight - scrollOffsetBottom) {
      if (offsetHeight < containerHeight - scrollOffsetTop - scrollOffsetBottom) {
        return offsetTop + offsetHeight + scrollBarWidth - containerHeight + scrollOffsetBottom;
      }
      return offsetTop - scrollOffsetTop;
    }

    return top;
  }

  private getScrollLeftLocation(element: HTMLElement, scrollOffset: ScrollOffset): number {
    const offsetLeft = getRelativeLocation(element).left;
    const scrollBarWidth = this.getScrollBarWidth();
    const containerWidth = this.containerRef.offsetWidth;
    const { offsetWidth } = element;
    const { left: scrollOffsetLeft, right: scrollOffsetRight } = scrollOffset;
    const { left } = this.scrollOffset();

    if (offsetLeft < left + scrollOffsetLeft) {
      if (offsetWidth < containerWidth - scrollOffsetLeft - scrollOffsetRight) {
        return offsetLeft - scrollOffsetLeft;
      }
      return offsetLeft + offsetWidth - containerWidth + scrollOffsetRight + scrollBarWidth;
    }

    if (offsetLeft + offsetWidth >= left + containerWidth - scrollOffsetRight) {
      if (offsetWidth < containerWidth - scrollOffsetLeft - scrollOffsetRight) {
        return offsetLeft + offsetWidth + scrollBarWidth - containerWidth + scrollOffsetRight;
      }
      return offsetLeft - scrollOffsetLeft;
    }

    return left;
  }
}
