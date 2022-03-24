import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, React, Event,
} from '@devextreme-generator/declarations';
import LegacyNumberBox from '../../../ui/number_box';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { EventCallback } from '../common/event_callback';
import devices from '../../../core/devices';
import { EditorProps } from './internal/editor';

const DEFAULT_VALUE = 0;

export const viewFunction = ({
  componentProps,
  restAttributes,
}: NumberBox): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyNumberBox}
    componentProps={componentProps}
    templateNames={[]}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class NumberBoxProps extends EditorProps {
  @OneWay() invalidValueMessage?: string;

  @OneWay() max?: number;

  @OneWay() min?: number;

  @OneWay() mode?: 'number' | 'text' | 'tel';

  @OneWay() showSpinButtons?: boolean;

  @OneWay() step?: number;

  @OneWay() useLargeSpinButtons?: boolean;

  @TwoWay() value: number | null = DEFAULT_VALUE;

  @Event() valueChange?: EventCallback<number | null>;

  @OneWay() hoverStateEnabled = true;

  @OneWay() activeStateEnabled = true;

  @OneWay() focusStateEnabled = devices.real().deviceType === 'desktop' && !devices.isSimulator();
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class NumberBox extends JSXComponent(NumberBoxProps) {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): NumberBoxProps {
    return this.props;
  }
}
