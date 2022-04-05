import {
  Component, ComponentBindings, JSXComponent, OneWay, React,
} from '@devextreme-generator/declarations';
import LegacyTextArea from '../../../ui/text_area';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { EditorProps } from './common/editor';
import { EditorStateProps } from './common/editor_state_props';
import { EditorLabelProps } from './common/editor_label_props';
import { TextEditorProps } from './common/text_editor_props';

export const viewFunction = ({
  componentProps,
  restAttributes,
}: TextArea): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyTextArea}
    componentProps={componentProps}
    templateNames={[]}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@ComponentBindings()
export class TextAreaProps extends EditorProps {
  @OneWay() autoResizeEnabled?: boolean = false;
}

export type TextAreaPropsType = TextAreaProps
& EditorStateProps & EditorLabelProps & TextEditorProps;

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TextArea extends JSXComponent<TextAreaPropsType>() {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): TextAreaPropsType {
    return this.props;
  }
}
