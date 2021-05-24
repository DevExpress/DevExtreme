import {
  Event, OneWay, ComponentBindings, ForwardRef,
} from '@devextreme-generator/declarations';

@ComponentBindings()
export class BaseWidgetProps {
  // TODO Vitik workaround for: https://trello.com/c/0RkuDnxC/2752-renovation-unable-to-import-refobject-for-componentbinding-only
  @ForwardRef() rootElementRef?: {
    (instance: (HTMLDivElement) | null): void;
    current: HTMLDivElement | null;
  };// RefObject<HTMLDivElement>;

  @OneWay() className?: string = '';

  @OneWay() accessKey?: string;

  @OneWay() activeStateEnabled?: boolean = false;

  @OneWay() disabled?: boolean = false;

  @OneWay() focusStateEnabled?: boolean = false;

  @OneWay() height?: string | number | (() => (string | number));

  @OneWay() hint?: string;

  @OneWay() hoverStateEnabled?: boolean = false;

  @Event() onClick?: (e: any) => void;

  @Event() onKeyDown?: (e: any) => any;

  @OneWay() rtlEnabled?: boolean;

  @OneWay() tabIndex?: number = 0;

  @OneWay() visible?: boolean = true;

  @OneWay() width?: string | number | (() => (string | number));
}
