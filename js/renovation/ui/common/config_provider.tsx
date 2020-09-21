import {
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
  Provider,
  Component,
  Fragment,
} from 'devextreme-generator/component_declaration/common';
import { ConfigContextValue, ConfigContext } from './config_context';

export const viewFunction = (viewModel: ConfigProvider): JSX.Element => (
  <Fragment>
    {viewModel.props.children}
  </Fragment>
);

@ComponentBindings()
export class ConfigProviderProps {
  @OneWay() rtlEnabled!: boolean;

  @Slot() children?: JSX.Element;
}

@Component({ defaultOptionRules: null, view: viewFunction })
// TODO generator bug uncomment after fix
export class ConfigProvider extends JSXComponent<ConfigProviderProps, 'rtlEnabled' /* | 'children' */>() {
  @Provider(ConfigContext)
  get config(): ConfigContextValue {
    return {
      rtlEnabled: this.props.rtlEnabled,
    };
  }
}
