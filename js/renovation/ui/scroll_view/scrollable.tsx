import {
  Component,
  JSXComponent,
  Ref,
  Method,
  RefObject,
} from '@devextreme-generator/declarations';

import {
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
import { ScrollableWrapper } from '../../component_wrapper/scrollable';
import { WidgetProps } from '../common/widget';
import { ScrollableSimulatedProps } from './scrollable_simulated_props';

export const viewFunction = (viewModel: Scrollable): JSX.Element => {
  const {
    scrollableNativeRef,
    scrollableSimulatedRef,
    props: {
      useNative, children, classes,
      aria, disabled, width, height, visible, rtlEnabled,
      direction, showScrollbar, scrollByThumb, bounceEnabled,
      scrollByContent, useKeyboard, updateManually, pullDownEnabled,
      reachBottomEnabled, forceGeneratePockets, needScrollViewContentWrapper,
      needScrollViewLoadPanel, useSimulatedScrollbar, inertiaEnabled,
      pulledDownText, pullingDownText, refreshingText, reachBottomText,
      onScroll, onUpdated, onPullDown, onReachBottom, onStart, onEnd, onBounce,
    },
    restAttributes,
  } = viewModel;

  return (useNative
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
        showScrollbar={showScrollbar} // TODO: https://trello.com/c/ztUBYg5y/
        updateManually={updateManually}
        pullDownEnabled={pullDownEnabled}
        reachBottomEnabled={reachBottomEnabled}
        forceGeneratePockets={forceGeneratePockets}
        needScrollViewContentWrapper={needScrollViewContentWrapper}
        needScrollViewLoadPanel={needScrollViewLoadPanel}
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
        updateManually={updateManually}
        pullDownEnabled={pullDownEnabled}
        reachBottomEnabled={reachBottomEnabled}
        forceGeneratePockets={forceGeneratePockets}
        needScrollViewContentWrapper={needScrollViewContentWrapper}
        needScrollViewLoadPanel={needScrollViewLoadPanel}
        onScroll={onScroll}
        onUpdated={onUpdated}
        onPullDown={onPullDown}
        onReachBottom={onReachBottom}
        pulledDownText={pulledDownText}
        pullingDownText={pullingDownText}
        refreshingText={refreshingText}
        reachBottomText={reachBottomText}

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
    )
  );
};

type ScrollablePropsType = ScrollableProps
& Pick<WidgetProps, 'aria'>
& Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height' | 'visible'>
& Pick<ScrollableNativeProps, 'useSimulatedScrollbar'>
& Pick<ScrollableSimulatedProps, 'inertiaEnabled' | 'useKeyboard' | 'onStart' | 'onEnd' | 'onBounce'>;

export const defaultOptionRules = createDefaultOptionRules<ScrollablePropsType>([{
  device: (device): boolean => (!devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic'),
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
    return this.scrollableRef.content();
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollOffset>): void {
    this.scrollableRef.scrollBy(distance);
  }

  @Method()
  update(): void {
    this.scrollableRef.update();
  }

  @Method()
  release(): void {
    return this.scrollableRef.release();
  }

  @Method()
  refresh(): void {
    this.scrollableRef.refresh();
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollOffset>): void {
    this.scrollableRef.scrollTo(targetLocation);
  }

  @Method()
  scrollToElement(element: HTMLElement): void {
    this.scrollableRef.scrollToElement(element);
  }

  @Method()
  scrollHeight(): number {
    return this.scrollableRef.scrollHeight();
  }

  @Method()
  scrollWidth(): number {
    return this.scrollableRef.scrollWidth();
  }

  @Method()
  scrollOffset(): ScrollOffset {
    return this.scrollableRef.scrollOffset();
  }

  @Method()
  scrollTop(): number {
    return this.scrollableRef.scrollTop();
  }

  @Method()
  scrollLeft(): number {
    return this.scrollableRef.scrollLeft();
  }

  @Method()
  clientHeight(): number {
    return this.scrollableRef.clientHeight();
  }

  @Method()
  clientWidth(): number {
    return this.scrollableRef.clientWidth();
  }

  validate(e: Event): boolean {
    return this.scrollableRef.validate(e);
  }

  @Method()
  getScrollElementPosition(element: HTMLElement, direction: ScrollableDirection): boolean {
    return this.scrollableRef.getElementLocation(element, direction);
  }

  get scrollableRef(): any {
    if (this.props.useNative) {
      return this.scrollableNativeRef.current!;
    }
    return this.scrollableSimulatedRef.current!;
  }
}
