import {
  Component,
  JSXComponent,
  Ref,
  Method,
  RefObject,
} from '@devextreme-generator/declarations';

import {
  ScrollableLocation, ScrollOffset,
} from './types.d';

import { BaseWidgetProps } from '../common/base_props';
import {
  ScrollableProps,
} from './scrollable_props';

import { ScrollableNative } from './scrollable_native';
import { ScrollableSimulated } from './scrollable_simulated';
import { createDefaultOptionRules } from '../../../core/options/utils';
import devices from '../../../core/devices';
import { nativeScrolling, touch } from '../../../core/utils/support';

export const viewFunction = (viewModel: Scrollable): JSX.Element => {
  const {
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

  return (useNative
    ? (
      <ScrollableNative
        ref={scrollableNativeRef}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...scrollableProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
        pulledDownText={pulledDownText}
        pullingDownText={pullingDownText}
        refreshingText={refreshingText}
        reachBottomText={reachBottomText}
      />
    )
    : (
      <ScrollableSimulated
        ref={scrollableSimulatedRef}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...scrollableProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
        pulledDownText={pulledDownText}
        pullingDownText={pullingDownText}
        refreshingText={refreshingText}
        reachBottomText={reachBottomText}
      />
    )
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
  update(): void {
    this.scrollableRef.update();
  }

  @Method()
  release(): void {
    return this.scrollableRef.release();
  }

  @Method()
  refresh(): void {
    this.scrollableRef.refresh();
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

  @Method()
  validate(e: Event): boolean {
    return this.scrollableRef.validate(e);
  }

  get scrollableRef(): any {
    if (this.props.useNative) {
      return this.scrollableNativeRef.current!;
    }
    return this.scrollableSimulatedRef.current!;
  }
}
