import {
  Component, ComponentBindings, JSXComponent, OneWay, React,
} from '@devextreme-generator/declarations';
import LegacyTextBox from '../../../ui/text_box';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { EditorProps } from './internal/editor';
import { EditorStateProps } from './internal/editor_state_props';
import { EditorLabelProps } from './internal/editor_label_props';
import { TextEditorProps } from './internal/text_editor_props';

export const viewFunction = ({
  componentProps,
  restAttributes,
}: TextBox): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyTextBox}
    componentProps={componentProps}
    templateNames={[]}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class TextBoxProps extends EditorProps {
  @OneWay() buttons?: unknown[];

  @OneWay() mask?: string = '';

  @OneWay() maskChar?: string = '_';

  @OneWay() maskInvalidMessage?: string = 'Value is invalid';

  @OneWay() maskRules?: unknown = {};

  @OneWay() mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url' = 'text';

  @OneWay() showClearButton?: boolean = false;

  @OneWay() showMaskMode?: 'always' | 'onFocus' = 'always';

  @OneWay() useMaskedValue?: boolean = false;
}

export type TextBoxPropsType = TextBoxProps
& EditorStateProps & EditorLabelProps & TextEditorProps;
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TextBox extends JSXComponent<TextBoxPropsType>() {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): TextBoxPropsType {
    return this.props;
  }
}
