import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = (viewModel: VirtualCell): JSX.Element => (
  <td
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={`dx-scheduler-virtual-cell ${viewModel.props.className}`}
  />
);

@ComponentBindings()
export class VirtualCellProps {
  @OneWay() className? = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualCell extends JSXComponent(VirtualCellProps) {}
