import {
  ComponentBindings, OneWay, Event, Slot,
} from 'devextreme-generator/component_declaration/common';
import { EventCallback } from '../common/event_callback.d';
import BaseWidgetProps from '../../utils/base_props';
import { ScrollableDirection, ScrollableShowScrollbar, ScrollEventArgs } from './types.d';

@ComponentBindings()
export class ScrollableInternalProps {
  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @OneWay() direction: ScrollableDirection = 'vertical';

  @OneWay() showScrollbar?: ScrollableShowScrollbar;

  @OneWay() classes?: string;

  @OneWay() forceGeneratePockets = false;

  @OneWay() needScrollViewContentWrapper = false;

  @Event() onScroll?: EventCallback<ScrollEventArgs>;
}

export type ScrollableInternalPropsType = ScrollableInternalProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;

@ComponentBindings()
export class ScrollableProps extends ScrollableInternalProps {
  @OneWay() useNative = false;
}

export type ScrollablePropsType = ScrollableProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;
