import {
  Component,
  JSXComponent,
  Ref,
  Method,
  Fragment,
} from 'devextreme-generator/component_declaration/common';

import {
  ScrollableLocation, ScrollOffset,
} from './types.d';

import {
  ScrollablePropsType,
  ScrollableInternalPropsType,
} from './scrollable_props';

import { ScrollableNative } from './scrollable_native';
import { ScrollableSimulated } from './scrollable_simulated';

export const viewFunction = (viewModel: Scrollable): JSX.Element => {
  const {
    scrollableRef,
    scrollableProps,
    props: {
      useNative,
    },
    restAttributes,
  } = viewModel;

  return (
    <Fragment>
      {/* TODO: ADD IDs / Vue adds <div>, Angular adds wrapper as <div> */}
      {useNative && (
      <ScrollableNative
        ref={scrollableRef as any}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...scrollableProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
      />
      )}
      {!useNative && (
      <ScrollableSimulated
        ref={scrollableRef as any}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...scrollableProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
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
  @Ref() scrollableRef!: ScrollableNative;

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

  get scrollableProps(): ScrollableInternalPropsType {
    const { useNative, ...restProps } = this.props;

    return restProps;
  }
}
