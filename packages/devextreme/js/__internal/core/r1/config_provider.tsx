/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';

import { ConfigContext, type ConfigContextValue } from './config_context';

export interface ConfigProviderProps {
  rtlEnabled?: boolean;
  children: JSX.Element;
}

export const ConfigProviderDefaultProps = {};
export class ConfigProvider extends BaseInfernoComponent<ConfigProviderProps> {
  private readonly __getterCache: any = {};

  get config(): ConfigContextValue {
    if (this.__getterCache.config !== undefined) {
      return this.__getterCache.config;
    }
    // eslint-disable-next-line no-return-assign
    return this.__getterCache.config = ((): any => ({
      rtlEnabled: this.props.rtlEnabled,
    }))();
  }

  componentWillUpdate(nextProps: ConfigProviderProps): void {
    if (this.props.rtlEnabled !== nextProps.rtlEnabled) {
      this.__getterCache.config = undefined;
    }
  }

  getChildContext(): any {
    return {
      ...this.context,
      [ConfigContext.id]: this.config || ConfigContext.defaultValue,
    };
  }

  render(): JSX.Element {
    return (
      this.props.children
    );
  }
}
ConfigProvider.defaultProps = ConfigProviderDefaultProps;
