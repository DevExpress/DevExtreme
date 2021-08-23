import {
  Component,
  JSXComponent,
  Ref,
  Method,
  RefObject,
} from '@devextreme-generator/declarations';

import {
  DxMouseEvent,
  ScrollableDirection,
  ScrollOffset,
} from './types.d';

import { BaseWidgetProps } from '../common/base_props';
import {
  ScrollableProps,
} from './scrollable_props';

import { ScrollableNative, ScrollableNativeProps } from './scrollable_native';
import { ScrollableSimulated } from './scrollable_simulated';
import { createDefaultOptionRules } from '../../../core/options/utils';
import devices from '../../../core/devices';
import { nativeScrolling, touch } from '../../../core/utils/support';
import { ScrollableWrapper } from '../../component_wrapper/navigation/scrollable';
import { WidgetProps } from '../common/widget';
import { ScrollableSimulatedProps } from './scrollable_simulated_props';
import { getElementLocationInternal } from './utils/get_element_location_internal';

import { hasWindow } from '../../../core/utils/window';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from './common/consts';

let isServerSide = !hasWindow();

export const viewFunction = (viewModel: Scrollable): JSX.Element => {
  const {
    scrollableNativeRef,
    scrollableSimulatedRef,
    props: {
      useNative, activeStateUnit, children, classes,
      aria, disabled, width, height, visible, rtlEnabled,
      direction, showScrollbar, scrollByThumb, bounceEnabled,
      scrollByContent, useKeyboard, pullDownEnabled,
      reachBottomEnabled, forceGeneratePockets, needScrollViewContentWrapper,
      needScrollViewLoadPanel, useSimulatedScrollbar, inertiaEnabled,
      pulledDownText, pullingDownText, refreshingText, reachBottomText,
      onScroll, onUpdated, onPullDown, onReachBottom, onStart, onEnd, onBounce, onVisibilityChange,
    },
    restAttributes,
  } = viewModel;

  isServerSide = !hasWindow();

  return useNative
    ? (
      <ScrollableNative
        ref={scrollableNativeRef}
        activeStateUnit={activeStateUnit}
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
        needScrollViewLoadPanel={needScrollViewLoadPanel && !isServerSide}
        needRenderScrollbars={!isServerSide}
        onScroll={onScroll}
        onUpdated={onUpdated}
        onPullDown={onPullDown}
        onReachBottom={onReachBottom}
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
        activeStateUnit={activeStateUnit}
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
        needScrollViewLoadPanel={needScrollViewLoadPanel && !isServerSide}
        needRenderScrollbars={!isServerSide}
        onScroll={onScroll}
        onUpdated={onUpdated}
        onPullDown={onPullDown}
        onReachBottom={onReachBottom}
        pulledDownText={pulledDownText}
        pullingDownText={pullingDownText}
        refreshingText={refreshingText}
        reachBottomText={reachBottomText}

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

type ScrollablePropsType = ScrollableProps
& Pick<WidgetProps, 'aria' | 'activeStateUnit' | 'onVisibilityChange'>
& Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height' | 'visible'>
& Pick<ScrollableNativeProps, 'useSimulatedScrollbar'>
& Pick<ScrollableSimulatedProps, 'inertiaEnabled' | 'useKeyboard' | 'onStart' | 'onEnd' | 'onBounce'>;

export const defaultOptionRules = createDefaultOptionRules<ScrollablePropsType>([{
  device: (device): boolean => !devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic',
  options: {
    bounceEnabled: false,
    scrollByContent: touch,
    scrollByThumb: true,
    showScrollbar: 'onHover',
  },
}, {
  device: (): boolean => !nativeScrolling,
  options: {
    useNative: false,
  },
}]);

@Component({
  defaultOptionRules,
  jQuery: { register: true, component: ScrollableWrapper },
  view: viewFunction,
})

export class Scrollable extends JSXComponent<ScrollablePropsType>() {
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
  scrollBy(distance: number | Partial<ScrollOffset>): void {
    this.scrollableRef.scrollBy(distance);
  }

  @Method()
  updateHandler(): void {
    this.scrollableRef.updateHandler();
  }

  @Method()
  release(): void {
    if (!isServerSide) {
      this.scrollableRef.release() as undefined;
    }
  }

  @Method()
  refresh(): void {
    if (!isServerSide) {
      this.scrollableRef.refresh();
    }
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollOffset>): void {
    this.scrollableRef.scrollTo(targetLocation);
  }

  @Method()
  scrollToElement(element: HTMLElement, offset?: Partial<Omit<ClientRect, 'width' | 'height'>>): void {
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
    return this.scrollableRef.scrollOffset() as ScrollOffset;
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
    offset?: Partial<Omit<ClientRect, 'width' | 'height'>>,
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
    if (!isServerSide) {
      this.scrollableRef.finishLoading();
    }
  }

  validate(event: DxMouseEvent): boolean {
    return this.scrollableRef.validate(event) as boolean;
  }

  // https://trello.com/c/6TBHZulk/2672-renovation-cannot-use-getter-to-get-access-to-components-methods-react
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get scrollableRef(): any {
    if (this.props.useNative) {
      return this.scrollableNativeRef.current!;
    }
    return this.scrollableSimulatedRef.current!;
  }
}
