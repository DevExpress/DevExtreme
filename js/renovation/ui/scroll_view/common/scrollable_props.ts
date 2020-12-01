import {
  ComponentBindings, OneWay, Event, Slot,
} from 'devextreme-generator/component_declaration/common';
import { EventCallback } from '../../common/event_callback.d';
import BaseWidgetProps from '../../../utils/base_props';

export type ScrollableDirection = 'both' | 'horizontal' | 'vertical';

export interface ScrollOffset {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface ScrollableBoundaryProps {
  reachedBottom: boolean;
  reachedLeft: boolean;
  reachedRight: boolean;
  reachedTop: boolean;
}

export interface ScrollEventArgs extends Partial<ScrollableBoundaryProps> {
  event: Event;
  scrollOffset: Partial<ScrollOffset>;
}

@ComponentBindings()
export class ScrollableProps {
  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @OneWay() className?: string;

  @OneWay() classes?: string;

  @OneWay() direction?: ScrollableDirection = 'vertical';

  @OneWay() showScrollbar?: boolean = true;

  @OneWay() useNative?: boolean = false;

  @Event() onScroll?: EventCallback<ScrollEventArgs>;

  @Event() onStart?: (e: Event) => void;
}

export type ScrollablePropsType = ScrollableProps & Pick<BaseWidgetProps, 'rtlEnabled' | 'disabled' | 'width' | 'height'>;
