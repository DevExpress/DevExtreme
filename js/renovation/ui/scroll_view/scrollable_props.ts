import {
  ComponentBindings, OneWay, Event, Slot,
} from 'devextreme-generator/component_declaration/common';
import { EventCallback } from '../common/event_callback.d';
import BaseWidgetProps from '../../utils/base_props';
import { ScrollableDirection, ScrollableShowScrollbar, ScrollEventArgs } from './types.d';

import { TopPocketProps } from './topPocket_props';
import { BottomPocketProps } from './bottomPocket_props';

@ComponentBindings()
export class ScrollableInternalProps {
  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @OneWay() direction: ScrollableDirection = 'vertical';

  @OneWay() showScrollbar: ScrollableShowScrollbar = 'onScroll';

  @OneWay() scrollByThumb = false;

  @OneWay() useSimulatedScrollbar = false;

  @OneWay() classes?: string;

  @OneWay() forceGeneratePockets = false;

  @OneWay() needScrollViewContentWrapper = false;

  @Event() onScroll?: EventCallback<ScrollEventArgs>;
}

@ComponentBindings()
export class ScrollableProps extends ScrollableInternalProps {
  @OneWay() useNative = false;

  @OneWay() pullingDownText?: string;

  @OneWay() pulledDownText?: string;

  @OneWay() refreshingText?: string;

  @OneWay() reachBottomText?: string;
}

export type ScrollableInternalPropsType = ScrollableInternalProps
& Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>
& Pick<TopPocketProps, 'pullingDownText' | 'pulledDownText' | 'refreshingText'>
& Pick<BottomPocketProps, 'reachBottomText'>;

export type ScrollablePropsType = ScrollableProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;
