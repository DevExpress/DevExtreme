import {
  Component,
  JSXComponent,
  Method,
  Ref,
  Effect,
} from 'devextreme-generator/component_declaration/common';
import { subscribeToScrollEvent } from '../../utils/subscribe_to_event';
import { isNumeric } from '../../../core/utils/type';
import getScrollRtlBehavior from '../../../core/utils/scroll_rtl_behavior';
import { camelize } from '../../../core/utils/inflector';
import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn } from '../../utils/effect_return.d';

import {
  ScrollableInternalPropsType,
} from './scrollable_props';

import {
  ScrollableLocation, ScrollOffset, ScrollableBoundary, ScrollableDirection,
} from './types.d';

const DIRECTION_VERTICAL = 'vertical';
const DIRECTION_HORIZONTAL = 'horizontal';
const DIRECTION_BOTH = 'both';
const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';

export const ensureLocation = (
  location: number | Partial<ScrollableLocation>,
): ScrollableLocation => {
  if (isNumeric(location)) {
    return {
      left: location,
      top: location,
    };
  }
  return { top: 0, left: 0, ...location };
};

export const getRelativeLocation = (element: HTMLElement): ScrollableLocation => {
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
}: ScrollableSimulated): JSX.Element => (
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

@Component({
  view: viewFunction,
})
export class ScrollableSimulated extends JSXComponent<ScrollableInternalPropsType>() {
  @Ref() contentRef!: HTMLDivElement;

  @Ref() containerRef!: HTMLDivElement;

  @Method()
  content(): HTMLDivElement {
    return this.contentRef;
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollableLocation>): void {
    const location = ensureLocation(distance);

    if (this.isDirection(DIRECTION_VERTICAL)) {
      this.containerRef.scrollTop += Math.round(location.top);
    }
    if (this.isDirection(DIRECTION_HORIZONTAL)) {
      this.containerRef.scrollLeft += this.normalizeCoordinate('left', Math.round(location.left));
    }
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollableLocation>): void {
    const location = ensureLocation(targetLocation);
    const containerPosition = this.scrollOffset();

    const top = location.top - containerPosition.top;
    const left = location.left - containerPosition.left;

    this.scrollBy({ top, left });
  }

  @Method()
  scrollToElement(element: HTMLElement, offset?: Partial<ScrollOffset>): void {
    if (element.closest(`.${SCROLLABLE_CONTENT_CLASS}`)) {
      const scrollOffset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...(offset as Partial<ScrollOffset>),
      };

      this.scrollTo({
        top: this.getElementLocation(element, scrollOffset, DIRECTION_VERTICAL),
        left: this.getElementLocation(element, scrollOffset, DIRECTION_HORIZONTAL),
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
  scrollOffset(): ScrollableLocation {
    const { left, top } = this.getContainerOffsetInternal();
    return {
      left: this.getPublicCoordinate('left', left),
      top: this.getPublicCoordinate('top', top),
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
      (event: Event) => this.props.onScroll?.({
        event,
        scrollOffset: this.scrollOffset(),
        ...this.getBoundaryProps(),
      }));
  }

  private getBoundaryProps(): Partial<ScrollableBoundary> {
    const { left, top } = this.scrollOffset();

    const boundaryProps: Partial<ScrollableBoundary> = {};

    if (this.isDirection(DIRECTION_HORIZONTAL) || this.isDirection(DIRECTION_BOTH)) {
      boundaryProps.reachedLeft = left <= 0;
      boundaryProps.reachedRight = Math.round(left) >= this.getMaxScrollOffset('width');
    }

    if (this.isDirection(DIRECTION_VERTICAL) || this.isDirection(DIRECTION_BOTH)) {
      boundaryProps.reachedTop = top <= 0;
      boundaryProps.reachedBottom = top >= this.getMaxScrollOffset('height');
    }

    return boundaryProps;
  }

  private getMaxScrollOffset(dimension: string): number {
    return this.containerRef[`scroll${camelize(dimension, true)}`] - this.containerRef[`client${camelize(dimension, true)}`];
  }

  private isDirection(direction: ScrollableDirection): boolean {
    const { direction: currentDirection } = this.props;

    if (direction === DIRECTION_VERTICAL) {
      return currentDirection !== DIRECTION_HORIZONTAL;
    }
    if (direction === DIRECTION_HORIZONTAL) {
      return currentDirection !== DIRECTION_VERTICAL;
    }
    return currentDirection === direction;
  }

  private getContainerOffsetInternal(): ScrollableLocation {
    return {
      left: this.containerRef.scrollLeft,
      top: this.containerRef.scrollTop,
    };
  }

  get cssClasses(): string {
    const { direction } = this.props;

    const classesMap = {
      'dx-scrollview dx-scrollable dx-scrollable-native dx-scrollable-renovated dx-scrollable-native-generic': true,
      [`dx-scrollable-${direction}`]: true,
    };
    return combineClasses(classesMap);
  }

  private getScrollBarSize(dimension: string): number {
    return this.containerRef[`offset${dimension}`] - this.containerRef[`client${dimension}`];
  }

  private getElementLocation(
    element: HTMLElement, offset: ScrollOffset, direction: ScrollableDirection,
  ): number {
    const prop = direction === DIRECTION_VERTICAL ? 'top' : 'left';
    const location = this.normalizeCoordinate(prop,
      this.getElementLocationInternal(element, prop, offset, direction));

    return this.getPublicCoordinate(prop, location);
  }

  private getElementLocationInternal(
    element: HTMLElement,
    prop: keyof ScrollOffset,
    offset: ScrollOffset,
    direction: ScrollableDirection,
  ): number {
    const dimension = direction === DIRECTION_VERTICAL ? 'Height' : 'Width';
    const relativeLocation = getRelativeLocation(element)[prop];
    const scrollBarSize = this.getScrollBarSize(dimension);

    const containerSize = this.containerRef[`offset${dimension}`];
    const elementOffset = element[`offset${dimension}`];

    const offsetStart = offset[prop];
    const offsetEnd = offset[direction === DIRECTION_VERTICAL ? 'bottom' : 'right'];

    const containerLocation = this.normalizeCoordinate(prop,
      this.getContainerOffsetInternal()[prop]);

    if (relativeLocation < containerLocation + offsetStart) {
      if (elementOffset < containerSize - offsetStart - offsetEnd) {
        return relativeLocation - offsetStart;
      }
      return relativeLocation + elementOffset - containerSize + offsetEnd + scrollBarSize;
    }

    if (relativeLocation + elementOffset
      >= containerLocation + containerSize - offsetEnd - scrollBarSize) {
      if (elementOffset < containerSize - offsetStart - offsetEnd) {
        return relativeLocation + elementOffset + scrollBarSize - containerSize + offsetEnd;
      }
      return relativeLocation - offsetStart;
    }

    return containerLocation;
  }

  private getPublicCoordinate(prop: keyof ScrollOffset, coordinate: number): number {
    return this.needNormalizeCoordinate(prop)
      ? this.getMaxScrollOffset('width') + this.normalizeCoordinate(prop, coordinate)
      : coordinate;
  }

  private normalizeCoordinate(prop: keyof ScrollOffset, coordinate: number): number {
    return this.needNormalizeCoordinate(prop) && getScrollRtlBehavior().positive
      ? -1 * coordinate
      : coordinate;
  }

  private needNormalizeCoordinate(prop: keyof ScrollOffset): boolean {
    const { rtlEnabled } = this.props;

    return rtlEnabled === true && prop === 'left';
  }
}
