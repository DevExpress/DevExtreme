/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  JSXComponent, Component, ComponentBindings,
  OneWay, Fragment, Slot, InternalState, Effect, Consumer,
} from '@devextreme-generator/declarations';
import { PluginEntity, Plugins, PluginsContext } from './context';

import { PlaceholderItemRenderer } from './placeholder_item_renderer';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  // eslint-disable-next-line react/prop-types
  currentTemplate, args, props: {
    componentTypes, componentDeps, column, index, children,
  },
}: PlaceholderItem): JSX.Element => (
  <Fragment>
    {currentTemplate ? (
      <PlaceholderItemRenderer
        deps={args}
        column={column}
        currentTemplate={currentTemplate}
        baseTemplate={(): JSX.Element => (
          <PlaceholderItem
            componentTypes={componentTypes}
            componentDeps={componentDeps}
            column={column}
            index={index + 1}
          />
        )}
      />
    ) : <Fragment>{children}</Fragment>}
  </Fragment>
);

@ComponentBindings()
export class PlaceholderItemProps {
  @OneWay() componentTypes: any[] = [];

  @OneWay() componentDeps: PluginEntity<unknown, unknown>[][] = [];

  @OneWay() column: any;

  @OneWay() index = 0;

  @Slot() children?: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PlaceholderItem extends JSXComponent<PlaceholderItemProps>(PlaceholderItemProps) {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @InternalState()
  args: unknown[] = [];

  @Effect()
  updateArgs(): () => void {
    const disposers = this.componentDeps.map((entity) => this.plugins.watch(entity, () => {
      this.args = this.getArgs();
    }));

    return (): void => {
      disposers.forEach((disposer) => disposer());
    };
  }

  getArgs(): unknown[] {
    return this.componentDeps.map(
      (entity) => this.plugins.getValue(entity),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get currentTemplate(): any {
    if (this.componentDeps.every((entity) => this.plugins.hasValue(entity))) {
      return this.props.componentTypes[this.props.index];
    }

    return null;
  }

  get componentDeps(): PluginEntity<unknown, unknown>[] {
    return this.props.componentDeps[this.props.index] ?? [];
  }
}
