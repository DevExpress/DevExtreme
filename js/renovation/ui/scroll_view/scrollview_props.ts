import {
  ComponentBindings, OneWay, Event, Slot,
} from 'devextreme-generator/component_declaration/common';
import { EventCallback } from '../common/event_callback.d';
import BaseWidgetProps from '../../utils/base_props';
import { ScrollViewDirection, ScrollEventArgs } from './types';

@ComponentBindings()
export class ScrollViewProps {
  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @OneWay() direction: ScrollViewDirection = 'vertical';

  @Event() onScroll?: EventCallback<ScrollEventArgs>;
}

export type ScrollViewPropsType = ScrollViewProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;
