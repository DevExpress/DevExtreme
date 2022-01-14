/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  JSXComponent, Component, ComponentBindings,
  OneWay, Fragment, Slot, InternalState, Effect,
} from '@devextreme-generator/declarations';
import { PluginEntity, Plugins } from './context';

import { PlaceholderItemRenderer } from './placeholder_item_renderer';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  // eslint-disable-next-line react/prop-types
  currentTemplate, args, props: {
    componentTypes, column, index, children,
  },
}: PlaceholderItem): JSX.Element => (
  <Fragment>
    {currentTemplate ? (
      <PlaceholderItemRenderer
        deps={args}
        column={column}
        currentTemplate={currentTemplate}
        baseTemplate={(): JSX.Element => (
          <PlaceholderItem componentTypes={componentTypes} column={column} index={index + 1} />
        )}
      />
    ) : <Fragment>{children}</Fragment>}
  </Fragment>
);

@ComponentBindings()
export class PlaceholderItemProps {
  @OneWay() plugins!: Plugins;

  @OneWay() componentTypes: any[] = [];

  @OneWay() componentDeps: PluginEntity<unknown, unknown>[][] = [];

  @OneWay() column: any;

  @OneWay() index = 0;

  @Slot() children: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PlaceholderItem extends JSXComponent<PlaceholderItemProps, 'plugins'>(PlaceholderItemProps) {
  // @Consumer(PluginsContext)
  // plugins!: Plugins;

  @InternalState()
  args: unknown[] = [];

  @Effect()
  updateArgs(): () => void {
    const disposers = this.componentDeps.map((entity) => this.props.plugins.watch(entity, () => {
      this.args = this.getArgs();
    }));

    return (): void => {
      disposers.forEach((disposer) => disposer());
    };
  }

  getArgs(): unknown[] {
    return this.componentDeps.map(
      (entity) => this.props.plugins.getValue(entity),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get currentTemplate(): any {
    if (this.componentDeps.every((entity) => this.props.plugins.hasValue(entity))) {
      return this.props.componentTypes[this.props.index];
    }

    return null;
  }

  get componentDeps(): PluginEntity<unknown, unknown>[] {
    return this.props.componentDeps[this.props.index] ?? [];
  }
}
