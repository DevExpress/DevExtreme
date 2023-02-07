import { Children, cloneElement, ReactElement } from 'react';
import { useFormItemLayout } from '../hooks/use-form-item-layout';
import { FormItemProps } from '../types';
import { RadioGroupEditor } from './radio-group-form-editor';

export function FormItem({ name, children }: FormItemProps) {
  const {
    label, hint, editor, rest,
  } = useFormItemLayout(children, [
    RadioGroupEditor,
  ]);

  return (
    <div>
      <span>{label}</span>
      <span>{hint}</span>
      <span>
        {cloneElement(
          editor as ReactElement,
          { name },
          ...(editor as ReactElement).props.children,
          ...Children.toArray(rest),
        )}
      </span>
    </div>
  );
}
