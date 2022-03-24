import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, React, Event,
} from '@devextreme-generator/declarations';
import LegacySwitch from '../../../ui/switch';
import { EventCallback } from '../common/event_callback';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import messageLocalization from '../../../localization/message';
import devices from '../../../core/devices';

export const viewFunction = ({
  componentProps,
  restAttributes,
}: Switch): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacySwitch}
    componentProps={componentProps}
    templateNames={[]}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class SwitchProps extends EditorProps {
  @OneWay() switchedOnText?: string = messageLocalization.format('dxSwitch-switchedOnText');

  @OneWay() switchedOffText?: string = messageLocalization.format('dxSwitch-switchedOffText');

  @TwoWay() value = false;

  @Event() valueChange?: EventCallback<boolean>;

  @OneWay() hoverStateEnabled = true;

  @OneWay() activeStateEnabled = true;

  @OneWay() focusStateEnabled = devices.real().deviceType === 'desktop' && !devices.isSimulator();
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Switch extends JSXComponent(SwitchProps) {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): SwitchProps {
    return this.props;
  }
}
