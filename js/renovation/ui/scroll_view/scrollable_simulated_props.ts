import {
  ComponentBindings, OneWay, Event,
} from '@devextreme-generator/declarations';
import { EventCallback } from '../common/event_callback.d';
import {
  ScrollableProps,
} from './scrollable_props';
import { ScrollEventArgs } from './types.d';

import { BaseWidgetProps } from '../common/base_props';
import { TopPocketProps } from './top_pocket';
import { BottomPocketProps } from './bottom_pocket';
import { WidgetProps } from '../common/widget';

@ComponentBindings()
export class ScrollableSimulatedProps extends ScrollableProps {
  @OneWay() inertiaEnabled = true;

  @OneWay() useKeyboard = true;

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

export type ScrollableSimulatedPropsType = ScrollableSimulatedProps
& Pick<WidgetProps, 'aria'>
& Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height' | 'onKeyDown' | 'visible' >
& Pick<TopPocketProps, 'pullingDownText' | 'pulledDownText' | 'refreshingText'>
& Pick<BottomPocketProps, 'reachBottomText'>;
