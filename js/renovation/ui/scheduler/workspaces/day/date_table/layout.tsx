import { Component, JSXComponent } from 'devextreme-generator/component_declaration/common';
import { DateTableLayoutBase } from '../../base/date_table/layout';
import { LayoutProps } from '../../base/layout_props';

export const viewFunction = (viewModel: DayDateTableLayout): JSX.Element => (
  <DateTableLayoutBase
    viewData={viewModel.props.viewData}
    // This is a workaround: cannot use template inside a template
    viewType="day"
    dataCellTemplate={viewModel.props.dataCellTemplate}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export class DayDateTableLayout extends JSXComponent(LayoutProps) {}
