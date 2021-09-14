import {
  Component,
  JSXComponent,
  InternalState,
  RefObject,
  Ref,
  Effect,
  Method,
  Mutable,
} from '@devextreme-generator/declarations';

import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn, EffectReturn } from '../../utils/effect_return.d';
import domAdapter from '../../../core/dom_adapter';
import { isDefined } from '../../../core/utils/type';
import { isDxMouseWheelEvent } from '../../../events/utils/index';
import {
  DIRECTION_HORIZONTAL, SCROLLABLE_SCROLLBAR_CLASS,
  SCROLLABLE_SCROLL_CLASS,
  SCROLLABLE_SCROLL_CONTENT_CLASS,
  HIDE_SCROLLBAR_TIMEOUT,
  SCROLLABLE_SCROLLBAR_ACTIVE_CLASS,
  HOVER_ENABLED_STATE,
} from './common/consts';

import {
  subscribeToDXPointerDownEvent,
  subscribeToDXPointerUpEvent,
} from '../../utils/subscribe_to_event';

import { BaseWidgetProps } from '../common/base_props';
import { inRange } from '../../../core/utils/math';
import { DxMouseEvent } from './common/types.d';
import { clampIntoRange } from './utils/clamp_into_range';
import { ScrollbarProps } from './common/scrollbar_props';
import { ScrollableProps } from './common/scrollable_props';
import { ScrollableSimulatedProps } from './common/simulated_strategy_props';

const OUT_BOUNDS_ACCELERATION = 0.5;
export const THUMB_MIN_SIZE = 15;

export const viewFunction = (viewModel: Scrollbar): JSX.Element => {
  const {
    cssClasses, scrollStyles, scrollRef, scrollbarRef, hoverStateEnabled,
    hoverInHandler, hoverOutHandler, isVisible,
    props: { activeStateEnabled },
  } = viewModel;

  return (
    <Widget
      rootElementRef={scrollbarRef}
      classes={cssClasses}
      activeStateEnabled={activeStateEnabled}
      hoverStateEnabled={hoverStateEnabled}
      visible={isVisible}
      onHoverStart={hoverInHandler}
      onHoverEnd={hoverOutHandler}
    >
      <div className={viewModel.scrollClasses} style={scrollStyles} ref={scrollRef}>
        <div className={SCROLLABLE_SCROLL_CONTENT_CLASS} />
      </div>
    </Widget>
  );
};

