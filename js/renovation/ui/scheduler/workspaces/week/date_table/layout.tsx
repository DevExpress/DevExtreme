import { Component, JSXComponent } from 'devextreme-generator/component_declaration/common';
import { DateTableLayoutBase } from '../../base/date_table/layout';
import { LayoutProps } from '../../base/layout_props';
import { DateTableCellBase } from '../../base/date_table/cell';

export const viewFunction = (viewModel: WeekTableLayout): JSX.Element => (
  <DateTableLayoutBase
    viewData={viewModel.props.viewData}
    cellTemplate={DateTableCellBase}
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
export class WeekTableLayout extends JSXComponent(LayoutProps) {
}
