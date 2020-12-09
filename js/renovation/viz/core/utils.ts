import { ConfigContextValue } from '../../ui/common/config_context';
import globalConfig from '../../../core/config';

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
