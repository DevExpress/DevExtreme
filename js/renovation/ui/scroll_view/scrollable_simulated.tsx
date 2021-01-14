import {
  Component,
  JSXComponent,
  Method,
  Ref,
  Effect,
  RefObject,
} from 'devextreme-generator/component_declaration/common';
import { subscribeToScrollEvent } from '../../utils/subscribe_to_event';
import { Scroller } from './scroller';
import { Widget } from '../common/widget';
import { combineClasses } from '../../utils/combine_classes';
import { DisposeEffectReturn, EffectReturn } from '../../utils/effect_return.d';

import { map } from '../../../core/utils/iterator';
import { when } from '../../../core/utils/deferred';

import {
  ScrollableInternalPropsType,
} from './scrollable_props';

import {
  ScrollableLocation, ScrollableShowScrollbar, ScrollOffset,
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
  SCROLLABLE_DISABLED_CLASS,
  SCROLLABLE_SCROLLBARS_HIDDEN,
  SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE,
} from './scrollable_utils';

import { TopPocket } from './topPocket';
import { BottomPocket } from './bottomPocket';

import {
  dxScrollStart,
  dxScrollMove,
  dxScrollEnd,
  dxScrollStop,
  dxScrollCancel,
  mouseEnter,
  mouseLeave,
} from '../../../events/short';

function visibilityModeNormalize(mode: any): ScrollableShowScrollbar {
  if (mode === true) {
    return 'onScroll';
  }
  return (mode === false) ? 'never' : mode;
}

export const viewFunction = (viewModel: ScrollableSimulated): JSX.Element => {
  const {
    cssClasses, wrapperRef, contentRef, containerRef, horizontalScrollerRef, verticalScrollerRef,
    props: {
      disabled, height, width, rtlEnabled, children,
      forceGeneratePockets, needScrollViewContentWrapper,
      showScrollbar, direction, scrollByThumb, pullingDownText, pulledDownText, refreshingText,
      reachBottomText,
    },
    restAttributes,
  } = viewModel;

  const targetDirection = direction ?? 'vertical';
  const isVertical = targetDirection !== 'horizontal';
  const isHorizontal = targetDirection !== 'vertical';

  const visibilityMode = visibilityModeNormalize(showScrollbar);
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
          <div className={SCROLLABLE_CONTENT_CLASS} ref={contentRef}>
            {forceGeneratePockets && (
            <TopPocket
              pullingDownText={pullingDownText}
              pulledDownText={pulledDownText}
              refreshingText={refreshingText}
              refreshStrategy="simulated"
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
          {isHorizontal && (
            <Scroller
              ref={horizontalScrollerRef}
              direction="horizontal"
              visible={scrollByThumb}
              visibilityMode={visibilityMode}
              expandable={scrollByThumb}
            />
          )}
          {isVertical && (
            <Scroller
              ref={verticalScrollerRef}
              direction="vertical"
              visible={scrollByThumb}
              visibilityMode={visibilityMode}
              expandable={scrollByThumb}
            />
          )}
        </div>
      </div>
    </Widget>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class ScrollableSimulated extends JSXComponent<ScrollableInternalPropsType>() {
  @Ref() wrapperRef!: RefObject<HTMLDivElement>;

  @Ref() contentRef!: RefObject<HTMLDivElement>;

  @Ref() containerRef!: RefObject<HTMLDivElement>;

  @Ref() horizontalScrollerRef!: RefObject<Scroller>;

  @Ref() verticalScrollerRef!: RefObject<Scroller>;

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

  @Effect()
  startEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollStart.on(this.wrapperRef,
      (e: Event) => {
        this.handleStart(e);
      }, { namespace });

    return (): void => dxScrollStart.off(this.wrapperRef, { namespace });
  }

  @Effect()
  moveEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollMove.on(this.wrapperRef,
      (e: Event) => {
        this.handleMove(e);
      }, { namespace });

    return (): void => dxScrollMove.off(this.wrapperRef, { namespace });
  }

  @Effect()
  endEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollEnd.on(this.wrapperRef,
      (e: Event) => {
        this.handleEnd(e);
      }, { namespace });

    return (): void => dxScrollEnd.off(this.wrapperRef, { namespace });
  }

  @Effect()
  stopEffect(): DisposeEffectReturn {
    const namespace = 'dxScrollable';

    dxScrollStop.on(this.wrapperRef,
      (event: Event) => {
        this.handleStop(event);
      }, { namespace });

    return (): void => dxScrollStop.off(this.wrapperRef, { namespace });
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

  @Effect()
  mouseEnterEffect(): EffectReturn {
    const namespace = 'dxSimulatedScrollableCursor';

    mouseEnter.on(this.wrapperRef,
      (e: Event) => {
        this.cursorEnterHandler(e);
      }, { namespace });

    return (): void => mouseEnter.off(this.wrapperRef, { namespace });
  }

  @Effect()
  mouseLeaveEffect(): EffectReturn {
    const namespace = 'dxSimulatedScrollableCursor';

    mouseLeave.on(this.wrapperRef,
      (e: Event) => {
        this.cursorLeaveHandler(e);
      }, { namespace });

    return (): void => mouseLeave.off(this.wrapperRef, { namespace });
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

  /* istanbul ignore next */
  // eslint-disable-next-line
  private cursorEnterHandler(event: Event): void {
    if (!this.props.disabled && this.isHoverMode()) {
      this.eventHandler('cursorEnter');
    }
  }

  /* istanbul ignore next */
  // eslint-disable-next-line
  private cursorLeaveHandler(event: Event): void {
    if (!this.props.disabled && this.isHoverMode()) {
      this.eventHandler('cursorLeave');
    }
  }

  private isHoverMode(): boolean {
    return this.props.showScrollbar === 'onHover';
  }

  private eventHandler(eventName): any {
    const deferreds = map([this.horizontalScrollerRef, this.verticalScrollerRef],
      (scroller) => scroller[`${eventName}Handler`].apply(scroller));

    return when.apply($, deferreds).promise();
  }

  get cssClasses(): string {
    const {
      direction, classes, disabled, showScrollbar,
    } = this.props;

    const classesMap = {
      'dx-scrollable dx-scrollable-simulated dx-scrollable-renovated': true,
      [`dx-scrollable-${direction}`]: true,
      [SCROLLABLE_DISABLED_CLASS]: !!disabled,
      [SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE]: showScrollbar === 'always',
      [SCROLLABLE_SCROLLBARS_HIDDEN]: !showScrollbar,
      [`${classes}`]: !!classes,
    };
    return combineClasses(classesMap);
  }
}
