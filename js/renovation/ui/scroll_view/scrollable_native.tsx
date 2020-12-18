import {
  Component,
  JSXComponent,
  Method,
  Ref,
  Effect,
  RefObject,
} from 'devextreme-generator/component_declaration/common';
import { subscribeToScrollEvent } from '../../utils/subscribe_to_event';
import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
import devices from '../../../core/devices';

import {
  ScrollableInternalPropsType,
} from './scrollable_props';

import {
  ScrollableLocation, ScrollOffset,
} from './types.d';

import {
  ensureLocation, ScrollDirection, normalizeCoordinate,
  getContainerOffsetInternal,
  getElementLocation, getPublicCoordinate, getBoundaryProps,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  SCROLLABLE_CONTAINER_CLASS,
  SCROLLABLE_CONTENT_CLASS,
  SCROLLABLE_WRAPPER_CLASS,
  SCROLLVIEW_CONTENT_CLASS,
  SCROLLVIEW_BOTTOM_POCKET_CLASS,
  SCROLLVIEW_TOP_POCKET_CLASS,
  SCROLLABLE_DISABLED_CLASS,
  SCROLLABLE_SCROLLBAR_SIMULATED,
} from './scrollable_utils';
import { Scrollbar } from './scrollbar';

export const viewFunction = ({
  cssClasses, contentRef, containerRef,
  props: {
    disabled, height, width, rtlEnabled, children,
    forceGeneratePockets, needScrollViewContentWrapper,
    showScrollbar, direction, scrollByThumb, useSimulatedScrollbar,
  },
  restAttributes,
}: ScrollableNative): JSX.Element => {
  const { isVertical, isHorizontal } = new ScrollDirection(direction);
  return (
    <Widget
      classes={cssClasses}
      disabled={disabled}
      rtlEnabled={rtlEnabled}
      height={height}
      width={width}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <div className={SCROLLABLE_WRAPPER_CLASS}>
        <div className={SCROLLABLE_CONTAINER_CLASS} ref={containerRef}>
          <div className={SCROLLABLE_CONTENT_CLASS} ref={contentRef}>
            {forceGeneratePockets && <div className={SCROLLVIEW_TOP_POCKET_CLASS} />}
            {needScrollViewContentWrapper && (
              <div className={SCROLLVIEW_CONTENT_CLASS}>{children}</div>)}
            {!needScrollViewContentWrapper && children}
            {forceGeneratePockets && <div className={SCROLLVIEW_BOTTOM_POCKET_CLASS} />}
          </div>
        </div>
      </div>
      {useSimulatedScrollbar && isHorizontal && (
        <Scrollbar
          direction="horizontal"
          visibilityMode={showScrollbar}
          expandable={scrollByThumb}
        />
      )}
      {useSimulatedScrollbar && isVertical && (
        <Scrollbar
          direction="vertical"
          visibilityMode={showScrollbar}
          expandable={scrollByThumb}
        />
      )}
    </Widget>
  );
};

@Component({
  view: viewFunction,
})
export class ScrollableNative extends JSXComponent<ScrollableInternalPropsType>() {
  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @Method()
  content(): HTMLDivElement {
    return this.contentRef;
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollableLocation>): void {
    const location = ensureLocation(distance);
    const { isVertical, isHorizontal } = new ScrollDirection(this.props.direction);

    if (isVertical) {
      this.containerRef.scrollTop += Math.round(location.top);
    }
    if (isHorizontal) {
      this.containerRef.scrollLeft += normalizeCoordinate('left', Math.round(location.left), this.props.rtlEnabled);
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
    if (element === undefined || element === null) {
      return;
    }

    if (element.closest(`.${SCROLLABLE_CONTENT_CLASS}`)) {
      const scrollOffset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...(offset as Partial<ScrollOffset>),
      };

      this.scrollTo({
        top: getElementLocation(
          element, scrollOffset, DIRECTION_VERTICAL, this.containerRef, this.props.rtlEnabled,
        ),
        left: getElementLocation(
          element, scrollOffset, DIRECTION_HORIZONTAL, this.containerRef, this.props.rtlEnabled,
        ),
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
    const { rtlEnabled } = this.props;
    const { left, top } = getContainerOffsetInternal(this.containerRef);
    return {
      left: getPublicCoordinate('left', left, this.containerRef, rtlEnabled),
      top: getPublicCoordinate('top', top, this.containerRef, rtlEnabled),
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
        ...getBoundaryProps(this.props.direction, this.scrollOffset(), this.containerRef),
      }));
  }

  get cssClasses(): string {
    const {
      direction, classes, disabled, useSimulatedScrollbar,
    } = this.props;

    const classesMap = {
      [`dx-scrollable dx-scrollable-native dx-scrollable-native-${devices.real().platform} dx-scrollable-renovated`]: true,
      [`dx-scrollable-${direction}`]: true,
      [SCROLLABLE_DISABLED_CLASS]: !!disabled,
      [SCROLLABLE_SCROLLBAR_SIMULATED]: useSimulatedScrollbar,
      [`${classes}`]: !!classes,
    };
    return combineClasses(classesMap);
  }
}
