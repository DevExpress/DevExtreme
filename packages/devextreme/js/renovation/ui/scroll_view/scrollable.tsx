import {
  Component,
  JSXComponent,
  Ref,
  Method,
  RefObject,
  Consumer,
} from '@devextreme-generator/declarations';

import {
  DxMouseEvent,
  ElementOffset,
  ScrollableDirection,
  ScrollOffset,
} from './common/types';

import { ScrollableNative } from './strategy/native';
import { ScrollableSimulated } from './strategy/simulated';
import { ScrollableWrapper } from '../../component_wrapper/navigation/scrollable';
import { getElementLocationInternal } from './utils/get_element_location_internal';
import { convertToLocation } from './utils/convert_location';
import { getOffsetDistance } from './utils/get_offset_distance';
import { isDefined, isNumeric } from '../../../core/utils/type';

import { hasWindow } from '../../../core/utils/window';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from './common/consts';
import { ScrollableProps } from './common/scrollable_props';

import { resolveRtlEnabled } from '../../utils/resolve_rtl';
import { ConfigContextValue, ConfigContext } from '../../common/config_context';

export const viewFunction = (viewModel: Scrollable): JSX.Element => {
  const {
    scrollableNativeRef,
    scrollableSimulatedRef,
    rtlEnabled,
    isServerSide,
    props: {
      useNative, children, classes,
      aria, disabled, width, height, visible,
      direction, showScrollbar, scrollByThumb, bounceEnabled,
      scrollByContent, useKeyboard, pullDownEnabled,
      reachBottomEnabled, forceGeneratePockets, needScrollViewContentWrapper,
      useSimulatedScrollbar, inertiaEnabled,
      pulledDownText, pullingDownText, refreshingText, reachBottomText, refreshStrategy,
      onScroll, onUpdated, onPullDown, onReachBottom, onStart, onEnd, onBounce, onVisibilityChange,
      loadPanelTemplate,
    },
    restAttributes,
  } = viewModel;

  return useNative
    ? (
      <ScrollableNative
        ref={scrollableNativeRef}
        aria={aria}
        classes={classes}
        width={width}
        height={height}
        disabled={disabled}
        visible={visible}
        rtlEnabled={rtlEnabled}
        direction={direction}
        showScrollbar={showScrollbar}
        pullDownEnabled={pullDownEnabled}
        reachBottomEnabled={reachBottomEnabled}
        forceGeneratePockets={forceGeneratePockets && !isServerSide}
        needScrollViewContentWrapper={needScrollViewContentWrapper}
        loadPanelTemplate={!isServerSide ? loadPanelTemplate : undefined}
        needRenderScrollbars={!isServerSide}
        onScroll={onScroll}
        onUpdated={onUpdated}
        onPullDown={onPullDown}
        onReachBottom={onReachBottom}
        refreshStrategy={refreshStrategy}
        pulledDownText={pulledDownText}
        pullingDownText={pullingDownText}
        refreshingText={refreshingText}
        reachBottomText={reachBottomText}

        useSimulatedScrollbar={useSimulatedScrollbar}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
      >
        {children}
      </ScrollableNative>
    )
    : (
      <ScrollableSimulated
        ref={scrollableSimulatedRef}
        aria={aria}
        classes={classes}
        width={width}
        height={height}
        disabled={disabled}
        visible={visible}
        rtlEnabled={rtlEnabled}
        direction={direction}
        showScrollbar={showScrollbar}
        scrollByThumb={scrollByThumb}
        pullDownEnabled={pullDownEnabled}
        reachBottomEnabled={reachBottomEnabled}
        forceGeneratePockets={forceGeneratePockets && !isServerSide}
        needScrollViewContentWrapper={needScrollViewContentWrapper}
        loadPanelTemplate={!isServerSide ? loadPanelTemplate : undefined}
        needRenderScrollbars={!isServerSide}
        onScroll={onScroll}
        onUpdated={onUpdated}
        onPullDown={onPullDown}
        onReachBottom={onReachBottom}
        refreshStrategy="simulated"
        pulledDownText={pulledDownText}
        pullingDownText={pullingDownText}
        refreshingText={refreshingText}
        reachBottomText={reachBottomText}

        // uses in dateview rollers only
        onVisibilityChange={onVisibilityChange}
        inertiaEnabled={inertiaEnabled}
        bounceEnabled={bounceEnabled}
        scrollByContent={scrollByContent}
        useKeyboard={useKeyboard}
        onStart={onStart}
        onEnd={onEnd}
        onBounce={onBounce}

        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
      >
        {children}
      </ScrollableSimulated>
    );
};

@Component({
  defaultOptionRules: null,
  jQuery: {
    register: true,
    component: ScrollableWrapper,
  },
  view: viewFunction,
})

