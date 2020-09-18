import {
  ComponentBindings,
  JSXComponent,
  OneWay,
  Slot,
  Provider,
  Component,
  Fragment,
} from 'devextreme-generator/component_declaration/common';
import { RtlEnabledContext } from './rtl_enabled_context';

export const viewFunction = (viewModel: RtlEnabledProvider): JSX.Element => (
  <Fragment>
    {viewModel.props.children}
  </Fragment>
);

@ComponentBindings()
export class RtlEnabledProviderProps {
  @OneWay() rtlEnabled!: boolean;

  @Slot() children?: JSX.Element;
}

@Component({ defaultOptionRules: null, view: viewFunction })
// TODO generator bug uncomment after fix
export class RtlEnabledProvider extends JSXComponent<RtlEnabledProviderProps, 'rtlEnabled' /* | 'children' */>() {
  @Provider(RtlEnabledContext)
  get rtlEnabled(): boolean {
    return this.props.rtlEnabled;
  }
}
