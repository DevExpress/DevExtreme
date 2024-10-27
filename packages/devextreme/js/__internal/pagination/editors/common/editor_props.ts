import { BaseWidgetDefaultProps, type BaseWidgetProps } from './base_widget_props';
import { WidgetDefaultProps, type WidgetProps } from './widget_props';

export interface EditorProps extends BaseWidgetProps {
  readOnly?: false;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  validationError?: Record<string, unknown> | null;
  validationErrors?: Record<string, unknown>[] | null;
  validationMessageMode?: 'auto' | 'always';
  validationMessagePosition?: 'top' | 'right' | 'bottom' | 'left';
  validationStatus?: 'valid' | 'invalid' | 'pending';
  isValid?: boolean;
  isDirty?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputAttr?: any;
  // private
  onFocusIn?: (e: Event) => void;
}

export type EditorPropsType = EditorProps
// eslint-disable-next-line @typescript-eslint/no-type-alias
& Pick<WidgetProps, 'aria' | 'classes' | 'children'>;

export const EditorDefaultProps: EditorPropsType = {
  ...BaseWidgetDefaultProps,
  aria: WidgetDefaultProps.aria,
  classes: WidgetDefaultProps.classes,
  readOnly: false,
  name: '',
  value: null,
  validationError: null,
  validationErrors: null,
  validationMessageMode: 'auto',
  validationMessagePosition: 'bottom',
  validationStatus: 'valid',
  isValid: true,
  isDirty: false,
  inputAttr: {},
};
