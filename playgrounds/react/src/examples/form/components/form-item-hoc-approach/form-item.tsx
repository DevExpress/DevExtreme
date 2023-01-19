import { cloneElement, ReactElement } from 'react';
import { useFormItemLayout } from '../hooks/use-form-item-layout';
import { useEditorValidationRulesInitialization } from '../hooks/use-validation-rules-extractor';
import { FormItemProps } from '../types';
import { RadioGroupEditor } from './radio-group-form-editor';

export function FormItem({ name, children }: FormItemProps) {
  const { label, hint, editor } = useFormItemLayout(children, [
    RadioGroupEditor,
  ]);
  useEditorValidationRulesInitialization(name, children);

  return (
    <div>
      <span>{label}</span>
      <span>{hint}</span>
      <span>{cloneElement(editor as ReactElement, { name })}</span>
    </div>
  );
}
