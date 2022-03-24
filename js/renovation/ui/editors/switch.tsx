import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, React,
} from '@devextreme-generator/declarations';
import LegacySwitch from '../../../ui/switch';
import { Editor, EditorProps } from './editor_wrapper';
import messageLocalization from '../../../localization/message';

export const viewFunction = ({
  componentProps,
  restAttributes,
}: Switch): JSX.Element => (
  <Editor
    componentType={LegacySwitch}
    componentProps={componentProps}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class SwitchProps extends EditorProps {
  @OneWay() switchedOnText?: string = messageLocalization.format('dxSwitch-switchedOnText');

  @OneWay() switchedOffText?: string = messageLocalization.format('dxSwitch-switchedOffText');

  @TwoWay() value = false;
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
