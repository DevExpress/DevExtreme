import { Component, JSXComponent } from 'devextreme-generator/component_declaration/common';
import { DateTableCellBase } from '../../base/date_table/cell';
import { DateTableLayoutBase } from '../../base/date_table/layout';
import { LayoutProps } from '../../base/layout_props';

// This is a workaround for https://github.com/DevExpress/devextreme-renovation/issues/559
export const viewFunction = (viewModel: TimelineDateTableLayout): JSX.Element => (
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
export class TimelineDateTableLayout extends JSXComponent(LayoutProps) {}
