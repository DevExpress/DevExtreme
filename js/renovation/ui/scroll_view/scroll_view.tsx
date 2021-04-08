import {
  Component,
  JSXComponent,
  Ref,
  Method,
  RefObject,
} from '@devextreme-generator/declarations';

import { current, isMaterial } from '../../../ui/themes';
import { isDefined } from '../../../core/utils/type';

import {
  Scrollable,
  defaultOptionRules,
} from './scrollable';

import {
  ScrollableLocation, ScrollOffset,
} from './types.d';

import { combineClasses } from '../../utils/combine_classes';
import { ScrollViewPropsType } from './scroll_view_props';
import { ScrollableSimulated } from './scrollable_simulated';

export const viewFunction = (viewModel: ScrollView): JSX.Element => {
  const {
    cssClasses,
    pulledDownText,
    refreshingText,
    pullingDownText,
    reachBottomText,
    scrollableNativeRef,
    scrollViewSimulatedRef,
    props,
    restAttributes,
  } = viewModel;

  return (viewModel.props.useNative
    ? (
      <Scrollable
        classes={cssClasses}
        ref={scrollableNativeRef}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
        pulledDownText={pulledDownText}
        pullingDownText={pullingDownText}
        refreshingText={refreshingText}
        reachBottomText={reachBottomText}
        forceGeneratePockets
        needScrollViewContentWrapper
        needScrollViewLoadPanel
      />
    )
    : (
      <ScrollableSimulated
        classes={cssClasses}
        ref={scrollViewSimulatedRef}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
        pulledDownText={pulledDownText}
        pullingDownText={pullingDownText}
        refreshingText={refreshingText}
        reachBottomText={reachBottomText}
        forceGeneratePockets
        needScrollViewContentWrapper
        needScrollViewLoadPanel
      />
    )
  );
};
@Component({
  defaultOptionRules,
  jQuery: { register: true },
  view: viewFunction,
})

export class ScrollView extends JSXComponent<ScrollViewPropsType>() {
  @Ref() scrollableNativeRef!: RefObject<Scrollable>;

  @Ref() scrollViewSimulatedRef!: RefObject<ScrollableSimulated>;

  @Method()
  update(): void {
    this.scrollableRef.update();
  }

  @Method()
  release(): void {
    this.scrollableRef.release();
  }

  @Method()
  refresh(): void {
    if (this.props.pullDownEnabled) {
      this.scrollableRef.refresh();
    }
  }

  @Method()
  content(): HTMLDivElement {
    return this.scrollableRef.content();
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollableLocation>): void {
    this.scrollableRef.scrollBy(distance);
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollableLocation>): void {
    this.scrollableRef.scrollTo(targetLocation);
  }

  @Method()
  scrollToElement(element: HTMLElement, offset?: Partial<ScrollOffset>): void {
    this.scrollableRef.scrollToElement(element, offset);
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
  scrollOffset(): ScrollableLocation {
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

  // eslint-disable-next-line class-methods-use-this
  get cssClasses(): string {
    return combineClasses({
      'dx-scrollview': true,
    });
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

  get scrollableRef(): any {
    if (this.props.useNative) {
      return this.scrollableNativeRef.current!;
    }
    return this.scrollViewSimulatedRef.current!;
  }
}
