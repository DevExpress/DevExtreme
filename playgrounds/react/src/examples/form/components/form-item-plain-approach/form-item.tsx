import {
  Children,
  cloneElement, ReactElement, useContext,
} from 'react';
import { FormContext } from '../contexts/form-context';
import { RadioGroupEditor } from '../form-item-hoc-approach/radio-group-form-editor';
import { useFormItemLayout } from '../hooks/use-form-item-layout';
import { FormItemProps } from '../types';

export function FormItem({ name, children }: FormItemProps) {
  const formContext = useContext(FormContext);
  const {
    label, hint, editor, rest,
  } = useFormItemLayout(children, [RadioGroupEditor]);

  const onEditorValueChanged = (value: unknown) => {
    formContext?.onValueChanged(name, value);
  };

  return (
    <div>
      <span>{label}</span>
      <span>{hint}</span>
      <span>
        {/* We need to subscribe to different editors' valueChange.
        Also, we need to get their initial value somehow */}
        {cloneElement(editor as ReactElement, {
          valueChange: onEditorValueChanged,
          name,
        },
        ...(editor as ReactElement).props.children,
        ...Children.toArray(rest))}
      </span>
    </div>
  );
}
