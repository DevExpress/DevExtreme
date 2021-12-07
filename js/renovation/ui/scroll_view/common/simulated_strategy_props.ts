import {
  ComponentBindings, OneWay, Event,
} from '@devextreme-generator/declarations';
import { EventCallback } from '../../common/event_callback';
import {
  BaseScrollableProps,
} from './base_scrollable_props';
import {
  ScrollEventArgs, ScrollableShowScrollbar, RefreshStrategy, ScrollLocationChangeArgs,
} from './types';
import { isDesktop } from '../utils/get_default_option_value';

@ComponentBindings()
export class ScrollableSimulatedProps extends BaseScrollableProps {
  @OneWay() inertiaEnabled = true;

  @OneWay() useKeyboard = true;

  @OneWay() showScrollbar: ScrollableShowScrollbar = isDesktop() ? 'onHover' : 'onScroll';

  @OneWay() scrollByThumb = isDesktop();

  @OneWay() refreshStrategy: RefreshStrategy = 'simulated';

  @Event() onVisibilityChange?: (visible: boolean) => void;

  @Event() onStart?: EventCallback<ScrollEventArgs>;

  @Event() onEnd?: EventCallback<ScrollEventArgs>;

  @Event() onBounce?: EventCallback<ScrollEventArgs>;

  @Event() scrollLocationChange?: EventCallback<ScrollLocationChangeArgs>;
}
