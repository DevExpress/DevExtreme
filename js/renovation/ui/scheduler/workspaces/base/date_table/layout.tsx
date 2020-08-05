import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment, Template,
} from 'devextreme-generator/component_declaration/common';
import { Table } from '../table';
import { VirtualTable } from '../virtual_table';
import { DateTableBody } from './table_body';
import { LayoutProps } from '../layout_props';

export const viewFunction = (viewModel: DateTableLayoutBase) => (
  // This is a workaround because of bug in generator:
  // it's impossible use ternary operator to choose between tables
  <Fragment>
    {viewModel.isVirtual && (
      <VirtualTable
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...viewModel.restAttributes}
        topVirtualRowHeight={viewModel.topVirtualRowHeight}
        bottomVirtualRowHeight={viewModel.bottomVirtualRowHeight}
        className={`dx-scheduler-date-table ${viewModel.props.className}`}
      >
        <DateTableBody
          viewData={viewModel.props.viewData}
          cellTemplate={viewModel.props.cellTemplate}
        />
      </VirtualTable>
    )}
    {!viewModel.isVirtual && (
      <Table
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...viewModel.restAttributes}
        className={`dx-scheduler-date-table ${viewModel.props.className}`}
      >
        <DateTableBody
          viewData={viewModel.props.viewData}
          cellTemplate={viewModel.props.cellTemplate}
        />
      </Table>
    )}
  </Fragment>
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
  get isVirtual(): boolean {
    const { viewData } = this.props;
    return !!viewData!.isVirtual;
  }

  get topVirtualRowHeight(): number | undefined {
    return this.props.viewData?.topVirtualRowHeight || 0;
  }

  get bottomVirtualRowHeight(): number | undefined {
    return this.props.viewData?.bottomVirtualRowHeight || 0;
  }
}
