import {
  ComponentBindings, OneWay, Slot, Event,
} from '@devextreme-generator/declarations';
import { EventCallback } from '../common/event_callback.d';
import { ScrollableDirection, ScrollableShowScrollbar, ScrollEventArgs } from './types.d';

@ComponentBindings()
export class ScrollableInternalProps {
  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @OneWay() direction: ScrollableDirection = 'vertical';

  @OneWay() showScrollbar: ScrollableShowScrollbar = 'onScroll';

  @OneWay() scrollByThumb = false;

  @OneWay() bounceEnabled = true;

  @OneWay() scrollByContent = true;

  @OneWay() useKeyboard = true;

  @OneWay() classes?: string;

  @OneWay() forceGeneratePockets = false;

  @OneWay() needScrollViewContentWrapper = false;

  @Event() onScroll?: EventCallback<ScrollEventArgs>;

  @Event() onUpdated?: EventCallback<ScrollEventArgs>;
}

@ComponentBindings()
export class ScrollableProps extends ScrollableInternalProps {
  @OneWay() useNative = true;

  @OneWay() pullingDownText?: string;

  @OneWay() pulledDownText?: string;

  @OneWay() refreshingText?: string;

  @OneWay() reachBottomText?: string;
}
