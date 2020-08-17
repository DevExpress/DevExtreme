import {
  Component, ComponentBindings, JSXComponent, OneWay, Template,
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
    className={viewModel.classes}
  >
    <DateTableBody
      cellTemplate={viewModel.props.cellTemplate}
      viewData={viewModel.props.viewData}
      dataCellTemplate={viewModel.props.dataCellTemplate}
    />
  </Table>
);
@ComponentBindings()
export class DateTableLayoutBaseProps extends LayoutProps {
  @OneWay() className?: string;

  @Template() cellTemplate?: any;
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

  get topVirtualRowHeight(): number | undefined {
    return this.props.viewData!.topVirtualRowHeight || 0;
  }

  get bottomVirtualRowHeight(): number | undefined {
    return this.props.viewData!.bottomVirtualRowHeight || 0;
  }
}
