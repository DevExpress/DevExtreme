import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot,
} from 'devextreme-generator/component_declaration/common';
import { Table } from './table';
import { Row } from './row';

export const viewFunction = (viewModel: VirtualTable): JSX.Element => (
  <Table
    className={`dx-scheduler-table-virtual ${viewModel.props.className}`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <Row className="dx-scheduler-virtual-row" />
    {viewModel.props.children}
    <Row className="dx-scheduler-virtual-row" />
  </Table>
);

@ComponentBindings()
export class VirtualTableProps {
  @OneWay() className?: string;

  @Slot() children?: JSX.Element | JSX.Element[];
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualTable extends JSXComponent(VirtualTableProps) {
}
