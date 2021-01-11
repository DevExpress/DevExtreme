import {
  Component,
  JSXComponent,
  Ref,
  Method,
  Fragment,
  RefObject,
} from 'devextreme-generator/component_declaration/common';

import { combineClasses } from '../../utils/combine_classes';
import {
  ScrollableLocation, ScrollOffset,
} from './types.d';

import {
  ScrollablePropsType,
} from './scrollable_props';

import { ScrollableNative } from './scrollable_native';
import { ScrollableSimulated } from './scrollable_simulated';

export const viewFunction = (viewModel: Scrollable): JSX.Element => {
  const {
    cssClasses,
    scrollableRef,
    props: {
      useNative,
      pulledDownText,
      pullingDownText,
      pushBackValue,
      refreshingText,
      reachBottomText,
      ...scrollableProps
    },
    restAttributes,
  } = viewModel;

  return (
    <Fragment>
      {useNative && (
      <ScrollableNative
        ref={scrollableRef}
        classes={cssClasses}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...scrollableProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
        pushBackValue={pushBackValue}
        pulledDownText={pulledDownText}
        pullingDownText={pullingDownText}
        refreshingText={refreshingText}
        reachBottomText={reachBottomText}
      />
      )}
      {!useNative && (
      <ScrollableSimulated
        ref={scrollableRef}
        classes={cssClasses}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...scrollableProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
        pulledDownText={pulledDownText}
        pullingDownText={pullingDownText}
        refreshingText={refreshingText}
        reachBottomText={reachBottomText}
      />
      )}
    </Fragment>
  );
};

@Component({
  jQuery: { register: true },
  view: viewFunction,
})

export class Scrollable extends JSXComponent<ScrollablePropsType>() {
  @Ref() scrollableRef!: RefObject<ScrollableNative>;

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

  get cssClasses(): string {
    const { classes } = this.props;

    return combineClasses({
      [`${classes}`]: !!classes,
    });
  }
}
