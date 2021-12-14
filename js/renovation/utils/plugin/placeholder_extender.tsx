import {
  JSXComponent, Component, ComponentBindings, OneWay, Consumer, Effect, Template, Fragment,
} from '@devextreme-generator/declarations';

import {
  PluginsContext, Plugins,
} from './context';

@ComponentBindings()
export class PlaceholderExtenderProps {
  @OneWay() type!: any /* TODO PluginPlaceholder */;

  @OneWay() order!: number;

  @Template() template: any;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = (): JSX.Element => <Fragment />;

@Component({ defaultOptionRules: null, view: viewFunction })
export class PlaceholderExtender extends JSXComponent<PlaceholderExtenderProps, 'type' | 'order'>(PlaceholderExtenderProps) {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect()
  extendPlaceholder(): () => void {
    return this.plugins.extendPlaceholder(this.props.type, this.props.order, this.props.template);
  }
}
