import { RadioGroup } from '@devextreme/react';
import { cloneElement, ReactElement, useContext } from 'react';
import { FormContext } from '../contexts/form-context';
import { ValidationContext } from '../contexts/validation-context';
import { useFormItemLayout } from '../hooks/use-form-item-layout';
import { FormItemProps } from '../types';
import { Validator } from '../validator';

export function FormItem({ name, children }: FormItemProps) {
  const formContext = useContext(FormContext);
  const validationContext = useContext(ValidationContext);
  const { label, hint, editor } = useFormItemLayout(children, [RadioGroup]);

  const onEditorValueChanged = (value: unknown) => {
    formContext?.onValueChanged(name, value);
  };

  const renderValidation = () => (
    <span>{validationContext?.validationResult?.[name]?.join('. ')}</span>
  );

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
      <span>{renderValidation()}</span>
      <Validator name={name}>{children}</Validator>
    </div>
  );
}
