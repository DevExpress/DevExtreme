import { RadioGroupCore } from '@devextreme/components';
import { ComponentType, ReactElement } from 'react';
import { RadioGroupValue } from '../radio-group';

export type LabelType = string | ReactElement;

export interface RadioTemplateProps {
  checked: boolean;
}

export interface LabelTemplateProps {
  label: LabelType;
}

export interface RadioButtonProps {
  value: RadioGroupValue;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  label?: LabelType;
  radioTemplate?: ComponentType<RadioTemplateProps>;
  labelTemplate?: ComponentType<LabelTemplateProps>;
  onChange?: React.ChangeEventHandler;
  onClick?: React.MouseEventHandler;
}

export interface RadioButtonRenderProps extends RadioButtonProps {
  inputId: string;
  inputRef: React.ForwardedRef<HTMLInputElement>;
  renderRadioComponent?: (radioComponent: ComponentType<RadioTemplateProps>) => JSX.Element
}

export interface CoreBoundRadioButtonProps extends RadioButtonRenderProps {
  radioGroupCore: RadioGroupCore<RadioGroupValue>;
}

export type RadioButtonRenderType = (props: RadioButtonRenderProps) => JSX.Element;
