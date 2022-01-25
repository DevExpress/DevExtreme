/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXComponent, Component, ComponentBindings, OneWay, Consumer, Effect, Template, Fragment,
} from '@devextreme-generator/declarations';

import {
  PluginsContext, Plugins, PluginEntity,
} from './context';

@ComponentBindings()
export class PlaceholderExtenderProps {
  @OneWay() type!: any /* TODO PluginPlaceholder */;

  @OneWay() order!: number;

  @Template() template!: (props) => JSX.Element;

  @OneWay() deps: PluginEntity<unknown, unknown>[] = [];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = (): JSX.Element => <Fragment />;

@Component({ defaultOptionRules: null, view: viewFunction })
export class PlaceholderExtender extends JSXComponent<PlaceholderExtenderProps, 'type' | 'order' | 'template'>(PlaceholderExtenderProps) {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect()
  extendPlaceholder(): () => void {
    return this.plugins.extendPlaceholder(
      this.props.type,
      this.props.order,
      this.props.template,
      this.props.deps,
    );
  }
}
