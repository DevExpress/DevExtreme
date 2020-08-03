import {
  Event, OneWay, ComponentBindings,
} from 'devextreme-generator/component_declaration/common';
import config from '../../core/config';

@ComponentBindings()
export default class BaseWidgetProps {
  @OneWay() accessKey?: string | null = null;

  @OneWay() activeStateEnabled?: boolean = false;

  @OneWay() disabled?: boolean = false;

  @OneWay() focusStateEnabled?: boolean = false;

  @OneWay() height?: string | number | (() => (string | number));

  @OneWay() hint?: string;

  @OneWay() hoverStateEnabled?: boolean = false;

  @Event() onClick?: (e: any) => void;

  @Event({
    actionConfig: { excludeValidators: ['disabled', 'readOnly'] },
  }) onContentReady?: (e: any) => any = (() => {});

  @Event() onKeyDown?: (e: any) => any;

  @OneWay() rtlEnabled?: boolean = config().rtlEnabled;

  @OneWay() tabIndex?: number = 0;

  @OneWay() visible?: boolean = true;

  @OneWay() width?: string | number | (() => (string | number));
}
