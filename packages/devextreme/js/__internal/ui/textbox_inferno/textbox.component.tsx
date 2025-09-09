import Guid from '@js/core/guid';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';
import withMethods from '@ts/ui/textbox_inferno/textbox.methods_hoc';
import type { TextBoxProps } from '@ts/ui/textbox_inferno/textbox.types';

class InfernoTextBoxComponent extends BaseInfernoComponent<TextBoxProps> {
  render(): JSX.Element {
    const {
      name,
      label,
      placeholder,
      value,
      onChange,
      onInput,
    } = this.props;

    const id = new Guid().toString();

    return (
      <div className="inferno-textbox">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="text"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onInput={onInput}
          className="textbox"/>
      </div>
    );
  }
}

// @ts-ignore
export const InfernoTextBoxComponentWithHOC = withMethods(InfernoTextBoxComponent);
