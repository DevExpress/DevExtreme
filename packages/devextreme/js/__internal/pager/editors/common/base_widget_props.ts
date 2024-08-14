export interface BaseWidgetProps {
  className?: string;
  accessKey?: string;
  activeStateEnabled?: boolean;
  disabled?: boolean ;
  focusStateEnabled?: boolean;
  height?: string | number | (() => (string | number));
  hint?: string;
  hoverStateEnabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onKeyDown?: (e: any) => any;
  rtlEnabled?: boolean;
  tabIndex?: number;
  visible?: boolean;
  width?: string | number | (() => (string | number));
}

export const BaseWidgetDefaultProps: BaseWidgetProps = {
  className: '',
  activeStateEnabled: false,
  disabled: false,
  focusStateEnabled: false,
  hoverStateEnabled: false,
  tabIndex: 0,
  visible: true,
  rtlEnabled: false,
};
