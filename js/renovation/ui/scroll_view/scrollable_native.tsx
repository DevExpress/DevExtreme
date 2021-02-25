import {
  Component,
  JSXComponent,
  Method,
  Ref,
  Effect,
  RefObject,
  ComponentBindings,
  Mutable,
  InternalState,
} from 'devextreme-generator/component_declaration/common';
import { subscribeToScrollEvent } from '../../utils/subscribe_to_event';
import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn, EffectReturn } from '../../utils/effect_return.d';
import devices from '../../../core/devices';
import { isDefined } from '../../../core/utils/type';
import BaseWidgetProps from '../../utils/base_props';
import {
  ScrollableProps,
} from './scrollable_props';
import { TopPocketProps } from './top_pocket_props';
import { BottomPocketProps } from './bottom_pocket_props';
import '../../../events/gesture/emitter.gesture.scroll';

import {
  ScrollEventArgs,
  ScrollableLocation, ScrollOffset, ScrollableDirection,
} from './types.d';

import { isDxMouseWheelEvent } from '../../../events/utils/index';

import {
  ensureLocation, ScrollDirection, normalizeCoordinate,
  getContainerOffsetInternal,
  getElementLocation, getPublicCoordinate, getBoundaryProps,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  DIRECTION_BOTH,
  SCROLLABLE_CONTAINER_CLASS,
  SCROLLABLE_CONTENT_CLASS,
  SCROLLABLE_WRAPPER_CLASS,
  SCROLLVIEW_CONTENT_CLASS,
  SCROLLABLE_DISABLED_CLASS,
  SCROLLABLE_SCROLLBAR_SIMULATED,
  SCROLLABLE_SCROLLBARS_HIDDEN,
} from './scrollable_utils';
import { Scrollbar } from './scrollbar';

import { TopPocket } from './top_pocket';
import { BottomPocket } from './bottom_pocket';

import {
  dxScrollInit,
  dxScrollMove,
} from '../../../events/short';

const HIDE_SCROLLBAR_TIMEOUT = 500;

export const viewFunction = (viewModel: ScrollableNative): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef, direction,
    horizontalScrollbarRef, verticalScrollbarRef,
    contentClientWidth, containerClientWidth, contentClientHeight, containerClientHeight,
    windowResizeHandler, needForceScrollbarsVisibility,
    props: {
      disabled, height, width, rtlEnabled, children, visible,
      forceGeneratePockets, needScrollViewContentWrapper,
      showScrollbar, scrollByThumb, useSimulatedScrollbar, pullingDownText,
      pulledDownText, refreshingText, reachBottomText,
    },
    restAttributes,
  } = viewModel;

  return (
    <Widget
      classes={cssClasses}
      disabled={disabled}
      rtlEnabled={rtlEnabled}
      height={height}
      width={width}
      visible={visible}
      onDimensionChanged={windowResizeHandler}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <div className={SCROLLABLE_WRAPPER_CLASS} ref={wrapperRef}>
        <div className={SCROLLABLE_CONTAINER_CLASS} ref={containerRef}>
          <div className={SCROLLABLE_CONTENT_CLASS} ref={contentRef}>
            {forceGeneratePockets && (
            <TopPocket
              pullingDownText={pullingDownText}
              pulledDownText={pulledDownText}
              refreshingText={refreshingText}
            />
            )}
            {needScrollViewContentWrapper && (
              <div className={SCROLLVIEW_CONTENT_CLASS}>{children}</div>)}
            {!needScrollViewContentWrapper && children}
            {forceGeneratePockets && (
            <BottomPocket
              reachBottomText={reachBottomText}
            />
            )}
          </div>
        </div>
      </div>
      { showScrollbar && useSimulatedScrollbar && direction.isHorizontal && (
        <Scrollbar
          direction="horizontal"
          ref={horizontalScrollbarRef}
          scrollByThumb={scrollByThumb}
          contentSize={contentClientWidth}
          containerSize={containerClientWidth}
          forceVisibility={needForceScrollbarsVisibility}
        />
      )}
      { showScrollbar && useSimulatedScrollbar && direction.isVertical && (
        <Scrollbar
          direction="vertical"
          ref={verticalScrollbarRef}
          scrollByThumb={scrollByThumb}
          contentSize={contentClientHeight}
          containerSize={containerClientHeight}
          forceVisibility={needForceScrollbarsVisibility}
        />
      )}
    </Widget>
  );
};
@ComponentBindings()
export class ScrollableNativeProps extends ScrollableProps {
}

