import type { RefObject } from 'inferno';

import { BaseWidgetDefaultProps } from '../../base_props';
import type { BaseWidgetProps } from './base_widget_props';

const DEFAULT_FEEDBACK_HIDE_TIMEOUT = 400;
const DEFAULT_FEEDBACK_SHOW_TIMEOUT = 30;

export interface WidgetProps extends BaseWidgetProps {
  rootElementRef?: RefObject<HTMLDivElement>;
  _feedbackHideTimeout?: number;
  _feedbackShowTimeout?: number;
  activeStateUnit?: string;
  cssText: string;
  aria?: Record<string, string>;
  children?: JSX.Element | (JSX.Element | undefined | false | null)[];
  classes?: string | undefined;
  name?: string;
  addWidgetClass?: boolean;
  onActive?: (e: Event) => void;
  onDimensionChanged?: () => void;
  onInactive?: (e: Event) => void;
  onVisibilityChange?: (args: boolean) => void;
  onFocusIn?: (e: Event) => void;
  onFocusOut?: (e: Event) => void;
  onHoverStart?: (e: Event) => void;
  onHoverEnd?: (e: Event) => void;
  onRootElementRendered?: (rootElement: HTMLDivElement) => void;
}

export const WidgetDefaultProps: WidgetProps = {
  ...BaseWidgetDefaultProps,
  _feedbackHideTimeout: DEFAULT_FEEDBACK_HIDE_TIMEOUT,
  _feedbackShowTimeout: DEFAULT_FEEDBACK_SHOW_TIMEOUT,
  cssText: '',
  aria: { },
  classes: '',
  name: '',
  addWidgetClass: true,
};
