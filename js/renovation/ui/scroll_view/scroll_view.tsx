import {
  Component,
  JSXComponent,
  Ref,
  Method,
  RefObject,
  InternalState,
} from '@devextreme-generator/declarations';

import { ScrollViewWrapper } from '../../component_wrapper/navigation/scroll_view';
import { isDefined } from '../../../core/utils/type';

import {
  Scrollable,
} from './scrollable';

import {
  ElementOffset,
  ScrollOffset,
} from './common/types';

import { ScrollViewProps } from './common/scrollview_props';
import { ScrollViewLoadPanel } from './internal/load_panel';

export const viewFunction = (viewModel: ScrollView): JSX.Element => {
  const {
    scrollableRef,
    reachBottomEnabled,
    props: {
      useNative, children,
      aria, disabled, width, height, visible, rtlEnabled,
      direction, showScrollbar, scrollByThumb, bounceEnabled,
      scrollByContent, useKeyboard, pullDownEnabled,
      useSimulatedScrollbar, inertiaEnabled,
      onScroll, onUpdated, onPullDown, onReachBottom, onStart, onEnd, onBounce,
      pulledDownText, refreshingText, pullingDownText, reachBottomText, refreshStrategy,
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
      pullDownEnabled={pullDownEnabled}
      reachBottomEnabled={reachBottomEnabled}
      onScroll={onScroll}
      onUpdated={onUpdated}
      onPullDown={onPullDown}
      onReachBottom={onReachBottom}
      refreshStrategy={refreshStrategy}
      pulledDownText={pulledDownText}
      pullingDownText={pullingDownText}
      refreshingText={refreshingText}
      reachBottomText={reachBottomText}
      forceGeneratePockets
      needScrollViewContentWrapper
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
      loadPanelTemplate={ScrollViewLoadPanel}

      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    >
      {children}
    </Scrollable>
  );
};

@Component({
  defaultOptionRules: null,
  jQuery: {
    register: true,
    component: ScrollViewWrapper,
  },
  view: viewFunction,
})

export class ScrollView extends JSXComponent<ScrollViewProps>() {
  @Ref() scrollableRef!: RefObject<Scrollable>;

  @InternalState() forceReachBottom?: boolean;

  @Method()
  release(preventScrollBottom: boolean): void {
    if (preventScrollBottom !== undefined) {
      this.toggleLoading(!preventScrollBottom);
    }

    this.scrollableRef.current!.release();
  }

  @Method()
  refresh(): void {
    if (this.props.pullDownEnabled) {
      this.scrollableRef.current!.refresh();
    }
  }

  @Method()
  content(): HTMLDivElement {
    return this.scrollableRef.current!.content();
  }

  @Method()
  container(): HTMLDivElement {
    return this.scrollableRef.current!.container();
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollOffset>): void {
    this.scrollableRef.current!.scrollBy(distance);
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollOffset>): void {
    this.scrollableRef.current!.scrollTo(targetLocation);
  }

  @Method()
  scrollToElement(element: HTMLElement, offset?: ElementOffset): void {
    this.scrollableRef.current!.scrollToElement(element, offset);
  }

  @Method()
  scrollHeight(): number {
    return this.scrollableRef.current!.scrollHeight();
  }

  @Method()
  scrollWidth(): number {
    return this.scrollableRef.current!.scrollWidth();
  }

  @Method()
  scrollOffset(): ScrollOffset {
    return this.scrollableRef.current!.scrollOffset();
  }

  @Method()
  scrollTop(): number {
    return this.scrollableRef.current!.scrollTop();
  }

  @Method()
  scrollLeft(): number {
    return this.scrollableRef.current!.scrollLeft();
  }

  @Method()
  clientHeight(): number {
    return this.scrollableRef.current!.clientHeight();
  }

  @Method()
  clientWidth(): number {
    return this.scrollableRef.current!.clientWidth();
  }

  @Method()
  toggleLoading(showOrHide: boolean): void {
    this.forceReachBottom = showOrHide;
  }

  @Method()
  startLoading(): void {
    this.scrollableRef.current!.startLoading();
  }

  @Method()
  finishLoading(): void {
    this.scrollableRef.current!.finishLoading();
  }

  @Method()
  updateHandler(): void {
    this.scrollableRef.current!.updateHandler();
  }

  get reachBottomEnabled(): boolean {
    if (isDefined(this.forceReachBottom)) {
      return this.forceReachBottom;
    }
    return this.props.reachBottomEnabled;
  }
}
