import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, React,
} from '@devextreme-generator/declarations';
import LegacyNumberBox from '../../../ui/number_box';
import { Editor, EditorProps } from './editor_wrapper';

const DEFAULT_VALUE = 0;

export const viewFunction = ({
  componentProps,
  restAttributes,
}: NumberBox): JSX.Element => (
  <Editor
    componentType={LegacyNumberBox}
    componentProps={componentProps}
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
