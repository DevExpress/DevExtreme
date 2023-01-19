import { RadioGroup } from '@devextreme/react';
import { cloneElement, ReactElement, useContext } from 'react';
import { FormContext } from '../contexts/form-context';
import { ValidationContext } from '../contexts/validation-context';
import { useFormItemLayout } from '../hooks/use-form-item-layout';
import { useEditorValidationRulesInitialization } from '../hooks/use-validation-rules-extractor';
import { FormItemProps } from '../types';

export function FormItem({ name, children }: FormItemProps) {
  const formContext = useContext(FormContext);
  const validationContext = useContext(ValidationContext);
  const { label, hint, editor } = useFormItemLayout(children, [RadioGroup]);
  useEditorValidationRulesInitialization(name, children);

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
    </div>
  );
}
