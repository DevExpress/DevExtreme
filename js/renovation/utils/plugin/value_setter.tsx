/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXComponent, Component, ComponentBindings, OneWay, Effect, Consumer,
} from '@devextreme-generator/declarations';

import {
  Plugins, PluginEntity, PluginsContext,
} from './context';

export const viewFunction = (): JSX.Element => <div />;

@ComponentBindings()
export class ValueSetterProps {
  @OneWay() type!: PluginEntity<unknown, unknown>;

  @OneWay() value!: unknown;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class ValueSetter extends JSXComponent<ValueSetterProps, 'type' | 'value'>(ValueSetterProps) {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect()
  updatePluginValue(): void {
    this.plugins.set(this.props.type, this.props.value);
  }
}
