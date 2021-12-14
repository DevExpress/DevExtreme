import {
  JSXComponent, Component, ComponentBindings, OneWay, Fragment, Slot,
} from '@devextreme-generator/declarations';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  // eslint-disable-next-line react/prop-types
  currentComponent, props: {
    componentTypes, column, index, children,
  },
}: PlaceholderItem) => (
  <Fragment>
    {
  currentComponent ? currentComponent(
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

  @OneWay() column: any;

  @OneWay() index = 0;

  @Slot() children: any;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PlaceholderItem extends JSXComponent(PlaceholderItemProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get currentComponent(): any {
    return this.props.componentTypes[this.props.index];
  }
}
