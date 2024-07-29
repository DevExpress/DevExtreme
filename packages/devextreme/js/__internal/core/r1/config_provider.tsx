import {
  Component,
  JSXComponent,
  Provider,
} from '@devextreme-generator/declarations';

import * as config_context from './config_context';

export const viewFunction = (viewModel: ConfigProvider): JSX.Element => viewModel.props.children;

export interface ConfigProviderProps {
  rtlEnabled: boolean;
  children: JSX.Element;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class ConfigProvider extends JSXComponent<ConfigProviderProps, 'rtlEnabled' | 'children'>() {
  @Provider(config_context.ConfigContext)
  get config(): config_context.ConfigContextValue {
    return {
      rtlEnabled: this.props.rtlEnabled,
    };
  }
}
