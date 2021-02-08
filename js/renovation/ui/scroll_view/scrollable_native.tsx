import {
  Component,
  JSXComponent,
  Method,
  Ref,
  Effect,
  RefObject,
  ComponentBindings,
  OneWay,
  Mutable,
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
  allowedDirection,
  ScrollableLocation, ScrollOffset,
} from './types.d';

import { isDxMouseWheelEvent } from '../../../events/utils/index';

import {
  ensureLocation, ScrollDirection, normalizeCoordinate,
  getContainerOffsetInternal,
  getElementLocation, getPublicCoordinate, getBoundaryProps,
  getElementWidth, getElementHeight,
  updateAllowedDirection,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
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
  dxScrollStart,
  dxScrollMove,
  dxScrollEnd,
  dxScrollStop,
  dxScrollCancel,
} from '../../../events/short';

export const viewFunction = (viewModel: ScrollableNative): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef,
    styles,
    props: {
      disabled, height, width, rtlEnabled, children,
      forceGeneratePockets, needScrollViewContentWrapper,
      showScrollbar, direction, scrollByThumb, useSimulatedScrollbar, pullingDownText,
      pulledDownText, refreshingText, reachBottomText,
    },
    restAttributes,
  } = viewModel;

  const targetDirection = direction ?? 'vertical';
  const isVertical = targetDirection !== 'horizontal';
  const isHorizontal = targetDirection !== 'vertical';

  return (
    <Widget
      classes={cssClasses}
      disabled={disabled}
      rtlEnabled={rtlEnabled}
      height={height}
      width={width}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <div className={SCROLLABLE_WRAPPER_CLASS} ref={wrapperRef}>
        <div className={SCROLLABLE_CONTAINER_CLASS} ref={containerRef}>
          <div className={SCROLLABLE_CONTENT_CLASS} style={styles} ref={contentRef}>
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
      { showScrollbar && useSimulatedScrollbar && isHorizontal && (
        <Scrollbar
          direction="horizontal"
          scrollByThumb={scrollByThumb}
        />
      )}
      { showScrollbar && useSimulatedScrollbar && isVertical && (
        <Scrollbar
          direction="vertical"
          scrollByThumb={scrollByThumb}
        />
      )}
    </Widget>
  );
};
@ComponentBindings()
export class ScrollableNativeProps extends ScrollableProps {
  @OneWay() pushBackValue?: number;
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

  @Mutable() locked = false;

  @Method()
  content(): HTMLDivElement {
    return this.contentRef.current!;
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollableLocation>): void {
    const location = ensureLocation(distance);
    const { isVertical, isHorizontal } = new ScrollDirection(this.props.direction);

    if (isVertical) {
      this.containerRef.current!.scrollTop += Math.round(location.top);
    }
    if (isHorizontal) {
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
  clientHeight(): number | undefined {
    return this.containerRef.current?.clientHeight;
  }

  @Method()
  clientWidth(): number | undefined {
    return this.containerRef.current?.clientWidth;
  }

  @Effect() scrollEffect(): EffectReturn {
    return subscribeToScrollEvent(this.containerRef.current,
      (event: Event) => this.props.onScroll?.({
        event,
        scrollOffset: this.scrollOffset(),
        ...getBoundaryProps(
          this.props.direction, this.scrollOffset(), this.containerRef.current!, this.pushBackValue,
        ),
      }));
  }

  @Effect()
  initEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    /* istanbul ignore next */
    dxScrollInit.on(this.wrapperRef.current,
      (e: Event) => {
        this.handleInit(e);
      }, {
        getDirection: () => this.getDirection(),
        validate: (e) => this.validate(e),
        isNative: true,
        scrollTarget: this.containerRef.current,
      }, { namespace });

    return (): void => dxScrollInit.off(this.wrapperRef, { namespace });
  }

  @Effect()
  startEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollStart.on(this.wrapperRef.current,
      (e: Event) => {
        this.handleStart(e);
      }, { namespace });

    return (): void => dxScrollStart.off(this.wrapperRef.current, { namespace });
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

  @Effect()
  endEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollEnd.on(this.wrapperRef.current,
      (e: Event) => {
        this.handleEnd(e);
      }, { namespace });

    return (): void => dxScrollEnd.off(this.wrapperRef.current, { namespace });
  }

  @Effect()
  stopEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollStop.on(this.wrapperRef.current,
      (event: Event) => {
        this.handleStop(event);
      }, { namespace });

    return (): void => dxScrollStop.off(this.wrapperRef.current, { namespace });
  }

  @Effect()
  cancelEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollCancel.on(this.wrapperRef,
      (event: Event) => {
        this.handleCancel(event);
      }, { namespace });

    return (): void => dxScrollCancel.off(this.wrapperRef, { namespace });
  }

  /* istanbul ignore next */
  // eslint-disable-next-line
  private handleInit(event: Event): void {
    // console.log('initHandler', event, this);
  }
  /* istanbul ignore next */
  // eslint-disable-next-line
  private handleStart(event: Event): void {
    // console.log('handleEnd', event, this);
  }
  /* istanbul ignore next */
  // eslint-disable-next-line
  private handleMove(event: Event): void {
    // console.log('handleEnd', event, this);
  }
  /* istanbul ignore next */
  // eslint-disable-next-line
  private handleEnd(event: Event): void {
    // console.log('handleEnd', event, this);
  }
  /* istanbul ignore next */
  // eslint-disable-next-line
  private handleStop(event: Event): void {
    // console.log('handleStop', event, this);
  }
  /* istanbul ignore next */
  // eslint-disable-next-line
  private handleCancel(event: Event): void {
    // console.log('handleCancel', event, this);
  }

  private getDirection(): string | undefined {
    return this.allowedDirection();
  }

  private allowedDirection(): string | undefined {
    return updateAllowedDirection(this.allowedDirections(), this.props.direction);
  }

  private allowedDirections(): allowedDirection {
    const { isVertical, isHorizontal } = new ScrollDirection(this.props.direction);

    return {
      vertical: isVertical
      && getElementHeight(this.contentRef.current) > getElementHeight(this.containerRef.current),
      horizontal: isHorizontal
      && getElementWidth(this.contentRef.current) > getElementWidth(this.containerRef.current),
    };
  }

  private validate(e: Event): boolean {
    if (this.isLocked()) {
      return false;
    }

    if (this.props.disabled) {
      return false;
    }

    if (isDxMouseWheelEvent(e) && this.isScrolledInMaxDirection(e)) {
      return false;
    }

    return isDefined(this.allowedDirection());
  }

  private isLocked(): boolean {
    return this.locked;
  }

  private isScrolledInMaxDirection(e: Event): boolean {
    const { delta, shiftKey } = e as any;
    const {
      scrollLeft, scrollTop, scrollWidth, clientWidth, scrollHeight, clientHeight,
    } = this.containerRef.current!;

    if (delta > 0) {
      return shiftKey ? !scrollLeft : !scrollTop;
    }

    return shiftKey
      ? scrollLeft >= scrollWidth - clientWidth
      : scrollTop >= scrollHeight - clientHeight;
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

  get pushBackValue(): number {
    const { pushBackValue } = this.props;

    if (isDefined(pushBackValue)) {
      return pushBackValue;
    }

    return (devices.real().platform === 'ios' ? 1 : 0);
  }

  get styles(): { [key: string]: any } {
    return {
      paddingTop: this.pushBackValue !== 0 ? this.pushBackValue : undefined,
      paddingBottom: this.pushBackValue !== 0 ? this.pushBackValue : undefined,
    };
  }
}
