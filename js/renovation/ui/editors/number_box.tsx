import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, React, Event,
} from '@devextreme-generator/declarations';
import LegacyNumberBox from '../../../ui/number_box';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { EventCallback } from '../common/event_callback';
import { EditorProps } from './common/editor';
import { EditorStateProps } from './common/editor_state_props';
import { EditorLabelProps } from './common/editor_label_props';

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
}

export type NumberBoxPropsType = NumberBoxProps & EditorStateProps & EditorLabelProps;
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class NumberBox extends JSXComponent<NumberBoxPropsType>() {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): NumberBoxPropsType {
    return this.props;
  }
}
