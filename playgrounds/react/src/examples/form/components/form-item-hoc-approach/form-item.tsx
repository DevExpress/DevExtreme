import { cloneElement, ReactElement } from 'react';
import { useFormItemLayout } from '../hooks/use-form-item-layout';
import { useFormItemRulesInitialization } from '../hooks/use-form-item-rules-initialization';
import { FormItemProps } from '../types';
import { RadioGroupEditor } from './radio-group-form-editor';

export function FormItem({ name, children }: FormItemProps) {
  const {
    label, hint, editor, rules,
  } = useFormItemLayout(children, [RadioGroupEditor]);

  useFormItemRulesInitialization(name, rules);

  return (
    <div>
      <span>{label}</span>
      <span>{hint}</span>
      <span>{cloneElement(editor as ReactElement, { name })}</span>
    </div>
  );
}
