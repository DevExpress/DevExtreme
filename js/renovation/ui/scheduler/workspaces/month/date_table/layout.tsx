import { Component, JSXComponent } from 'devextreme-generator/component_declaration/common';
import { DateTableLayoutBase } from '../../base/date_table/layout';
import { LayoutProps } from '../../base/layout_props';

export const viewFunction = (viewModel: MonthDateTableLayout): JSX.Element => (
  <DateTableLayoutBase
    // This is a workaround: cannot use template inside a template
    viewType="month"
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
