/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXComponent, Component, ComponentBindings, OneWay, Consumer, Effect,
} from '@devextreme-generator/declarations';

import {
  PluginsContext, Plugins, PluginGetter, PluginSelector, PluginEntity,
} from './context';

export const viewFunction = (): JSX.Element => <div />;

@ComponentBindings()
export class GetterExtenderProps {
  @OneWay() type!: PluginGetter<any>;

  @OneWay() order!: number;

  @OneWay() value!: PluginEntity<unknown>;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class GetterExtender extends JSXComponent<GetterExtenderProps, 'type' | 'order' | 'value'>(GetterExtenderProps) {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect()
  updateExtender(): () => void {
    const { value } = this.props;
    if (value instanceof PluginSelector) {
      return this.plugins.extend(
        this.props.type,
        this.props.order,
        value.func,
        value.deps,
      );
    }
    return this.plugins.extend(
      this.props.type,
      this.props.order,
      () => this.plugins.getValue(value),
      [value],
    );
  }
}
