import { FormEventHandler, PropsWithChildren, ReactElement } from 'react';

export interface FormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children?:
  | ReactElement<FormItemProps>[]
  | ReactElement<FormItemProps>;
}

export interface FormItemProps extends PropsWithChildren {
  name: string;
}
