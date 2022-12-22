import { RadioGroupCore } from '@devextreme/components';
import { ComponentType, ReactElement } from 'react';

export type LabelType = string | ReactElement;

export interface RadioTemplateProps {
  checked: boolean;
}

export interface LabelTemplateProps {
  label: LabelType;
}

export type ChangedEventHandler<T> = (value: T) => void;
export interface RadioButtonProps<T> {
  value: T;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  label?: LabelType;
  radioTemplate?: ComponentType<RadioTemplateProps>;
  labelTemplate?: ComponentType<LabelTemplateProps>;
  onChange?: React.ChangeEventHandler;
  onChanged?: ChangedEventHandler<T>;
  onClick?: React.MouseEventHandler;
}

export interface RadioButtonRenderProps<T>
  extends RadioButtonProps<T> {
  inputId: string;
  inputRef: React.ForwardedRef<HTMLInputElement>;
  renderRadioComponent?: (
    radioComponent: ComponentType<RadioTemplateProps>
  ) => JSX.Element;
}

export interface CoreBoundRadioButtonProps<T>
  extends RadioButtonRenderProps<T> {
  radioGroupCore: RadioGroupCore<T>;
}

export type RadioButtonRenderType<T> = (
  props: RadioButtonRenderProps<T>
) => JSX.Element;
