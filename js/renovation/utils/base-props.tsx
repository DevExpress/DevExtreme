import {
    Event, OneWay, ComponentBindings,
} from 'devextreme-generator/component_declaration/common';
import config from '../../core/config';

@ComponentBindings()
export class BaseWidgetProps {
    @OneWay() accessKey?: string | null = null;
    @OneWay() activeStateEnabled?: boolean = false;
    @OneWay() disabled?: boolean = false;
    @OneWay() elementAttr?: { [name: string]: any };
    @OneWay() focusStateEnabled?: boolean = false;
    @OneWay() height?: string | number | null = null;
    @OneWay() hint?: string;
    @OneWay() hoverStateEnabled?: boolean = false;
    @Event() onClick?: (e: any) => void;
    @Event({
        actionConfig: { excludeValidators: ['disabled', 'readOnly'] },
    }) onContentReady?: (e: any) => any = (() => {});
    @Event() onKeyDown?: (e: any, options: any) => any;
    @OneWay() rtlEnabled?: boolean = config().rtlEnabled;
    @OneWay() tabIndex?: number = 0;
    @OneWay() visible?: boolean = true;
    @OneWay() width?: string | number | null = null;
}
