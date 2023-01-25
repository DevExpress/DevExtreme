import { RadioGroup } from '@devextreme/react';
import { cloneElement, ReactElement, useContext } from 'react';
import { ValidationResult } from '../../../validation/components/validation-result';
import { Validator } from '../../../validation/components/validator';
import { FormContext } from '../contexts/form-context';
import { useFormItemLayout } from '../hooks/use-form-item-layout';
import { FormItemProps } from '../types';

export function FormItem({ name, children }: FormItemProps) {
  const formContext = useContext(FormContext);
  const { label, hint, editor } = useFormItemLayout(children, [RadioGroup]);

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
        })}
      </span>
      <ValidationResult editorName={name} />
      <Validator editorName={name}>{children}</Validator>
    </div>
  );
}
