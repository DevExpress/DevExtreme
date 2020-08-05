import {
  Component, ComponentBindings, JSXComponent, OneWay, Slot,
} from 'devextreme-generator/component_declaration/common';
import { Table } from './table';
import { Row } from './row';

export const viewFunction = (viewModel: VirtualTable) => (
  <Table
    className={`dx-scheduler-table-virtual ${viewModel.props.className}`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <Row className="dx-scheduler-virtual-row" height={viewModel.props.topVirtualRowHeight} />
    {viewModel.props.children}
    <Row className="dx-scheduler-virtual-row" height={viewModel.props.bottomVirtualRowHeight} />
  </Table>
);

@ComponentBindings()
export class VirtualTableProps {
  @OneWay() className?: string;

  @Slot() children?: any;

  @OneWay() topVirtualRowHeight?: number = 0;

  @OneWay() bottomVirtualRowHeight?: number = 0;

  @OneWay() startIndex?: number = 0;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class VirtualTable extends JSXComponent(VirtualTableProps) {
}
