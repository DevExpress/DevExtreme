import {
  Component,
  JSXComponent,
  Ref,
  Method,
  RefObject,
} from '@devextreme-generator/declarations';

// eslint-disable-next-line import/default
import Themes from '../../../ui/themes';
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

export const viewFunction = (viewModel: ScrollView): JSX.Element => {
  const {
    cssClasses,
    pulledDownText,
    refreshingText,
    pullingDownText,
    reachBottomText,
    scrollableRef,
    props,
    restAttributes,
  } = viewModel;

  return (
    <Scrollable
      classes={cssClasses}
      ref={scrollableRef}
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
    />
  );
};
@Component({
  defaultOptionRules,
  jQuery: { register: true },
  view: viewFunction,
})

export class ScrollView extends JSXComponent<ScrollViewPropsType>() {
  @Ref() scrollableRef!: RefObject<Scrollable>;

  @Method()
  content(): HTMLDivElement {
    return this.scrollableRef.current!.content();
  }

  @Method()
  scrollBy(distance: number | Partial<ScrollableLocation>): void {
    this.scrollableRef.current!.scrollBy(distance);
  }

  @Method()
  scrollTo(targetLocation: number | Partial<ScrollableLocation>): void {
    this.scrollableRef.current!.scrollTo(targetLocation);
  }

  @Method()
  scrollToElement(element: HTMLElement, offset?: Partial<ScrollOffset>): void {
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
  scrollOffset(): ScrollableLocation {
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

    // eslint-disable-next-line import/no-named-as-default-member
    return Themes.isMaterial(Themes.current()) ? '' : undefined;
  }

  get pulledDownText(): string | undefined {
    const { pulledDownText } = this.props;

    if (isDefined(pulledDownText)) {
      return pulledDownText;
    }

    // eslint-disable-next-line import/no-named-as-default-member
    return Themes.isMaterial(Themes.current()) ? '' : undefined;
  }

  get refreshingText(): string | undefined {
    const { refreshingText } = this.props;

    if (isDefined(refreshingText)) {
      return refreshingText;
    }

    // eslint-disable-next-line import/no-named-as-default-member
    return Themes.isMaterial(Themes.current()) ? '' : undefined;
  }

  get reachBottomText(): string | undefined {
    const { reachBottomText } = this.props;

    if (isDefined(reachBottomText)) {
      return reachBottomText;
    }

    // eslint-disable-next-line import/no-named-as-default-member
    return Themes.isMaterial(Themes.current()) ? '' : undefined;
  }
}
