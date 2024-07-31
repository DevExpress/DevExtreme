/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInfernoComponent } from '@devextreme/runtime/inferno';

export interface ConfigProviderProps {
  rtlEnabled?: boolean;
  children: JSX.Element;
}

export const ConfigProviderDefaultProps = {};
export class ConfigProvider extends BaseInfernoComponent<ConfigProviderProps> {
  public state: any = {};

  render(): JSX.Element {
    return (
      this.props.children
    );
  }
}
ConfigProvider.defaultProps = ConfigProviderDefaultProps;