export type ScrollbarPropsType = ScrollbarProps
& Pick<BaseWidgetProps, 'rtlEnabled'>
& Pick<ScrollableProps, 'direction'>
& Pick<ScrollableSimulatedProps, 'bounceEnabled' | 'showScrollbar' | 'scrollByThumb' | 'scrollLocationChange'>;

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Scrollbar extends JSXComponent<ScrollbarPropsType>() {
  @Mutable() rightScrollLocation = 0;

  @Mutable() prevScrollLocation = 0;

  @Mutable() hideScrollbarTimer?: unknown;

  @InternalState() showOnScrollByWheel?: boolean;

  @InternalState() hovered = false;

  @InternalState() expanded = false;

  @InternalState() visibility = false;

  @Ref() scrollbarRef!: RefObject<HTMLDivElement>;

  @Ref() scrollRef!: RefObject<HTMLDivElement>;

  @Effect()
  pointerDownEffect(): EffectReturn {
    return subscribeToDXPointerDownEvent(this.scrollRef.current, () => { this.expand(); });
  }

  @Effect()
  pointerUpEffect(): EffectReturn {
    return subscribeToDXPointerUpEvent(domAdapter.getDocument(), () => { this.collapse(); });
  }

  @Method()
  isThumb(element: EventTarget | null): boolean {
    return this.scrollbarRef.current!.querySelector(`.${SCROLLABLE_SCROLL_CLASS}`) === element
      || this.scrollbarRef.current!.querySelector(`.${SCROLLABLE_SCROLL_CONTENT_CLASS}`) === element;
  }

  @Method()
  isScrollbar(element: EventTarget | null): boolean {
    return element === this.scrollbarRef.current;
  }

  @Method()
  show(): void {
    this.visibility = true;
  }

  @Method()
  hide(): void {
    this.visibility = false;

    if (isDefined(this.showOnScrollByWheel) && this.props.showScrollbar === 'onScroll') {
      this.hideScrollbarTimer = setTimeout(() => {
        this.showOnScrollByWheel = undefined;
      }, HIDE_SCROLLBAR_TIMEOUT);
    }
  }

  @Method()
  initHandler(
    event: DxMouseEvent,
    thumbScrolling: boolean,
    offset: number,
  ): void {
    if (isDxMouseWheelEvent(event.originalEvent)) {
      if (this.props.showScrollbar === 'onScroll') {
        this.showOnScrollByWheel = true;
      }
      return;
    }

    const { target } = event.originalEvent;
    const scrollbarClicked = this.props.scrollByThumb && this.isScrollbar(target);

    if (scrollbarClicked) {
      this.moveToMouseLocation(event, offset);
    }

    if (thumbScrolling) {
      this.expand();
    }
  }

  @Method()
  moveHandler(delta: number, minOffset: number, maxOffset: number, thumbScrolling: boolean): void {
    let resultDelta = delta;

    if (thumbScrolling) {
      resultDelta = -Math.round(delta / this.containerToContentRatio);
    }

    const isOutBounds = !inRange(this.props.scrollLocation, maxOffset, minOffset);
    if (isOutBounds) {
      resultDelta *= OUT_BOUNDS_ACCELERATION;
    }

    this.scrollStep(resultDelta, minOffset, maxOffset);
  }

  @Effect({ run: 'once' })
  disposeHideScrollbarTimer(): DisposeEffectReturn {
    return (): void => this.clearHideScrollbarTimer();
  }

  @Method()
  scrollStep(delta: number, minOffset: number, maxOffset: number): void {
    const moveToValue = this.props.scrollLocation + delta;

    this.moveTo(this.props.bounceEnabled
      ? moveToValue
      : clampIntoRange(moveToValue, minOffset, maxOffset));
  }

  @Method()
  moveTo(location: number): void {
    const scrollDelta = Math.abs(this.prevScrollLocation - location);
    this.prevScrollLocation = location;
    this.rightScrollLocation = this.props.maxOffset - location;

    this.props.scrollLocationChange?.(this.fullScrollProp, -location, scrollDelta >= 1);
  }

  @Effect()
  /* istanbul ignore next */
  syncScrollLocation(): void {
    if (this.props.containerHasSizes) {
      let newScrollLocation = this.props.scrollLocation;

      if (this.isHorizontal && this.props.rtlEnabled) {
        newScrollLocation = this.props.maxOffset - this.rightScrollLocation;

        if (newScrollLocation >= 0) {
          newScrollLocation = 0;
          this.rightScrollLocation = 0;
        }
      }

      this.moveTo(newScrollLocation);
    }
  }

  get axis(): 'x' | 'y' {
    return this.isHorizontal ? 'x' : 'y';
  }

  get fullScrollProp(): 'scrollLeft' | 'scrollTop' {
    return this.isHorizontal ? 'scrollLeft' : 'scrollTop';
  }

  get dimension(): 'width' | 'height' {
    return this.isHorizontal ? 'width' : 'height';
  }

  get isHorizontal(): boolean {
    return this.props.direction === DIRECTION_HORIZONTAL;
  }

  clearHideScrollbarTimer(): void {
    clearTimeout(this.hideScrollbarTimer as number);
    this.hideScrollbarTimer = undefined;
  }

  moveToMouseLocation(event: DxMouseEvent, offset: number): void {
    const mouseLocation = event[`page${this.axis.toUpperCase()}`] - offset;
    const delta = mouseLocation / this.containerToContentRatio - this.props.containerSize / 2;

    this.visibility = true;

    this.moveTo(Math.round(-delta));
  }

  get scrollSize(): number {
    return Math.max(this.props.containerSize * this.containerToContentRatio, THUMB_MIN_SIZE);
  }

  get containerToContentRatio(): number {
    return this.props.contentSize
      ? this.props.containerSize / this.props.contentSize
      : this.props.containerSize;
  }

  get scrollRatio(): number {
    const scrollOffsetMax = Math.abs(this.props.maxOffset);

    if (scrollOffsetMax) {
      return (this.props.containerSize - this.scrollSize) / scrollOffsetMax;
    }

    return 1;
  }

  expand(): void {
    this.expanded = true;
  }

  collapse(): void {
    this.expanded = false;
  }

  hoverInHandler(): void {
    if (this.props.showScrollbar === 'onHover') {
      this.hovered = true;
    }
  }

  hoverOutHandler(): void {
    if (this.props.showScrollbar === 'onHover') {
      this.hovered = false;
    }
  }

  get cssClasses(): string {
    const classesMap = {
      [SCROLLABLE_SCROLLBAR_CLASS]: true,
      [`dx-scrollbar-${this.props.direction}`]: true,
      [SCROLLABLE_SCROLLBAR_ACTIVE_CLASS]: !!this.expanded,
      [HOVER_ENABLED_STATE]: !!this.hoverStateEnabled,
    };
    return combineClasses(classesMap);
  }

  get scrollStyles(): { [key: string]: string | number } {
    return {
      [this.dimension]: this.scrollSize || THUMB_MIN_SIZE, // TODO: remove ||
      transform: this.scrollTransform,
    };
  }

  get scrollTransform(): string {
    if (this.props.showScrollbar === 'never') {
      return 'none';
    }

    const translateValue = -this.props.scrollLocation * this.scrollRatio;

    if (this.isHorizontal) {
      return `translate(${translateValue}px, 0px)`;
    }

    return `translate(0px, ${translateValue}px)`;
  }

  get scrollClasses(): string {
    return combineClasses({
      [SCROLLABLE_SCROLL_CLASS]: true,
      'dx-state-invisible': !this.visible,
    });
  }

  get isVisible(): boolean {
    return this.props.showScrollbar !== 'never' && -this.props.maxOffset > 0 && this.props.containerSize > 15;
  }

  get visible(): boolean {
    const { showScrollbar, forceVisibility } = this.props;

    if (!this.isVisible) {
      return false;
    }
    if (showScrollbar === 'onHover') {
      return this.visibility || this.props.isScrollableHovered || this.hovered;
    }
    if (showScrollbar === 'always') {
      return true;
    }

    return forceVisibility || this.visibility || !!this.showOnScrollByWheel;
  }

  get hoverStateEnabled(): boolean {
    const { showScrollbar, scrollByThumb } = this.props;
    return (showScrollbar === 'onHover' || showScrollbar === 'always') && scrollByThumb;
  }
}
