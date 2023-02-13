import { PropsWithChildren } from 'react';
import {
  CssForwardProps,
  EditorProps,
  FocusableProps,
} from '../../internal/props';

export type RadioGroupRef = {
  focus(options?: FocusOptions): void,
};

export type RadioGroupProps<T> = PropsWithChildren<
EditorProps<T> &
FocusableProps &
CssForwardProps
>;
