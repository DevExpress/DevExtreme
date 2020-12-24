import {
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
  Provider,
  Component,
} from 'devextreme-generator/component_declaration/common';
import { ConfigContextValue, ConfigContext } from './config_context';

export const viewFunction = (viewModel: ConfigProvider): JSX.Element => viewModel.props.children;

@ComponentBindings()
export class ConfigProviderProps {
  @OneWay() rtlEnabled!: boolean;

  @Slot() children!: JSX.Element;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class ConfigProvider extends JSXComponent<ConfigProviderProps, 'rtlEnabled' | 'children'>() {
  @Provider(ConfigContext)
  get config(): ConfigContextValue {
    return {
      rtlEnabled: this.props.rtlEnabled,
    };
  }
}