type ScrollableNativePropsType = ScrollableNativeProps
& Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height' | 'onKeyDown' | 'visible' >
& Pick<TopPocketProps, 'pullingDownText' | 'pulledDownText' | 'refreshingText'>
& Pick<BottomPocketProps, 'reachBottomText'>;

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ScrollableNative extends JSXComponent<ScrollableNativePropsType>() {
  @Ref() wrapperRef!: RefObject<HTMLDivElement>;

  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @Ref() verticalScrollbarRef!: RefObject; // TODO: any -> Scrollbar (Generators)

  @Ref() horizontalScrollbarRef!: RefObject; // TODO: any -> Scrollbar (Generators)

  @Mutable() locked = false;

  @Mutable() hideScrollbarTimeout?: any;

  @Mutable() eventForUserAction?: Event;

  @Mutable() lastLocation: { top: number; left: number } = { top: 0, left: 0 };

  @InternalState() containerClientWidth = 0;

  @InternalState() containerClientHeight = 0;

  @InternalState() contentClientWidth = 0;

  @InternalState() contentClientHeight = 0;

  @InternalState() needForceScrollbarsVisibility = false;

  @Method()
  content(): HTMLDivElement {
    return this.contentRef.current!;
  }

  @Method()
  update(): void {
    const contentEl = this.contentRef.current;

    if (isDefined(contentEl)) {
      this.updateSizes();
      this.props.onUpdated?.(this.getEventArgs());
    }
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollableLocation>): void {
    const location = ensureLocation(distance);

    if (this.direction.isVertical) {
      this.containerRef.current!.scrollTop += Math.round(location.top);
    }
    if (this.direction.isHorizontal) {
      this.containerRef.current!.scrollLeft += normalizeCoordinate('left', Math.round(location.left), this.props.rtlEnabled);
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
          element,
          scrollOffset,
          DIRECTION_VERTICAL,
          this.containerRef.current!,
          this.props.rtlEnabled,
        ),
        left: getElementLocation(
          element,
          scrollOffset,
          DIRECTION_HORIZONTAL,
          this.containerRef.current!,
          this.props.rtlEnabled,
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
    const { left, top } = getContainerOffsetInternal(this.containerRef.current!);
    return {
      left: getPublicCoordinate('left', left, this.containerRef.current!, rtlEnabled),
      top: getPublicCoordinate('top', top, this.containerRef.current!, rtlEnabled),
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
    return this.containerRef.current!.clientHeight;
  }

  @Method()
  clientWidth(): number {
    return this.containerRef.current!.clientWidth;
  }

  @Effect() scrollEffect(): EffectReturn {
    return subscribeToScrollEvent(this.containerRef.current!,
      (e: Event) => {
        if (!this.isScrollLocationChanged()) { // TODO: need check it after renovation
          e.stopImmediatePropagation();
          return;
        }

        this.eventForUserAction = e;
        if (this.props.useSimulatedScrollbar) {
          this.moveScrollbars();
        }

        this.props.onScroll?.(this.getEventArgs());
        this.lastLocation = this.location();
      });
  }

  getEventArgs(): ScrollEventArgs {
    return {
      event: this.eventForUserAction,
      scrollOffset: this.scrollOffset(),
      ...getBoundaryProps(this.props.direction, this.scrollOffset(), this.containerRef.current!),
    };
  }

  isScrollLocationChanged(): boolean {
    const currentLocation = this.location();

    const isTopChanged = this.lastLocation.top !== currentLocation.top;
    const isLeftChanged = this.lastLocation.left !== currentLocation.left;

    return isTopChanged || isLeftChanged;
  }

  @Effect() effectDisabledState(): void {
    if (this.props.disabled) {
      this.lock();
    } else {
      this.unlock();
    }
  }

  lock(): void {
    this.locked = true;
  }

  unlock(): void {
    if (!this.props.disabled) {
      this.locked = false;
    }
  }

  @Effect() effectResetInactiveState(): void {
    const containerEl = this.containerRef.current;

    if (this.props.direction === DIRECTION_BOTH || !isDefined(containerEl)) { // || !hasWindow()
      return;
    }

    containerEl[this.fullScrollInactiveProp] = 0;
  }

  get fullScrollInactiveProp(): 'scrollLeft' | 'scrollTop' {
    return this.props.direction === DIRECTION_HORIZONTAL ? 'scrollTop' : 'scrollLeft';
  }

  @Effect({ run: 'always' }) effectUpdateScrollbarSize(): void {
    this.updateSizes();
  }

  windowResizeHandler(): void { // update if simulatedScrollbars are using
    this.updateSizes();
    this.props.onUpdated?.(this.getEventArgs());
  }

  updateSizes(): void {
    const containerEl = this.containerRef.current;
    const contentEl = this.contentRef.current;

    if (isDefined(containerEl)) {
      this.containerClientWidth = containerEl.clientWidth;
      this.containerClientHeight = containerEl.clientHeight;
    }

    if (isDefined(contentEl)) {
      this.contentClientWidth = contentEl.clientWidth;
      this.contentClientHeight = contentEl.clientHeight;
    }
  }

  moveScrollbars(): void {
    const { top, left } = this.location();

    if (this.direction.isHorizontal) {
      const scrollbarEl = this.horizontalScrollbarRef.current;
      if (isDefined(scrollbarEl)) {
        this.horizontalScrollbarRef.current.moveScrollbar(left);
      }
    }

    if (this.direction.isVertical) {
      const scrollbarEl = this.verticalScrollbarRef.current;
      if (isDefined(scrollbarEl)) {
        this.verticalScrollbarRef.current.moveScrollbar(top);
      }
    }

    this.needForceScrollbarsVisibility = true;

    this.clearHideScrollbarTimeout();

    this.hideScrollbarTimeout = setTimeout(() => {
      /* istanbul ignore next */
      this.needForceScrollbarsVisibility = false;
    }, HIDE_SCROLLBAR_TIMEOUT);
  }

  @Effect({ run: 'once' })
  disposeHideScrollbarTimeout(): DisposeEffectReturn {
    return (): void => this.clearHideScrollbarTimeout();
  }

  clearHideScrollbarTimeout(): void {
    clearTimeout(this.hideScrollbarTimeout);
    this.hideScrollbarTimeout = undefined;
  }

  location(): { top: number; left: number } {
    return {
      top: -this.containerRef.current!.scrollTop,
      left: -this.containerRef.current!.scrollLeft,
    };
  }

  @Effect()
  initEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollInit.on(this.wrapperRef.current,
      (e: Event) => {
        this.handleInit(e);
      }, this.getInitEventData(), { namespace });

    return (): void => dxScrollInit.off(this.wrapperRef.current, { namespace });
  }

  getInitEventData(): any {
    return {
      getDirection: this.tryGetAllowedDirection,
      validate: this.validate,
      isNative: true,
      scrollTarget: this.containerRef.current,
    };
  }

  @Effect()
  moveEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollMove.on(this.wrapperRef.current,
      (e: Event) => {
        this.handleMove(e);
      }, { namespace });

    return (): void => dxScrollMove.off(this.wrapperRef.current, { namespace });
  }

  // eslint-disable-next-line
  handleInit(e): void {}

  handleMove(e): void {
    if (this.locked) {
      e.cancel = true;
      return;
    }

    if (isDefined(this.tryGetAllowedDirection())) {
      e.originalEvent.isScrollingEvent = true;
    }
  }

  tryGetAllowedDirection(): ScrollableDirection | undefined {
    const { isVertical, isHorizontal, isBoth } = new ScrollDirection(this.props.direction);

    const contentEl = this.contentRef.current;
    const containerEl = this.containerRef.current;

    const isOverflowVertical = contentEl!.clientHeight > containerEl!.clientHeight;
    const isOverflowHorizontal = contentEl!.clientWidth > containerEl!.clientWidth;

    if (isBoth && isOverflowVertical && isOverflowHorizontal) {
      return DIRECTION_BOTH;
    } if (isHorizontal && isOverflowHorizontal) {
      return DIRECTION_HORIZONTAL;
    } if (isVertical && isOverflowVertical) {
      return DIRECTION_VERTICAL;
    }
    return undefined;
  }

  validate(e: Event): boolean {
    const { disabled } = this.props;

    if (this.isLocked() || disabled || (isDxMouseWheelEvent(e) && this.isScrollingOutOfBound(e))) {
      return false;
    }

    return isDefined(this.tryGetAllowedDirection());
  }

  isLocked(): boolean {
    return this.locked;
  }

  isScrollingOutOfBound(e: Event): boolean {
    const { delta, shiftKey } = e as any;
    const {
      scrollLeft, scrollTop, scrollWidth, clientWidth, scrollHeight, clientHeight,
    } = this.containerRef.current!;

    if (delta > 0) {
      return shiftKey ? !scrollLeft : !scrollTop;
    }

    return shiftKey
      ? clientWidth >= scrollWidth - scrollLeft
      : clientHeight >= scrollHeight - scrollTop;
  }

  get cssClasses(): string {
    const {
      direction, classes, disabled, useSimulatedScrollbar, showScrollbar,
    } = this.props;

    const classesMap = {
      [`dx-scrollable dx-scrollable-native dx-scrollable-native-${devices.real().platform} dx-scrollable-renovated`]: true,
      [`dx-scrollable-${direction}`]: true,
      [SCROLLABLE_DISABLED_CLASS]: !!disabled,
      [SCROLLABLE_SCROLLBAR_SIMULATED]: showScrollbar && useSimulatedScrollbar,
      [SCROLLABLE_SCROLLBARS_HIDDEN]: !showScrollbar,
      [`${classes}`]: !!classes,
    };
    return combineClasses(classesMap);
  }

  get direction(): { isVertical: boolean; isHorizontal: boolean } {
    return new ScrollDirection(this.props.direction);
  }
}
