/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno';

import { PaginationConfigContext, type PaginationConfigContextValue } from './pagination_config_context';

export interface PaginationConfigProviderProps {
  isGridCompatibilityMode?: boolean;
  children: JSX.Element;
}

export const PaginationConfigProviderDefaultProps = {};
export class PaginationConfigProvider extends BaseInfernoComponent<PaginationConfigProviderProps> {
  public state: any = {};

  getConfig(): PaginationConfigContextValue {
    return {
      isGridCompatibilityMode: this.props.isGridCompatibilityMode,
    };
  }

  getChildContext(): any {
    return {
      ...this.context,
      ...{
        [PaginationConfigContext.id]: this.getConfig() || PaginationConfigContext.defaultValue,
      },
    };
  }

  render(): JSX.Element {
    return (
      this.props.children
    );
  }
}
PaginationConfigProvider.defaultProps = PaginationConfigProviderDefaultProps;
