import {
  Component,
  JSXComponent,
  Method,
  Ref,
  Effect,
} from 'devextreme-generator/component_declaration/common';
import { subscribeToScrollEvent } from '../../utils/subscribe_to_event';
import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn } from '../../utils/effect_return.d';

import {
  ScrollableInternalPropsType,
} from './scrollable_props';

import {
  ScrollableLocation, ScrollOffset,
} from './types.d';

import {
  ensureLocation, isDirection, normalizeCoordinate,
  getContainerOffsetInternal,
  getElementLocation, getPublicCoordinate, getBoundaryProps,
} from './scrollable_utils';

const DIRECTION_VERTICAL = 'vertical';
const DIRECTION_HORIZONTAL = 'horizontal';
const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';

export const viewFunction = ({
  cssClasses, contentRef, containerRef,
  props: {
    disabled, height, width, rtlEnabled, children, forceGeneratePockets,
  },
  restAttributes,
}: ScrollableNative): JSX.Element => (
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
          {forceGeneratePockets && <div className="dx-scrollview-top-pocket" />}
          {children}
          {forceGeneratePockets && <div className="dx-scrollview-bottom-pocket" />}
        </div>
      </div>
    </div>
  </Widget>
);

@Component({
  view: viewFunction,
})
export class ScrollableNative extends JSXComponent<ScrollableInternalPropsType>() {
  @Ref() contentRef!: HTMLDivElement;

  @Ref() containerRef!: HTMLDivElement;

  @Method()
  content(): HTMLDivElement {
    return this.contentRef;
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollableLocation>): void {
    const location = ensureLocation(distance);

    if (isDirection(DIRECTION_VERTICAL, this.props.direction)) {
      this.containerRef.scrollTop += Math.round(location.top);
    }
    if (isDirection(DIRECTION_HORIZONTAL, this.props.direction)) {
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
    const { direction, classes } = this.props;

    const classesMap = {
      'dx-scrollable dx-scrollable-native dx-scrollable-renovated dx-scrollable-native-generic': true,
      [`dx-scrollable-${direction}`]: true,
      [`${classes}`]: !!classes,
    };
    return combineClasses(classesMap);
  }
}
