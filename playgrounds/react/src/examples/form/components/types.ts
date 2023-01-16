import { FormEventHandler, PropsWithChildren, ReactElement } from 'react';

export interface Rule {
  validate: (value: unknown) => boolean;
  message: string;
}

export interface FormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children?:
  | ReactElement<FormItemProps>[]
  | ReactElement<FormItemProps>;
}

export type FormValidationResult = Record<string, string[]>;

export type FormItemValidator = (value: unknown, rules: Rule[]) => string[];

export interface FormItemProps extends PropsWithChildren {
  name: string;
}
