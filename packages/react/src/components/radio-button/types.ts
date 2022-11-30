import { ComponentType, ReactElement } from 'react';

export type LabelType = string | ReactElement;

export interface RadioTemplateProps {
  checked: boolean;
}

export interface LabelTemplateProps {
  label: LabelType;
}

export interface RadioButtonProps {
  value: string;
  checked: boolean;
  label: LabelType;
  radioTemplate?: ComponentType<RadioTemplateProps>;
  labelTemplate?: ComponentType<LabelTemplateProps>;
  onChange?: React.ChangeEventHandler;
  onClick?: React.MouseEventHandler;
}
