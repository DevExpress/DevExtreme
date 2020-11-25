import {
  Component,
  JSXComponent,
  Method,
  Ref,
} from 'devextreme-generator/component_declaration/common';

import {
  ScrollView,
  ScrollViewPropsType,
} from './scroll_view';

export const viewFunction = ({
  scrollViewRef,
  props: {
    children, direction, height, width, onScroll, showScrollbar,
  },
  restAttributes,
}: Scrollable): JSX.Element => (
  <ScrollView
    ref={scrollViewRef as any}
    height={height}
    width={width}
    direction={direction}
    onScroll={onScroll}
    showScrollbar={showScrollbar}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    {children}
  </ScrollView>
);

@Component({
  jQuery: { register: true },
  view: viewFunction,
})

export class Scrollable extends JSXComponent<ScrollViewPropsType>() {
  @Ref() scrollViewRef!: ScrollView;

  @Method()
  content(): HTMLDivElement {
    return this.scrollViewRef.content();
  }

  @Method()
  scrollBy(distance: any): void { // number | Partial<ScrollViewLocation> - https://github.com/DevExpress/devextreme-renovation/issues/519
    this.scrollViewRef.scrollBy(distance);
  }

  @Method()
  scrollTo(targetLocation: any): void { // number | Partial<ScrollViewLocation> - https://github.com/DevExpress/devextreme-renovation/issues/519
    this.scrollViewRef.scrollTo(targetLocation);
  }

  @Method()
  scrollToElement(element: HTMLElement, offset?: any): void { // Partial<ScrollOffset> - https://github.com/DevExpress/devextreme-renovation/issues/519
    this.scrollViewRef.scrollToElement(element, offset);
  }

  @Method()
  scrollHeight(): number {
    return this.scrollViewRef.scrollHeight();
  }

  @Method()
  scrollWidth(): number {
    return this.scrollViewRef.scrollWidth();
  }

  @Method()
  scrollOffset(): any { // ScrollViewLocation - https://github.com/DevExpress/devextreme-renovation/issues/519
    return this.scrollViewRef.scrollOffset();
  }

  @Method()
  scrollTop(): number {
    return this.scrollViewRef.scrollTop();
  }

  @Method()
  scrollLeft(): number {
    return this.scrollViewRef.scrollLeft();
  }

  @Method()
  clientHeight(): number {
    return this.scrollViewRef.clientHeight();
  }

  @Method()
  clientWidth(): number {
    return this.scrollViewRef.clientWidth();
  }
}
