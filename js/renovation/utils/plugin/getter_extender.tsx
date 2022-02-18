/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXComponent, Component, ComponentBindings, OneWay, Consumer, Effect,
} from '@devextreme-generator/declarations';

import {
  PluginsContext, Plugins, PluginGetter, PluginSelector,
} from './context';

export const viewFunction = (): JSX.Element => <div />;

@ComponentBindings()
export class GetterExtenderProps {
  @OneWay() type!: PluginGetter<any>;

  @OneWay() order!: number;

  @OneWay() selector!: PluginSelector<unknown>;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class GetterExtender extends JSXComponent<GetterExtenderProps, 'type' | 'order' | 'selector'>(GetterExtenderProps) {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect()
  updateExtender(): () => void {
    return this.plugins.extend(
      this.props.type,
      this.props.order,
      this.props.selector.func,
      this.props.selector.deps,
    );
  }
}
