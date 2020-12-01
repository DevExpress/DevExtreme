import {
  Component,
  JSXComponent,
  Method,
  Ref,
} from 'devextreme-generator/component_declaration/common';

import {
  Scrollable,
} from './scroll_view/scrollable';

import {
  ScrollablePropsType,
} from './scroll_view/common/scrollable_props';

import { combineClasses } from '../utils/combine_classes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCssClasses = (model: ScrollablePropsType): string => combineClasses({
  'dx-scrollview': true,
});

export const viewFunction = ({
  scrollableRef,
  cssClasses,
  props: {
    children, direction, height, width, onScroll, showScrollbar, useNative,
  },
  restAttributes,
}: ScrollView): JSX.Element => (
  <Scrollable
    classes={cssClasses}
    ref={scrollableRef as any}
    height={height}
    width={width}
    direction={direction}
    onScroll={onScroll}
    useNative={useNative}
    showScrollbar={showScrollbar}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    {children}
  </Scrollable>
);

@Component({
  jQuery: { register: true },
  view: viewFunction,
})

export class ScrollView extends JSXComponent<ScrollablePropsType>() {
  @Ref() scrollableRef!: Scrollable;

  @Method()
  content(): HTMLDivElement {
    return this.scrollableRef.content();
  }

  @Method()
  scrollBy(distance: any): void { // number | Partial<ScrollableLocation> - https://github.com/DevExpress/devextreme-renovation/issues/519
    this.scrollableRef.scrollBy(distance);
  }

  @Method()
  scrollTo(targetLocation: any): void { // number | Partial<ScrollableLocation> - https://github.com/DevExpress/devextreme-renovation/issues/519
    this.scrollableRef.scrollTo(targetLocation);
  }

  @Method()
  scrollToElement(element: HTMLElement, offset?: any): void { // Partial<ScrollOffset> - https://github.com/DevExpress/devextreme-renovation/issues/519
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
  scrollOffset(): any { // ScrollableLocation - https://github.com/DevExpress/devextreme-renovation/issues/519
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
    return getCssClasses(this.props);
  }
}
