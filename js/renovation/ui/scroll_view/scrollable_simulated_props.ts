import {
  ComponentBindings, OneWay, Event,
} from 'devextreme-generator/component_declaration/common';
import { EventCallback } from '../common/event_callback.d';
import {
  ScrollableProps,
} from './scrollable_props';
import { ScrollEventArgs } from './types.d';

import BaseWidgetProps from '../../utils/base_props';
import { TopPocketProps } from './top_pocket_props';
import { BottomPocketProps } from './bottom_pocket_props';

@ComponentBindings()
export class ScrollableSimulatedProps extends ScrollableProps {
  @OneWay() inertiaEnabled = true;

  @Event() onStart?: EventCallback<ScrollEventArgs>;

  @Event() onEnd?: EventCallback<ScrollEventArgs>;

  @Event() onBounce?: EventCallback<ScrollEventArgs>;

  @Event() onStop?: EventCallback<ScrollEventArgs>;
}

export type ScrollableSimulatedPropsType = ScrollableSimulatedProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height' | 'onKeyDown' | 'visible' >
& Pick<TopPocketProps, 'pullingDownText' | 'pulledDownText' | 'refreshingText'>
& Pick<BottomPocketProps, 'reachBottomText'>;
