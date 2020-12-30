import {
  Component,
  JSXComponent,
  Ref,
  Method,
  RefObject,
} from 'devextreme-generator/component_declaration/common';

import Themes from '../../../ui/themes';

import {
  Scrollable,
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
      forceGeneratePockets
      needScrollViewContentWrapper
    />
  );
};
@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class ScrollView extends JSXComponent<ScrollViewPropsType>() {
  @Ref() scrollableRef!: RefObject<Scrollable>;

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
    // eslint-disable-next-line import/no-named-as-default-member
    return this.props.pullingDownText || (Themes.isMaterial(Themes.current()) ? '' : undefined);
  }

  get pulledDownText(): string | undefined {
    // eslint-disable-next-line import/no-named-as-default-member
    return this.props.pulledDownText || (Themes.isMaterial(Themes.current()) ? '' : undefined);
  }

  get refreshingText(): string | undefined {
    // eslint-disable-next-line import/no-named-as-default-member
    return this.props.refreshingText || (Themes.isMaterial(Themes.current()) ? '' : undefined);
  }
}
