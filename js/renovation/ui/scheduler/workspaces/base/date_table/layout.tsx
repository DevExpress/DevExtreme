import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { Table } from '../table';
import { DateTableBody } from './table_body';
import { LayoutProps } from '../layout_props';

export const viewFunction = (viewModel: DateTableLayoutBase): JSX.Element => (
  <Table
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    isVirtual={viewModel.isVirtual}
    topVirtualRowHeight={viewModel.topVirtualRowHeight}
    bottomVirtualRowHeight={viewModel.bottomVirtualRowHeight}
    virtualCellsCount={viewModel.virtualCellsCount}
    className={viewModel.classes}
  >
    <DateTableBody
      // This is a workaround: cannot use template inside a template
      viewType={viewModel.props.viewType}
      viewData={viewModel.props.viewData}
      dataCellTemplate={viewModel.props.dataCellTemplate}
    />
  </Table>
);
@ComponentBindings()
export class DateTableLayoutBaseProps extends LayoutProps {
  @OneWay() className?: string;

  @OneWay() viewType?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableLayoutBase extends JSXComponent(DateTableLayoutBaseProps) {
  get classes(): string {
    return `dx-scheduler-date-table ${this.props.className}`;
  }

  get isVirtual(): boolean {
    const { viewData } = this.props;
    return !!viewData!.isVirtual;
  }

  get topVirtualRowHeight(): number {
    return this.props.viewData!.topVirtualRowHeight || 0;
  }

  get bottomVirtualRowHeight(): number {
    return this.props.viewData!.bottomVirtualRowHeight || 0;
  }

  get virtualCellsCount(): number {
    return this.props.viewData!.groupedData[0].dateTable[0].length;
  }
}
