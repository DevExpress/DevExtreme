import {
  Component,
  JSXComponent,
  Ref,
  ComponentBindings,
  Method,
  RefObject,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

import { createDefaultOptionRules } from '../../../core/options/utils';
import devices from '../../../core/devices';

import {
  Scrollable,
} from './scrollable';

import {
  ScrollableProps,
} from './scrollable_props';

import {
  ScrollableLocation, ScrollOffset, RefreshStrategy,
} from './types.d';

import BaseWidgetProps from '../../utils/base_props';
import { combineClasses } from '../../utils/combine_classes';

export const viewFunction = (viewModel: ScrollView): JSX.Element => {
  const {
    cssClasses,
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
      forceGeneratePockets
      needScrollViewContentWrapper
    />
  );
};
@ComponentBindings()
export class ScrollViewProps extends ScrollableProps {
  @OneWay() refreshStrategy: RefreshStrategy = 'pullDown';
}

export type ScrollViewPropsType = ScrollViewProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;

export const defaultOptionRules = createDefaultOptionRules<ScrollViewProps>([{
  device: (): boolean => devices.real().platform === 'android',
  options: { refreshStrategy: 'swipeDown' },
}]);
@Component({
  defaultOptionRules,
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
}
