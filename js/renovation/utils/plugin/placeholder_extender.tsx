/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXComponent, Component, ComponentBindings, OneWay, Effect, Template,
} from '@devextreme-generator/declarations';

import {
  Plugins, PluginEntity,
} from './context';

@ComponentBindings()
export class PlaceholderExtenderProps {
  @OneWay() plugins!: Plugins;

  @OneWay() type!: any /* TODO PluginPlaceholder */;

  @OneWay() order!: number;

  @Template() template!: (props) => JSX.Element;

  @OneWay() deps: PluginEntity<unknown, unknown>[] = [];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = (): JSX.Element => <div />;

@Component({ defaultOptionRules: null, jQuery: { register: true }, view: viewFunction })
export class PlaceholderExtender extends JSXComponent<PlaceholderExtenderProps, 'plugins' | 'type' | 'order' | 'template'>(PlaceholderExtenderProps) {
  // @Consumer(PluginsContext)
  // plugins!: Plugins;

  @Effect()
  extendPlaceholder(): () => void {
    return this.props.plugins.extendPlaceholder(
      this.props.type,
      this.props.order,
      this.props.template,
      this.props.deps,
    );
  }
}
