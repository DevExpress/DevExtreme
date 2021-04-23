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

@ComponentBindings()
export class ScrollableSimulatedProps extends ScrollableProps {
  @OneWay() inertiaEnabled = true;

  @Event() onStart?: EventCallback<ScrollEventArgs>;

  @Event() onEnd?: EventCallback<ScrollEventArgs>;

  @Event() onBounce?: EventCallback<ScrollEventArgs>;

  @Event() onStop?: EventCallback<ScrollEventArgs>;

  @Event()
  contentTranslateOffsetChange?: EventCallback<{ left?: number; top?: number }>;

  @Event()
  contentPositionChange?: (scrollProp: 'scrollLeft' | 'scrollTop', location: number, ratio: number) => void;
}

export type ScrollableSimulatedPropsType = ScrollableSimulatedProps
& Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height' | 'onKeyDown' | 'visible' >
& Pick<TopPocketProps, 'pullingDownText' | 'pulledDownText' | 'refreshingText'>
& Pick<BottomPocketProps, 'reachBottomText'>;
