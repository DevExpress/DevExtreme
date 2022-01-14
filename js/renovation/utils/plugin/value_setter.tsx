/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXComponent, Component, ComponentBindings, OneWay, Effect,
} from '@devextreme-generator/declarations';

import {
  Plugins, PluginEntity,
} from './context';

export const viewFunction = (): JSX.Element => <div />;

@ComponentBindings()
export class ValueSetterProps {
  @OneWay() plugins!: Plugins;

  @OneWay() type!: PluginEntity<unknown, unknown>;

  @OneWay() value!: unknown;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class ValueSetter extends JSXComponent<ValueSetterProps, 'plugins' | 'type' | 'value'>(ValueSetterProps) {
  // @Consumer(PluginsContext)
  // plugins!: Plugins;

  @Effect()
  updatePluginValue(): void {
    this.props.plugins.set(this.props.type, this.props.value);
  }
}
