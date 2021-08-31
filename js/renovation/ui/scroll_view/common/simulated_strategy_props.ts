import {
  ComponentBindings, OneWay, Event,
} from '@devextreme-generator/declarations';
import { EventCallback } from '../../common/event_callback';
import {
  BaseScrollableProps,
} from './base_scrollable_props';
import {
  ScrollEventArgs, ScrollableShowScrollbar,
} from './types.d';
import { isDesktop } from '../utils/get_default_option_value';

@ComponentBindings()
export class ScrollableSimulatedProps extends BaseScrollableProps {
  @OneWay() inertiaEnabled = true;

  @OneWay() useKeyboard = true;

  @OneWay() showScrollbar: ScrollableShowScrollbar = isDesktop() ? 'onHover' : 'onScroll';

  @OneWay() scrollByThumb = isDesktop();

  @Event() onVisibilityChange?: (args: boolean) => void;

  @Event() onStart?: EventCallback<ScrollEventArgs>;

  @Event() onEnd?: EventCallback<ScrollEventArgs>;

  @Event() onBounce?: EventCallback<ScrollEventArgs>;

  @Event()
  contentTranslateOffsetChange?: (scrollProp: 'left' | 'top', translateOffset: number) => void;

  @Event()
  scrollLocationChange?: (fullScrollProp: 'scrollLeft' | 'scrollTop', location: number) => void;

  @Event()
  pocketStateChange?: (newState: number) => void;
}
