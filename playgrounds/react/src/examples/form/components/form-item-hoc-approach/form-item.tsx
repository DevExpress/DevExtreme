import { cloneElement, ReactElement } from 'react';
import { Validator } from '../../../validation/components/validator';
import { useFormItemLayout } from '../hooks/use-form-item-layout';
import { FormItemProps } from '../types';
import { RadioGroupEditor } from './radio-group-form-editor';

export function FormItem({ name, children }: FormItemProps) {
  const { label, hint, editor } = useFormItemLayout(children, [
    RadioGroupEditor,
  ]);

  return (
    <div>
      <span>{label}</span>
      <span>{hint}</span>
      <span>{cloneElement(editor as ReactElement, { name })}</span>
      <Validator>{children}</Validator>
    </div>
  );
}
