import { ConfigContextValue } from '../../ui/common/config_context';
import globalConfig from '../../../core/config';
import getElementComputedStyle from '../../ui/pager/utils/get_computed_style';
import { toNumber } from '../../ui/pager/utils/get_element_width';

export function getElementWidth(element: Element | undefined): number {
  const style = getElementComputedStyle(element);
  return toNumber(style?.width) - toNumber(style?.paddingLeft) - toNumber(style?.paddingRight);
}
export function getElementHeight(element: Element | undefined): number {
  const style = getElementComputedStyle(element);
  return toNumber(style?.height) - toNumber(style?.paddingTop) - toNumber(style?.paddingBottom);
}

export const sizeIsValid = (value): boolean => !!(value ?? (value > 0));

export const pickPositiveValue = (values): number => (
  values.reduce((result, value) => ((value > 0 && !result) ? value : result), 0)
);

// eslint-disable-next-line max-len
export const mergeRtlEnabled = (rtlProp?: boolean, config?: ConfigContextValue): boolean | undefined => {
  if (rtlProp !== undefined) {
    return rtlProp;
  }
  if (config?.rtlEnabled !== undefined) {
    return config.rtlEnabled;
  }
  return globalConfig().rtlEnabled;
};
