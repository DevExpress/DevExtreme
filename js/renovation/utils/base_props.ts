import {
  Event, OneWay, ComponentBindings,
} from 'devextreme-generator/component_declaration/common';

@ComponentBindings()
export class BaseWidgetProps {
  @OneWay() accessKey?: string;

  @OneWay() activeStateEnabled?: boolean = false;

  @OneWay() disabled?: boolean = false;

  @OneWay() focusStateEnabled?: boolean = false;

  @OneWay() height?: string | number | (() => (string | number));

  @OneWay() hint?: string;

  @OneWay() hoverStateEnabled?: boolean = false;

  @Event() onClick?: (e: any) => void;

  @Event({
    actionConfig: { excludeValidators: ['disabled', 'readOnly'] },
  }) onContentReady?: (e: any) => any;

  @Event() onKeyDown?: (e: any) => any;

  @OneWay() rtlEnabled?: boolean;

  @OneWay() tabIndex?: number = 0;

  @OneWay() visible?: boolean = true;

  @OneWay() width?: string | number | (() => (string | number));
}
