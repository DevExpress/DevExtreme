import {
  Event, OneWay, ComponentBindings, ForwardRef, RefObject,
} from '@devextreme-generator/declarations';
import { EventCallback } from './event_callback';

@ComponentBindings()
export class BaseWidgetProps {
  @ForwardRef() rootElementRef!: RefObject<HTMLDivElement>;

  @OneWay() className?: string = '';

  @OneWay() accessKey?: string;

  @OneWay() activeStateEnabled?: boolean = false;

  @OneWay() disabled?: boolean = false;

  @OneWay() focusStateEnabled?: boolean = false;

  @OneWay() height?: string | number | (() => (string | number));

  @OneWay() hint?: string;

  @OneWay() hoverStateEnabled?: boolean = false;

  @Event() onClick?: EventCallback<Event>;

  @Event() onKeyDown?: EventCallback<Event>;

  @OneWay() rtlEnabled?: boolean;

  @OneWay() tabIndex?: number = 0;

  @OneWay() visible?: boolean = true;

  @OneWay() width?: string | number | (() => (string | number));
}
