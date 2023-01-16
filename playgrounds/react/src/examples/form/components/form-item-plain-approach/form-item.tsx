import { RadioGroup } from '@devextreme/react';
import { cloneElement, ReactElement, useContext } from 'react';
import { FormContext } from '../form-context';
import { useFormItemLayout } from '../hooks/use-form-item-layout';
import { useFormItemRulesInitialization } from '../hooks/use-form-item-rules-initialization';
import { FormItemProps } from '../types';

export function FormItem({ name, children }: FormItemProps) {
  const formContext = useContext(FormContext);
  const {
    label, hint, editor, rules,
  } = useFormItemLayout(children, [RadioGroup]);

  useFormItemRulesInitialization(name, rules);

  const onEditorValueChanged = (value: unknown) => {
    formContext?.onValueChanged(name, value);
  };

  const renderValidation = () => (
    <span>{formContext?.validationResult?.[name]?.join('. ')}</span>
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
