import {
  Component,
  JSXComponent,
  Ref,
  Method,
} from 'devextreme-generator/component_declaration/common';
import { Widget } from '../common/widget';

import {
  ScrollableLocation, ScrollOffset,
} from './types';

import {
  ScrollablePropsType,
} from './scrollable_props';

import { ScrollableNative } from './scrollable_native';
import { ScrollableSimulated } from './scrollable_simulated';

export const viewFunction = (viewModel: Scrollable): JSX.Element => {
  const {
    scrollableRef,
    props: {
      useNative, children,
    },
    restAttributes,
  } = viewModel;

  return (
    <Widget
      // useNative={useNative}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    >
      {useNative && (
      <ScrollableNative
        ref={scrollableRef as any}
      >
        {children}
      </ScrollableNative>
      )}
      {!useNative && (
      <ScrollableSimulated
        ref={scrollableRef as any}
      >
        {children}
      </ScrollableSimulated>
      )}
    </Widget>
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
}
