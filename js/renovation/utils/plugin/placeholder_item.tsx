/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  JSXComponent, Component, ComponentBindings,
  OneWay, Fragment, Slot, Consumer, InternalState, Effect,
} from '@devextreme-generator/declarations';
import { PluginEntity, Plugins, PluginsContext } from './context';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  // eslint-disable-next-line react/prop-types
  currentComponent, args, props: {
    componentTypes, column, index, children,
  },
}: PlaceholderItem): JSX.Element => (
  <Fragment>
    {
  currentComponent ? currentComponent(
    args,
    column,
    <PlaceholderItem componentTypes={componentTypes} column={column} index={index + 1}>
      {children}
    </PlaceholderItem>,
  ) : <Fragment>{children}</Fragment>
  /* CurrentComponent && (
    <CurrentComponent
      column={column}
      childrenTemplate={(
        <PlaceholderItem componentTypes={componentTypes} column={column} index={index + 1} />
      )}
    />

  ) */
}
  </Fragment>
);

@ComponentBindings()
export class PlaceholderItemProps {
  @OneWay() componentTypes: any[] = [];

  @OneWay() componentDeps: PluginEntity<unknown, unknown>[][] = [];

  @OneWay() column: any;

  @OneWay() index = 0;

  @Slot() children: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PlaceholderItem extends JSXComponent(PlaceholderItemProps) {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @InternalState()
  updateCounter = 0;

  @Effect()
  updateArgs(): () => void {
    const disposers = this.componentDeps.map((entity) => this.plugins.watch(entity, () => {
      this.updateCounter += 1;
    }));

    return (): void => {
      disposers.forEach((disposer) => disposer());
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get currentComponent(): any {
    if (this.componentDeps.every((entity) => this.plugins.hasValue(entity))) {
      return this.props.componentTypes[this.props.index];
    }

    return null;
  }

  get componentDeps(): PluginEntity<unknown, unknown>[] {
    return this.props.componentDeps[this.props.index] ?? [];
  }

  get args(): unknown { // TODO unknown[]
    return this.componentDeps.map(
      (entity) => this.plugins.getValue(entity),
    );
  }
}
