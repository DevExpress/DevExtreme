/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXComponent, Component, ComponentBindings, OneWay, Effect, Template, Consumer, JSXTemplate,
} from '@devextreme-generator/declarations';

import {
  Plugins, PluginEntity, PluginsContext,
} from './context';

@ComponentBindings()
export class TemplateSetterProps {
  @OneWay() type!: PluginEntity<unknown>;

  @Template() template!: JSXTemplate<any>;
}

export const viewFunction = (): JSX.Element => <div />;

@Component({ defaultOptionRules: null, view: viewFunction })
export class TemplateSetter extends JSXComponent<TemplateSetterProps, 'type' | 'template'>(TemplateSetterProps) {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @Effect()
  updateTemplate(): void {
    this.plugins.set(this.props.type, this.props.template);
  }
}
