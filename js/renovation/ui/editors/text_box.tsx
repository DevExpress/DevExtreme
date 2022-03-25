import {
  Component, ComponentBindings, JSXComponent, OneWay, TwoWay, React, Event,
} from '@devextreme-generator/declarations';
import LegacyTextBox from '../../../ui/text_box';
import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { EventCallback } from '../common/event_callback';
import { EditorProps } from './internal/editor';
import { EditorStateProps } from './internal/editor_state_props';
import { isMaterial, current } from '../../../ui/themes';

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

  @OneWay() inputAttr?: unknown;

  @OneWay() label?: string = '';

  @OneWay() labelMode?: 'static' | 'floating' | 'hidden' = isMaterial(current()) ? 'floating' : 'static';

  @OneWay() mask?: string = '';

  @OneWay() maskChar?: string = '_';

  @OneWay() maskInvalidMessage?: string = 'Value is invalid';

  @OneWay() maskRules?: unknown = {};

  @OneWay() maxLength?: string | number | null = null;

  @OneWay() mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url' = 'text';

  @OneWay() showClearButton?: boolean = false;

  @OneWay() showMaskMode?: 'always' | 'onFocus' = 'always';

  @OneWay() spellCheck?: boolean = false;

  @OneWay() stylingMode?: 'outlined' | 'underlined' | 'filled' = isMaterial(current()) ? 'filled' : 'outlined';

  @OneWay() useMaskedValue?: boolean = false;

  // overrides
  @TwoWay() value = '';

  @Event() valueChange?: EventCallback<string>;
}

export type TextBoxPropsType = TextBoxProps & EditorStateProps;
@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class TextBox extends JSXComponent<TextBoxPropsType>() {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): TextBoxProps {
    return this.props;
  }
}
