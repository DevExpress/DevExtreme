/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXComponent, Component, ComponentBindings, OneWay, Consumer, Effect, Fragment,
} from '@devextreme-generator/declarations';

import {
  PluginsContext, Plugins, PluginGetter,
} from './context';

export const viewFunction = (): JSX.Element => <Fragment />;

@ComponentBindings()
export class GetterExtenderProps {
  @OneWay() type!: PluginGetter<any>;

  @OneWay() order!: number;

  @OneWay() func!: (base: any) => any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class GetterExtender extends JSXComponent<GetterExtenderProps, 'type' | 'order' | 'func'>(GetterExtenderProps) {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect()
  updateExtender(): () => void {
    return this.plugins.extend(
      this.props.type,
      this.props.order,
      this.props.func,
    );
  }
}
