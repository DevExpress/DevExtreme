import { Component, JSXComponent } from 'devextreme-generator/component_declaration/common';
import { DateTableLayoutBase } from '../../base/date_table/layout';
import { DayDateTableCell } from './cell';
import { LayoutProps } from '../../base/layout_props';

export const viewFunction = (viewModel: DayDateTableLayout): object => (
  <DateTableLayoutBase
    viewData={viewModel.props.viewData}
    cellTemplate={DayDateTableCell}
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
