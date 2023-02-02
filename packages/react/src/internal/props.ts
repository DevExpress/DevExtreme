import {
  ReadonlyProps,
  TemplateProps,
  ValueProps,
} from '@devextreme/components';
import { RootContainerDomOptions } from '@devextreme/components/src/root-container';
import { FocusEventHandler, RefObject } from 'react';

type HandlerProp<P extends string> = `${P}Change`;
type DefaultProp<P extends string> = `default${Capitalize<P>}`;

type WithHandlerProps<T> = { [P in keyof T & string as HandlerProp<P>]?: (value: T[P]) => void };
type WithDefaultProps<T> = { [P in keyof T & string as DefaultProp<P>]?: T[P] };

export type Props<
  TValues,
  TReadonly,
  TTemplate,
  > =
  Partial<TValues>
  & WithDefaultProps<TValues>
  & WithHandlerProps<TValues>
  & Partial<TReadonly>
  & Partial<TTemplate>;

export interface EditorProps<T> extends Props<ValueProps<T>, ReadonlyProps, TemplateProps> {
  name?: string
}

export type FocusableProps = {
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLDivElement>;
};

export type WithCustomRef<TRef> = {
  componentRef?: RefObject<TRef>;
};

// --- compat ---
export type CompatibleOmittedProps = keyof FocusablePropsCompatible
& RootContainerDomOptions['accessKey'];

export type FocusablePropsCompatible = {
  onFocusIn?: FocusEventHandler<HTMLElement>;
  onFocusOut?: FocusEventHandler<HTMLElement>;
};

export type LifecyclePropsCompatible = {
  onContentReady?: () => void;
  onInitialized?: () => void;
  onDisposing?: () => void;
};
