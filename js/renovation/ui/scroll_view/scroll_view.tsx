import {
  Component,
  JSXComponent,
  Ref,
  Method,
  RefObject,
} from 'devextreme-generator/component_declaration/common';

import { createDefaultOptionRules } from '../../../core/options/utils';
import devices from '../../../core/devices';

import Themes from '../../../ui/themes';

import {
  Scrollable,
} from './scrollable';

import {
  ScrollableLocation, ScrollOffset,
} from './types.d';

import { combineClasses } from '../../utils/combine_classes';
import { ScrollViewProps, ScrollViewPropsType } from './scrollview_props';

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

export const defaultOptionRules = createDefaultOptionRules<ScrollViewProps>([{
  device: (): boolean => devices.real().platform === 'android',
  options: { refreshStrategy: 'swipeDown' },
}, {
  // eslint-disable-next-line import/no-named-as-default-member
  device: (): boolean => Themes.isMaterial(Themes.current()),
  options: {
    pullingDownText: '',
    pulledDownText: '',
    refreshingText: '',
    reachBottomText: '',
  },
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
