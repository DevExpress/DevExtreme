import type { BaseWidgetProps } from '@ts/core/r1/base_props';
import { BaseWidgetDefaultProps } from '@ts/core/r1/base_props';

export interface ButtonProps extends BaseWidgetProps {
  activeStateEnabled: boolean;

  hoverStateEnabled: boolean;

  icon: string;

  iconPosition?: string;

  onClick?: (e: { event: Event }) => void;

  onSubmit?: (e: { event: Event; submitInput: HTMLInputElement | null }) => void;

  pressed?: boolean;

  stylingMode: 'outlined' | 'text' | 'contained';

  template?: (props: { data: { icon?: string; text?: string } }) => JSX.Element;

  iconTemplate?: (props) => JSX.Element;

  children?: JSX.Element;

  text: string;

  type: 'danger' | 'default' | 'normal' | 'success';

  useInkRipple: boolean;

  useSubmitBehavior: boolean;

  templateData?: Record<string, unknown>;
}

export const defaultButtonProps: ButtonProps = {
  ...BaseWidgetDefaultProps,
  activeStateEnabled: true,
  hoverStateEnabled: true,
  icon: '',
  iconPosition: 'left',
  stylingMode: 'contained',
  text: '',
  type: 'normal',
  useInkRipple: false,
  useSubmitBehavior: false,
  templateData: {},
};
