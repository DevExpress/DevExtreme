import { ConfigContextValue } from '../common/config_context';
import { isDefined } from '../../core/utils/type';
import globalConfig from '../../core/config';

export function resolveRtlEnabled(rtlProp?: boolean, config?: ConfigContextValue):
boolean | undefined {
  if (rtlProp !== undefined) {
    return rtlProp;
  }
  if (config?.rtlEnabled !== undefined) {
    return config.rtlEnabled;
  }
  return globalConfig().rtlEnabled;
}

export function resolveRtlEnabledDefinition(rtlProp?: boolean, config?: ConfigContextValue):
boolean {
  const isPropDefined = isDefined(rtlProp);
  const onlyGlobalDefined = isDefined(globalConfig().rtlEnabled)
  && !isPropDefined && !isDefined(config?.rtlEnabled);
  return (isPropDefined
  && (rtlProp !== config?.rtlEnabled))
  || onlyGlobalDefined;
}
