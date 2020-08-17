import { Component, JSXComponent } from 'devextreme-generator/component_declaration/common';
import { DateTableLayoutBase } from '../../base/date_table/layout';
import { MonthDateTableCell } from './cell';
import { LayoutProps } from '../../base/layout_props';

export const viewFunction = (viewModel: MonthDateTableLayout): JSX.Element => (
  <DateTableLayoutBase
    cellTemplate={MonthDateTableCell}
    viewData={viewModel.props.viewData}
    dataCellTemplate={viewModel.props.dataCellTemplate}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class MonthDateTableLayout extends JSXComponent(LayoutProps) {}
