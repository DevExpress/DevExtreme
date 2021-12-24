/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXComponent, Component, ComponentBindings, OneWay, Consumer, Effect, Fragment,
} from '@devextreme-generator/declarations';

import {
  PluginsContext, Plugins, PluginEntity,
} from './context';

export const viewFunction = (): JSX.Element => <Fragment />;

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
