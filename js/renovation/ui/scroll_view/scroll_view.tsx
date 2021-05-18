import {
  Component,
  JSXComponent,
  Ref,
  Method,
  RefObject,
  ComponentBindings,
  InternalState,
} from '@devextreme-generator/declarations';

import { ScrollViewWrapper } from '../../component_wrapper/scroll_view';
import { current, isMaterial } from '../../../ui/themes';
import { isDefined } from '../../../core/utils/type';

import {
  Scrollable,
  defaultOptionRules,
} from './scrollable';

import {
  ScrollOffset,
} from './types.d';

import { BaseWidgetProps } from '../common/base_props';
import {
  ScrollableProps,
} from './scrollable_props';
import { WidgetProps } from '../common/widget';
import { ScrollableNativeProps } from './scrollable_native';
import { ScrollableSimulatedProps } from './scrollable_simulated_props';

export const viewFunction = (viewModel: ScrollView): JSX.Element => {
  const {
    pulledDownText,
    refreshingText,
    pullingDownText,
    reachBottomText,
    scrollableRef,
    reachBottomEnabled,
    props: {
      useNative, children,
      aria, disabled, width, height, visible, rtlEnabled,
      direction, showScrollbar, scrollByThumb, bounceEnabled,
      scrollByContent, useKeyboard, updateManually, pullDownEnabled,
      useSimulatedScrollbar, inertiaEnabled,
      onScroll, onUpdated, onPullDown, onReachBottom, onStart, onEnd, onBounce,
    },
    restAttributes,
  } = viewModel;

  return (
    <Scrollable
      useNative={useNative}
      classes="dx-scrollview"
      ref={scrollableRef}
      aria={aria}
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
      onScroll={onScroll}
      onUpdated={onUpdated}
      onPullDown={onPullDown}
      onReachBottom={onReachBottom}
      pulledDownText={pulledDownText}
      pullingDownText={pullingDownText}
      refreshingText={refreshingText}
      reachBottomText={reachBottomText}
      forceGeneratePockets
      needScrollViewContentWrapper
      needScrollViewLoadPanel
      // Native
      useSimulatedScrollbar={useSimulatedScrollbar}
      // Simulated
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
    </Scrollable>
  );
};

@ComponentBindings()
export class ScrollViewProps extends ScrollableProps {}

type ScrollViewPropsType =
Omit<ScrollableProps, 'forceGeneratePockets' | 'needScrollViewContentWrapper' | 'needScrollViewLoadPanel'>
& Pick<WidgetProps, 'aria'>
& Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height' | 'visible'>
& Pick<ScrollableNativeProps, 'useSimulatedScrollbar'>
& Pick<ScrollableSimulatedProps, 'inertiaEnabled' | 'useKeyboard' | 'onStart' | 'onEnd' | 'onBounce'>;

@Component({
  defaultOptionRules,
  jQuery: {
    register: true,
    component: ScrollViewWrapper,
  },
  view: viewFunction,
})

export class ScrollView extends JSXComponent<ScrollViewPropsType>() {
  @Ref() scrollableRef!: RefObject<Scrollable>;

  @InternalState() forceReachBottom?: boolean;

  @Method()
  update(): void {
    this.scrollable.update();
  }

  @Method()
  release(): void {
    this.scrollable.release();
  }

  @Method()
  refresh(): void {
    if (this.props.pullDownEnabled) {
      this.scrollable.refresh();
    }
  }

  @Method()
  content(): HTMLDivElement {
    return this.scrollable.content();
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollOffset>): void {
    this.scrollable.scrollBy(distance);
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollOffset>): void {
    this.scrollable.scrollTo(targetLocation);
  }

  @Method()
  scrollToElement(element: HTMLElement): void {
    this.scrollable.scrollToElement(element);
  }

  @Method()
  scrollToElementTopLeft(element: HTMLElement): void {
    this.scrollable.scrollToElementTopLeft(element);
  }

  @Method()
  scrollHeight(): number {
    return this.scrollable.scrollHeight();
  }

  @Method()
  scrollWidth(): number {
    return this.scrollable.scrollWidth();
  }

  @Method()
  scrollOffset(): ScrollOffset {
    return this.scrollable.scrollOffset();
  }

  @Method()
  scrollTop(): number {
    return this.scrollable.scrollTop();
  }

  @Method()
  scrollLeft(): number {
    return this.scrollable.scrollLeft();
  }

  @Method()
  clientHeight(): number {
    return this.scrollable.clientHeight();
  }

  @Method()
  clientWidth(): number {
    return this.scrollable.clientWidth();
  }

  @Method()
  /* istanbul ignore next */
  // TODO: avoid using this method in List
  toggleLoading(showOrHide: boolean): void {
    this.forceReachBottom = showOrHide;
  }

  @Method()
  /* istanbul ignore next */
  // TODO: avoid using this method in List
  isFull(): boolean {
    return this.content().clientHeight > this.clientHeight();
    // TODO: this.clientHeight() should be containerRef.current.clientHeight
  }

  get reachBottomEnabled(): boolean {
    /* istanbul ignore next */
    if (isDefined(this.forceReachBottom)) {
      return this.forceReachBottom;
    }
    return this.props.reachBottomEnabled;
  }

  get pullingDownText(): string | undefined {
    const { pullingDownText } = this.props;

    if (isDefined(pullingDownText)) {
      return pullingDownText;
    }

    return isMaterial(current()) ? '' : undefined;
  }

  get pulledDownText(): string | undefined {
    const { pulledDownText } = this.props;

    if (isDefined(pulledDownText)) {
      return pulledDownText;
    }

    return isMaterial(current()) ? '' : undefined;
  }

  get refreshingText(): string | undefined {
    const { refreshingText } = this.props;

    if (isDefined(refreshingText)) {
      return refreshingText;
    }

    return isMaterial(current()) ? '' : undefined;
  }

  get reachBottomText(): string | undefined {
    const { reachBottomText } = this.props;

    if (isDefined(reachBottomText)) {
      return reachBottomText;
    }

    return isMaterial(current()) ? '' : undefined;
  }

  get scrollable(): any {
    return this.scrollableRef.current!;
  }
}