export class Scrollable extends JSXComponent<ScrollableProps>() {
  @Consumer(ConfigContext)
  config?: ConfigContextValue;

  @Ref() scrollableNativeRef!: RefObject<ScrollableNative>;

  @Ref() scrollableSimulatedRef!: RefObject<ScrollableSimulated>;

  @Method()
  content(): HTMLDivElement {
    return this.scrollableRef.content() as HTMLDivElement;
  }

  @Method()
  container(): HTMLDivElement {
    return this.scrollableRef.container() as HTMLDivElement;
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollOffset>): void {
    if (!this.props.useNative) {
      // the resizeObserver handler calls too late
      // in case when DataGrid call dxresize when data was loaded
      this.updateHandler();
    }

    const currentScrollOffset = this.props.useNative
      ? this.scrollOffset()
      : { top: this.container().scrollTop, left: this.container().scrollLeft };

    const distance = getOffsetDistance(
      convertToLocation(targetLocation, this.props.direction),
      currentScrollOffset,
    );

    this.scrollBy(distance);
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollOffset>): void {
    let { top = 0, left = 0 } = convertToLocation(distance, this.props.direction);

    // destructuring assignment with default values not working
    // TODO: delete next two conditions after fix - https://github.com/DevExpress/devextreme-renovation/issues/734
    /* istanbul ignore next */
    if (!isDefined(top) || !isNumeric(top)) {
      top = 0;
    }
    /* istanbul ignore next */
    if (!isDefined(left) || !isNumeric(top)) {
      left = 0;
    }

    if (top === 0 && left === 0) {
      return;
    }

    this.scrollableRef.scrollByLocation({ top, left });
  }

  @Method()
  updateHandler(): void {
    this.scrollableRef.updateHandler();
  }

  @Method()
  release(): void {
    if (!this.isServerSide) {
      this.scrollableRef.release() as undefined;
    }
  }

  @Method()
  refresh(): void {
    if (!this.isServerSide) {
      this.scrollableRef.refresh();
    }
  }

  @Method()
  scrollToElement(element: HTMLElement, offset?: ElementOffset): void {
    if (!this.content().contains(element)) {
      return;
    }

    const scrollPosition = { top: 0, left: 0 };
    const { direction } = this.props;

    if (direction !== DIRECTION_VERTICAL) {
      scrollPosition.left = this.getScrollElementPosition(element, DIRECTION_HORIZONTAL, offset);
    }
    if (direction !== DIRECTION_HORIZONTAL) {
      scrollPosition.top = this.getScrollElementPosition(element, DIRECTION_VERTICAL, offset);
    }

    this.scrollTo(scrollPosition);
  }

  @Method()
  scrollHeight(): number {
    return this.scrollableRef.scrollHeight() as number;
  }

  @Method()
  scrollWidth(): number {
    return this.scrollableRef.scrollWidth() as number;
  }

  @Method()
  scrollOffset(): ScrollOffset {
    if (!this.isServerSide) {
      return this.scrollableRef.scrollOffset() as ScrollOffset;
    }

    return { top: 0, left: 0 };
  }

  @Method()
  scrollTop(): number {
    return this.scrollableRef.scrollTop() as number;
  }

  @Method()
  scrollLeft(): number {
    return this.scrollableRef.scrollLeft() as number;
  }

  @Method()
  clientHeight(): number {
    return this.scrollableRef.clientHeight() as number;
  }

  @Method()
  clientWidth(): number {
    return this.scrollableRef.clientWidth() as number;
  }

  // TODO: decorator uses for DataGrid. It's internal method
  @Method()
  getScrollElementPosition(
    targetElement: HTMLElement,
    direction: ScrollableDirection,
    offset?: ElementOffset,
  ): number {
    const scrollOffset = this.scrollOffset();

    return getElementLocationInternal(
      targetElement,
      direction,
      this.container(),
      scrollOffset,
      offset,
    );
  }

  @Method()
  startLoading(): void {
    this.scrollableRef.startLoading();
  }

  @Method()
  finishLoading(): void {
    if (!this.isServerSide) {
      this.scrollableRef.finishLoading();
    }
  }

  validate(event: DxMouseEvent): boolean {
    return this.scrollableRef.validate(event) as boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get scrollableRef(): any {
    if (this.props.useNative) {
      return this.scrollableNativeRef.current!;
    }
    return this.scrollableSimulatedRef.current!;
  }

  get rtlEnabled(): boolean {
    const { rtlEnabled } = this.props;
    return !!resolveRtlEnabled(rtlEnabled, this.config);
  }

  // eslint-disable-next-line class-methods-use-this
  get isServerSide(): boolean {
    return !hasWindow();
  }
}
