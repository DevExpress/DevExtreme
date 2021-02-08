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

import BaseWidgetProps from '../../utils/base_props';
import {
  ScrollableProps,
} from './scrollable_props';

import { ScrollableNative } from './scrollable_native';
import { ScrollableSimulated } from './scrollable_simulated';
import { createDefaultOptionRules } from '../../../core/options/utils';
import devices from '../../../core/devices';
import browser from '../../../core/utils/browser';
import { nativeScrolling, touch } from '../../../core/utils/support';

export const viewFunction = (viewModel: Scrollable): JSX.Element => {
  const {
    cssClasses,
    scrollableNativeRef,
    scrollableSimulatedRef,
    props: {
      useNative,
      pulledDownText,
      pullingDownText,
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
        ref={scrollableNativeRef}
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
      {!useNative && (
      <ScrollableSimulated
        ref={scrollableSimulatedRef}
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

type ScrollablePropsType = ScrollableProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;

export const defaultOptionRules = createDefaultOptionRules<ScrollablePropsType>([{
  device: (device): boolean => (!devices.isSimulator() && devices.real().deviceType === 'desktop' && device.platform === 'generic'),
  options: {
    bounceEnabled: false,
    scrollByContent: touch,
    scrollByThumb: true,
    showScrollbar: 'onHover',
  },
}, {
  device: (): boolean => !nativeScrolling,
  options: {
    useNative: false,
  },
}, {
  device: (): boolean => nativeScrolling && devices.real().platform === 'android' && !browser.mozilla,
  options: {
    useSimulatedScrollbar: true,
  },
}]);

@Component({
  defaultOptionRules,
  jQuery: { register: true },
  view: viewFunction,
})

export class Scrollable extends JSXComponent<ScrollablePropsType>() {
  @Ref() scrollableNativeRef!: RefObject<ScrollableNative>;

  @Ref() scrollableSimulatedRef!: RefObject<ScrollableSimulated>;

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get scrollableRef(): any {
    return this.scrollableNativeRef || this.scrollableSimulatedRef;
  }
}
