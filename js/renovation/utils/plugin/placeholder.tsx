/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  JSXComponent, Component, ComponentBindings, OneWay, Consumer, InternalState, Effect, Slot,
} from '@devextreme-generator/declarations';

import { PlaceholderItem } from './placeholder_item';
import {
  PluginsContext, Plugins, PluginEntity,
} from './context';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  plugins, componentTypes, componentDeps, props: { column, children },
}: Placeholder): JSX.Element => (
  <PlaceholderItem
    plugins={plugins}
    componentTypes={componentTypes}
    componentDeps={componentDeps}
    column={column}
  >
    { children }
  </PlaceholderItem>
);
@ComponentBindings()
export class PlaceholderProps {
  @OneWay() type!: any /* TODO PluginPlaceholder */;

  @OneWay() column: any;

  @Slot() children: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class Placeholder extends JSXComponent<PlaceholderProps, 'type'>(PlaceholderProps) {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @InternalState() componentTypes: any /* [] */ = [];

  @InternalState() componentDeps: any = [];

  @Effect()
  updateComponentTypes(): () => void {
    return this.plugins.watch(this.props.type, (items: {
      order: number;
      component: unknown;
      deps: PluginEntity<unknown, unknown>[];
    }[]) => {
      this.componentTypes = items.map((item) => item.component).reverse();
      this.componentDeps = items.map((item) => item.deps).reverse();
    });
  }
}
