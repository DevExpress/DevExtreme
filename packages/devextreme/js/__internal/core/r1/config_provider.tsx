/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';

import { ConfigContext, type ConfigContextValue } from './config_context';

export interface ConfigProviderProps {
  rtlEnabled?: boolean;
  children: JSX.Element;
}

export const ConfigProviderDefaultProps = {};
export class ConfigProvider extends BaseInfernoComponent<ConfigProviderProps> {
  public state: any = {};

  getConfig(): ConfigContextValue {
    return {
      rtlEnabled: this.props.rtlEnabled,
    };
  }

  getChildContext(): any {
    return {
      ...this.context,
      ...{
        [ConfigContext.id]: this.getConfig() || ConfigContext.defaultValue,
      },
    };
  }

  render(): JSX.Element {
    return (
      this.props.children
    );
  }
}
ConfigProvider.defaultProps = ConfigProviderDefaultProps;
