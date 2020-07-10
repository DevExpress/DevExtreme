import {
  Component, ComponentBindings, JSXComponent, Slot, OneWay,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = (viewModel: Row) => (
  <tr
    className={viewModel.props.className}
    style={viewModel.style}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    {viewModel.props.children}
  </tr>
);

@ComponentBindings()
export class RowProps {
  @OneWay() height?: number;

  @OneWay() className?: string;

  @Slot() children?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Row extends JSXComponent(RowProps) {
  get style() {
    const { height } = this.props;

    return { height: height ? `${height}px` : undefined };
  }
}
